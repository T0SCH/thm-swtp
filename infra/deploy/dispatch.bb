#!/usr/bin/env bb
;; /opt/stacks/swtp/dispatch.bb
;;
;; Forced command for the deploy SSH key in authorized_keys:
;;   command="/opt/stacks/swtp/dispatch.bb" ssh-ed25519 ...
;;
;; Dispatches based on SSH_ORIGINAL_COMMAND:
;;   (no command)               → production deploy
;;   review-deploy <pr> <svcs>  → spin up review environment
;;   review-teardown <pr>       → tear down review environment

(require '[babashka.process :refer [exec]]
         '[clojure.string   :as str])

(def cmd (System/getenv "SSH_ORIGINAL_COMMAND"))

(defn dispatch [s]
  (cond
    (or (nil? s) (= s "deploy"))
    (exec "/opt/stacks/swtp/deploy.sh")

    (str/starts-with? s "review-deploy ")
    (apply exec "/opt/stacks/swtp/review-deploy.sh"
           (str/split (subs s (count "review-deploy ")) #" "))

    (str/starts-with? s "review-teardown ")
    (exec "/opt/stacks/swtp/review-teardown.sh"
          (subs s (count "review-teardown ")))

    :else
    (do
      (binding [*out* *err*]
        (println "Unknown command:" s))
      (System/exit 1))))

(dispatch cmd)
