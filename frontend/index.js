import { registerRootComponent } from 'expo';

import App from './App';

// Suppress non-critical development warnings
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = (...args) => {
    const message = String(args[0]);
    // Suppress audio API warnings
    if (message.includes('DynamicsCompressor') || message.includes('AudioContext')) {
      return;
    }
    // Suppress React Native touch tracking warnings
    if (message.includes('Cannot record touch') || message.includes('Touch Bank')) {
      return;
    }
    // Suppress performance optimization warnings in development
    if (message.includes('Performance optimizations')) {
      return;
    }
    // Suppress pointerEvents deprecation warning
    if (message.includes('pointerEvents')) {
      return;
    }
    // Suppress text node warnings
    if (message.includes('Unexpected text node')) {
      return;
    }
    originalWarn(...args);
  };

  console.error = (...args) => {
    const message = String(args[0]);
    // Suppress touch event errors
    if (message.includes('touch') || message.includes('Touch')) {
      return;
    }
    originalError(...args);
  };
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
