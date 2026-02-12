/**
 * Google AdSense Manager
 * Handles dynamic ad insertion and optimization
 */

const AdSenseManager = {
    // Configuration
    publisherId: 'ca-pub-5413114692875335',
    nativeAdSlot: '7592615481',
    inFeedAdSlot: '3082524839',
    sidebarAdSlot: '2535827986',
    
    /**
     * Initialize AdSense manager
     */
    init() {
        // Delay setup to ensure DOM is ready and visible
        if (document.readyState === 'complete') {
            this.setupAdObserver();
        } else {
            window.addEventListener('load', () => this.setupAdObserver());
        }
    },
    
    /**
     * Check if element and all parents have valid width
     * @param {HTMLElement} el - Element to check
     * @returns {boolean} True if element is visible with positive width
     */
    isVisibleWithWidth(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        // Check if element has width and is in the viewport
        if (el.offsetWidth < 10 || rect.width < 10) {
            return false;
        }
        // Also check if the body/document has width (page is rendered)
        if (document.body.offsetWidth < 100) {
            return false;
        }
        return true;
    },
    
    /**
     * Insert native ad between results
     * @param {number} position - Position to insert ad (every N items)
     */
    insertNativeAds(position = 5) {
        const resultsContainer = document.getElementById('resultsContainer');
        // Prevent ad insertion if no results or low-value content
        if (!resultsContainer || resultsContainer.children.length === 0 || resultsContainer.textContent.trim().length < 50) {
            return;
        }
        // Check visibility
        if (!this.isVisibleWithWidth(resultsContainer)) {
            console.warn('AdSenseManager: resultsContainer has zero width, skipping ad insertion');
            return;
        }
        const resultCards = resultsContainer.querySelectorAll('.result-card, .neighborhood-card');
        let adsInserted = 0;
        resultCards.forEach((card, index) => {
            if ((index + 1) % position === 0 && index > 0) {
                // Create native ad container
                const adContainer = document.createElement('div');
                adContainer.className = 'native-ad-container';
                const adUnit = document.createElement('ins');
                adUnit.className = 'adsbygoogle';
                adUnit.setAttribute('data-ad-format', 'fluid');
                adUnit.setAttribute('data-ad-layout-key', '-6t+ed+2i-1n-4w');
                adUnit.setAttribute('data-ad-client', this.publisherId);
                adUnit.setAttribute('data-ad-slot', this.nativeAdSlot);
                adContainer.appendChild(adUnit);
                // Insert after current card
                card.parentNode.insertBefore(adContainer, card.nextSibling);
                // Push ad to AdSense only if container is visible
                if (this.isVisibleWithWidth(adContainer)) {
                    try {
                        (adsbygoogle = window.adsbygoogle || []).push({});
                        adUnit.dataset.adsenseLoaded = 'true';
                        adsInserted++;
                    } catch (e) {
                        console.error('AdSense push error:', e);
                    }
                }
            }
        });
    },
    
    /**
     * Create in-feed ad unit
     * @returns {HTMLElement} Ad container
     */
    createInFeedAd() {
        const adContainer = document.createElement('div');
        adContainer.className = 'in-feed-ad-container';
        
        const adUnit = document.createElement('ins');
        adUnit.className = 'adsbygoogle';
        adUnit.setAttribute('data-ad-format', 'fluid');
        adUnit.setAttribute('data-ad-layout', 'in-article');
        adUnit.setAttribute('data-ad-client', this.publisherId);
        adUnit.setAttribute('data-ad-slot', this.inFeedAdSlot);
        
        adContainer.appendChild(adUnit);
        
        return adContainer;
    },
    
    /**
     * Setup Intersection Observer for lazy loading ads
     */
    setupAdObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        const self = this;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const adIns = entry.target.querySelector('.adsbygoogle');
                    if (adIns && !adIns.dataset.adsenseLoaded && self.isVisibleWithWidth(entry.target)) {
                        try {
                            (adsbygoogle = window.adsbygoogle || []).push({});
                            adIns.dataset.adsenseLoaded = 'true';
                        } catch (e) {
                            console.error('AdSense lazy load error:', e);
                        }
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px'
        });
        
        // Observe all ad containers
        document.querySelectorAll('.native-ad-container, .in-feed-ad-container').forEach(ad => {
            observer.observe(ad);
        });
    },
    
    /**
     * Refresh ads when results are updated
     */
    refreshAds() {
        // Remove existing native ads
        document.querySelectorAll('.native-ad-container, .in-feed-ad-container').forEach(ad => {
            ad.remove();
        });
        
        // Wait for results to render and page to be visible, then insert new ads
        const self = this;
        setTimeout(() => {
            // Only insert if page has valid width
            if (document.body.offsetWidth > 100) {
                self.insertNativeAds(5);
                self.setupAdObserver();
            }
        }, 1000);
    },
    
    /**
     * Track ad performance (for analytics)
     * @param {string} adType - Type of ad (native, display, in-feed)
     * @param {string} action - Action (impression, click)
     */
    trackAdPerformance(adType, action) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ad_interaction', {
                'ad_type': adType,
                'action': action,
                'timestamp': new Date().toISOString()
            });
        }
    },
    
    /**
     * A/B test different ad positions
     * @returns {number} Optimal position for ad insertion
     */
    getOptimalAdPosition() {
        // Store user variant in localStorage
        let variant = localStorage.getItem('ad_position_variant');
        
        if (!variant) {
            // Randomly assign variant (A: every 5, B: every 7, C: every 3)
            const variants = [3, 5, 7];
            variant = variants[Math.floor(Math.random() * variants.length)];
            localStorage.setItem('ad_position_variant', variant);
        }
        
        return parseInt(variant);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AdSenseManager.init());
} else {
    AdSenseManager.init();
}
