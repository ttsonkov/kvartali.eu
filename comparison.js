/**
 * Comparison Tool Module
 * Compare neighborhoods side-by-side with visualizations
 */

const Comparison = {
    selectedItems: [],
    maxItems: 3,
    modal: null,
    
    /**
     * Initialize comparison functionality
     */
    init() {
        this.modal = Utils.getElement('comparisonModal');
        this.setupEventListeners();
        this.updateCompareButton();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Compare button
        const compareBtn = Utils.getElement('compareButton');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                if (this.selectedItems.length >= 2) {
                    this.showComparison();
                } else {
                    this.showToast('Моля изберете поне 2 квартала за сравнение');
                }
            });
        }

        // Close modal
        const closeBtn = Utils.getElement('closeComparison');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Modal overlay click
        const overlay = this.modal?.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeModal());
        }

        // Share comparison
        const shareBtn = Utils.getElement('shareComparison');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareComparison());
        }

        // Clear comparison
        const clearBtn = Utils.getElement('clearComparison');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearSelection();
                this.closeModal();
            });
        }

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.style.display === 'flex') {
                this.closeModal();
            }
        });
    },

    /**
     * Add checkbox to neighborhood cards
     * @param {HTMLElement} card - Card element
     * @param {Object} entry - Neighborhood data
     */
    addCompareCheckbox(card, entry) {
        // Only for neighborhoods (not childcare/doctors/dentists in initial version)
        if (entry.locationType !== 'neighborhood') return;

        const checkbox = document.createElement('div');
        checkbox.className = 'compare-checkbox-container';
        
        const itemId = `${entry.city}-${entry.neighborhood}`;
        const isChecked = this.selectedItems.some(item => 
            item.city === entry.city && item.neighborhood === entry.neighborhood
        );

        checkbox.innerHTML = `
            <label class="compare-checkbox">
                <input type="checkbox" 
                    data-city="${entry.city}" 
                    data-neighborhood="${entry.neighborhood}"
                    ${isChecked ? 'checked' : ''}>
                <span class="checkbox-label">Сравни</span>
            </label>
        `;

        const checkboxInput = checkbox.querySelector('input[type="checkbox"]');
        checkboxInput.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.addItem(entry);
            } else {
                this.removeItem(entry);
            }
        });

        // Insert at the top of the card
        const h3 = card.querySelector('h3');
        if (h3) {
            h3.parentNode.insertBefore(checkbox, h3.nextSibling);
        }
    },

    /**
     * Add item to comparison
     * @param {Object} entry - Neighborhood entry
     */
    addItem(entry) {
        if (this.selectedItems.length >= this.maxItems) {
            this.showToast(`Можете да сравните максимум ${this.maxItems} квартала`);
            // Uncheck the checkbox
            const checkbox = document.querySelector(
                `input[data-city="${entry.city}"][data-neighborhood="${entry.neighborhood}"]`
            );
            if (checkbox) checkbox.checked = false;
            return;
        }

        // Check if already added
        const exists = this.selectedItems.some(item => 
            item.city === entry.city && item.neighborhood === entry.neighborhood
        );

        if (!exists) {
            this.selectedItems.push(entry);
            this.updateCompareButton();
            
            // Track in analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'comparison_add', {
                    event_category: 'engagement',
                    event_label: entry.neighborhood
                });
            }
        }
    },

    /**
     * Remove item from comparison
     * @param {Object} entry - Neighborhood entry
     */
    removeItem(entry) {
        this.selectedItems = this.selectedItems.filter(item => 
            !(item.city === entry.city && item.neighborhood === entry.neighborhood)
        );
        this.updateCompareButton();
    },

    /**
     * Update compare button text
     */
    updateCompareButton() {
        const btn = Utils.getElement('compareButton');
        if (btn) {
            const count = this.selectedItems.length;
            const text = btn.querySelector('span') || btn.childNodes[btn.childNodes.length - 1];
            if (text.nodeType === Node.TEXT_NODE) {
                text.textContent = `Сравни (${count})`;
            } else {
                btn.childNodes[btn.childNodes.length - 1].textContent = `Сравни (${count})`;
            }
            
            // Enable/disable button
            if (count >= 2) {
                btn.classList.add('active');
                btn.disabled = false;
            } else {
                btn.classList.remove('active');
                btn.disabled = false; // Keep enabled to show message
            }
        }
    },

    /**
     * Show comparison modal
     */
    showComparison() {
        if (this.selectedItems.length < 2) return;

        const content = Utils.getElement('comparisonContent');
        if (!content) return;

        // Build comparison HTML
        content.innerHTML = this.buildComparisonHTML();

        // Show modal
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Create charts after modal is visible
        setTimeout(() => {
            this.createComparisonCharts();
        }, 100);

        // Track in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_comparison', {
                event_category: 'engagement',
                value: this.selectedItems.length
            });
        }
    },

    /**
     * Build comparison HTML
     * @returns {string} - HTML string
     */
    buildComparisonHTML() {
        const items = this.selectedItems;
        
        let html = '<div class="comparison-grid">';

        // Headers
        html += '<div class="comparison-header comparison-criteria-label">Критерий</div>';
        items.forEach(item => {
            html += `
                <div class="comparison-header comparison-item-header">
                    <h3>${item.neighborhood}</h3>
                    <p>${item.city}</p>
                    <div class="comparison-overall-score">${item.totalAvg.toFixed(1)} ★</div>
                </div>
            `;
        });

        // Criteria rows
        Object.entries(criteria).forEach(([key, name]) => {
            html += `<div class="comparison-row-label">${name}</div>`;
            items.forEach(item => {
                const value = parseFloat(item.avgRatings[key]);
                const barWidth = (value / 5) * 100;
                const color = this.getScoreColor(value);
                
                html += `
                    <div class="comparison-cell">
                        <div class="comparison-score">${item.avgRatings[key]} ★</div>
                        <div class="comparison-bar">
                            <div class="comparison-bar-fill" style="width: ${barWidth}%; background: ${color};"></div>
                        </div>
                    </div>
                `;
            });
        });

        // Vote count row
        html += `<div class="comparison-row-label">Брой гласове</div>`;
        items.forEach(item => {
            html += `
                <div class="comparison-cell">
                    <div class="comparison-votes">${item.neighborhoodRatings.length} ${item.neighborhoodRatings.length === 1 ? 'глас' : 'гласа'}</div>
                </div>
            `;
        });

        html += '</div>'; // End grid

        // Radar charts section
        html += '<div class="comparison-charts-section">';
        html += '<h3>Визуална диаграма</h3>';
        html += '<div class="comparison-charts-grid">';
        items.forEach((item, index) => {
            html += `
                <div class="comparison-chart-container">
                    <h4>${item.neighborhood}</h4>
                    <canvas id="comparisonRadar${index}" width="300" height="300"></canvas>
                </div>
            `;
        });
        html += '</div></div>';

        return html;
    },

    /**
     * Create radar charts for comparison
     */
    createComparisonCharts() {
        if (typeof Charts === 'undefined') return;

        this.selectedItems.forEach((item, index) => {
            const canvasId = `comparisonRadar${index}`;
            Charts.createRadarChart(canvasId, item.avgRatings, item.neighborhood);
        });
    },

    /**
     * Get color based on score
     * @param {number} score - Score value (0-5)
     * @returns {string} - Color hex
     */
    getScoreColor(score) {
        if (score >= 4.5) return '#10b981'; // Green
        if (score >= 4.0) return '#84cc16'; // Light green
        if (score >= 3.5) return '#eab308'; // Yellow
        if (score >= 3.0) return '#f59e0b'; // Orange
        if (score >= 2.5) return '#f97316'; // Dark orange
        return '#ef4444'; // Red
    },

    /**
     * Close modal
     */
    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
            
            // Destroy charts
            if (typeof Charts !== 'undefined') {
                this.selectedItems.forEach((item, index) => {
                    const canvasId = `comparisonRadar${index}`;
                    if (Charts.charts[canvasId]) {
                        Charts.charts[canvasId].destroy();
                        delete Charts.charts[canvasId];
                    }
                });
            }
        }
    },

    /**
     * Share comparison
     */
    shareComparison() {
        const names = this.selectedItems.map(item => item.neighborhood).join(', ');
        const city = this.selectedItems[0]?.city || 'София';
        const url = window.location.origin + window.location.pathname;
        const text = `Сравнение на квартали: ${names} в ${city} - KvartaliEU`;

        // Try Web Share API
        if (navigator.share) {
            navigator.share({
                title: text,
                text: text,
                url: url
            }).then(() => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'share', {
                        method: 'comparison',
                        content_type: 'comparison',
                        item_id: names
                    });
                }
            }).catch(err => console.log('Share failed:', err));
        } else {
            // Fallback: Copy to clipboard
            const fullText = `${text}\n${url}`;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(fullText).then(() => {
                    this.showToast('Линк копиран! Споделете го с приятели.');
                });
            } else {
                // Old browser fallback
                const textarea = document.createElement('textarea');
                textarea.value = fullText;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                this.showToast('Линк копиран! Споделете го с приятели.');
            }

            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    method: 'copy',
                    content_type: 'comparison',
                    item_id: names
                });
            }
        }
    },

    /**
     * Clear selection
     */
    clearSelection() {
        this.selectedItems = [];
        this.updateCompareButton();
        
        // Uncheck all checkboxes
        document.querySelectorAll('.compare-checkbox input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
    },

    /**
     * Show toast message
     * @param {string} message - Message to show
     */
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    Comparison.init();
});
