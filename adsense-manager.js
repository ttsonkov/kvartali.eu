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
        // Delay setup to ensure DOM is ready
        if (document.readyState === 'complete') {
            this.setupAdObserver();
        } else {
            window.addEventListener('load', () => this.setupAdObserver());
        }
    },
    
    /**
     * Insert native ad between results
     * @param {number} position - Position to insert ad (every N items)
     */
    insertNativeAds(position = 5) {
        const resultsContainer = document.getElementById('resultsContainer');
        if (!resultsContainer || resultsContainer.children.length < 3) {
            return;
        }
        
        const resultCards = resultsContainer.querySelectorAll('.result-card, .neighborhood-card');
        resultCards.forEach((card, index) => {
            if ((index + 1) % position === 0 && index > 0) {
                // Check if ad already exists after this card
                if (card.nextSibling && card.nextSibling.classList && card.nextSibling.classList.contains('native-ad-container')) {
                    return;
                }
                
                // Create native ad container
                const adContainer = document.createElement('div');
                adContainer.className = 'native-ad-container';
                adContainer.style.minHeight = '90px';
                adContainer.style.minWidth = '300px';
                
                const adUnit = document.createElement('ins');
                adUnit.className = 'adsbygoogle';
                adUnit.style.display = 'block';
                adUnit.style.minHeight = '90px';
                adUnit.style.width = '100%';
                adUnit.setAttribute('data-ad-format', 'rectangle');
                adUnit.setAttribute('data-ad-client', this.publisherId);
                adUnit.setAttribute('data-ad-slot', this.nativeAdSlot);
                adContainer.appendChild(adUnit);
                
                // Insert after current card
                card.parentNode.insertBefore(adContainer, card.nextSibling);
                
                // Push ad to AdSense after a short delay to ensure width is set
                setTimeout(() => {
                    try {
                        (adsbygoogle = window.adsbygoogle || []).push({});
                    } catch (e) {
                        console.error('AdSense push error:', e);
                    }
                }, 100);
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
        adContainer.style.minWidth = '300px';
        adContainer.style.minHeight = '90px';
        
        const adUnit = document.createElement('ins');
        adUnit.className = 'adsbygoogle';
        adUnit.style.display = 'block';
        adUnit.style.width = '100%';
        adUnit.style.minHeight = '90px';
        adUnit.setAttribute('data-ad-format', 'rectangle');
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
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const adIns = entry.target.querySelector('.adsbygoogle');
                    if (adIns && !adIns.dataset.adsenseLoaded) {
                        // Delay to ensure element has proper width
                        setTimeout(() => {
                            if (entry.target.offsetWidth >= 250) {
                                try {
                                    (adsbygoogle = window.adsbygoogle || []).push({});
                                    adIns.dataset.adsenseLoaded = 'true';
                                } catch (e) {
                                    console.error('AdSense lazy load error:', e);
                                }
                            }
                        }, 100);
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
        
        // Wait for results to render, then insert new ads
        const self = this;
        setTimeout(() => {
            self.insertNativeAds(5);
            self.setupAdObserver();
        }, 500);
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
