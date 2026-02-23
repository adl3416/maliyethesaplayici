# Platform-Specific Configuration Guide

Bu proje, iOS ve Android için ayrı yapılandırma yönetimine sahiptir. Her platform bağımsız olarak ayarlanabilir.

## 📁 Dosya Yapısı

```
config/
├── shared.js       # Ortak ayarlar (her iki platform için)
├── ios.js         # iOS-spesifik ayarlar
├── android.js     # Android-spesifik ayarlar
└── index.js       # Konfigürasyonları merge eden ana dosya

platformHelpers.js  # Platform detection ve yardımcı fonksiyonlar
eas.json           # Build profiles (platform-specific)
```

## 🔧 Nasıl Kullanılır

### App.js'de Platform-Specific Logic Eklemek

```javascript
import { isIOS, isAndroid, platformSelect } from './platformHelpers.js';

// Yöntem 1: İF kontrolü ile
if (isIOS()) {
  // iOS-spesifik kod
}

if (isAndroid()) {
  // Android-spesifik kod
}

// Yöntem 2: Platform-specific değer seçmek
const fontSize = platformSelect({
  ios: 16,
  android: 14,
  default: 15
});

// Yöntem 3: Component render etmek
import { PlatformView } from './platformHelpers.js';

<PlatformView
  ios={<View style={{ backgroundColor: '#f0f0f0' }} />}
  android={<View style={{ backgroundColor: '#ffffff' }} />}
/>
```

### Konfigürasyon Değiştirmek

#### iOS-spesifik değişiklik yapmak için:
1. `config/ios.js` dosyasını düzenle
2. Değişikliği `ios` bloğu içine ekle

Örnek:
```javascript
// config/ios.js
export const iosConfig = {
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.example.iosspecific', // iOS-spesifik
  },
};
```

#### Android-spesifik değişiklik yapmak için:
1. `config/android.js` dosyasını düzenle
2. Değişikliği `android` bloğu içine ekle

Örnek:
```javascript
// config/android.js
export const androidConfig = {
  android: {
    package: 'com.example.android',
    softwareKeyboardLayoutMode: 'pan', // Android-spesifik
  },
};
```

#### Her iki platform için ortak değişiklik:
1. `config/shared.js` dosyasını düzenle

## 🚀 Build Komutları

```bash
# Genel preview
eas build --platform all --profile preview

# iOS-spesifik preview
eas build --platform ios --profile preview-ios

# Android-spesifik preview
eas build --platform android --profile preview-android

# Production build (tüm platformlar)
eas build --platform all --profile production

# Production iOS
eas build --platform ios --profile production-ios

# Production Android
eas build --platform android --profile production-android
```

## 📝 Önemli Notlar

- **shared.js**: Her iki platform tarafından kullanılan ortak ayarlar
- **ios.js & android.js**: Platform-spesifik override'lar
- **Merge mantığı**: shared → platform-spesifik (platform-spesifik öncelik alır)
- **Hiçbir şey bozulmadı**: Mevcut yapı korundu, yeni sistem üzerine inşa edildi

## 🐛 Debugging

Platform bilgisini log'a dökmek için:

```javascript
import { logPlatformInfo } from './platformHelpers.js';

logPlatformInfo(); // Console'da platform info görüntülenecek
```

---

**Eğer yeni bir platform-spesifik ayar eklemek istersen:** 
Sadece bana "Android için..." veya "iOS için..." diye söyle, ben uygun dosyayı güncelledim!
