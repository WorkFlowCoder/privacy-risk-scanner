import { Manifest } from "@plasmohq/chrome-extension-manifest"

const manifest: Manifest = {
  permissions: [
    "tabs",
    "activeTab",
    "scripting",
  ],

  host_permissions: [
    "<all_urls>",
  ],
}

export default manifest