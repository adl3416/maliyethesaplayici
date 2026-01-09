# MaviProje - React Native App

A React Native mobile application built with Expo and styled with Tailwind CSS using NativeWind.

## Features

- **React Native 0.81.5** - Latest React Native framework
- **Expo 54.0.31** - Easy development and deployment
- **NativeWind** - Tailwind CSS support for React Native
- **Responsive Design** - Styled home screen with blue "mavi proje" text

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. Navigate to the project directory:
   ```bash
   cd reacnativebos
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

#### Start Development Server
```bash
npm start
```

#### Run on Android
```bash
npm run android
```

#### Run on iOS
```bash
npm run ios
```

#### Run on Web
```bash
npm run web
```

## Project Structure

```
.
├── App.js                 # Main app component with home screen
├── app.json              # App configuration
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── metro.config.js       # Metro bundler configuration
├── global.css            # Global Tailwind styles
└── assets/               # App assets (icons, etc.)
```

## Styling

This project uses **NativeWind** for Tailwind CSS support in React Native. Styles are applied using the `className` prop instead of `StyleSheet.create()`.

Example:
```jsx
<Text className="text-3xl font-bold text-blue-500">mavi proje</Text>
```

## Dependencies

- **react** (19.1.0) - React library
- **react-native** (0.81.5) - React Native framework
- **expo** (~54.0.31) - Development framework
- **nativewind** - Tailwind CSS for React Native
- **tailwindcss** - CSS framework

## Learn More

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
