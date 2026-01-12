/**
 * Gets or generates a persistent device ID stored in localStorage.
 * Since browsers don't allow direct MAC address access, we use a UUID
 * stored in localStorage as a device identifier.
 */
export const getDeviceId = (): string => {
    if (typeof window === 'undefined') {
        // Server-side: generate a temporary ID (will be replaced on client)
        return '00000000-0000-0000-0000-000000000000';
    }

    const STORAGE_KEY = 'quantara_device_id';
    
    // Try to get existing device ID from localStorage
    let deviceId = localStorage.getItem(STORAGE_KEY);
    
    if (!deviceId) {
        // Generate a new UUID v4
        deviceId = generateUUID();
        localStorage.setItem(STORAGE_KEY, deviceId);
    }
    
    return deviceId;
};

/**
 * Generates a UUID v4 using the Web Crypto API
 */
const generateUUID = (): string => {
    // Use crypto.randomUUID if available (modern browsers)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    
    // Fallback: generate UUID v4 manually
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
