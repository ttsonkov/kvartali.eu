// Application State Management (Single Responsibility Principle)
const AppState = {
    currentCity: 'София',
    currentRatings: {},
    currentLocationType: 'neighborhood',
    
    // Getters
    getCity() {
        return this.currentCity;
    },
    
    setCity(city) {
        this.currentCity = city || 'София';
    },
    
    getLocationType() {
        return this.currentLocationType;
    },
    
    setLocationType(type) {
        this.currentLocationType = type;
    },
    
    getRatings() {
        return { ...this.currentRatings };
    },
    
    setRating(criterion, value) {
        this.currentRatings[criterion] = value;
    },
    
    clearRatings() {
        this.currentRatings = {};
    },
    
    initRatings(criteria) {
        Object.keys(criteria).forEach(key => {
            this.currentRatings[key] = 0;
        });
    }
};

// Expose globally
window.AppState = AppState;
