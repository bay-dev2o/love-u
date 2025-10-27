/*
 * Heartverse Letter Editor
 * Interactive Love Letter Editor with Rich Text Features
 */

// Letter Editor Application Object
const LetterEditor = {
  // App state
  state: {
    isPreviewOpen: false,
    currentDate: new Date()
  },
  
  // DOM Elements
  elements: {
    backButton: null,
    saveButton: null,
    sendButton: null,
    letterTitle: null,
    currentDateElement: null,
    letterEditor: null,
    boldButton: null,
    italicButton: null,
    underlineButton: null,
    heartButton: null,
    flowerButton: null,
    previewButton: null,
    shareButton: null,
    previewModal: null,
    previewLetter: null,
    closePreview: null,
    printButton: null,
    whatsappButton: null
  },
  
  // Initialize the letter editor
  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.updateCurrentDate();
    this.setupEditor();
  },
  
  // Cache DOM elements
  cacheElements() {
    this.elements.backButton = document.querySelector('.back-button');
    this.elements.saveButton = document.querySelector('.save-button');
    this.elements.sendButton = document.querySelector('.send-button');
    this.elements.letterTitle = document.querySelector('.letter-title');
    this.elements.currentDateElement = document.getElementById('current-date');
    this.elements.letterEditor = document.getElementById('letter-editor');
    this.elements.boldButton = document.querySelector('.bold-button');
    this.elements.italicButton = document.querySelector('.italic-button');
    this.elements.underlineButton = document.querySelector('.underline-button');
    this.elements.heartButton = document.querySelector('.heart-button');
    this.elements.flowerButton = document.querySelector('.flower-button');
    this.elements.previewButton = document.querySelector('.preview-button');
    this.elements.shareButton = document.querySelector('.share-button');
    this.elements.previewModal = document.getElementById('preview-modal');
    this.elements.previewLetter = document.getElementById('preview-letter');
    this.elements.closePreview = document.querySelector('.close-preview');
    this.elements.printButton = document.querySelector('.print-button');
    this.elements.whatsappButton = document.querySelector('.whatsapp-button');
  },
  
  // Set up event listeners
  setupEventListeners() {
    // Back button
    if (this.elements.backButton) {
      this.elements.backButton.addEventListener('click', () => {
        window.location.href = 'portal.html';
      });
    }
    
    // Save button
    if (this.elements.saveButton) {
      this.elements.saveButton.addEventListener('click', () => {
        this.saveLetter();
      });
    }
    
    // Send button
    if (this.elements.sendButton) {
      this.elements.sendButton.addEventListener('click', () => {
        this.sendLetter();
      });
    }
    
    // Editor buttons
    if (this.elements.boldButton) {
      this.elements.boldButton.addEventListener('click', () => {
        this.formatText('bold');
      });
    }
    
    if (this.elements.italicButton) {
      this.elements.italicButton.addEventListener('click', () => {
        this.formatText('italic');
      });
    }
    
    if (this.elements.underlineButton) {
      this.elements.underlineButton.addEventListener('click', () => {
        this.formatText('underline');
      });
    }
    
    if (this.elements.heartButton) {
      this.elements.heartButton.addEventListener('click', () => {
        this.insertEmoji('❤️');
      });
    }
    
    if (this.elements.flowerButton) {
      this.elements.flowerButton.addEventListener('click', () => {
        this.insertEmoji('🌸');
      });
    }
    
    // Preview button
    if (this.elements.previewButton) {
      this.elements.previewButton.addEventListener('click', () => {
        this.openPreview();
      });
    }
    
    // Share button
    if (this.elements.shareButton) {
      this.elements.shareButton.addEventListener('click', () => {
        this.shareLetter();
      });
    }
    
    // Preview modal
    if (this.elements.closePreview) {
      this.elements.closePreview.addEventListener('click', () => {
        this.closePreview();
      });
    }
    
    if (this.elements.printButton) {
      this.elements.printButton.addEventListener('click', () => {
        this.printLetter();
      });
    }
    
    if (this.elements.whatsappButton) {
      this.elements.whatsappButton.addEventListener('click', () => {
        this.sendViaWhatsApp();
      });
    }
    
    // Close modal when clicking outside
    if (this.elements.previewModal) {
      this.elements.previewModal.addEventListener('click', (e) => {
        if (e.target === this.elements.previewModal) {
          this.closePreview();
        }
      });
    }
  },
  
  // Set up editor
  setupEditor() {
    if (this.elements.letterEditor) {
      // Add typing animation effect
      this.elements.letterEditor.addEventListener('input', () => {
        this.checkForSpecialWords();
      });
    }
  },
  
  // Update current date
  updateCurrentDate() {
    if (this.elements.currentDateElement) {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      this.elements.currentDateElement.textContent = 
        this.state.currentDate.toLocaleDateString('id-ID', options);
    }
  },
  
  // Format text
  formatText(command) {
    document.execCommand(command, false, null);
    
    // Update button state
    this.updateButtonState(command);
  },
  
  // Update button state
  updateButtonState(command) {
    const button = this.elements[`${command}Button`];
    if (button) {
      const isActive = document.queryCommandState(command);
      if (isActive) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    }
  },
  
  // Insert emoji
  insertEmoji(emoji) {
    if (!this.elements.letterEditor) return;
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    const emojiNode = document.createTextNode(emoji);
    range.insertNode(emojiNode);
    
    // Move cursor after the emoji
    range.setStartAfter(emojiNode);
    range.setEndAfter(emojiNode);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger input event for special effects
    this.elements.letterEditor.dispatchEvent(new Event('input'));
  },
  
  // Check for special words
  checkForSpecialWords() {
    if (!this.elements.letterEditor) return;
    
    const content = this.elements.letterEditor.textContent.toLowerCase();
    
    // Check for special words and trigger effects
    if (content.includes('love') || content.includes('cinta') || content.includes('sayang')) {
      this.createParticleEffect('❤️');
    }
    
    if (content.includes('kamu') || content.includes('you') || content.includes('darling')) {
      this.createParticleEffect('💕');
    }
    
    if (content.includes('bunga') || content.includes('flower') || content.includes('mekar')) {
      this.createParticleEffect('🌸');
    }
  },
  
  // Create particle effect
  createParticleEffect(emoji) {
    const container = document.body;
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.textContent = emoji;
        particle.style.position = 'fixed';
        particle.style.fontSize = '20px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.opacity = '0';
        particle.style.transition = 'all 1s ease';
        particle.style.transform = 'translate(-50%, -50%)';
        
        container.appendChild(particle);
        
        // Animate in
        setTimeout(() => {
          particle.style.opacity = '1';
          particle.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
        }, 10);
        
        // Remove after animation
        setTimeout(() => {
          particle.style.opacity = '0';
          particle.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`;
          setTimeout(() => {
            if (particle.parentNode) {
              particle.parentNode.removeChild(particle);
            }
          }, 1000);
        }, 1000);
      }, i * 200);
    }
  },
  
  // Save letter
  saveLetter() {
    this.showNotification('Surat telah disimpan!');
  },
  
  // Send letter
  sendLetter() {
    this.showNotification('Fitur pengiriman akan segera tersedia!');
  },
  
  // Open preview
  openPreview() {
    if (!this.elements.previewLetter || !this.elements.previewModal) return;
    
    // Copy content to preview
    if (this.elements.letterTitle) {
      const title = this.elements.letterTitle.value || 'Surat Cinta';
      this.elements.previewLetter.innerHTML = `<h2 style="text-align: center; margin-bottom: 20px;">${title}</h2>`;
    }
    
    if (this.elements.letterEditor) {
      this.elements.previewLetter.innerHTML += this.elements.letterEditor.innerHTML;
    }
    
    // Show modal
    this.elements.previewModal.classList.remove('hidden');
    this.state.isPreviewOpen = true;
  },
  
  // Close preview
  closePreview() {
    if (this.elements.previewModal) {
      this.elements.previewModal.classList.add('hidden');
      this.state.isPreviewOpen = false;
    }
  },
  
  // Print letter
  printLetter() {
    this.showNotification('Fitur pencetakan akan segera tersedia!');
  },
  
  // Share letter
  shareLetter() {
    this.showNotification('Fitur berbagi akan segera tersedia!');
  },
  
  // Send via WhatsApp
  sendViaWhatsApp() {
    this.showNotification('Mengirim via WhatsApp...');
    
    // In a real app, this would open WhatsApp with the letter content
    setTimeout(() => {
      this.showNotification('Surat berhasil dikirim via WhatsApp!');
    }, 1500);
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
    notification.style.backgroundColor = 'rgba(26, 26, 46, 0.9)';
    notification.style.color = 'white';
    notification.style.fontWeight = 'bold';
    notification.style.textAlign = 'center';
    notification.style.maxWidth = '90%';
    notification.style.width = 'auto';
    
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
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  LetterEditor.init();
  
  // Expose LetterEditor to global scope for debugging
  window.LetterEditor = LetterEditor;
});