/*
 * Heartverse Secret Page
 * Secure Portal with PIN and Emoji Lock for Secret Messages and Private Playlist
 */

// Secret Application Object
const Secret = {
  // App state
  state: {
    isLocked: true,
    pin: '1234', // Default PIN
    emojiKey: ['❤️', '💖', '✨'], // Default emoji key
    currentEmojiSequence: [],
    messages: [],
    playlist: [],
    usePin: true, // Whether to use PIN or emoji for unlocking
    setupMode: false // Whether we're in setup mode for creating new PIN/emoji key
  },
  
  // DOM Elements
  elements: {
    backButton: null,
    lockButton: null,
    lockScreen: null,
    secretContent: null,
    pinSection: null,
    emojiSection: null,
    pinInput: null,
    pinKeys: null,
    emojiKeys: null,
    pinUnlockButton: null,
    emojiUnlockButton: null,
    toggleUnlockMethod: null,
    toggleText: null,
    emojiSequence: null,
    messagesContainer: null,
    newMessageInput: null,
    addMessageButton: null,
    playlistContainer: null,
    newSongInput: null,
    addSongButton: null,
    touchTrailContainer: null,
    // Setup mode elements
    setupSection: null,
    setupPinInput: null,
    setupPinConfirm: null,
    setupEmojiDisplay: null,
    setupSaveButton: null,
    setupCancelButton: null,
    setupInstruction: null
  },
  
  // Initialize the secret portal
  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.loadSecrets();
    this.updateUI();
  },
  
  // Cache DOM elements
  cacheElements() {
    this.elements.backButton = document.getElementById('back-button');
    this.elements.lockButton = document.getElementById('lock-button');
    this.elements.lockScreen = document.getElementById('lock-screen');
    this.elements.secretContent = document.getElementById('secret-content');
    this.elements.pinSection = document.getElementById('pin-section');
    this.elements.emojiSection = document.getElementById('emoji-section');
    this.elements.pinInput = document.getElementById('pin-input');
    this.elements.pinKeys = document.querySelectorAll('.key');
    this.elements.emojiKeys = document.querySelectorAll('.emoji-key');
    this.elements.pinUnlockButton = document.getElementById('pin-unlock-button');
    this.elements.emojiUnlockButton = document.getElementById('emoji-unlock-button');
    this.elements.toggleUnlockMethod = document.getElementById('toggle-unlock-method');
    this.elements.toggleText = document.getElementById('toggle-text');
    this.elements.emojiSequence = document.getElementById('emoji-sequence');
    this.elements.messagesContainer = document.getElementById('messages-container');
    this.elements.newMessageInput = document.getElementById('new-message-input');
    this.elements.addMessageButton = document.getElementById('add-message-button');
    this.elements.playlistContainer = document.getElementById('playlist-container');
    this.elements.newSongInput = document.getElementById('new-song-input');
    this.elements.addSongButton = document.getElementById('add-song-button');
    this.elements.touchTrailContainer = document.getElementById('touch-trail-container');
    
    // Setup mode elements
    this.elements.setupSection = document.getElementById('setup-section');
    this.elements.setupPinInput = document.getElementById('setup-pin-input');
    this.elements.setupPinConfirm = document.getElementById('setup-pin-confirm');
    this.elements.setupEmojiDisplay = document.getElementById('setup-emoji-display');
    this.elements.setupSaveButton = document.getElementById('setup-save-button');
    this.elements.setupCancelButton = document.getElementById('setup-cancel-button');
    this.elements.setupInstruction = document.getElementById('setup-instruction');
  },
  
  // Set up event listeners
  setupEventListeners() {
    // Back button
    if (this.elements.backButton) {
      this.elements.backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
    
    // Lock button
    if (this.elements.lockButton) {
      this.elements.lockButton.addEventListener('click', () => {
        this.lockPortal();
      });
    }
    
    // PIN input
    if (this.elements.pinInput) {
      this.elements.pinInput.addEventListener('input', () => {
        this.handlePinInput();
      });
    }
    
    // PIN keys
    if (this.elements.pinKeys) {
      this.elements.pinKeys.forEach(key => {
        key.addEventListener('click', (e) => {
          this.handlePinKeyPress(e);
        });
      });
    }
    
    // Emoji keys
    if (this.elements.emojiKeys) {
      this.elements.emojiKeys.forEach(key => {
        key.addEventListener('click', (e) => {
          this.handleEmojiKeyPress(e);
        });
      });
    }
    
    // Unlock buttons
    if (this.elements.pinUnlockButton) {
      this.elements.pinUnlockButton.addEventListener('click', () => {
        this.unlockWithPin();
      });
    }
    
    if (this.elements.emojiUnlockButton) {
      this.elements.emojiUnlockButton.addEventListener('click', () => {
        this.unlockWithEmoji();
      });
    }
    
    // Toggle unlock method
    if (this.elements.toggleUnlockMethod) {
      this.elements.toggleUnlockMethod.addEventListener('click', () => {
        this.toggleUnlockMethod();
      });
    }
    
    // Add message
    if (this.elements.newMessageInput) {
      this.elements.newMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addMessage();
        }
      });
    }
    
    if (this.elements.addMessageButton) {
      this.elements.addMessageButton.addEventListener('click', () => {
        this.addMessage();
      });
    }
    
    // Add song
    if (this.elements.newSongInput) {
      this.elements.newSongInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addSong();
        }
      });
    }
    
    if (this.elements.addSongButton) {
      this.elements.addSongButton.addEventListener('click', () => {
        this.addSong();
      });
    }
    
    // Setup mode event listeners
    if (this.elements.setupPinInput) {
      this.elements.setupPinInput.addEventListener('input', (e) => {
        this.handleSetupPinInput(e);
      });
    }
    
    if (this.elements.setupPinConfirm) {
      this.elements.setupPinConfirm.addEventListener('input', (e) => {
        this.handleSetupPinConfirm(e);
      });
    }
    
    if (this.elements.setupEmojiDisplay) {
      this.elements.setupEmojiDisplay.addEventListener('click', () => {
        this.startEmojiSetup();
      });
    }
    
    if (this.elements.setupSaveButton) {
      this.elements.setupSaveButton.addEventListener('click', () => {
        this.saveSetup();
      });
    }
    
    if (this.elements.setupCancelButton) {
      this.elements.setupCancelButton.addEventListener('click', () => {
        this.cancelSetup();
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
  
  // Handle PIN input
  handlePinInput() {
    if (!this.elements.pinInput) return;
    
    // Auto-unlock if 4 digits entered
    if (this.elements.pinInput.value.length === 4) {
      this.unlockWithPin();
    }
  },
  
  // Handle PIN key press
  handlePinKeyPress(e) {
    const value = e.currentTarget.dataset.value;
    
    if (!this.elements.pinInput) return;
    
    if (value === 'clear') {
      this.elements.pinInput.value = '';
    } else if (value === 'back') {
      this.elements.pinInput.value = this.elements.pinInput.value.slice(0, -1);
    } else {
      if (this.elements.pinInput.value.length < 4) {
        this.elements.pinInput.value += value;
        
        // Auto-unlock if 4 digits entered
        if (this.elements.pinInput.value.length === 4) {
          this.unlockWithPin();
        }
      }
    }
  },
  
  // Handle emoji key press
  handleEmojiKeyPress(e) {
    const emoji = e.currentTarget.dataset.emoji;
    
    if (emoji === 'clear') {
      this.state.currentEmojiSequence = [];
    } else if (emoji === 'back') {
      this.state.currentEmojiSequence.pop();
    } else {
      if (this.state.currentEmojiSequence.length < 5) {
        this.state.currentEmojiSequence.push(emoji);
      }
    }
    
    // Update emoji sequence display
    this.updateEmojiSequence();
    
    // Auto-unlock if 3 emojis entered (matching default key length)
    if (this.state.currentEmojiSequence.length === this.state.emojiKey.length) {
      this.unlockWithEmoji();
    }
  },
  
  // Update emoji sequence display
  updateEmojiSequence() {
    if (!this.elements.emojiSequence) return;
    
    this.elements.emojiSequence.innerHTML = '';
    
    this.state.currentEmojiSequence.forEach(emoji => {
      const span = document.createElement('span');
      span.textContent = emoji;
      this.elements.emojiSequence.appendChild(span);
    });
  },
  
  // Unlock with PIN
  unlockWithPin() {
    if (!this.elements.pinInput) return;
    
    const enteredPin = this.elements.pinInput.value;
    
    // Validate PIN format (4 digits)
    if (!/^[0-9]{4}$/.test(enteredPin)) {
      this.showNotification('PIN harus terdiri dari 4 angka!');
      if (this.elements.pinInput) {
        this.elements.pinInput.value = '';
        this.elements.pinInput.focus();
      }
      return;
    }
    
    if (enteredPin === this.state.pin) {
      this.unlockPortal();
      this.showNotification('Portal berhasil dibuka dengan PIN!');
    } else {
      this.showNotification('PIN salah! Coba lagi.');
      if (this.elements.pinInput) {
        this.elements.pinInput.value = '';
        this.elements.pinInput.focus();
      }
    }
  },
  
  // Unlock with emoji
  unlockWithEmoji() {
    const enteredSequence = this.state.currentEmojiSequence.join('');
    const correctSequence = this.state.emojiKey.join('');
    
    if (enteredSequence === correctSequence) {
      this.unlockPortal();
      this.showNotification('Portal berhasil dibuka dengan kunci emoji!');
    } else {
      this.showNotification('Urutan emoji salah! Coba lagi.');
      this.state.currentEmojiSequence = [];
      this.updateEmojiSequence();
    }
  },
  
  // Toggle unlock method
  toggleUnlockMethod() {
    this.state.usePin = !this.state.usePin;
    
    // Update UI
    if (this.elements.pinSection && this.elements.emojiSection && this.elements.toggleText) {
      if (this.state.usePin) {
        this.elements.pinSection.classList.remove('hidden');
        this.elements.emojiSection.classList.add('hidden');
        this.elements.toggleText.textContent = 'Emoji';
      } else {
        this.elements.pinSection.classList.add('hidden');
        this.elements.emojiSection.classList.remove('hidden');
        this.elements.toggleText.textContent = 'PIN';
      }
    }
  },
  
  // Unlock portal
  unlockPortal() {
    this.state.isLocked = false;
    
    // Show secret content
    if (this.elements.lockScreen && this.elements.secretContent) {
      this.elements.lockScreen.classList.add('hidden');
      this.elements.secretContent.classList.remove('hidden');
    }
    
    // Render messages and playlist
    this.renderMessages();
    this.renderPlaylist();
  },
  
  // Lock portal
  lockPortal() {
    this.state.isLocked = true;
    
    // Hide secret content
    if (this.elements.lockScreen && this.elements.secretContent) {
      this.elements.lockScreen.classList.remove('hidden');
      this.elements.secretContent.classList.add('hidden');
    }
    
    // Clear inputs
    if (this.elements.pinInput) {
      this.elements.pinInput.value = '';
    }
    
    this.state.currentEmojiSequence = [];
    this.updateEmojiSequence();
    
    this.showNotification('Portal telah terkunci.');
  },
  
  // Enter setup mode
  enterSetupMode() {
    this.state.setupMode = true;
    
    // Show setup section
    if (this.elements.setupSection) {
      this.elements.setupSection.classList.remove('hidden');
    }
    
    // Hide unlock sections
    if (this.elements.pinSection) {
      this.elements.pinSection.classList.add('hidden');
    }
    if (this.elements.emojiSection) {
      this.elements.emojiSection.classList.add('hidden');
    }
    
    // Hide toggle button
    if (this.elements.toggleUnlockMethod) {
      this.elements.toggleUnlockMethod.classList.add('hidden');
    }
    
    // Update instruction
    if (this.elements.setupInstruction) {
      this.elements.setupInstruction.textContent = 'Buat PIN baru Anda (4 digit)';
    }
    
    // Clear setup inputs
    if (this.elements.setupPinInput) {
      this.elements.setupPinInput.value = '';
    }
    if (this.elements.setupPinConfirm) {
      this.elements.setupPinConfirm.value = '';
    }
  },
  
  // Handle setup PIN input
  handleSetupPinInput(e) {
    const value = e.target.value;
    
    // Ensure only digits and limit to 4 characters
    if (value.length > 4) {
      e.target.value = value.slice(0, 4);
    }
    
    // Enable confirm input when PIN is 4 digits
    if (this.elements.setupPinConfirm) {
      this.elements.setupPinConfirm.disabled = value.length !== 4;
    }
  },
  
  // Handle setup PIN confirm
  handleSetupPinConfirm(e) {
    const value = e.target.value;
    
    // Ensure only digits and limit to 4 characters
    if (value.length > 4) {
      e.target.value = value.slice(0, 4);
    }
  },
  
  // Start emoji setup
  startEmojiSetup() {
    // Clear current emoji sequence
    this.state.currentEmojiSequence = [];
    this.updateEmojiSequence();
    
    // Show emoji selection
    if (this.elements.emojiSection) {
      this.elements.emojiSection.classList.remove('hidden');
    }
    
    // Hide PIN section
    if (this.elements.pinSection) {
      this.elements.pinSection.classList.add('hidden');
    }
    
    // Update instruction
    if (this.elements.setupInstruction) {
      this.elements.setupInstruction.textContent = 'Pilih 3 emoji untuk kunci Anda';
    }
    
    // Update button text
    if (this.elements.setupSaveButton) {
      this.elements.setupSaveButton.textContent = 'Simpan Emoji';
    }
  },
  
  // Save setup
  saveSetup() {
    if (this.elements.setupPinInput && this.elements.setupPinInput.value && 
        this.elements.setupPinConfirm && this.elements.setupPinConfirm.value) {
      // Save PIN setup
      const pin = this.elements.setupPinInput.value;
      const confirmPin = this.elements.setupPinConfirm.value;
      
      // Validate PIN
      if (!/^[0-9]{4}$/.test(pin)) {
        this.showNotification('PIN harus terdiri dari 4 angka!');
        return;
      }
      
      if (pin !== confirmPin) {
        this.showNotification('PIN dan konfirmasi tidak cocok!');
        return;
      }
      
      // Save PIN
      this.state.pin = pin;
      this.saveSecrets();
      this.showNotification('PIN baru telah disimpan!');
      this.exitSetupMode();
    } else if (this.state.currentEmojiSequence.length === 3) {
      // Save emoji setup
      this.state.emojiKey = [...this.state.currentEmojiSequence];
      this.saveSecrets();
      this.showNotification('Kunci emoji baru telah disimpan!');
      this.exitSetupMode();
    } else {
      this.showNotification('Silakan lengkapi pengaturan PIN atau emoji terlebih dahulu!');
    }
  },
  
  // Cancel setup
  cancelSetup() {
    this.exitSetupMode();
  },
  
  // Exit setup mode
  exitSetupMode() {
    this.state.setupMode = false;
    
    // Hide setup section
    if (this.elements.setupSection) {
      this.elements.setupSection.classList.add('hidden');
    }
    
    // Show unlock sections based on current method
    if (this.state.usePin) {
      if (this.elements.pinSection) {
        this.elements.pinSection.classList.remove('hidden');
      }
    } else {
      if (this.elements.emojiSection) {
        this.elements.emojiSection.classList.remove('hidden');
      }
    }
    
    // Show toggle button
    if (this.elements.toggleUnlockMethod) {
      this.elements.toggleUnlockMethod.classList.remove('hidden');
    }
    
    // Clear setup inputs
    if (this.elements.setupPinInput) {
      this.elements.setupPinInput.value = '';
    }
    if (this.elements.setupPinConfirm) {
      this.elements.setupPinConfirm.value = '';
      this.elements.setupPinConfirm.disabled = true;
    }
    
    this.state.currentEmojiSequence = [];
    this.updateEmojiSequence();
    
    // Reset button text
    if (this.elements.setupSaveButton) {
      this.elements.setupSaveButton.textContent = 'Simpan';
    }
  },
  
  // Add message
  addMessage() {
    if (!this.elements.newMessageInput) return;
    
    const messageText = this.elements.newMessageInput.value.trim();
    if (!messageText) return;
    
    // Add to state
    const message = {
      id: Date.now(),
      text: messageText,
      timestamp: new Date().toISOString()
    };
    
    this.state.messages.push(message);
    
    // Save to localStorage
    this.saveSecrets();
    
    // Clear input
    this.elements.newMessageInput.value = '';
    
    // Render messages
    this.renderMessages();
    
    // Show notification
    this.showNotification('Pesan rahasia telah ditambahkan!');
  },
  
  // Delete message
  deleteMessage(id) {
    this.state.messages = this.state.messages.filter(msg => msg.id !== id);
    
    // Save to localStorage
    this.saveSecrets();
    
    // Render messages
    this.renderMessages();
    
    // Show notification
    this.showNotification('Pesan rahasia telah dihapus.');
  },
  
  // Add song
  addSong() {
    if (!this.elements.newSongInput) return;
    
    const songText = this.elements.newSongInput.value.trim();
    if (!songText) return;
    
    // Parse song text (assume format: "Song Title - Artist")
    const parts = songText.split(' - ');
    const title = parts[0] || songText;
    const artist = parts[1] || 'Artis Tidak Diketahui';
    
    // Add to state
    const song = {
      id: Date.now(),
      title: title,
      artist: artist,
      timestamp: new Date().toISOString()
    };
    
    this.state.playlist.push(song);
    
    // Save to localStorage
    this.saveSecrets();
    
    // Clear input
    this.elements.newSongInput.value = '';
    
    // Render playlist
    this.renderPlaylist();
    
    // Show notification
    this.showNotification('Lagu telah ditambahkan ke playlist!');
  },
  
  // Delete song
  deleteSong(id) {
    this.state.playlist = this.state.playlist.filter(song => song.id !== id);
    
    // Save to localStorage
    this.saveSecrets();
    
    // Render playlist
    this.renderPlaylist();
    
    // Show notification
    this.showNotification('Lagu telah dihapus dari playlist.');
  },
  
  // Render messages
  renderMessages() {
    if (!this.elements.messagesContainer) return;
    
    this.elements.messagesContainer.innerHTML = '';
    
    this.state.messages.forEach(message => {
      const messageItem = document.createElement('div');
      messageItem.className = 'message-item';
      messageItem.innerHTML = `
        <div class="message-text">${message.text}</div>
        <button class="delete-message" data-id="${message.id}">
          <svg class="delete-icon" viewBox="0 0 24 24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </button>
      `;
      
      // Add delete event listener
      const deleteButton = messageItem.querySelector('.delete-message');
      deleteButton.addEventListener('click', () => {
        this.deleteMessage(message.id);
      });
      
      this.elements.messagesContainer.appendChild(messageItem);
    });
  },
  
  // Render playlist
  renderPlaylist() {
    if (!this.elements.playlistContainer) return;
    
    this.elements.playlistContainer.innerHTML = '';
    
    this.state.playlist.forEach(song => {
      const playlistItem = document.createElement('div');
      playlistItem.className = 'playlist-item';
      playlistItem.innerHTML = `
        <svg class="playlist-item-icon" viewBox="0 0 24 24">
          <path d="M12,3V13.55C11.41,13.21 10.73,13 10,13C7.79,13 6,14.79 6,17C6,19.21 7.79,21 10,21C12.21,21 14,19.21 14,17V7H18V3H12Z"/>
        </svg>
        <div class="playlist-item-info">
          <div class="playlist-item-title">${song.title}</div>
          <div class="playlist-item-artist">${song.artist}</div>
        </div>
        <button class="delete-song" data-id="${song.id}">
          <svg class="delete-icon" viewBox="0 0 24 24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </button>
      `;
      
      // Add delete event listener
      const deleteButton = playlistItem.querySelector('.delete-song');
      deleteButton.addEventListener('click', () => {
        this.deleteSong(song.id);
      });
      
      this.elements.playlistContainer.appendChild(playlistItem);
    });
  },
  
  // Load secrets from localStorage
  loadSecrets() {
    const savedPin = localStorage.getItem('heartverse-secret-pin');
    const savedEmojiKey = localStorage.getItem('heartverse-secret-emoji-key');
    const savedMessages = localStorage.getItem('heartverse-secret-messages');
    const savedPlaylist = localStorage.getItem('heartverse-secret-playlist');
    
    // Validate and load PIN
    if (savedPin && /^[0-9]{4}$/.test(savedPin)) {
      this.state.pin = savedPin;
    } else {
      // Reset to default if invalid or not found
      this.state.pin = '1234';
      localStorage.setItem('heartverse-secret-pin', this.state.pin);
    }
    
    // Validate and load emoji key
    if (savedEmojiKey) {
      try {
        const parsedEmojiKey = JSON.parse(savedEmojiKey);
        if (Array.isArray(parsedEmojiKey) && parsedEmojiKey.length > 0) {
          this.state.emojiKey = parsedEmojiKey;
        }
      } catch (e) {
        console.warn('Failed to parse emoji key, using default');
      }
    }
    
    // Load messages
    if (savedMessages) {
      try {
        this.state.messages = JSON.parse(savedMessages);
      } catch (e) {
        console.warn('Failed to parse messages, using empty array');
        this.state.messages = [];
      }
    }
    
    // Load playlist
    if (savedPlaylist) {
      try {
        this.state.playlist = JSON.parse(savedPlaylist);
      } catch (e) {
        console.warn('Failed to parse playlist, using empty array');
        this.state.playlist = [];
      }
    }
  },
  
  // Save secrets to localStorage
  saveSecrets() {
    localStorage.setItem('heartverse-secret-pin', this.state.pin);
    localStorage.setItem('heartverse-secret-emoji-key', JSON.stringify(this.state.emojiKey));
    localStorage.setItem('heartverse-secret-messages', JSON.stringify(this.state.messages));
    localStorage.setItem('heartverse-secret-playlist', JSON.stringify(this.state.playlist));
  },
  
  // Update UI based on state
  updateUI() {
    // Set initial unlock method
    if (this.elements.pinSection && this.elements.emojiSection && this.elements.toggleText) {
      if (this.state.usePin) {
        this.elements.pinSection.classList.remove('hidden');
        this.elements.emojiSection.classList.add('hidden');
        this.elements.toggleText.textContent = 'Emoji';
      } else {
        this.elements.pinSection.classList.add('hidden');
        this.elements.emojiSection.classList.remove('hidden');
        this.elements.toggleText.textContent = 'PIN';
      }
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
  Secret.init();
  
  // Expose Secret to global scope for debugging
  window.Secret = Secret;
});