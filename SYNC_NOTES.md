## Template Sync Workflow

This repository was created from the `Sitecore/sai-example-industry-verticals` template. To keep it in sync while preserving local customizations, use an **upstream + merge-based sync** workflow.

### Remotes and tracking branches

- **Origin (your repo)**: `origin`
- **Upstream (template)**: `upstream` → `https://github.com/Sitecore/sai-example-industry-verticals.git`
- **Tracking branch for upstream main**: `upstream-main` (local branch that mirrors `upstream/main`)

To refresh the upstream reference:

```bash
git fetch upstream --tags
git branch -f upstream-main upstream/main   # fast‑forward local tracking branch
```

### Standard sync flow (merge-based)

We keep `main` as the primary working branch and periodically merge in changes from the template using a dedicated **sync branch**. This avoids rewriting history on `main` and keeps upstream changes clearly visible in PRs.

1. Ensure `main` is up to date:

```bash
git checkout main
git pull origin main
git fetch upstream --tags
git branch -f upstream-main upstream/main
```

2. Create a sync branch from `main` for the current upstream version (example uses `v4.1.0`):

```bash
git checkout -b sync/upstream-v4-1-0 main
```

3. Merge the corresponding upstream reference into the sync branch:

- To sync with the **latest upstream main**:

  ```bash
  git merge upstream-main
  ```

- To sync with a **specific upstream release tag**:

  ```bash
  git merge v4.1.0
  ```

4. Resolve any merge conflicts, run tests/linting on the sync branch, and review the changes.

5. When satisfied, push the sync branch and create a PR into `main`:

```bash
git push -u origin sync/upstream-v4-1-0
```

Use the PR to review template changes alongside your customizations before merging.

### When to prefer rebase

For feature branches based off `main`, you can rebase them on top of the latest `main` (after `main` has been synced via a merge):

```bash
git checkout my-feature
git pull --rebase origin main
```

This keeps feature branch history linear without rewriting `main`.

### Dependency vulnerabilities step

After you apply a new upstream snapshot on a sync branch, run a dedicated pass to reduce **critical, high, and moderate** npm vulnerabilities before opening the PR:

1. From the repo root on the sync branch, run:

```bash
./fix-vulns.sh
```

2. This will:

- Iterate through each industry vertical app under `industry-verticals/`
- Run `npm install` to ensure dependencies are up to date
- Run `npm audit fix --audit-level=moderate` to automatically fix vulnerabilities where safe upgrades are available
- Optionally run `npm run lint` / `npm test` if those scripts exist in the app

3. Review all resulting changes (especially `package.json` and lockfiles) and keep them in the same sync PR so that:

- Template updates and security fixes travel together
- You can test the combined effect of both code and dependency updates

Some vulnerabilities may remain if there is no non-breaking fix available; in those cases you can either:

- Accept the remaining risk and track it, or
- Plan a manual upgrade of the affected dependency with additional testing


