// Shein-Inspired Shopify Theme - JavaScript

class SheinTheme {
  constructor() {
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
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
      });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileMenu && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  initializeComponents() {
    // Initialize tooltips
    this.initTooltips();
    
    // Initialize modals
    this.initModals();
    
    // Initialize dropdowns
    this.initDropdowns();
  }

  setupMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenu) return;

    // Create mobile menu structure
    const nav = document.querySelector('.navbar-nav');
    if (nav) {
      mobileMenu.innerHTML = nav.outerHTML;
    }
  }

  setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput) {
      let searchTimeout;
      
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length < 2) {
          this.hideSearchResults();
          return;
        }
        
        searchTimeout = setTimeout(() => {
          this.performSearch(query);
        }, 300);
      });
      
      // Hide results when clicking outside
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults?.contains(e.target)) {
          this.hideSearchResults();
        }
      });
    }
  }

  async performSearch(query) {
    try {
      // For demo purposes, use sample search data
      const sampleProducts = [
        {
          title: 'Elegant Black Dress',
          price: '89.99',
          image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=100&h=100&fit=crop&crop=center',
          url: '/products/sample-dress'
        },
        {
          title: 'Classic White Shirt',
          price: '45.99',
          image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop&crop=center',
          url: '/products/sample-shirt'
        },
        {
          title: 'Slim Fit Chinos',
          price: '65.99',
          image: 'https://images.unsplash.com/photo-1506629905607-1a0b0b0b0b0b?w=100&h=100&fit=crop&crop=center',
          url: '/products/sample-pants'
        },
        {
          title: 'Denim Jacket',
          price: '120.99',
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop&crop=center',
          url: '/products/sample-jacket'
        },
        {
          title: 'Leather Loafers',
          price: '95.99',
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop&crop=center',
          url: '/products/sample-shoes'
        }
      ];
      
      // Filter products based on query
      const filteredProducts = sampleProducts.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase())
      );
      
      this.displaySearchResults(filteredProducts);
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  displaySearchResults(products) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;

    if (products.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No products found</div>';
    } else {
      const resultsHTML = products.map(product => `
        <a href="${product.url}" class="search-result-item">
          <img src="${product.image}" alt="${product.title}" class="search-result-image">
          <div class="search-result-content">
            <h4 class="search-result-title">${product.title}</h4>
            <p class="search-result-price">$${product.price}</p>
          </div>
        </a>
      `).join('');
      
      searchResults.innerHTML = resultsHTML;
    }
    
    searchResults.classList.add('active');
  }

  hideSearchResults() {
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
      searchResults.classList.remove('active');
    }
  }

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
    
    products.forEach(product => {
      let shouldShow = true;
      
      activeFilters.forEach(filter => {
        const filterType = filter.dataset.filter;
        const filterValue = filter.dataset.value;
        
        if (filterType === 'category') {
          if (!product.dataset.category?.includes(filterValue)) {
            shouldShow = false;
          }
        } else if (filterType === 'price') {
          const productPrice = parseFloat(product.dataset.price);
          const [min, max] = filterValue.split('-').map(Number);
          
          if (productPrice < min || (max && productPrice > max)) {
            shouldShow = false;
          }
        } else if (filterType === 'color') {
          if (!product.dataset.colors?.includes(filterValue)) {
            shouldShow = false;
          }
        }
      });
      
      product.style.display = shouldShow ? 'block' : 'none';
    });
  }

  setupWishlist() {
    const wishlistButtons = document.querySelectorAll('.product-card-wishlist');
    
    wishlistButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const productId = button.dataset.productId;
        this.toggleWishlist(productId, button);
      });
    });
  }

  toggleWishlist(productId, button) {
    const isWishlisted = button.classList.contains('active');
    
    if (isWishlisted) {
      this.removeFromWishlist(productId);
      button.classList.remove('active');
    } else {
      this.addToWishlist(productId);
      button.classList.add('active');
    }
  }

  addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      this.showNotification('Added to wishlist');
      this.updateWishlistCount();
    }
  }

  removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    this.showNotification('Removed from wishlist');
    this.updateWishlistCount();
  }

  updateWishlistCount() {
    const wishlistCount = document.querySelector('.wishlist-count');
    if (wishlistCount) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      wishlistCount.textContent = wishlist.length;
    }
  }

  setupCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const productId = button.dataset.productId;
        const variantId = button.dataset.variantId;
        
        this.addToCart(productId, variantId, button);
      });
    });
  }

  async addToCart(productId, variantId, button) {
    const originalText = button.textContent;
    button.textContent = 'Adding...';
    button.disabled = true;
    
    try {
      // For demo purposes, simulate adding to cart
      if (productId && productId !== 'undefined') {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update local cart count
        const currentCount = parseInt(localStorage.getItem('cartCount') || '0');
        localStorage.setItem('cartCount', (currentCount + 1).toString());
        
        this.showNotification('Added to cart');
        this.updateCartCount();
      } else {
        throw new Error('Product ID not found');
      }
    } catch (error) {
      console.error('Cart error:', error);
      this.showNotification('Failed to add to cart', 'error');
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  }

  updateCartCount() {
    // For demo purposes, use localStorage
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      const count = localStorage.getItem('cartCount') || '0';
      cartCount.textContent = count;
    }
  }

  setupProductGallery() {
    const productImages = document.querySelectorAll('.product-image');
    const thumbnailImages = document.querySelectorAll('.product-thumbnail');
    
    thumbnailImages.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        const mainImage = thumbnail.dataset.image;
        const mainImageElement = document.querySelector('.product-main-image');
        
        if (mainImageElement) {
          mainImageElement.src = mainImage;
        }
        
        // Update active thumbnail
        thumbnailImages.forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
      });
    });
  }

  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }

  initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = e.target.dataset.tooltip;
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
      });
      
      element.addEventListener('mouseleave', () => {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
          tooltip.remove();
        }
      });
    });
  }

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

  initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (toggle && menu) {
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Close other dropdowns
          dropdowns.forEach(d => {
            if (d !== dropdown) {
              d.classList.remove('active');
            }
          });
          
          dropdown.classList.toggle('active');
        });
      }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    });
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Utility methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
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
document.addEventListener('DOMContentLoaded', () => {
  new SheinTheme();
});

// Global functions for Shopify integration
window.SheinTheme = {
  addToCart: (variantId, quantity = 1) => {
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 422) {
        throw new Error(data.description);
      }
      return data;
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
    });
  },

  updateCart: (updates) => {
    return fetch('/cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updates })
    });
  },

  getCart: () => {
    return fetch('/cart.js')
      .then(response => response.json());
  }
};

