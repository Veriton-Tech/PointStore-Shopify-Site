/*
  assets/theme.js
  Clean SheinTheme implementation (single file)
  - Centralizes lightweight UI helpers
  - Normalizes wishlist storage key to 'shopify-wishlist'
*/

class SheinTheme {
  constructor() {
    this.WISHLIST_KEY = 'shopify-wishlist';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeComponents();
    this.setupMobileMenu();
    this.setupSearch();
    this.setupFilters();
    this.setupWishlist();
    this.setupCart();
    this.setupProductGallery();
    this.setupLazyLoading();
  }

  setupEventListeners() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  initializeComponents() {
    this.initTooltips();
    this.initModals();
    this.initDropdowns();
  }

  /* ----------------------------- Search ----------------------------- */
  setupSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      if (query.length < 2) return;
      searchTimeout = setTimeout(() => this.performSearch(query), 300);
    });
  }

  performSearch(query) {
    // Placeholder: integrate with your search API if available
    console.debug('performSearch', query);
  }

  hideSearchResults() {
    const searchResults = document.querySelector('.search-results');
    if (searchResults) searchResults.classList.remove('active');
  }

  /* ----------------------------- Filters ---------------------------- */
  setupFilters() {
    const filterOptions = document.querySelectorAll('.filter-option');
    filterOptions.forEach(option => {
      option.addEventListener('click', () => {
        option.classList.toggle('active');
        this.applyFilters();
      });
    });
  }

  applyFilters() {
    const activeFilters = document.querySelectorAll('.filter-option.active');
    const products = document.querySelectorAll('.product-card');
    // Lightweight client-side filtering placeholder
    products.forEach(product => {
      let shouldShow = true;
      // Add logic to set shouldShow based on activeFilters and product attributes
      if (shouldShow) product.style.display = '';
      else product.style.display = 'none';
    });
  }

  /* ----------------------------- Tooltips --------------------------- */
  initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = e.target.dataset.tooltip || '';
        document.body.appendChild(tooltip);
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
      });

      element.addEventListener('mouseleave', () => {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) tooltip.remove();
      });
    });
  }

  /* ----------------------------- Modals ----------------------------- */
  initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');

    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.dataset.modal;
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.add('active');
          document.body.classList.add('modal-open');
        }
      });
    });

    modals.forEach(modal => {
      const closeButton = modal.querySelector('.modal-close');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          modal.classList.remove('active');
          document.body.classList.remove('modal-open');
        });
      }

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.classList.remove('modal-open');
        }
      });
    });
  }

  /* ---------------------------- Dropdowns --------------------------- */
  initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (!toggle) return;
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdowns.forEach(d => { if (d !== dropdown) d.classList.remove('active'); });
        dropdown.classList.toggle('active');
      });
    });

    document.addEventListener('click', () => {
      dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    });
  }

  /* ---------------------------- Wishlist ---------------------------- */
  setupWishlist() {
    // Seed active states for any existing buttons
    const stored = JSON.parse(localStorage.getItem(this.WISHLIST_KEY) || '[]');

    // helper to check existence for both legacy (string) and object entries
    const inWishlist = (pid) => {
      try {
        return stored.some(item => (typeof item === 'string' ? item === pid : String(item.id) === pid));
      } catch (e) {
        return false;
      }
    };

    document.querySelectorAll('.product-card-wishlist').forEach(btn => {
      const pid = String(btn.dataset.productId || '');
      if (pid && inWishlist(pid)) btn.classList.add('active');
      btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        const productId = String(btn.dataset.productId || '');
        if (!productId) return;
        this.toggleWishlist(productId, btn);
      });
    });

    // Keep header count in sync with other scripts/pages
    this.updateWishlistCount();

    // Listen to custom events dispatched by other inline scripts
    window.addEventListener('wishlistUpdated', () => this.updateWishlistCount());

    // Also listen to storage events for cross-tab updates
    window.addEventListener('storage', (e) => {
      if (e.key === this.WISHLIST_KEY) this.updateWishlistCount();
    });
  }

  toggleWishlist(productId, button) {
    const isActive = button.classList.contains('active');
    if (isActive) {
      button.classList.remove('active');
      this.removeFromWishlist(productId);
    } else {
      button.classList.add('active');
      this.addToWishlist(productId);
    }
  }

  addToWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem(this.WISHLIST_KEY) || '[]');
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlist));
      this.showNotification('Added to wishlist');
      this.updateWishlistCount();
      // notify other components
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { wishlist, productId, action: 'added' } }));
    }
  }

  removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem(this.WISHLIST_KEY) || '[]');
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlist));
    this.showNotification('Removed from wishlist');
    this.updateWishlistCount();
    // notify other components
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { wishlist, productId, action: 'removed' } }));
  }

  updateWishlistCount() {
    const wishlistCount = document.querySelector('.wishlist-count');
    if (!wishlistCount) return;
    const wishlist = JSON.parse(localStorage.getItem(this.WISHLIST_KEY) || '[]');
    wishlistCount.textContent = String(wishlist.length);
  }

  /* ------------------------------ Cart ----------------------------- */
  setupCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const variantId = button.dataset.variantId;
        this.addToCart(variantId, 1, button);
      });
    });
    this.updateCartCount();
  }

  async addToCart(variantId, quantity = 1, button) {
    if (!variantId) return;
    const originalText = button ? button.textContent : null;
    if (button) { button.textContent = 'Adding...'; button.disabled = true; }
    try {
      await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity })
      });
      const currentCount = parseInt(localStorage.getItem('cartCount') || '0', 10);
      localStorage.setItem('cartCount', String(currentCount + 1));
      this.showNotification('Added to cart');
      this.updateCartCount();
    } catch (err) {
      console.error(err);
      this.showNotification('Failed to add to cart', 'error');
    } finally {
      if (button) { button.textContent = originalText; button.disabled = false; }
    }
  }

  updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;
    cartCount.textContent = localStorage.getItem('cartCount') || '0';
  }

  /* ------------------------- Product gallery ------------------------ */
  setupProductGallery() { /* placeholder */ }
  setupLazyLoading() { /* placeholder */ }

  /* --------------------------- Utilities --------------------------- */
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 50);
    setTimeout(() => notification.remove(), 3000);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => { clearTimeout(timeout); func(...args); };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', () => new SheinTheme());

// Global helper for Shopify cart operations (kept for compatibility)
window.SheinTheme = {
  addToCart: (variantId, quantity = 1) => {
    return fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity })
    })
    .then(res => res.json())
    .catch(err => console.error(err));
  },

  updateCart: (updates) => {
    return fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates })
    }).then(res => res.json());
  },

  getCart: () => fetch('/cart.js').then(res => res.json())
};

