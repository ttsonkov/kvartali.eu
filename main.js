// Main application logic

let currentCity = "София";
let currentRatings = {};

// Helper functions
const makeVoteKey = (city, neighborhood) => `${city || 'София'}::${neighborhood}`;

const getNeighborhoodsForCity = (city) => {
    if (!city) return allNeighborhoods;
    return cityNeighborhoods[city] || [];
};

// Central city selection handler
function applyCitySelection(city) {
    const newCity = city || 'София';
    currentCity = newCity;

    const citySelect = document.getElementById('citySelect');
    if (citySelect) citySelect.value = newCity;

    const filterCitySelect = document.getElementById('filterCity');
    if (filterCitySelect) filterCitySelect.value = newCity;

    updateHeaderCity(newCity);
    populateSelectOptions(newCity, newCity);

    const currentNeighborhoodFilter = document.getElementById('filterNeighborhood')?.value || '';
    displayResults(newCity, currentNeighborhoodFilter);
    updateNeighborhoodOptions();
    hideHeaderMenu();
}

// Initialize star ratings
function initStarRatings() {
    document.querySelectorAll('.stars').forEach(starsContainer => {
        const criterion = starsContainer.dataset.criterion;
        currentRatings[criterion] = 0;
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.textContent = '★';
            star.dataset.value = i;
            
            star.addEventListener('click', () => {
                currentRatings[criterion] = i;
                updateStars(starsContainer, i);
            });
            
            starsContainer.appendChild(star);
        }
    });
}

// Event listeners setup
function setupEventListeners() {
    // City selector change
    document.getElementById('citySelect').addEventListener('change', (e) => {
        applyCitySelection(e.target.value);
    });

    // Filter results
    document.getElementById('filterCity').addEventListener('change', (e) => {
        const city = e.target.value || currentCity;
        applyCitySelection(city);
    });

    document.getElementById('filterNeighborhood').addEventListener('change', (e) => {
        const city = document.getElementById('filterCity').value;
        displayResults(city, e.target.value);
    });

    // Header city link toggles menu
    document.getElementById('headerCityLink').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleHeaderMenu();
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('headerCityMenu');
        const link = document.getElementById('headerCityLink');
        if (!menu || !link) return;
        if (!menu.contains(e.target) && !link.contains(e.target)) {
            hideHeaderMenu();
        }
    });

    // Form submission
    document.getElementById('ratingForm').addEventListener('submit', handleFormSubmit);
}

// Initialize application
function initApp() {
    initStarRatings();
    buildHeaderCityMenu();
    setupEventListeners();
    
    // Wait for Firebase SDK to load
    if (typeof firebase !== 'undefined') {
        initFirebase();
    } else {
        console.error('Firebase SDK not loaded');
        showToast('Firebase SDK не е зареден', 'error');
    }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
