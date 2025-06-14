// Main JavaScript for Online Voting System

class VotingSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStats();
        this.animateElements();
    }

    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Add loading states to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.href && !btn.href.includes('#')) {
                    btn.classList.add('loading');
                    btn.style.opacity = '0.7';
                    btn.style.pointerEvents = 'none';
                }
            });
        });
    }

    async loadStats() {
        try {
            const response = await fetch('/api/voting/results');
            if (response.ok) {
                const data = await response.json();
                this.updateStatsDisplay(data);
            }
        } catch (error) {
            console.log('Stats not available yet');
        }
    }

    updateStatsDisplay(data) {
        const voterCountEl = document.getElementById('voterCount');
        const voteCountEl = document.getElementById('voteCount');

        if (voterCountEl && data.totalVotes !== undefined) {
            this.animateNumber(voteCountEl, data.totalVotes);
        }

        // Simulate voter registration count
        if (voterCountEl) {
            this.animateNumber(voterCountEl, Math.max(data.totalVotes * 2, 147));
        }
    }

    animateNumber(element, target) {
        const duration = 2000;
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    animateElements() {
        // Add fade-in animation to elements when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.feature-card, .access-card, .stat').forEach(el => {
            observer.observe(el);
        });
    }

    // Utility function for API calls
    async apiCall(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();
            return { success: response.ok, data, status: response.status };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
}

// Initialize the voting system
document.addEventListener('DOMContentLoaded', () => {
    window.votingSystem = new VotingSystem();
});

// Common utilities
const Utils = {
    formatAadhaar: (input) => {
        // Format Aadhaar as XXXX XXXX XXXX
        const numbers = input.replace(/\D/g, '').substring(0, 12);
        return numbers.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
    },

    validateAadhaar: (aadhaar) => {
        const pattern = /^\d{4}\s\d{4}\s\d{4}$/;
        return pattern.test(aadhaar);
    },

    formatDateTime: (date) => {
        return new Date(date).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    showLoader: (element) => {
        element.classList.add('loading');
        element.disabled = true;
    },

    hideLoader: (element) => {
        element.classList.remove('loading');
        element.disabled = false;
    }
};

// Make Utils available globally
window.Utils = Utils;