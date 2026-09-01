#!/usr/bin/env bash
# Runs the Go backend and the Vite dev server side by side for local testing.
# Vite proxies /api and /ws to the Go server (see client/vite.config.ts), so a
# single origin (the Vite URL printed below) serves the whole app.
set -e

trap 'kill 0' EXIT

(cd "$(dirname "$0")/server" && go run .) &
(cd "$(dirname "$0")/client" && npm run dev) &

wait
