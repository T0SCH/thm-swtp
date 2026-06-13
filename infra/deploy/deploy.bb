#!/usr/bin/env bb
;; /opt/stacks/swtp/deploy.bb
;; Production deploy — pull images, restart services.

(require '[babashka.process :refer [sh exec]]
         '[clojure.string :as str])

(def dir "/opt/stacks/swtp")
(def logfile (str dir "/deploy.log"))

(defn now-str []
  (-> (sh "date" "+%Y-%m-%d %H:%M:%S") :out str/trim))

(defn log [msg]
  (spit logfile (str "[" (now-str) "] " msg "\n") :append true))

(log "Deploy triggered")

;; Pull images
(let [{:keys [out]} (sh "sudo" "docker" "compose" "pull" "swtp-api" "swtp-web" {:dir dir})]
  (doseq [svc ["swtp-api" "swtp-web"]]
    (cond
      (str/includes? out (str svc " Pulled"))
      (log (str svc ": updated"))

      (str/includes? out (str svc " up to date"))
      (log (str svc ": up-to-date"))

      :else
      (log (str svc ": check output")))))

(log "Restarting services")
(exec "sudo" "docker" "compose" "up" "-d" "swtp-api" "swtp-web" {:dir dir})
