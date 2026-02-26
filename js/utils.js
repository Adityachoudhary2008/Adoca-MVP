/**
 * ADOCA INDUSTRIAL UTILITIES (v11.5)
 * Focus: Security, Geolocation, and Scaling.
 */

const utils = {
    /**
     * Sanitizes HTML to prevent XSS.
     * Use this for all user-generated content or API data before rendering.
     */
    sanitize(str) {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        let sanitized = temp.innerHTML;
        // Extra protection against common injection patterns
        return sanitized.replace(/javascript:/gi, '').replace(/onerror/gi, 'no-error');
    },

    /**
     * Strict Validation Suite
     */
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    isValidPhone(phone) {
        // Industry standard: allows Optional +, then 10-15 digits
        return /^\+?[\d]{10,15}$/.test(phone.replace(/[\s-]/g, ''));
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    },

    /**
     * Gets current user location and performs reverse geocoding.
     */
    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation not supported"));
                return;
            }

            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Using Nominatim (OpenStreetMap) for free reverse geocoding
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();

                    // Extracting the most relevant localized name
                    const locality = data.address.suburb || data.address.neighbourhood || data.address.city || data.address.town || "Unknown Locality";
                    resolve({ lat: latitude, lon: longitude, address: data.display_name, locality });
                } catch (err) {
                    console.error("Geocoding failed:", err);
                    resolve(null);
                }
            }, (err) => {
                console.warn("Geolocation permission denied or error:", err);
                resolve(null);
            });
        });
    },

    /**
     * Debounce utility for scaling search/API calls.
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Securely generates a unique request ID.
     */
    generateId() {
        return `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
};
