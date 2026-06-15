#!/usr/bin/env bb
;; /opt/stacks/swtp-main/deploy.bb
;; Pulls :latest images and restarts the swtp-main stack.

(require '[babashka.process :refer [sh]]
         '[cheshire.core :as json]
         '[clojure.string :as str])

(def script-dir (-> (sh "dirname" (System/getProperty "babashka.file")) :out str/trim))
(def logfile (str script-dir "/deploy.log"))
(def dashboard-file "/opt/stacks/swtp-infra/dashboard/data.json")

(defn now-str []
  (-> (sh "date" "+%Y-%m-%d %H:%M:%S") :out str/trim))

(defn log [msg]
  (spit logfile (str "[" (now-str) "] " msg "\n") :append true))

(log "Deploy triggered (swtp-main)")

;; Pull images
(def services ["swtp-main-api" "swtp-main-web"])
(def compose-file (str script-dir "/docker-compose.yml"))

(defn service-image [svc]
  (-> (sh ["docker" "compose" "-f" compose-file "config" "--images" svc] {:dir script-dir})
      :out str/trim))

(defn image-id [image]
  (-> (sh ["docker" "image" "inspect" "-f" "{{.Id}}" image] {:dir script-dir})
      :out str/trim))

(def service-images (into {} (for [svc services] [svc (service-image svc)])))

(let [before (into {} (for [svc services] [svc (image-id (get service-images svc))]))]
  (sh ["docker" "compose" "-f" compose-file "pull"] {:dir script-dir})
  (let [after (into {} (for [svc services] [svc (image-id (get service-images svc))]))]
    (doseq [svc services]
      (if (= (get before svc) (get after svc))
        (log (str svc ": up-to-date"))
        (log (str svc ": updated"))))))

(log "Restarting services")
(sh ["docker" "compose" "-f" (str script-dir "/docker-compose.yml") "up" "-d"] {:dir script-dir})

;; ── Dashboard aktualisieren ──────────────────────────────────────────────────
(defn update-dashboard! [path entry]
  (let [data (if (.exists (java.io.File. dashboard-file))
               (json/parse-string (slurp dashboard-file))
               {})
        updated (assoc-in data (mapv str path) (assoc entry "updated_at" (now-str)))]
    (spit dashboard-file (json/generate-string updated {:pretty true}))))

(update-dashboard! ["main"]
  {"fe" "https://www.swtp-ss26.de"
   "be" "https://api.swtp-ss26.de/swagger-ui/index.html"
   "logs" "https://logs.swtp-ss26.de"})

(log "Deploy complete")
(spit logfile "----------------------------------------\n" :append true)
