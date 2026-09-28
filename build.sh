#!/bin/bash

set -e

echo "Building frontend..."
cd frontend
npm run build

echo "Creating zip archive..."
cd ../
# Start fresh: `zip` only adds/updates, so reusing the old archive would keep
# hashed assets from previous builds around forever.
rm -f dist.zip
# Zip the directory itself, not `frontend/dist/*` — the glob skips dotfiles,
# and .htaccess carries the SPA fallback that makes /guddi-bra work on a
# direct hit.
zip -r dist.zip frontend/dist -x '*.DS_Store'

echo "Build complete. Output: dist.zip"
