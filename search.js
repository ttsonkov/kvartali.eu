/**
 * Search and Fuzzy Matching Module
 * Real-time search with fuzzy matching for neighborhoods, childcare, doctors, dentists
 */

const Search = {
    searchInput: null,
    clearButton: null,
    suggestionsContainer: null,
    currentResults: [],

    /**
     * Initialize search functionality
     */
    init() {
        this.searchInput = Utils.getElement('searchInput');
        this.clearButton = Utils.getElement('clearSearch');
        this.suggestionsContainer = Utils.getElement('searchSuggestions');

        if (!this.searchInput) return;

        this.setupEventListeners();
    },

    /**
     * Setup event listeners for search
     */
    setupEventListeners() {
        // Real-time search with debounce
        const debouncedSearch = Utils.debounce(() => {
            this.performSearch();
        }, 300);

        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            
            // Show/hide clear button
            if (query.length > 0) {
                this.clearButton.style.display = 'block';
            } else {
                this.clearButton.style.display = 'none';
                this.hideSuggestions();
            }

            debouncedSearch();
        });

        // Clear search
        this.clearButton.addEventListener('click', () => {
            this.searchInput.value = '';
            this.clearButton.style.display = 'none';
            this.hideSuggestions();
            triggerFilteredDisplay();
            
            // Track clear in analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'search_clear', {
                    event_category: 'search'
                });
            }
        });

        // Handle Enter key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch();
                this.hideSuggestions();
            }
        });

        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSuggestions();
            }
        });
    },

    /**
     * Perform search and filter results
     */
    performSearch() {
        const query = this.searchInput.value.trim();

        if (query.length === 0) {
            triggerFilteredDisplay();
            return;
        }

        // Get all current results based on filters
        const filters = getCurrentFilters();
        
        // Search in all ratings
        const searchResults = this.fuzzySearch(query, allRatings);
        
        // Track search in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'search', {
                event_category: 'engagement',
                search_term: query,
                results_count: searchResults.length
            });
        }

        // Display search results
        this.displaySearchResults(searchResults, filters);
    },

    /**
     * Fuzzy search implementation using Levenshtein distance
     * @param {string} query - Search query
     * @param {Array} items - Items to search
     * @returns {Array} - Matched items with scores
     */
    fuzzySearch(query, items) {
        const normalizedQuery = this.normalizeString(query);
        const results = [];

        items.forEach(item => {
            // Skip if wrong location type or city
            if ((item.locationType || 'neighborhood') !== AppState.getLocationType()) return;
            if ((item.city || 'София') !== AppState.getCity()) return;

            const name = this.normalizeString(item.neighborhood);
            const score = this.calculateMatchScore(normalizedQuery, name);

            // Include if score is good enough (threshold: 0.3)
            if (score > 0.3) {
                results.push({
                    item: item,
                    score: score,
                    neighborhood: item.neighborhood
                });
            }
        });

        // Sort by score (descending)
        results.sort((a, b) => b.score - a.score);

        return results;
    },

    /**
     * Calculate match score between query and text
     * Uses combination of exact match, starts with, contains, and Levenshtein distance
     * @param {string} query - Normalized query
     * @param {string} text - Normalized text
     * @returns {number} - Match score (0-1)
     */
    calculateMatchScore(query, text) {
        // Exact match
        if (text === query) return 1.0;

        // Starts with query
        if (text.startsWith(query)) return 0.9;

        // Contains query
        if (text.includes(query)) return 0.8;

        // Calculate Levenshtein distance
        const distance = this.levenshteinDistance(query, text);
        const maxLength = Math.max(query.length, text.length);
        const similarity = 1 - (distance / maxLength);

        return similarity;
    },

    /**
     * Levenshtein distance algorithm
     * @param {string} a - First string
     * @param {string} b - Second string
     * @returns {number} - Edit distance
     */
    levenshteinDistance(a, b) {
        const matrix = [];

        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    },

    /**
     * Normalize string for comparison (lowercase, remove accents)
     * @param {string} str - String to normalize
     * @returns {string} - Normalized string
     */
    normalizeString(str) {
        return str.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    },

    /**
     * Display search results
     * @param {Array} searchResults - Search results with scores
     * @param {Object} filters - Current filters
     */
    displaySearchResults(searchResults, filters) {
        // Group by neighborhood and apply existing filters/sorting
        const grouped = {};
        
        searchResults.forEach(result => {
            const neighborhood = result.neighborhood;
            if (!grouped[neighborhood]) {
                grouped[neighborhood] = [];
            }
            grouped[neighborhood].push(result.item);
        });

        // Build entries like in displayResults
        const entries = Object.entries(grouped).map(([neighborhood, neighborhoodRatings]) => {
            const city = neighborhoodRatings[0]?.city || 'София';
            const locationType = neighborhoodRatings[0]?.locationType || 'neighborhood';
            const avgRatings = {};
            
            let specialty = '';
            if (locationType === 'doctors') {
                const match = neighborhood.match(/\(([^)]+)\)$/);
                specialty = match ? match[1] : '';
            }
            
            if (locationType === 'childcare' || locationType === 'doctors' || locationType === 'dentists') {
                const sum = neighborhoodRatings.reduce((acc, r) => acc + (r.ratings.overall || 0), 0);
                avgRatings.overall = (sum / neighborhoodRatings.length).toFixed(1);
                const totalAvg = parseFloat(avgRatings.overall);
                return { neighborhood, city, neighborhoodRatings, avgRatings, totalAvg, locationType, specialty };
            } else {
                Object.keys(criteria).forEach(criterion => {
                    const sum = neighborhoodRatings.reduce((acc, r) => acc + (r.ratings[criterion] || 0), 0);
                    avgRatings[criterion] = (sum / neighborhoodRatings.length).toFixed(1);
                });
                const totalAvg = (Object.values(avgRatings).reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / 10).toFixed(1);
                return { neighborhood, city, neighborhoodRatings, avgRatings, totalAvg: parseFloat(totalAvg), locationType, specialty };
            }
        });

        // Apply advanced filters
        let displayedEntries = entries.filter(entry => {
            const voteCount = entry.neighborhoodRatings.length;
            const rating = entry.totalAvg;
            return voteCount >= filters.minVotes && rating >= filters.minRating;
        });

        // Apply sorting
        displayedEntries = applySorting(displayedEntries, filters.sortBy);

        // Update results count
        updateResultsCount(displayedEntries.length);

        // Display results
        const container = Utils.getElement('resultsContainer');
        container.innerHTML = '';

        if (displayedEntries.length === 0) {
            container.innerHTML = '<div class="empty-state">Няма резултати за "' + this.searchInput.value + '"</div>';
            return;
        }

        // Use existing render logic
        renderResultBatch(displayedEntries, container);
    },

    /**
     * Show search suggestions
     * @param {Array} suggestions - Array of suggestion strings
     */
    showSuggestions(suggestions) {
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        this.suggestionsContainer.innerHTML = '';
        
        suggestions.slice(0, 5).forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = suggestion;
            item.addEventListener('click', () => {
                this.searchInput.value = suggestion;
                this.performSearch();
                this.hideSuggestions();
            });
            this.suggestionsContainer.appendChild(item);
        });

        this.suggestionsContainer.style.display = 'block';
    },

    /**
     * Hide search suggestions
     */
    hideSuggestions() {
        if (this.suggestionsContainer) {
            this.suggestionsContainer.style.display = 'none';
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    Search.init();
});
