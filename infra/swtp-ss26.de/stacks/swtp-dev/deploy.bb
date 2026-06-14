#!/usr/bin/env bb
;; /opt/stacks/swtp-dev/deploy.bb
;; Pulls :dev images and restarts the swtp-dev stack.

(require '[babashka.process :refer [sh]]
         '[clojure.string :as str])

(def script-dir (-> (sh "dirname" (System/getProperty "babashka.file")) :out str/trim))
(def logfile (str script-dir "/deploy.log"))

(defn now-str []
  (-> (sh "date" "+%Y-%m-%d %H:%M:%S") :out str/trim))

(defn log [msg]
  (spit logfile (str "[" (now-str) "] " msg "\n") :append true))

(log "Deploy triggered (swtp-dev)")

;; Pull images
(let [{:keys [out err]} (sh ["docker" "compose" "-f" (str script-dir "/docker-compose.yml") "pull"] {:dir script-dir})
      combined (str out "\n" err)]
  (doseq [[svc image] [["swtp-dev-api" "swtp-api"] ["swtp-dev-web" "swtp-web"]]]
    (cond
      (re-find (re-pattern (str image ":dev Pulled")) combined)
      (log (str svc ": pulled"))
      (re-find (re-pattern (str image ":dev Skipped")) combined)
      (log (str svc ": up-to-date"))
      :else
      (log (str svc ": check output\n" combined)))))

(log "Restarting services")
(sh ["docker" "compose" "-f" (str script-dir "/docker-compose.yml") "up" "-d"] {:dir script-dir})
(log "Deploy complete")
(spit logfile "----------------------------------------\n" :append true)
