/**
 * Keyboard Shortcuts Module
 * Provides keyboard navigation and shortcuts
 */

const KeyboardShortcuts = {
    init() {
        this.setupKeyboardListeners();
        console.log('Keyboard shortcuts initialized');
    },
    
    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            // Skip if user is typing in input/textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                // Allow Escape to blur
                if (e.key === 'Escape') {
                    e.target.blur();
                }
                return;
            }
            
            // Focus search with '/' key
            if (e.key === '/') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                    Utils.showToast('Търсене активирано', 'success');
                }
            }
            
            // Focus form with 'n' (new rating)
            if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                const firstInput = document.querySelector('#ratingForm select, #ratingForm textarea');
                if (firstInput) {
                    firstInput.focus();
                    firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    Utils.showToast('Формуляр за оценка', 'success');
                }
            }
            
            // Toggle dark mode with 'd'
            if (e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                if (typeof DarkMode !== 'undefined' && DarkMode.toggle) {
                    DarkMode.toggle();
                }
            }
            
            // Navigate location types with number keys
            if (e.key >= '1' && e.key <= '4') {
                e.preventDefault();
                const buttons = [
                    document.getElementById('btnNeighborhoods'),
                    document.getElementById('btnChildcare'),
                    document.getElementById('btnDoctors'),
                    document.getElementById('btnDentists')
                ];
                const index = parseInt(e.key) - 1;
                if (buttons[index]) {
                    buttons[index].click();
                }
            }
            
            // Show help with '?'
            if (e.key === '?') {
                e.preventDefault();
                this.showHelp();
            }
        });
    },
    
    showHelp() {
        const helpText = `
            <div style="text-align: left; line-height: 1.8;">
                <h3 style="margin-top: 0;">⌨️ Клавишни комбинации:</h3>
                <p><kbd>/</kbd> - Фокус върху търсачката</p>
                <p><kbd>N</kbd> - Отвори формуляр за оценка</p>
                <p><kbd>D</kbd> - Превключи тъмен режим</p>
                <p><kbd>1-4</kbd> - Смени тип локация (Квартали/ДГ/Лекари/Зъболекари)</p>
                <p><kbd>Esc</kbd> - Затвори диалогов прозорец</p>
                <p><kbd>?</kbd> - Покажи тази помощ</p>
            </div>
        `;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'keyboard-help-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: var(--card-bg);
            padding: 30px;
            border-radius: 12px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            color: var(--text-primary);
        `;
        content.innerHTML = helpText;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Close on click or Escape
        const close = () => modal.remove();
        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                close();
                document.removeEventListener('keydown', escHandler);
            }
        });
        
        // Track help view
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_keyboard_help', {
                'event_category': 'user_assistance'
            });
        }
    }
};

// Keyboard shortcut styles
const style = document.createElement('style');
style.textContent = `
    kbd {
        display: inline-block;
        padding: 3px 8px;
        font-family: monospace;
        font-size: 0.9em;
        background: var(--input-bg);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        box-shadow: 0 2px 3px rgba(0,0,0,0.1);
        margin: 0 2px;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => KeyboardShortcuts.init());
} else {
    KeyboardShortcuts.init();
}

// Expose globally
window.KeyboardShortcuts = KeyboardShortcuts;
