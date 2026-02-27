#!/usr/bin/env bash

set -euo pipefail

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is not installed or not on PATH." >&2
  exit 1
fi

# Ensure we are in the repo root (heuristic)
if [ ! -f "xmcloud.build.json" ]; then
  echo "Error: Please run this script from the repository root (where xmcloud.build.json lives)." >&2
  exit 1
fi

apps=(
  "industry-verticals/healthcare"
  "industry-verticals/luxury-retail"
  "industry-verticals/retail"
  "industry-verticals/travel"
  "industry-verticals/energy"
  "industry-verticals/starter"
)

echo "Running npm audit fixes (audit-level=moderate) for vertical apps..."
echo "This will modify package.json and lockfiles where safe upgrades are available."

for app in "${apps[@]}"; do
  if [ -f "${app}/package.json" ]; then
    echo
    echo "=== Processing ${app} ==="
    pushd "${app}" >/dev/null

    echo "-> npm install"
    npm install

    echo "-> npm audit fix --audit-level=moderate"
    # Keep going even if some issues cannot be auto-fixed
    npm audit fix --audit-level=moderate || true

    # Run lint/tests if defined, but do not fail the whole script if they fail.
    if npm run | grep -q "lint"; then
      echo "-> npm run lint"
      npm run lint || true
    fi

    if npm run | grep -q "test"; then
      echo "-> npm test"
      npm test || true
    fi

    popd >/dev/null
  fi
done

cat <<'EOF'

Dependency vulnerability pass complete.

Next steps:
  1. Review the changes (especially package.json and lockfiles) on this sync branch.
  2. Re-run key app-level checks you care about (build, e2e, etc.).
  3. Include these changes in the same PR as the upstream sync so template and security updates are reviewed together.

EOF

