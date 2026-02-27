# Onboarding a new industry-vertical site (duplicated from Sitecore)

Use this checklist when you duplicate an existing Sitecore site (e.g. Nova Medical → Baptist Health) and want to add the new site as its own app under `industry-verticals/`.

## Parameters

- **SOURCE_APP_KEY** – Existing app folder and rendering host key (e.g. `healthcare`, `retail`, `travel`).
- **NEW_APP_KEY** – New app folder name and new rendering host key (e.g. `baptist-health`). Use lowercase with hyphens.
- **NEW_SITECORE_SITE_NAME** – Sitecore site name/key under `/sitecore/content/industry-verticals/...`. Usually the same as NEW_APP_KEY (e.g. `baptist-health`).
- **NEW_EDGE_CONTEXT_IDS** – Server-side and client-side Experience Edge context IDs for the new site (from XM Cloud).

## 1. Prepare in Sitecore / XM Cloud

- Duplicate the Sitecore site from your chosen source vertical so the new site exists at `/sitecore/content/industry-verticals/NEW_SITECORE_SITE_NAME`.
- In XM Cloud, obtain the **server-side** and **client-side** Experience Edge context IDs for the new site.
- Decide SOURCE_APP_KEY, NEW_APP_KEY, and NEW_SITECORE_SITE_NAME.

## 2. Copy the source app folder

- From the repo root, copy the entire source app folder:
  - `industry-verticals/SOURCE_APP_KEY/` → `industry-verticals/NEW_APP_KEY/`
- Exclude from the copy: `node_modules`, `.next`, `.env.local`, `storybook-static`.
- In the new folder:
  - Update `package.json`: set `name` and `config.appName` to something like `industry-verticals-NEW_APP_KEY`.
  - Update `README.md`: replace source site name and paths with the new site name and `industry-verticals/NEW_APP_KEY`; set the “Editing host name” in the Add Editing Host section to NEW_APP_KEY.

## 3. Configure environment for the new app

- In `industry-verticals/NEW_APP_KEY/`:
  - Copy `.env.remote.example` to `.env.local` (or use any app-specific env example as reference).
  - In `.env.local`, set:
    - `SITECORE_EDGE_CONTEXT_ID` – server-side Edge context ID for the new site.
    - `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID` – client-side Edge context ID.
    - `NEXT_PUBLIC_DEFAULT_SITE_NAME` – NEW_SITECORE_SITE_NAME.
    - `NEXT_PUBLIC_DEFAULT_LANGUAGE` – e.g. `en`.
    - `SITECORE_EDITING_SECRET` – secret for the editing endpoint.
  - `sitecore.config.ts` reads from these env vars; no code change needed unless you add new variables.

## 4. Create authoring folders and module config for serialization

If you use serialization (authoring in Git), add the following so the new site’s items are included.

**Templates and layouts are shared** across all verticals. They live only in `Project.IndustryVerticals` (under `/sitecore/templates/Project/industry-verticals` and related paths). The new site's modules must include **only content and media** for that site—do not add any template or layout includes. Duplicating the site in Sitecore copies content that references those shared templates; it does not (and should not) duplicate the template tree in serialization.

- **Module label**: Choose a PascalCase label for the new app (e.g. `BaptistHealth`, `Healthcare`). Use it in namespaces and optionally in module file names.

1. **Create the site folder under authoring**
   - Path: `authoring/items/industry-verticals/sites/NEW_SITECORE_SITE_NAME/`
   - Example: `authoring/items/industry-verticals/sites/baptist-health/`

2. **Add two module JSON files** in that folder (use `authoring/items/industry-verticals/sites/nova-medical/healthcare-content.module.json` and `healthcare-media.module.json` as templates):
   - **Content module** (e.g. `NEW_APP_KEY-content.module.json`): `namespace` = `Project.<ModuleLabel>-Content`, `references` = `["Project.IndustryVerticals"]`, and five includes (home, Media, Data, Dictionary, Presentation) under `/sitecore/content/industry-verticals/NEW_SITECORE_SITE_NAME/`. Use include **names** like `NEW_APP_KEY-home`, `NEW_APP_KEY-media`, `NEW_APP_KEY-data`, `NEW_APP_KEY-dictionary`, `NEW_APP_KEY-presentation`.
   - **Media module** (e.g. `NEW_APP_KEY-media.module.json`): `namespace` = `Project.<ModuleLabel>-Media`, `references` = `["Project.IndustryVerticals"]`, and one include for `/sitecore/Media Library/Project/industry-verticals/NEW_SITECORE_SITE_NAME`. Use a **different** include name than the content module's Media include (e.g. `NEW_APP_KEY-medialibrary`) so the CLI does not report "same include name" for the two modules in that folder.
   - Set `"$schema": "../.sitecore/schemas/ModuleFile.schema.json"` in both files.

3. **Update common.module.json** (`authoring/items/industry-verticals/common/common.module.json`):
   - In **projectMediaFolders.rules**, add: `{ "path": "/NEW_SITECORE_SITE_NAME", "scope": "SingleItem", "allowedPushOperations": "CreateOnly" }`.
   - Add a new **sites** include: `"name": "sites-NEW_SITECORE_SITE_NAME"`, `"path": "/sitecore/content/industry-verticals/NEW_SITECORE_SITE_NAME"`, with the same `rules` array as other sites (home, Media, Data, Dictionary, Presentation, Settings/Site Grouping, Settings, * Ignored).

4. **Register the new modules in xmcloud.build.json**
   - Under `postActions.actions.scsModules.modules`, add `Project.<ModuleLabel>-Content` and `Project.<ModuleLabel>-Media` (must match the `namespace` values in the two new module files).

5. **items/ folder**: The new site folder can start without an `items/` subfolder. From the `authoring` directory, run serialization **pull** (and then **validate**) so the new site's content is in the repo and any duplicate-ID issues are caught:
   ```bash
   cd authoring
   dotnet sitecore ser pull --include Project.IndustryVerticals --include Project.<ModuleLabel>-Content --include Project.<ModuleLabel>-Media
   dotnet sitecore ser validate --include Project.IndustryVerticals --include Project.<ModuleLabel>-Content --include Project.<ModuleLabel>-Media
   ```
   If validate reports duplicate item IDs, run `dotnet sitecore ser validate --fix ...` (with the same `--include` flags) to resolve them. Optionally, you can copy `items/` from the source site folder and adjust paths/IDs, but prefer pulling from Sitecore so item IDs match the duplicated site and you avoid duplicate-ID conflicts.

## 5. Register the new rendering host

- In the repo root, open `xmcloud.build.json`.
- Under `renderingHosts`, add a new entry with key **NEW_APP_KEY**:
  - `path`: `./industry-verticals/NEW_APP_KEY`
  - Use the same `nodeVersion`, `type`, `buildCommand`, and `runCommand` as other verticals.
  - Set `enabled: true`.
- In **XM Cloud Deploy** (portal): create a new Editing Host and set its **name** to NEW_APP_KEY so it matches the key in `xmcloud.build.json`.

## 6. Sitecore site and sites metadata

- Confirm the new Sitecore site exists at `/sitecore/content/industry-verticals/NEW_SITECORE_SITE_NAME` with correct hostnames and start item.
- If you track content in Git: add or serialize the new site under `authoring/items/industry-verticals/...` (e.g. similar to `sites-nova-medical` for healthcare).
- Regenerate sites metadata for the new app:
  - From `industry-verticals/NEW_APP_KEY/`, run the normal build (e.g. `npm run build`). The Content SDK step `generateSites()` will run and update `.sitecore/sites.json` with the new site from Experience Edge. No manual edit of `sites.json` is required.

## 7. Verify locally

- From `industry-verticals/NEW_APP_KEY/`: run `npm install`. Ensure `.env.local` is present and contains real `SITECORE_EDGE_CONTEXT_ID` and `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID` (from XM Cloud); otherwise `npm run build` will fail at the Sitecore tools step with "provide either Edge contextId".
- Run `npm run dev` (or `npm run build` then `npm run start`).
- Open the app with the host/path that resolves to the new site and confirm pages and error pages use the new site.
- If using XM Cloud Editing, associate the new site with the new Editing Host and test editing.

## Example: healthcare → baptist-health

- SOURCE_APP_KEY: `healthcare`
- NEW_APP_KEY: `baptist-health`
- NEW_SITECORE_SITE_NAME: `baptist-health`
- New app: `industry-verticals/baptist-health`
- New rendering host in `xmcloud.build.json`: `"baptist-health": { "path": "./industry-verticals/baptist-health", ... }`
- Editing host name in XM Cloud Deploy: `baptist-health`
- Serialization: `authoring/items/industry-verticals/sites/baptist-health/` with `baptist-health-content.module.json` and `baptist-health-media.module.json`; module namespaces `Project.BaptistHealth-Content` and `Project.BaptistHealth-Media` added to `common.module.json` and `xmcloud.build.json` postActions.scsModules.modules.
