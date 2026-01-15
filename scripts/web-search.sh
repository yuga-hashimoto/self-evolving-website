#!/bin/bash
# Web search wrapper script for AI evolution workflow
# Usage: bash scripts/web-search.sh "search query"

set -e

QUERY="$1"
API_BASE="http://localhost:3131/api/search"

if [ -z "$QUERY" ]; then
  echo '{"error": "Query is required", "usage": "bash scripts/web-search.sh \"search query\""}' >&2
  exit 1
fi

# Security: Ensure we only hit the local search API
if ! echo "$API_BASE" | grep -q "^http://localhost:3131"; then
  echo '{"error": "Invalid API endpoint"}' >&2
  exit 1
fi

# URL encode using Node.js
ENCODED_QUERY=$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$QUERY")

# Make the request
curl -s "${API_BASE}?q=$ENCODED_QUERY"
