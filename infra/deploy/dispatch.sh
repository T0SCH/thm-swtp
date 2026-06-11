#!/bin/bash
# /opt/stacks/swtp/dispatch.sh
#
# Forced command for the deploy SSH key in authorized_keys:
#   command="/opt/stacks/swtp/dispatch.sh" ssh-rsa ...
#
# Dispatches based on SSH_ORIGINAL_COMMAND:
#   (no command)               → production deploy
#   review-deploy <pr> <svcs>  → spin up review environment
#   review-teardown <pr>       → tear down review environment

set -e

CMD="${SSH_ORIGINAL_COMMAND:-deploy}"

case "$CMD" in
  deploy)
    exec /opt/stacks/swtp/deploy.sh
    ;;
  "review-deploy "*)
    ARGS="${CMD#review-deploy }"
    exec /opt/stacks/swtp/review-deploy.sh $ARGS
    ;;
  "review-teardown "*)
    PR="${CMD#review-teardown }"
    exec /opt/stacks/swtp/review-teardown.sh "$PR"
    ;;
  *)
    echo "Unknown command: $CMD" >&2
    exit 1
    ;;
esac
