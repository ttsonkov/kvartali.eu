/**
 * Favorites Module
 * Allows users to bookmark neighborhoods, childcare facilities, etc.
 * Stores favorites in localStorage for persistence
 */

const Favorites = {
    STORAGE_KEY: 'kvartali_favorites',
    favorites: [],
    onlyShowFavorites: false,

    /**
     * Initialize favorites system
     */
    init() {
        this.loadFromStorage();
        this.renderCategoryStatsButton();
        this.renderFavoritesFilter();
        this.setupEventListeners();
    },

    /**
     * Load favorites from localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.favorites = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            this.favorites = [];
        }
    },

    /**
     * Save favorites to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    },

    /**
     * Generate unique ID for an item
     * @param {Object} entry - Entry data
     * @returns {string} Unique identifier
     */
    generateId(entry) {
        const type = entry.locationType || 'neighborhood';
        const city = entry.city || '';
        const name = entry.neighborhood || entry.name || entry.childcareName || '';
        return `${type}::${city}::${name}`.toLowerCase();
    },

    /**
     * Check if an item is favorited
     * @param {Object} entry - Entry data
     * @returns {boolean}
     */
    isFavorite(entry) {
        const id = this.generateId(entry);
        return this.favorites.includes(id);
    },

    /**
     * Toggle favorite status
     * @param {Object} entry - Entry data
     * @returns {boolean} New favorite status
     */
    toggle(entry) {
        const id = this.generateId(entry);
        const index = this.favorites.indexOf(id);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            Utils?.showToast?.('Премахнато от любими', 'info') || 
                this.showSimpleToast('Премахнато от любими');
        } else {
            this.favorites.push(id);
            Utils?.showToast?.('Добавено в любими ❤️', 'success') || 
                this.showSimpleToast('Добавено в любими ❤️');
        }
        
        this.saveToStorage();
        this.updateFilterButton();
        return this.isFavorite(entry);
    },

    /**
     * Simple toast fallback if Utils is not available
     */
    showSimpleToast(message) {
        const existing = document.querySelector('.simple-toast');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.className = 'simple-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    },

    /**
     * Add favorite button to a card element
     * @param {HTMLElement} card - Card DOM element
     * @param {Object} entry - Entry data
     */
    addFavoriteButton(card, entry) {
        // Skip if already has button
        if (card.querySelector('.favorite-btn')) return;
        
        // Make sure card has relative positioning
        card.style.position = 'relative';
        
        const btn = document.createElement('button');
        btn.className = `favorite-btn${this.isFavorite(entry) ? ' active' : ''}`;
        btn.setAttribute('aria-label', this.isFavorite(entry) ? 'Премахни от любими' : 'Добави в любими');
        btn.setAttribute('title', this.isFavorite(entry) ? 'Премахни от любими' : 'Добави в любими');
        btn.innerHTML = this.isFavorite(entry) ? '❤️' : '🤍';
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isNowFavorite = this.toggle(entry);
            btn.classList.toggle('active', isNowFavorite);
            btn.innerHTML = isNowFavorite ? '❤️' : '🤍';
            btn.setAttribute('aria-label', isNowFavorite ? 'Премахни от любими' : 'Добави в любими');
            btn.setAttribute('title', isNowFavorite ? 'Премахни от любими' : 'Добави в любими');
            
            // If filtering by favorites and we unfavorited, hide the card
            if (this.onlyShowFavorites && !isNowFavorite) {
                card.style.display = 'none';
            }
        });
        
        card.appendChild(btn);
    },

    /**
     * Get total counts of all items by category from allRatings, filtered by current city
     * @returns {Object} Object with category counts
     */
    getTotalCountsByCategory() {
        const counts = {
            neighborhood: 0,
            childcare: 0,
            schools: 0,
            doctors: 0,
            services: 0,
            shops: 0
        };
        
        // Use window.allRatings for global access
        const ratings = window.allRatings || (typeof allRatings !== 'undefined' ? allRatings : []);
        if (!Array.isArray(ratings) || ratings.length === 0) {
            return counts;
        }
        
        const currentCity = (window.AppState && AppState.getCity) ? AppState.getCity() : 'София';
        
        // Group by neighborhood+city+type to get unique entries, filtered by current city
        const uniqueEntries = new Set();
        ratings.forEach(r => {
            if ((r.city || '') !== currentCity) return;
            const type = r.locationType || 'neighborhood';
            const key = `${type}::${r.city || ''}::${r.neighborhood || ''}`;
            uniqueEntries.add(key);
        });
        
        uniqueEntries.forEach(key => {
            const type = key.split('::')[0];
            if (counts.hasOwnProperty(type)) {
                counts[type]++;
            }
        });
        
        return counts;
    },

    /**
     * Render the category stats button
     */
    renderCategoryStatsButton() {
        const controlsContainer = document.querySelector('.controls-container') || 
                                   document.querySelector('.filter-section');
        
        if (!controlsContainer) return;
        
        // Don't add if already exists
        if (document.getElementById('categoryStatsBtn')) return;
        
        const categoryLabels = {
            neighborhood: 'Квартали',
            childcare: 'Градини',
            schools: 'Училища',
            doctors: 'Лекари',
            services: 'Услуги',
            shops: 'Магазини'
        };
        
        const counts = this.getTotalCountsByCategory();
        const currentType = (window.AppState && AppState.getLocationType) ? AppState.getLocationType() : 'neighborhood';
        const currentCount = counts[currentType] || 0;
        const currentLabel = categoryLabels[currentType] || 'Квартали';
        
        const btn = document.createElement('div');
        btn.id = 'categoryStatsBtn';
        btn.className = 'category-stats-btn';
        btn.innerHTML = `
            <span class="stats-main">
                📊 <span class="stats-category-label">${currentLabel}</span>
                <span class="stats-total-count">${currentCount}</span>
            </span>
        `;
        
        // Find a good place to insert
        const sortControls = controlsContainer.querySelector('.sort-controls') ||
                            controlsContainer.querySelector('.filter-controls');
        
        if (sortControls) {
            sortControls.appendChild(btn);
        } else {
            controlsContainer.appendChild(btn);
        }
    },

    /**
     * Update the category stats display
     */
    updateCategoryStats() {
        const counts = this.getTotalCountsByCategory();
        const categoryLabels = {
            neighborhood: 'Квартали',
            childcare: 'Градини',
            schools: 'Училища',
            doctors: 'Лекари',
            services: 'Услуги',
            shops: 'Магазини'
        };
        
        const currentType = (window.AppState && AppState.getLocationType) ? AppState.getLocationType() : 'neighborhood';
        const currentCount = counts[currentType] || 0;
        const currentLabel = categoryLabels[currentType] || 'Квартали';
        
        const totalEl = document.querySelector('.stats-total-count');
        if (totalEl) {
            totalEl.textContent = currentCount;
        }
        
        const labelEl = document.querySelector('.stats-category-label');
        if (labelEl) {
            labelEl.textContent = currentLabel;
        }
    },

    /**
     * Render the favorites filter button
     */
    renderFavoritesFilter() {
        const controlsContainer = document.querySelector('.controls-container') || 
                                   document.querySelector('.filter-section');
        
        if (!controlsContainer) return;
        
        // Don't add if already exists
        if (document.getElementById('favoritesFilterBtn')) return;
        
        const counts = this.getCountsByCategory();
        const categoryLabels = {
            neighborhood: 'Квартали',
            childcare: 'Градини',
            schools: 'Училища',
            doctors: 'Лекари',
            services: 'Услуги',
            shops: 'Магазини'
        };
        
        const categoryTags = Object.keys(counts).map(type => {
            const count = counts[type];
            return `<span class="fav-cat fav-cat-${type}" style="display: ${count > 0 ? 'inline-block' : 'none'}">${categoryLabels[type]}: ${count}</span>`;
        }).join('');
        
        const btn = document.createElement('button');
        btn.id = 'favoritesFilterBtn';
        btn.className = 'favorites-filter-btn';
        btn.innerHTML = `
            <span class="fav-main">
                ❤️ Любими
                <span class="favorites-count">${this.favorites.length}</span>
            </span>
            <span class="fav-categories">${categoryTags}</span>
        `;
        
        btn.addEventListener('click', () => {
            this.onlyShowFavorites = !this.onlyShowFavorites;
            btn.classList.toggle('active', this.onlyShowFavorites);
            this.applyFavoritesFilter();
        });
        
        // Find a good place to insert
        const sortControls = controlsContainer.querySelector('.sort-controls') ||
                            controlsContainer.querySelector('.filter-controls');
        
        if (sortControls) {
            sortControls.appendChild(btn);
        } else {
            controlsContainer.appendChild(btn);
        }
    },

    /**
     * Get counts of favorites by category
     * @returns {Object} Object with category counts
     */
    getCountsByCategory() {
        const counts = {
            neighborhood: 0,
            childcare: 0,
            schools: 0,
            doctors: 0,
            services: 0,
            shops: 0
        };
        
        this.favorites.forEach(id => {
            const type = id.split('::')[0];
            if (counts.hasOwnProperty(type)) {
                counts[type]++;
            }
        });
        
        return counts;
    },

    /**
     * Update the favorites filter button count
     */
    updateFilterButton() {
        const countEl = document.querySelector('.favorites-count');
        if (countEl) {
            countEl.textContent = this.favorites.length;
        }
        this.updateCategoryCounts();
    },

    /**
     * Update the category counts display
     */
    updateCategoryCounts() {
        const counts = this.getCountsByCategory();
        const categoryLabels = {
            neighborhood: 'Квартали',
            childcare: 'Градини',
            schools: 'Училища',
            doctors: 'Лекари',
            services: 'Услуги',
            shops: 'Магазини'
        };
        
        Object.keys(counts).forEach(type => {
            const el = document.querySelector(`.fav-cat-${type}`);
            if (el) {
                const count = counts[type];
                el.textContent = `${categoryLabels[type]}: ${count}`;
                el.style.display = count > 0 ? 'inline-block' : 'none';
            }
        });
    },

    /**
     * Apply favorites filter to visible cards
     */
    applyFavoritesFilter() {
        const cards = document.querySelectorAll('.result-item, .neighborhood-card, [data-entry-id]');
        
        cards.forEach(card => {
            if (!this.onlyShowFavorites) {
                card.style.display = '';
                return;
            }
            
            // Try to determine if this card is favorited
            const btn = card.querySelector('.favorite-btn');
            if (btn) {
                const isFav = btn.classList.contains('active');
                card.style.display = isFav ? '' : 'none';
            }
        });
        
        // Show message if no favorites
        if (this.onlyShowFavorites && this.favorites.length === 0) {
            Utils?.showToast?.('Нямате любими места все още', 'info') ||
                this.showSimpleToast('Нямате любими места все още');
        }
    },

    /**
     * Get all favorites
     * @returns {Array} Array of favorite IDs
     */
    getAll() {
        return [...this.favorites];
    },

    /**
     * Clear all favorites
     */
    clearAll() {
        this.favorites = [];
        this.saveToStorage();
        this.updateFilterButton();
        
        // Update all buttons
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.innerHTML = '🤍';
        });
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for card rendering events
        document.addEventListener('cardsRendered', () => {
            this.updateFilterButton();
            this.updateCategoryStats();
        });
        
        // Listen for data load events
        document.addEventListener('ratingsLoaded', () => {
            this.updateCategoryStats();
        });
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Favorites.init());
} else {
    Favorites.init();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Favorites;
}
