/**
 * Platform Detection & Config Helpers
 * Use these utilities throughout the app for platform-specific logic
 */

import { Platform } from 'react-native';
import { getPlatformConfig } from './config/index.js';

/**
 * Get platform name
 */
export const getPlatform = () => {
  return Platform.OS; // 'ios', 'android', or 'web'
};

/**
 * Check if running on iOS
 */
export const isIOS = () => Platform.OS === 'ios';

/**
 * Check if running on Android
 */
export const isAndroid = () => Platform.OS === 'android';

/**
 * Check if running on Web
 */
export const isWeb = () => Platform.OS === 'web';

/**
 * Get platform-specific configuration
 */
export const getConfig = () => {
  return getPlatformConfig(getPlatform());
};

/**
 * Platform-specific value selector
 * Usage: platformSelect({ ios: 'value-ios', android: 'value-android' })
 */
export const platformSelect = (values) => {
  const platform = getPlatform();
  return values[platform] !== undefined ? values[platform] : values.default;
};

/**
 * Platform-specific rendering
 * Usage: <PlatformView ios={<View />} android={<View />} />
 */
export const PlatformView = ({ ios, android, web, children, ...props }) => {
  const platform = getPlatform();
  
  if (platform === 'ios' && ios) return ios;
  if (platform === 'android' && android) return android;
  if (platform === 'web' && web) return web;
  
  return children || null;
};

/**
 * Log platform-specific info (development helper)
 */
export const logPlatformInfo = () => {
  console.log(`[Platform] Running on: ${getPlatform().toUpperCase()}`);
  console.log('[Platform] Config:', getConfig());
};
