/**
 * Config Index - Merges shared, iOS and Android configs
 * Usage: import { getFullConfig } from './config'
 */

import { sharedConfig, getAppConfig } from './shared.js';
import { iosConfig } from './ios.js';
import { androidConfig } from './android.js';

/**
 * Get complete app configuration for export to app.json
 * Merges: shared + iOS-specific + Android-specific
 */
export const getFullConfig = () => {
  return {
    expo: {
      ...sharedConfig,
      ...iosConfig,
      ...androidConfig,
      web: {
        favicon: './assets/favicon.png'
      },
      extra: {
        eas: {
          projectId: sharedConfig.projectId
        }
      }
    }
  };
};

/**
 * Get platform-specific config
 * @param {string} platform - 'ios' or 'android'
 * @returns {object} Platform-specific configuration
 */
export const getPlatformConfig = (platform) => {
  if (platform === 'ios') {
    return { ...sharedConfig, ...iosConfig };
  } else if (platform === 'android') {
    return { ...sharedConfig, ...androidConfig };
  }
  return sharedConfig;
};

export { sharedConfig, iosConfig, androidConfig };
