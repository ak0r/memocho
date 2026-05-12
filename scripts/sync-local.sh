#!/bin/bash
# sync-local.sh
set -e

VAULT="/mnt/d/my-data/notes/personal-blog-content" # Windows Vault location
# VAULT="/home/amitkul/devhome/personal-blog-content" # WSL
CONTENT="src/content"

rsync -av --delete "$VAULT/destinations/" "$CONTENT/destinations/"
rsync -av --delete "$VAULT/posts/" "$CONTENT/posts/"
rsync -av --delete "$VAULT/pages/" "$CONTENT/pages/"
rsync -av --delete "$VAULT/travels/" "$CONTENT/travels/"
rsync -av --delete "$VAULT/tech/" "$CONTENT/tech/"

echo "✓ Content synced"