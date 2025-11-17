// Matterport Configuration
// 
// IMPORTANT: There are two types of credentials:
// 1. SDK Key - Used for embedding Matterport 3D viewers (what we use here)
// 2. API Tokens - Used for REST API access (Token ID + Token Secret)
//
// For the SDK viewer, we need the SDK Key (also called Application Key)
// Get this from: Matterport Account → Settings → Developer Tools → SDK Key Management

export const MATTERPORT_CONFIG = {
  // SDK Key (Application Key) - Used in iframe URL and SDK.connect()
  // This is the key shown in "SDK Key Management" section
  APPLICATION_KEY: process.env.EXPO_PUBLIC_MATTERPORT_APP_KEY || 'zsa4sfk5fikarpikt15drcdmb',
  
  // Model SID (Space ID) - Unique ID for each Matterport scan
  // Get this from a Matterport scan or allow users to input it
  DEFAULT_MODEL_SID: process.env.EXPO_PUBLIC_MATTERPORT_MODEL_SID || null,
  
  // API Tokens (for REST API access - optional, not used for SDK viewer)
  // These are used if you want to make REST API calls to Matterport
  API_TOKEN_ID: process.env.EXPO_PUBLIC_MATTERPORT_TOKEN_ID || '245a11276b221242',
  API_TOKEN_SECRET: process.env.EXPO_PUBLIC_MATTERPORT_TOKEN_SECRET || '3dc44cd146598a04b52a48506e78d27e',
};

// Helper function to validate configuration
export function validateMatterportConfig(modelSid) {
  if (!MATTERPORT_CONFIG.APPLICATION_KEY || MATTERPORT_CONFIG.APPLICATION_KEY === 'YOUR_APPLICATION_KEY') {
    throw new Error('Matterport SDK Key (Application Key) not configured. Get it from SDK Key Management in your Matterport account.');
  }
  if (!modelSid || modelSid === 'YOUR_MODEL_SID_HERE') {
    throw new Error('Model SID is required. Get this from a Matterport scan (Space ID).');
  }
  return true;
}

// Helper to get API token for REST API calls (if needed in the future)
export function getAPIToken() {
  if (MATTERPORT_CONFIG.API_TOKEN_ID && MATTERPORT_CONFIG.API_TOKEN_SECRET) {
    return {
      tokenId: MATTERPORT_CONFIG.API_TOKEN_ID,
      tokenSecret: MATTERPORT_CONFIG.API_TOKEN_SECRET,
    };
  }
  return null;
}

