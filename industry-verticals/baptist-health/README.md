# Baptist Health

## Overview

Baptist Health is a healthcare-focused site based on the Nova Medical (healthcare) vertical template. The site demonstrates a patient-focused digital experience with Tailwind-based styling, modular components, and localization support.

## Developer Expectations

- Tailwind-based styling (Shadcn)
- Modular components for reuse
- Localization support

## Preconditions

1. You have deployed your XM Cloud environment already. If not follow this link: [Deploy a Project and Environment](https://doc.sitecore.com/xmc/en/developers/xm-cloud/deploy-a-project-and-environment.html)

## Run site locally

1. Clone the repository (if not yet done)
   `git clone https://github.com/Sitecore/Sitecore.Demo.XMCloud.IndustryVerticals.SiteTemplates`
2. Starting from the root of the repository navigate to site app folder
   `cd industry-verticals/baptist-health`
3. Copy the environment file `.env.remote.example` (or use `baptist-health.env.example` as reference)
4. Rename the copied file to `.env.local`
5. Edit `.env.local` and provide a value for
   - SITECORE_EDGE_CONTEXT_ID
   - NEXT_PUBLIC_DEFAULT_SITE_NAME
   - NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID
   - SITECORE_EDITING_SECRET
6. Install dependencies:
   from `industry-verticals/baptist-health` run `npm install`
7. If `npm run build` or `npm run dev` fails with "provide either Edge contextId", ensure `.env.local` has valid `SITECORE_EDGE_CONTEXT_ID` and `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID` from your XM Cloud environment.
8. Run the site locally:
   `npm run dev`
9. Access the site:
   Visit http://localhost:3000 in your browser.

## Add Editing host to XM Cloud

If you have not enabled the split deployment feature your editing hosts are automatically created based on the xmcloud.build.json if enabled is set to true. The following steps are not required. Only if you have enabled the split deployment feature, continue with the next steps.

1. Go to Sitecore Cloud Portal https://portal.sitecorecloud.io
2. Open XM Cloud Deploy
3. Select Project that has been deployed
4. Switch to tab "Editing Hosts"
5. Click "Add editing host"
6. Provide Editing host name `baptist-health` as per xmcloud.build.json
7. Include search related environment variables
8. Check if the link to authoring environment is set correctly (should be by default)
9. Check if the source code provider is set correctly (should be by default)
10. Check if the GitHub Account is set correctly (should be by default)
11. Check if repository is set correctly (should be by default)
12. Check if Branch is set correctly (should be by default)
13. Set the Auto deploy option (recommended)
14. Click "Save"
15. On the new new editing host click the ... and hit "Build and deploy"

Additional Info: You do not have to create rendering host items in XM Cloud as those are created automatically for you when creating a rendering host. Mapping of sites using site templates to editing hosts is also done automatically.

[Documentation](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html)
