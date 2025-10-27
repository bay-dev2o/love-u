/*
 * Heartverse Settings Page
 * Comprehensive Settings Management for Theme, Audio, and Data Preferences
 */

// Settings Application Object
const Settings = {
  // App state
  state: {
    currentTheme: 'midnight',
    animationsEnabled: true,
    touchTrailEnabled: true,
    masterVolume: 80,
    soundEffectsEnabled: true,
    whatsappIntegration: true,
    whatsappNumber: '',
    data: {}
  },
  
  // DOM Elements
  elements: {
    backButton: null,
    saveButton: null,
    themeOptions: null,
    animationsToggle: null,
    touchTrailToggle: null,
    masterVolumeSlider: null,
    soundEffectsToggle: null,
    whatsappToggle: null,
    whatsappNumberInput: null,
    exportDataButton: null,
    importDataButton: null,
    clearDataButton: null,
    touchTrailContainer: null
  },
  
  // Initialize the settings page
  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.loadSettings();
    this.updateUI();
  },
  
  // Cache DOM elements
  cacheElements() {
    this.elements.backButton = document.getElementById('back-button');
    this.elements.saveButton = document.getElementById('save-button');
    this.elements.themeOptions = document.querySelectorAll('.theme-option');
    this.elements.animationsToggle = document.getElementById('animations-toggle');
    this.elements.touchTrailToggle = document.getElementById('touch-trail-toggle');
    this.elements.masterVolumeSlider = document.getElementById('master-volume');
    this.elements.soundEffectsToggle = document.getElementById('sound-effects-toggle');
    this.elements.whatsappToggle = document.getElementById('whatsapp-toggle');
    this.elements.whatsappNumberInput = document.getElementById('whatsapp-number');
    this.elements.exportDataButton = document.getElementById('export-data-button');
    this.elements.importDataButton = document.getElementById('import-data-button');
    this.elements.clearDataButton = document.getElementById('clear-data-button');
    this.elements.touchTrailContainer = document.getElementById('touch-trail-container');
  },
  
  // Set up event listeners
  setupEventListeners() {
    // Back button
    if (this.elements.backButton) {
      this.elements.backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
    
    // Save button
    if (this.elements.saveButton) {
      this.elements.saveButton.addEventListener('click', () => {
        this.saveSettings();
      });
    }
    
    // Theme options
    if (this.elements.themeOptions) {
      this.elements.themeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          const theme = e.currentTarget.dataset.theme;
          this.setTheme(theme);
        });
      });
    }
    
    // Toggle switches
    if (this.elements.animationsToggle) {
      this.elements.animationsToggle.addEventListener('change', () => {
        this.toggleAnimations();
      });
    }
    
    if (this.elements.touchTrailToggle) {
      this.elements.touchTrailToggle.addEventListener('change', () => {
        this.toggleTouchTrail();
      });
    }
    
    if (this.elements.soundEffectsToggle) {
      this.elements.soundEffectsToggle.addEventListener('change', () => {
        this.toggleSoundEffects();
      });
    }
    
    if (this.elements.whatsappToggle) {
      this.elements.whatsappToggle.addEventListener('change', () => {
        this.toggleWhatsappIntegration();
      });
    }
    
    // Volume slider
    if (this.elements.masterVolumeSlider) {
      this.elements.masterVolumeSlider.addEventListener('input', () => {
        this.setMasterVolume();
      });
    }
    
    // WhatsApp number input
    if (this.elements.whatsappNumberInput) {
      this.elements.whatsappNumberInput.addEventListener('input', () => {
        this.setWhatsappNumber();
      });
    }
    
    // Data management buttons
    if (this.elements.exportDataButton) {
      this.elements.exportDataButton.addEventListener('click', () => {
        this.exportData();
      });
    }
    
    if (this.elements.importDataButton) {
      this.elements.importDataButton.addEventListener('click', () => {
        this.importData();
      });
    }
    
    if (this.elements.clearDataButton) {
      this.elements.clearDataButton.addEventListener('click', () => {
        this.clearData();
      });
    }
    
    // Touch events for mobile
    document.addEventListener('touchstart', (e) => {
      this.handleTouchStart(e);
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
      this.handleTouchMove(e);
    }, { passive: false });
  },
  
  // Set theme
  setTheme(theme) {
    this.state.currentTheme = theme;
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update UI to show active theme
    if (this.elements.themeOptions) {
      this.elements.themeOptions.forEach(option => {
        if (option.dataset.theme === theme) {
          option.classList.add('active');
        } else {
          option.classList.remove('active');
        }
      });
    }
    
    // Show notification
    this.showNotification(`Tema diubah menjadi ${this.getThemeName(theme)}`);
  },
  
  // Get theme name
  getThemeName(theme) {
    switch (theme) {
      case 'morning': return 'Pagi';
      case 'sunset': return 'Senja';
      case 'midnight': return 'Malammu';
      default: return theme;
    }
  },
  
  // Toggle animations
  toggleAnimations() {
    if (!this.elements.animationsToggle) return;
    
    this.state.animationsEnabled = this.elements.animationsToggle.checked;
    
    // Apply to document
    if (this.state.animationsEnabled) {
      document.body.classList.remove('animations-disabled');
    } else {
      document.body.classList.add('animations-disabled');
    }
    
    // Show notification
    this.showNotification(`Animasi ${this.state.animationsEnabled ? 'diaktifkan' : 'dinonaktifkan'}`);
  },
  
  // Toggle touch trail
  toggleTouchTrail() {
    if (!this.elements.touchTrailToggle) return;
    
    this.state.touchTrailEnabled = this.elements.touchTrailToggle.checked;
    
    // Show notification
    this.showNotification(`Jejak sentuh ${this.state.touchTrailEnabled ? 'diaktifkan' : 'dinonaktifkan'}`);
  },
  
  // Set master volume
  setMasterVolume() {
    if (!this.elements.masterVolumeSlider) return;
    
    this.state.masterVolume = parseInt(this.elements.masterVolumeSlider.value);
    
    // Show notification
    this.showNotification(`Volume diatur ke ${this.state.masterVolume}%`);
  },
  
  // Toggle sound effects
  toggleSoundEffects() {
    if (!this.elements.soundEffectsToggle) return;
    
    this.state.soundEffectsEnabled = this.elements.soundEffectsToggle.checked;
    
    // Show notification
    this.showNotification(`Efek suara ${this.state.soundEffectsEnabled ? 'diaktifkan' : 'dinonaktifkan'}`);
  },
  
  // Toggle WhatsApp integration
  toggleWhatsappIntegration() {
    if (!this.elements.whatsappToggle) return;
    
    this.state.whatsappIntegration = this.elements.whatsappToggle.checked;
    
    // Show notification
    this.showNotification(`Integrasi WhatsApp ${this.state.whatsappIntegration ? 'diaktifkan' : 'dinonaktifkan'}`);
  },
  
  // Set WhatsApp number
  setWhatsappNumber() {
    if (!this.elements.whatsappNumberInput) return;
    
    this.state.whatsappNumber = this.elements.whatsappNumberInput.value;
  },
  
  // Export data
  exportData() {
    // Collect all data from localStorage
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('heartverse-')) {
        data[key] = localStorage.getItem(key);
      }
    }
    
    // Add current settings
    data['heartverse-settings'] = JSON.stringify(this.state);
    
    // Create blob and download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heartverse-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show notification
    this.showNotification('Data telah diekspor!');
  },
  
  // Import data
  importData() {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          
          // Import data to localStorage
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              localStorage.setItem(key, data[key]);
            }
          }
          
          // Reload settings
          this.loadSettings();
          this.updateUI();
          
          // Show notification
          this.showNotification('Data telah diimpor!');
        } catch (error) {
          console.error('Error importing data:', error);
          this.showNotification('Gagal mengimpor data. File tidak valid.');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  },
  
  // Clear data
  clearData() {
    // Confirm before clearing
    if (confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
      // Clear all heartverse data from localStorage
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('heartverse-')) {
          localStorage.removeItem(key);
        }
      }
      
      // Reset to default settings
      this.resetToDefaults();
      
      // Show notification
      this.showNotification('Semua data telah dihapus.');
    }
  },
  
  // Reset to defaults
  resetToDefaults() {
    this.state = {
      currentTheme: 'midnight',
      animationsEnabled: true,
      touchTrailEnabled: true,
      masterVolume: 80,
      soundEffectsEnabled: true,
      whatsappIntegration: true,
      whatsappNumber: '',
      data: {}
    };
    
    this.updateUI();
    this.saveSettings();
  },
  
  // Load settings from localStorage
  loadSettings() {
    const savedSettings = localStorage.getItem('heartverse-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        this.state = { ...this.state, ...parsed };
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  },
  
  // Save settings to localStorage
  saveSettings() {
    localStorage.setItem('heartverse-settings', JSON.stringify(this.state));
    
    // Apply settings
    this.applySettings();
    
    // Show notification
    this.showNotification('Pengaturan telah disimpan!');
  },
  
  // Apply settings
  applySettings() {
    // Apply theme
    this.setTheme(this.state.currentTheme);
    
    // Apply animations
    if (this.elements.animationsToggle) {
      this.elements.animationsToggle.checked = this.state.animationsEnabled;
      this.toggleAnimations();
    }
    
    // Apply touch trail
    if (this.elements.touchTrailToggle) {
      this.elements.touchTrailToggle.checked = this.state.touchTrailEnabled;
      this.toggleTouchTrail();
    }
    
    // Apply volume
    if (this.elements.masterVolumeSlider) {
      this.elements.masterVolumeSlider.value = this.state.masterVolume;
    }
    
    // Apply sound effects
    if (this.elements.soundEffectsToggle) {
      this.elements.soundEffectsToggle.checked = this.state.soundEffectsEnabled;
      this.toggleSoundEffects();
    }
    
    // Apply WhatsApp settings
    if (this.elements.whatsappToggle) {
      this.elements.whatsappToggle.checked = this.state.whatsappIntegration;
      this.toggleWhatsappIntegration();
    }
    
    if (this.elements.whatsappNumberInput) {
      this.elements.whatsappNumberInput.value = this.state.whatsappNumber;
    }
  },
  
  // Update UI based on state
  updateUI() {
    // Update theme options
    if (this.elements.themeOptions) {
      this.elements.themeOptions.forEach(option => {
        if (option.dataset.theme === this.state.currentTheme) {
          option.classList.add('active');
        } else {
          option.classList.remove('active');
        }
      });
    }
    
    // Update toggle switches
    if (this.elements.animationsToggle) {
      this.elements.animationsToggle.checked = this.state.animationsEnabled;
    }
    
    if (this.elements.touchTrailToggle) {
      this.elements.touchTrailToggle.checked = this.state.touchTrailEnabled;
    }
    
    if (this.elements.soundEffectsToggle) {
      this.elements.soundEffectsToggle.checked = this.state.soundEffectsEnabled;
    }
    
    if (this.elements.whatsappToggle) {
      this.elements.whatsappToggle.checked = this.state.whatsappIntegration;
    }
    
    // Update sliders and inputs
    if (this.elements.masterVolumeSlider) {
      this.elements.masterVolumeSlider.value = this.state.masterVolume;
    }
    
    if (this.elements.whatsappNumberInput) {
      this.elements.whatsappNumberInput.value = this.state.whatsappNumber;
    }
  },
  
  // Handle touch start
  handleTouchStart(e) {
    if (e.touches.length > 0) {
      this.createTouchEffect(e.touches[0].clientX, e.touches[0].clientY);
    }
  },
  
  // Handle touch move
  handleTouchMove(e) {
    if (e.touches.length > 0) {
      this.createTouchEffect(e.touches[0].clientX, e.touches[0].clientY);
    }
  },
  
  // Create touch effect
  createTouchEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'touch-trail';
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    effect.style.background = 'radial-gradient(circle, #ff6b6b, transparent 70%)';
    
    this.elements.touchTrailContainer.appendChild(effect);
    
    // Remove after animation
    setTimeout(() => {
      if (effect.parentNode) {
        effect.parentNode.removeChild(effect);
      }
    }, 1000);
  },
  
  // Show notification
  showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'success-message';
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
      }, 3000);
    }, 3000);
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  Settings.init();
  
  // Expose Settings to global scope for debugging
  window.Settings = Settings;
});