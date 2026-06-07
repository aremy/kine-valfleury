#!/bin/bash
set -e

BUCKET="s3://kine-valfleury.fr"
BUCKET_NAME="kine-valfleury.fr"
REGION="eu-west-2"

# Configure S3 website (index + error document) — idempotent
aws s3 website "s3://${BUCKET_NAME}/" \
  --index-document index.html \
  --error-document 404.html \
  --region "$REGION"

# Sync all non-HTML, non-JS assets (static assets get 1-year immutable cache)
aws s3 sync _site/ "$BUCKET/" \
  --region "$REGION" \
  --delete \
  --exclude "*.html" \
  --exclude "*.js" \
  --cache-control "max-age=31536000,immutable"

# JS files — 1-year cache (except sw.js handled separately below)
aws s3 sync _site/ "$BUCKET/" \
  --region "$REGION" \
  --exclude "*" \
  --include "assets/js/*.js" \
  --cache-control "max-age=31536000,immutable"

# Service Worker — must never be cached so the browser always checks for updates
aws s3 cp _site/sw.js "$BUCKET/sw.js" \
  --region "$REGION" \
  --content-type "application/javascript" \
  --cache-control "no-cache,no-store,must-revalidate"

# HTML pages — always fresh, no cache
find _site -name "*.html" | while read -r html; do
  key="${html#_site/}"
  aws s3 cp "$html" "$BUCKET/$key" \
    --region "$REGION" \
    --content-type "text/html; charset=utf-8" \
    --cache-control "no-cache,no-store,must-revalidate"
done

# Re-upload CSS and JS gzip-compressed for better transfer performance
mkdir -p /tmp/kine-deploy

gzip_upload() {
  local src="$1" ctype="$2" dest="$3"
  gzip -c --best "$src" > "/tmp/kine-deploy/$(basename "$src")"
  aws s3 cp "/tmp/kine-deploy/$(basename "$src")" "$BUCKET/$dest" \
    --region "$REGION" \
    --content-type "$ctype" \
    --content-encoding "gzip" \
    --cache-control "max-age=31536000,immutable"
}

gzip_upload "_site/assets/css/main.css" "text/css"        "assets/css/main.css"
gzip_upload "_site/assets/js/main.js"   "text/javascript" "assets/js/main.js"

rm -rf /tmp/kine-deploy

# CloudFront invalidation — only runs when CF_DISTRIBUTION_ID is set
# Set this as a GitHub Actions secret once CloudFront is configured
if [ -n "${CF_DISTRIBUTION_ID:-}" ]; then
  echo "Invalidating CloudFront distribution ${CF_DISTRIBUTION_ID}..."
  aws cloudfront create-invalidation \
    --distribution-id "$CF_DISTRIBUTION_ID" \
    --paths "/*"
fi
