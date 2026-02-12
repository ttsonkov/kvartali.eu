/**
 * Dark Mode Manager
 * Handles theme switching with localStorage persistence and system preference detection
 */

const DarkMode = {
    /**
     * Initialize dark mode
     * - Check localStorage for saved preference
     * - If no preference, detect system preference
     * - Apply the theme
     */
    init() {
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark') {
            this.enableDarkMode(false);
        } else if (savedTheme === 'light') {
            this.disableDarkMode(false);
        } else {
            // No saved preference, check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.enableDarkMode(false);
            }
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem('theme')) {
                    if (e.matches) {
                        this.enableDarkMode(false);
                    } else {
                        this.disableDarkMode(false);
                    }
                }
            });
        }

        // Set up toggle button
        this.setupToggleButton();
    },

    /**
     * Enable dark mode
     * @param {boolean} savePreference - Whether to save to localStorage
     */
    enableDarkMode(savePreference = true) {
        document.body.classList.add('dark-mode');
        if (savePreference) {
            localStorage.setItem('theme', 'dark');
        }
        this.trackThemeChange('dark');
    },

    /**
     * Disable dark mode
     * @param {boolean} savePreference - Whether to save to localStorage
     */
    disableDarkMode(savePreference = true) {
        document.body.classList.remove('dark-mode');
        if (savePreference) {
            localStorage.setItem('theme', 'light');
        }
        this.trackThemeChange('light');
    },

    /**
     * Toggle between dark and light mode
     */
    toggle() {
        if (document.body.classList.contains('dark-mode')) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    },

    /**
     * Set up the toggle button
     */
    setupToggleButton() {
        // Create the toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'dark-mode-toggle';
        toggleButton.setAttribute('aria-label', 'Превключи тъмна тема');
        toggleButton.setAttribute('title', 'Превключи тъмна/светла тема');
        
        // Sun icon (for light mode)
        const sunIcon = `
            <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        `;
        
        // Moon icon (for dark mode)
        const moonIcon = `
            <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#7289da" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `;
        
        toggleButton.innerHTML = sunIcon + moonIcon;
        
        // Add click handler
        toggleButton.addEventListener('click', () => {
            this.toggle();
        });
        
        // Add to page
        document.body.appendChild(toggleButton);
    },

    /**
     * Track theme change in Google Analytics
     * @param {string} theme - The theme that was applied
     */
    trackThemeChange(theme) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                event_category: 'engagement',
                event_label: theme,
                value: theme === 'dark' ? 1 : 0
            });
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    DarkMode.init();
});
