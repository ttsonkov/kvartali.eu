// Application Configuration Constants
const CONFIG = {
    // UI Configuration
    ITEMS_PER_PAGE: 10,
    TOAST_DURATION: 3000,
    TOAST_ERROR_DURATION: 5000,
    LAZY_LOAD_DELAY: 500,
    AD_REFRESH_DEBOUNCE: 1000,
    
    // Cache Configuration
    CACHE_DURATION: 3600000, // 1 hour
    
    // Touch Target Sizes (mobile)
    MIN_TOUCH_TARGET: 44, // pixels (Apple HIG)
    
    // Animation Durations
    FADE_DURATION: 300,
    SLIDE_DURATION: 400,
    
    // Search Configuration
    SEARCH_DEBOUNCE: 300,
    MIN_SEARCH_LENGTH: 2,
    
    // Form Validation
    MIN_OPINION_LENGTH: 10,
    MAX_OPINION_LENGTH: 500,
    
    // API Configuration
    AIR_QUALITY_TOKEN: 'demo',
    ADSENSE_PUBLISHER_ID: 'ca-pub-5413114692875335'
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);

// Expose globally
window.CONFIG = CONFIG;
