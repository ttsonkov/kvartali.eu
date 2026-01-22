/**
 * Data Visualizations Module
 * Charts for neighborhoods using Chart.js
 */

const Charts = {
    charts: {},

    /**
     * Create radar chart for neighborhood criteria
     * @param {string} canvasId - Canvas element ID
     * @param {Object} avgRatings - Average ratings object
     * @param {string} neighborhood - Neighborhood name
     * @returns {Chart} - Chart.js instance
     */
    createRadarChart(canvasId, avgRatings, neighborhood) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        // Destroy existing chart if present
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const labels = Object.values(criteria);
        const data = Object.keys(criteria).map(key => parseFloat(avgRatings[key]) || 0);

        // Get theme colors
        const isDarkMode = document.body.classList.contains('dark-mode');
        const textColor = isDarkMode ? '#e0e0e0' : '#333333';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const chartColor = isDarkMode ? 'rgba(114, 137, 218, 0.6)' : 'rgba(102, 126, 234, 0.6)';
        const chartBorder = isDarkMode ? 'rgba(114, 137, 218, 1)' : 'rgba(102, 126, 234, 1)';

        this.charts[canvasId] = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: neighborhood,
                    data: data,
                    backgroundColor: chartColor,
                    borderColor: chartBorder,
                    borderWidth: 2,
                    pointBackgroundColor: chartBorder,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: chartBorder
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1,
                            color: textColor,
                            backdropColor: 'transparent'
                        },
                        grid: {
                            color: gridColor
                        },
                        pointLabels: {
                            color: textColor,
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.r.toFixed(1) + ' ★';
                            }
                        }
                    }
                }
            }
        });

        return this.charts[canvasId];
    },

    /**
     * Create bar chart for comparing neighborhoods
     * @param {string} canvasId - Canvas element ID
     * @param {Array} entries - Array of neighborhood entries
     * @param {number} limit - Max number of items to show
     * @returns {Chart} - Chart.js instance
     */
    createComparisonBarChart(canvasId, entries, limit = 10) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        // Destroy existing chart if present
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        // Get top entries
        const topEntries = entries.slice(0, limit);
        const labels = topEntries.map(e => e.neighborhood);
        const data = topEntries.map(e => e.totalAvg);

        // Get theme colors
        const isDarkMode = document.body.classList.contains('dark-mode');
        const textColor = isDarkMode ? '#e0e0e0' : '#333333';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        // Generate gradient colors
        const colors = data.map((value, index) => {
            const hue = (120 * value / 5); // Green (120) for high ratings, red (0) for low
            return `hsla(${hue}, 70%, 50%, 0.7)`;
        });

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Среден рейтинг',
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors.map(c => c.replace('0.7', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y', // Horizontal bars
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            color: textColor,
                            stepSize: 1
                        },
                        grid: {
                            color: gridColor
                        }
                    },
                    y: {
                        ticks: {
                            color: textColor,
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.x.toFixed(1) + ' ★';
                            }
                        }
                    }
                }
            }
        });

        return this.charts[canvasId];
    },

    /**
     * Create votes distribution bar chart
     * @param {string} canvasId - Canvas element ID
     * @param {Array} entries - Array of neighborhood entries
     * @param {number} limit - Max number of items to show
     * @returns {Chart} - Chart.js instance
     */
    createVotesBarChart(canvasId, entries, limit = 10) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        // Destroy existing chart if present
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        // Sort by votes
        const sortedByVotes = [...entries].sort((a, b) => 
            b.neighborhoodRatings.length - a.neighborhoodRatings.length
        );

        const topEntries = sortedByVotes.slice(0, limit);
        const labels = topEntries.map(e => e.neighborhood);
        const data = topEntries.map(e => e.neighborhoodRatings.length);

        // Get theme colors
        const isDarkMode = document.body.classList.contains('dark-mode');
        const textColor = isDarkMode ? '#e0e0e0' : '#333333';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const chartColor = isDarkMode ? 'rgba(114, 137, 218, 0.7)' : 'rgba(102, 126, 234, 0.7)';
        const chartBorder = isDarkMode ? 'rgba(114, 137, 218, 1)' : 'rgba(102, 126, 234, 1)';

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Брой гласове',
                    data: data,
                    backgroundColor: chartColor,
                    borderColor: chartBorder,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            color: textColor,
                            stepSize: 1,
                            precision: 0
                        },
                        grid: {
                            color: gridColor
                        }
                    },
                    y: {
                        ticks: {
                            color: textColor,
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.x;
                                return value + (value === 1 ? ' глас' : ' гласа');
                            }
                        }
                    }
                }
            }
        });

        return this.charts[canvasId];
    },

    /**
     * Add chart toggle button to neighborhood card
     * @param {HTMLElement} card - Card element
     * @param {Object} entry - Neighborhood entry data
     */
    addChartToggle(card, entry) {
        // Only add charts for neighborhoods (10 criteria)
        if (entry.locationType !== 'neighborhood') return;

        const chartToggle = document.createElement('button');
        chartToggle.className = 'btn-chart-toggle';
        chartToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>Покажи графика</span>
        `;

        let chartContainer = null;
        let isChartVisible = false;

        chartToggle.addEventListener('click', () => {
            if (!isChartVisible) {
                // Create chart container
                chartContainer = document.createElement('div');
                chartContainer.className = 'chart-container';
                chartContainer.innerHTML = `
                    <canvas id="radar-${entry.neighborhood.replace(/\s+/g, '-')}" width="300" height="300"></canvas>
                `;
                card.appendChild(chartContainer);

                // Create radar chart
                const canvasId = `radar-${entry.neighborhood.replace(/\s+/g, '-')}`;
                this.createRadarChart(canvasId, entry.avgRatings, entry.neighborhood);

                chartToggle.querySelector('span').textContent = 'Скрий графика';
                isChartVisible = true;

                // Track chart view in analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'view_chart', {
                        event_category: 'engagement',
                        event_label: entry.neighborhood
                    });
                }
            } else {
                // Remove chart
                if (chartContainer) {
                    const canvasId = `radar-${entry.neighborhood.replace(/\s+/g, '-')}`;
                    if (this.charts[canvasId]) {
                        this.charts[canvasId].destroy();
                        delete this.charts[canvasId];
                    }
                    chartContainer.remove();
                }
                chartToggle.querySelector('span').textContent = 'Покажи графика';
                isChartVisible = false;
            }
        });

        // Insert button before share buttons
        const shareButtons = card.querySelector('.share-buttons');
        if (shareButtons) {
            shareButtons.parentNode.insertBefore(chartToggle, shareButtons);
        } else {
            card.appendChild(chartToggle);
        }
    },

    /**
     * Destroy all charts
     */
    destroyAll() {
        Object.keys(this.charts).forEach(key => {
            if (this.charts[key]) {
                this.charts[key].destroy();
            }
        });
        this.charts = {};
    }
};
