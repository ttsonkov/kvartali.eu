// Utility Functions (DRY Principle)
const Utils = {
    // DOM Helper
    getElement(id) {
        return document.getElementById(id);
    },
    
    getElementValue(id) {
        const element = this.getElement(id);
        return element ? element.value : null;
    },
    
    setElementValue(id, value) {
        const element = this.getElement(id);
        if (element) element.value = value;
    },
    
    // Vote key generator
    makeVoteKey(city, neighborhood, type = 'neighborhood') {
        return `${type}::${city || 'София'}::${neighborhood}`;
    },
    
    // URL Management
    updateURL(city, neighborhood = '', type = 'neighborhood') {
        const params = new URLSearchParams();
        // Don't add city param for Sofia (it's the default)
        if (city && city !== 'София') params.set('city', city);
        if (neighborhood) params.set('neighborhood', neighborhood);
        if (type && type !== 'neighborhood') params.set('type', type);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const newURL = `${window.location.pathname}${queryString}`;
        window.history.pushState({ city, neighborhood, type }, '', newURL);
    },
    
    getURLParams() {
        const params = new URLSearchParams(window.location.search);
        const hash = window.location.hash.toLowerCase();
        
        let type = params.get('type') || 'neighborhood';
        
        // Override type based on URL hash
        if (hash.includes('detskigradini')) {
            type = 'childcare';
        } else if (hash.includes('lekari') || hash.includes('zabolekari')) {
            type = 'doctors';
        }
        
        return {
            city: params.get('city') || 'София',
            neighborhood: params.get('neighborhood') || '',
            type: type
        };
    },
    
    // Toast notification
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        if (type === 'error') {
            toast.style.background = '#dc3545';
        } else if (type === 'warning') {
            toast.style.background = '#ffc107';
            toast.style.color = '#000';
        }
        document.body.appendChild(toast);
        
        const duration = type === 'error' ? (CONFIG?.TOAST_ERROR_DURATION || 5000) : (CONFIG?.TOAST_DURATION || 3000);
        setTimeout(() => toast.remove(), duration);
    },
    
    // Debounce function for performance optimization
    debounce(func, wait = 300) {
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
    
    // Throttle function for scroll/resize events
    throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Safe async wrapper with error handling
    async safeAsync(asyncFn, fallback = null, errorMsg = 'Възникна грешка') {
        try {
            return await asyncFn();
        } catch (error) {
            console.error(errorMsg, error);
            this.showToast(errorMsg, 'error');
            return fallback;
        }
    },
    
    // HTML escape to prevent XSS attacks
    escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
    
    // Validate and sanitize opinion text
    sanitizeOpinion(opinion, maxLength = 500) {
        if (!opinion) return '';
        // Trim and limit length
        let sanitized = String(opinion).trim().slice(0, maxLength);
        return sanitized;
    },
    
    // Validate rating value (1-5)
    validateRating(rating) {
        const num = parseInt(rating, 10);
        return num >= 1 && num <= 5 ? num : 0;
    }
};

// Expose globally
window.Utils = Utils;
