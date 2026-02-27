#!/usr/bin/env bash

set -euo pipefail

if ! command -v git >/dev/null 2>&1; then
  echo "Error: git is not installed or not on PATH." >&2
  exit 1
fi

# Ensure we are in the repo root (heuristic)
if [ ! -f "xmcloud.build.json" ]; then
  echo "Error: Please run this script from the repository root (where xmcloud.build.json lives)." >&2
  exit 1
fi

if ! git remote get-url upstream >/dev/null 2>&1; then
  echo "Error: 'upstream' remote is not configured." >&2
  echo "Add it with:" >&2
  echo "  git remote add upstream https://github.com/Sitecore/sai-example-industry-verticals.git" >&2
  exit 1
fi

echo "Fetching upstream branches and tags..."
git fetch upstream --tags

# Determine the reference to sync against.
# Usage:
#   ./sync-upstream.sh            # uses latest v*-style tag
#   ./sync-upstream.sh main       # uses upstream/main
#   ./sync-upstream.sh v4.1.0     # uses that specific tag
requested_ref="${1:-}"

if [ -z "$requested_ref" ]; then
  latest_tag="$(git tag --list 'v*' --sort=-version:refname | head -n 1 || true)"
  if [ -z "$latest_tag" ]; then
    echo "Error: No v*-style tags found. Specify a ref explicitly, e.g. './sync-upstream.sh main'." >&2
    exit 1
  fi
  ref="$latest_tag"
  echo "No ref provided. Using latest upstream tag: $ref"
else
  ref="$requested_ref"
  echo "Using requested ref: $ref"
fi

# Ensure working tree is clean (tracked files only).
if ! git diff-index --quiet HEAD --; then
  echo "Error: Working tree has local changes. Commit or stash them before running this script." >&2
  exit 1
fi

echo "Updating local 'main' from origin..."
git checkout main
git pull origin main

# Create sync branch name from ref (replace dots with hyphens)
sanitized_ref="${ref//./-}"
sync_branch="sync/upstream-${sanitized_ref}"

if git show-ref --verify --quiet "refs/heads/${sync_branch}"; then
  echo "Reusing existing sync branch: ${sync_branch}"
  git checkout "${sync_branch}"
else
  echo "Creating new sync branch: ${sync_branch}"
  git checkout -b "${sync_branch}" main
fi

echo "Applying upstream snapshot from '${ref}' into 'industry-verticals' (file-level checkout)."
echo "This avoids merging histories while still pulling in the latest template code."

# Note: 'ref' can be a tag (e.g. v4.1.0) or 'upstream/main'.
git checkout "${ref}" -- industry-verticals

cat <<'EOF'

Upstream snapshot applied to 'industry-verticals' on the sync branch.

Next steps:
  1. Review the changes:
       git status
       git diff main
  2. Run validation (example for retail vertical):
       cd industry-verticals/retail
       npm install
       npm run lint
  3. When satisfied, push the sync branch and open a PR into main:
       git push -u origin <sync-branch-shown-above>

EOF

