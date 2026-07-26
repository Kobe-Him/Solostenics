
/**
 * HAPTICS SERVICE
 * 
 * This service bridges the gap between Web and Native.
 * Currently: Uses Navigator.vibrate (Web)
 * Future: Will auto-detect and use Capacitor.Haptics (Native iOS/Android)
 */

export const Haptics = {
    light: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10); // 10ms vibration
        }
    },
    
    medium: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(25);
        }
    },

    heavy: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }
    },

    error: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([50, 30, 50, 30, 100]); // Buzz-Buzz-Buzz
        }
    }
};
