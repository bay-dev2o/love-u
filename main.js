/*
 * Heartverse - Main Application Logic
 * Ultra Modern, Mobile-First, Interactive 3D Experience
 */

// DOM Ready State Handler
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the application
  initializeApp();
});

// Main Application Object
const Heartverse = {
  // App state
  state: {
    isSplashVisible: true,
    isFabMenuOpen: false,
    currentTheme: 'midnight',
    touchTrailEnabled: true,
    animationsEnabled: true
  },
  
  // DOM Elements
  elements: {
    splashScreen: null,
    appContainer: null,
    fabButton: null,
    fabMenu: null,
    touchTrailContainer: null,
    navItems: null,
    glassHeart: null
  },
  
  // Audio Context for Web Audio API
  audioContext: null,
  
  // Initialize the application
  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.initializeAudio();
    this.loadTheme();
    this.hideSplashScreen();
  },
  
  // Cache DOM elements
  cacheElements() {
    this.elements.splashScreen = document.getElementById('splash-screen');
    this.elements.appContainer = document.getElementById('app-container');
    this.elements.fabButton = document.getElementById('fab-button');
    this.elements.fabMenu = document.getElementById('fab-menu');
    this.elements.touchTrailContainer = document.getElementById('touch-trail-container');
    this.elements.navItems = document.querySelectorAll('.nav-item');
    this.elements.glassHeart = document.querySelector('.glass-heart');
    // Add FAB menu items
    this.elements.fabMenuItems = document.querySelectorAll('.fab-menu-item');
  },
  
  // Set up event listeners
  setupEventListeners() {
    // FAB Button Toggle
    this.elements.fabButton.addEventListener('click', () => {
      this.toggleFabMenu();
    });
    
    // Close FAB menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.state.isFabMenuOpen && 
          !this.elements.fabButton.contains(e.target) && 
          !this.elements.fabMenu.contains(e.target)) {
        this.closeFabMenu();
      }
    });
    
    // Navigation Items
    this.elements.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const target = e.currentTarget.dataset.target;
        this.navigateTo(target);
      });
    });
    
    // FAB Menu Items
    if (this.elements.fabMenuItems) {
      this.elements.fabMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
          const target = e.currentTarget.dataset.target;
          this.navigateTo(target);
        });
      });
    }
    
    // Touch Events for Mobile
    document.addEventListener('touchstart', (e) => {
      this.handleTouchStart(e);
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
      this.handleTouchMove(e);
    }, { passive: false });
    
    document.addEventListener('touchend', (e) => {
      this.handleTouchEnd(e);
    }, { passive: false });
    
    // Mouse Events for Desktop Testing
    document.addEventListener('mousedown', (e) => {
      this.handleMouseDown(e);
    });
    
    document.addEventListener('mousemove', (e) => {
      this.handleMouseMove(e);
    });
    
    document.addEventListener('mouseup', (e) => {
      this.handleMouseUp(e);
    });
    
    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });
    
    // Window Resize Handling
    window.addEventListener('resize', () => {
      this.handleResize();
    });
    
    // Visibility Change (Tab switching)
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });
  },
  
  // Initialize Web Audio API
  initializeAudio() {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume audio context on first user interaction
      const resumeAudioContext = () => {
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }
        document.removeEventListener('touchstart', resumeAudioContext);
        document.removeEventListener('mousedown', resumeAudioContext);
      };
      
      document.addEventListener('touchstart', resumeAudioContext);
      document.addEventListener('mousedown', resumeAudioContext);
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  },
  
  // Load theme from localStorage or default
  loadTheme() {
    const savedTheme = localStorage.getItem('heartverse-theme') || 'midnight';
    this.setTheme(savedTheme);
  },
  
  // Set application theme
  setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    this.state.currentTheme = themeName;
    localStorage.setItem('heartverse-theme', themeName);
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: themeName }
    }));
  },
  
  // Hide splash screen after delay
  hideSplashScreen() {
    setTimeout(() => {
      this.elements.splashScreen.classList.add('hidden');
      this.elements.appContainer.classList.remove('hidden');
      this.state.isSplashVisible = false;
      
      // Trigger entrance animation for glass heart
      setTimeout(() => {
        this.elements.glassHeart.style.animationPlayState = 'running';
      }, 500);
    }, 3000);
  },
  
  // Toggle FAB menu
  toggleFabMenu() {
    if (this.state.isFabMenuOpen) {
      this.closeFabMenu();
    } else {
      this.openFabMenu();
    }
  },
  
  // Open FAB menu
  openFabMenu() {
    this.elements.fabMenu.classList.remove('hidden');
    this.state.isFabMenuOpen = true;
    
    // Add animation class
    this.elements.fabMenu.classList.add('animate-fade-in');
    
    // Rotate FAB button
    this.elements.fabButton.style.transform = 'rotate(45deg)';
  },
  
  // Close FAB menu
  closeFabMenu() {
    this.elements.fabMenu.classList.add('hidden');
    this.state.isFabMenuOpen = false;
    
    // Remove animation class
    this.elements.fabMenu.classList.remove('animate-fade-in');
    
    // Reset FAB button rotation
    this.elements.fabButton.style.transform = 'rotate(0deg)';
  },
  
  // Navigate to a section
  navigateTo(section) {
    // Close FAB menu if open
    if (this.state.isFabMenuOpen) {
      this.closeFabMenu();
    }
    
    // Add active class to navigation item
    this.elements.navItems.forEach(item => {
      item.classList.remove('active');
    });
    
    const activeItem = document.querySelector(`.nav-item[data-target="${section}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }
    
    // Navigate to the target page
    switch(section) {
      case 'portal':
        window.location.href = 'portal.html';
        break;
      case 'garden':
        window.location.href = 'garden.html';
        break;
      case 'music':
        window.location.href = 'music.html';
        break;
      case 'letter':
        window.location.href = 'letter.html';
        break;
      case 'game':
        window.location.href = 'game.html';
        break;
      case 'dream':
        window.location.href = 'dream.html';
        break;
      case 'secret':
        window.location.href = 'secret.html';
        break;
      case 'settings':
        window.location.href = 'settings.html';
        break;
      default:
        // In a full implementation, this would load the appropriate page
        // For now, we'll just show a notification
        this.showNotification(`Navigasi ke ${section}`, 'success');
    }
    
    // Create heart trail effect on navigation
    this.createHeartTrailEffect();
  },
  
  // Handle touch start
  handleTouchStart(e) {
    // Create touch trail effect
    if (this.state.touchTrailEnabled) {
      this.createTouchTrail(e.touches[0].clientX, e.touches[0].clientY);
    }
    
    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  },
  
  // Handle touch move
  handleTouchMove(e) {
    // Prevent scrolling when touching certain elements
    if (e.target.closest('.glass-heart-container')) {
      e.preventDefault();
    }
    
    // Create continuous touch trail
    if (this.state.touchTrailEnabled && e.touches.length > 0) {
      this.createTouchTrail(e.touches[0].clientX, e.touches[0].clientY);
    }
  },
  
  // Handle touch end
  handleTouchEnd(e) {
    // Nothing specific for now
  },
  
  // Handle mouse down (for desktop testing)
  handleMouseDown(e) {
    if (this.state.touchTrailEnabled) {
      this.createTouchTrail(e.clientX, e.clientY);
    }
  },
  
  // Handle mouse move (for desktop testing)
  handleMouseMove(e) {
    // Only create trail if mouse is pressed
    if (e.buttons > 0 && this.state.touchTrailEnabled) {
      this.createTouchTrail(e.clientX, e.clientY);
    }
  },
  
  // Handle mouse up (for desktop testing)
  handleMouseUp(e) {
    // Nothing specific for now
  },
  
  // Handle keyboard events
  handleKeyDown(e) {
    // Escape key closes FAB menu
    if (e.key === 'Escape' && this.state.isFabMenuOpen) {
      this.closeFabMenu();
    }
    
    // Tab navigation
    if (e.key === 'Tab') {
      // We could implement custom tab navigation here
    }
  },
  
  // Handle window resize
  handleResize() {
    // Adjust elements based on new screen size
    this.adjustForScreenSize();
  },
  
  // Handle visibility change (tab switching)
  handleVisibilityChange() {
    if (document.hidden) {
      // Pause animations when tab is hidden
      if (this.elements.glassHeart) {
        this.elements.glassHeart.style.animationPlayState = 'paused';
      }
    } else {
      // Resume animations when tab is visible
      if (this.elements.glassHeart) {
        this.elements.glassHeart.style.animationPlayState = 'running';
      }
    }
  },
  
  // Adjust elements for screen size
  adjustForScreenSize() {
    // Could implement responsive adjustments here
  },
  
  // Create touch trail effect
  createTouchTrail(x, y) {
    if (!this.state.touchTrailEnabled) return;
    
    const trail = document.createElement('div');
    trail.className = 'touch-trail';
    trail.style.left = `${x}px`;
    trail.style.top = `${y}px`;
    
    this.elements.touchTrailContainer.appendChild(trail);
    
    // Remove trail after animation completes
    setTimeout(() => {
      if (trail.parentNode) {
        trail.parentNode.removeChild(trail);
      }
    }, 1000);
  },
  
  // Create heart trail effect
  createHeartTrailEffect() {
    if (!this.state.touchTrailEnabled) return;
    
    // Create multiple heart trails in a pattern
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        const trail = document.createElement('div');
        trail.className = 'touch-trail';
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        trail.style.background = 'radial-gradient(circle, var(--primary-heart), transparent 70%)';
        
        this.elements.touchTrailContainer.appendChild(trail);
        
        // Remove trail after animation completes
        setTimeout(() => {
          if (trail.parentNode) {
            trail.parentNode.removeChild(trail);
          }
        }, 1000);
      }, i * 200);
    }
  },
  
  // Show notification
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}-message`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '100px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.padding = '12px 24px';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(-50%) translateY(-10px)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(-50%) translateY(0)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  },
  
  // Play sound effect
  playSoundEffect(frequency, duration, type = 'sine') {
    if (!this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      
      // Set volume envelope
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Error playing sound effect:', error);
    }
  },
  
  // Get current theme
  getCurrentTheme() {
    return this.state.currentTheme;
  },
  
  // Toggle animations
  toggleAnimations() {
    this.state.animationsEnabled = !this.state.animationsEnabled;
    
    if (this.state.animationsEnabled) {
      document.body.classList.remove('animations-disabled');
    } else {
      document.body.classList.add('animations-disabled');
    }
    
    return this.state.animationsEnabled;
  },
  
  // Toggle touch trails
  toggleTouchTrails() {
    this.state.touchTrailEnabled = !this.state.touchTrailEnabled;
    return this.state.touchTrailEnabled;
  }
};

// Initialize the application
function initializeApp() {
  Heartverse.init();
  
  // Expose Heartverse to global scope for debugging
  window.Heartverse = Heartverse;
}

// Service Worker Registration Helper
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// Add to Home Screen Prompt Handling
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Update UI to notify the user they can add to home screen
  showAddToHomeScreenPrompt();
});

function showAddToHomeScreenPrompt() {
  // In a full implementation, we would show a custom prompt
  // For now, we'll just log it
  console.log('PWA install prompt available');
}

// Performance Monitoring
window.addEventListener('load', () => {
  // Log performance metrics
  setTimeout(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    if (perfData) {
      console.log(`Page loaded in ${perfData.loadEventEnd - perfData.fetchStart} ms`);
    }
  }, 0);
});

// Error Handling
window.addEventListener('error', (e) => {
  console.error('Global error caught:', e.error);
  // In production, we would send this to an error reporting service
});

// Promise Rejection Handling
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  // In production, we would send this to an error reporting service
});