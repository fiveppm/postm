#!/bin/sh
# postmonster: resilient container start (PRD 12).
# The old chain was `nginx && pnpm run pm2` where pm2-run was
# `prisma-db-push && ...` - a transient DB/network blip during boot exited
# the whole container and left it in a restart loop (site answering 503).
# Rules here: transient failures retry, only a dead pm2 daemon ends the
# container (restart: unless-stopped then reboots it).
set -u

nginx || { echo 'nginx failed to start' >&2; exit 1; }

echo 'waiting for the database (prisma db push)...'
ok=0
i=1
while [ "$i" -le 60 ]; do
  if pnpm run prisma-db-push; then
    ok=1
    break
  fi
  echo "prisma-db-push failed (attempt ${i}/60), retrying in 5s..."
  sleep 5
  i=$((i + 1))
done
if [ "$ok" != "1" ]; then
  echo 'prisma-db-push never succeeded - continuing anyway (backend will retry its own boot)' >&2
fi

pm2 delete all >/dev/null 2>&1 || true
# one failing app must not prevent the others from starting
pnpm run --parallel pm2 || echo 'pm2 start reported errors - continuing' >&2

# foreground: container lives while the pm2 daemon lives
pm2 logs
