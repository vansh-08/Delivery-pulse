import * as client from 'openid-client';

let config = null;

export async function initMicrosoftClient() {
  try {
    const issuerUrl = new URL(`https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0`);
    
    config = await client.discovery(
      issuerUrl,
      process.env.AZURE_CLIENT_ID,
      process.env.AZURE_CLIENT_SECRET
    );
    
    console.log("✅ Microsoft OAuth Config Discovered");
  } catch (err) {
    console.error("❌ OAuth Discovery Failed:", err.message);
  }
}

export { config, client };