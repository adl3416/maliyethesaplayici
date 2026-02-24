/**
 * Shared configuration for both iOS and Android
 * Platform-agnostic settings that apply to both platforms
 */

export const sharedConfig = {
  // App Identity
  name: 'Maliyet Hesaplayıcı',
  slug: 'maliyet-hesaplayici',
  version: '1.0.0',
  
  // Orientation & UI
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  
  // Assets
  icon: './assets/icon.png',
  favicon: './assets/favicon.png',
  
  // Build & Deployment
  projectId: 'bcdaedd4-3bfa-4f35-ac73-589ef549d8fb',
};

/**
 * Get full app config by merging shared + platform-specific
 */
export const getAppConfig = (platformConfig) => {
  return {
    expo: {
      ...sharedConfig,
      ...platformConfig
    }
  };
};
