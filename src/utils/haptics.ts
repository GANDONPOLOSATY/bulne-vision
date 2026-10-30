// Tactile haptic feedback for mobile devices
export function triggerHaptic(type: 'light' | 'medium' | 'success' | 'warning' = 'light') {
  if (typeof window === 'undefined' || !window.navigator || !window.navigator.vibrate) {
    return;
  }

  try {
    switch (type) {
      case 'light':
        window.navigator.vibrate(15);
        break;
      case 'medium':
        window.navigator.vibrate(35);
        break;
      case 'success':
        window.navigator.vibrate([30, 50, 40]);
        break;
      case 'warning':
        window.navigator.vibrate([50, 40, 50]);
        break;
    }
  } catch {
    // Ignore unsupported devices
  }
}
