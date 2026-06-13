#!/bin/bash
cd /opt/stacks/swtp
LOG=/opt/stacks/swtp/deploy.log

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG; }

log "Deploy triggered"

# Pull images
PULL=$(sudo docker compose pull swtp-api swtp-web 2>&1)

# Summarize per service
for svc in swtp-api swtp-web; do
  if echo "$PULL" | grep -q "$svc.*Downloaded newer image\|$svc.*Pulled"; then
    log "$svc: updated"
  elif echo "$PULL" | grep -q "$svc.*Image is up to date\|$svc.*up-to-date"; then
    log "$svc: up-to-date"
  else
    log "$svc: check output"
  fi
done

log "Restarting services"
sudo docker compose up -d swtp-api swtp-web >> $LOG 2>&1
log "Deploy complete"
echo "----------------------------------------" >> $LOG
