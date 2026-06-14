#!/usr/bin/env bb
;; /opt/stacks/swtp-main/deploy.bb
;; Pulls :latest images and restarts the swtp-main stack.

(require '[babashka.process :refer [sh]]
         '[clojure.string :as str])

(def script-dir (-> (sh "dirname" (System/getProperty "babashka.file")) :out str/trim))
(def logfile (str script-dir "/deploy.log"))

(defn now-str []
  (-> (sh "date" "+%Y-%m-%d %H:%M:%S") :out str/trim))

(defn log [msg]
  (spit logfile (str "[" (now-str) "] " msg "\n") :append true))

(log "Deploy triggered (swtp-main)")

;; Pull images
(let [{:keys [out err]} (sh ["docker" "compose" "-f" (str script-dir "/docker-compose.yml") "pull"] {:dir script-dir})
      combined (str out "\n" err)]
  (doseq [[svc image] [["swtp-main-api" "swtp-api"] ["swtp-main-web" "swtp-web"]]]
    (cond
      (re-find (re-pattern (str image ":latest Pulled")) combined)
      (log (str svc ": pulled"))
      (re-find (re-pattern (str image ":latest Skipped")) combined)
      (log (str svc ": up-to-date"))
      :else
      (log (str svc ": check output\n" combined)))))

(log "Restarting services")
(sh ["docker" "compose" "-f" (str script-dir "/docker-compose.yml") "up" "-d"] {:dir script-dir})
(log "Deploy complete")
(spit logfile "----------------------------------------\n" :append true)
