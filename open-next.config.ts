import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

// The website is mostly static and does not use ISR. Keep the default
// (no incremental cache) so the Worker does not depend on R2.
export default defineCloudflareConfig({});
