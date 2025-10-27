/*
 * Heartverse Dream Sky
 * Interactive Dream Constellation Builder with Wish Writing
 */

// Dream Sky Application Object
const DreamSky = {
  // App state
  state: {
    wishes: [],
    stars: [],
    connections: [],
    mode: 'draw', // draw, connect, erase
    selectedStar: null,
    wishCount: 0,
    constellationCount: 0,
    starCount: 0,
    animationId: null,
    isAnimating: true
  },
  
  // DOM Elements
  elements: {
    backButton: null,
    saveButton: null,
    dreamCanvas: null,
    clearButton: null,
    wishInput: null,
    addWishButton: null,
    drawModeButton: null,
    connectModeButton: null,
    eraseModeButton: null,
    wishCountElement: null,
    constellationCountElement: null,
    starCountElement: null
  },
  
  // Canvas context
  ctx: null,
  canvasWidth: 0,
  canvasHeight: 0,
  
  // Initialize the dream sky
  init() {
    this.cacheElements();
    this.setupCanvas();
    this.setupEventListeners();
    this.startAnimation();
    this.loadFromStorage();
    this.updateStats();
  },
  
  // Cache DOM elements
  cacheElements() {
    this.elements.backButton = document.querySelector('.back-button');
    this.elements.saveButton = document.querySelector('.save-button');
    this.elements.dreamCanvas = document.getElementById('dream-canvas');
    this.elements.clearButton = document.getElementById('clear-button');
    this.elements.wishInput = document.getElementById('wish-input');
    this.elements.addWishButton = document.getElementById('add-wish-button');
    this.elements.drawModeButton = document.getElementById('draw-mode');
    this.elements.connectModeButton = document.getElementById('connect-mode');
    this.elements.eraseModeButton = document.getElementById('erase-mode');
    this.elements.wishCountElement = document.getElementById('wish-count');
    this.elements.constellationCountElement = document.getElementById('constellation-count');
    this.elements.starCountElement = document.getElementById('star-count');
    this.elements.wishFormContainer = document.querySelector('.wish-form-container');
  },
  
  // Set up canvas
  setupCanvas() {
    if (!this.elements.dreamCanvas) return;
    
    // Set canvas dimensions
    this.resizeCanvas();
    
    // Get 2D context
    this.ctx = this.elements.dreamCanvas.getContext('2d');
    
    // Set up mouse events
    this.setupCanvasEvents();
  },
  
  // Resize canvas to fit container
  resizeCanvas() {
    if (!this.elements.dreamCanvas) return;
    
    const container = this.elements.dreamCanvas.parentElement;
    this.canvasWidth = container.clientWidth;
    this.canvasHeight = container.clientHeight;
    
    this.elements.dreamCanvas.width = this.canvasWidth;
    this.elements.dreamCanvas.height = this.canvasHeight;
  },
  
  // Set up canvas events
  setupCanvasEvents() {
    if (!this.elements.dreamCanvas) return;
    
    // Mouse events
    this.elements.dreamCanvas.addEventListener('mousedown', (e) => {
      this.handleCanvasMouseDown(e);
    });
    
    this.elements.dreamCanvas.addEventListener('mousemove', (e) => {
      this.handleCanvasMouseMove(e);
    });
    
    this.elements.dreamCanvas.addEventListener('mouseup', () => {
      this.handleCanvasMouseUp();
    });
    
    // Touch events
    this.elements.dreamCanvas.addEventListener('touchstart', (e) => {
      this.handleCanvasTouchStart(e);
    });
    
    this.elements.dreamCanvas.addEventListener('touchmove', (e) => {
      this.handleCanvasTouchMove(e);
    });
    
    this.elements.dreamCanvas.addEventListener('touchend', () => {
      this.handleCanvasTouchEnd();
    });
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
        this.saveToStorage();
        this.showNotification('Langit mimpi telah disimpan!');
      });
    }
    
    // Clear button
    if (this.elements.clearButton) {
      this.elements.clearButton.addEventListener('click', () => {
        this.clearCanvas();
      });
    }
    
    // Wish form
    if (this.elements.addWishButton) {
      this.elements.addWishButton.addEventListener('click', () => {
        this.addWish();
      });
    }
    
    // Mode buttons
    if (this.elements.drawModeButton) {
      this.elements.drawModeButton.addEventListener('click', () => {
        this.setMode('draw');
      });
    }
    
    if (this.elements.connectModeButton) {
      this.elements.connectModeButton.addEventListener('click', () => {
        this.setMode('connect');
      });
    }
    
    if (this.elements.eraseModeButton) {
      this.elements.eraseModeButton.addEventListener('click', () => {
        this.setMode('erase');
      });
    }
    
    // Window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  },
  
  // Handle canvas mouse down
  handleCanvasMouseDown(e) {
    const rect = this.elements.dreamCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    this.handleCanvasAction(x, y);
  },
  
  // Handle canvas mouse move
  handleCanvasMouseMove(e) {
    if (e.buttons !== 1) return; // Only if left mouse button is pressed
    
    const rect = this.elements.dreamCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (this.state.mode === 'draw') {
      this.addStar(x, y);
    }
  },
  
  // Handle canvas mouse up
  handleCanvasMouseUp() {
    this.state.selectedStar = null;
  },
  
  // Handle canvas touch start
  handleCanvasTouchStart(e) {
    e.preventDefault();
    if (e.touches.length > 0) {
      const rect = this.elements.dreamCanvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      
      this.handleCanvasAction(x, y);
    }
  },
  
  // Handle canvas touch move
  handleCanvasTouchMove(e) {
    e.preventDefault();
    if (e.touches.length > 0) {
      const rect = this.elements.dreamCanvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      
      if (this.state.mode === 'draw') {
        this.addStar(x, y);
      }
    }
  },
  
  // Handle canvas touch end
  handleCanvasTouchEnd() {
    this.state.selectedStar = null;
  },
  
  // Handle canvas action
  handleCanvasAction(x, y) {
    switch (this.state.mode) {
      case 'draw':
        this.addStar(x, y);
        break;
      case 'connect':
        this.selectStarForConnection(x, y);
        break;
      case 'erase':
        this.eraseStarOrConnection(x, y);
        break;
    }
  },
  
  // Add star
  addStar(x, y) {
    const star = {
      id: Date.now() + Math.random(),
      x: x,
      y: y,
      size: Math.random() * 3 + 1,
      brightness: Math.random() * 0.5 + 0.5,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2
    };
    
    this.state.stars.push(star);
    this.state.starCount++;
    this.updateStats();
  },
  
  // Select star for connection
  selectStarForConnection(x, y) {
    const star = this.findStarNearPoint(x, y);
    if (!star) return;
    
    if (!this.state.selectedStar) {
      // First star selection
      this.state.selectedStar = star;
      this.highlightStar(star, '#ffd166');
    } else {
      // Second star selection - create connection
      if (this.state.selectedStar.id !== star.id) {
        const connection = {
          id: Date.now() + Math.random(),
          star1: this.state.selectedStar,
          star2: star
        };
        
        this.state.connections.push(connection);
        this.state.constellationCount++;
        this.updateStats();
      }
      
      // Reset selection
      this.state.selectedStar = null;
    }
  },
  
  // Erase star or connection
  eraseStarOrConnection(x, y) {
    // Try to erase a star first
    const starIndex = this.findStarIndexNearPoint(x, y);
    if (starIndex !== -1) {
      const starId = this.state.stars[starIndex].id;
      
      // Remove the star
      this.state.stars.splice(starIndex, 1);
      
      // Remove any connections involving this star
      this.state.connections = this.state.connections.filter(conn => {
        const shouldKeep = conn.star1.id !== starId && conn.star2.id !== starId;
        if (!shouldKeep) this.state.constellationCount--;
        return shouldKeep;
      });
      
      this.state.starCount--;
      this.updateStats();
      return;
    }
    
    // Try to erase a connection
    const connectionIndex = this.findConnectionIndexNearPoint(x, y);
    if (connectionIndex !== -1) {
      this.state.connections.splice(connectionIndex, 1);
      this.state.constellationCount--;
      this.updateStats();
    }
  },
  
  // Find star near point
  findStarNearPoint(x, y) {
    for (const star of this.state.stars) {
      const distance = Math.sqrt(Math.pow(star.x - x, 2) + Math.pow(star.y - y, 2));
      if (distance < 20) {
        return star;
      }
    }
    return null;
  },
  
  // Find star index near point
  findStarIndexNearPoint(x, y) {
    for (let i = 0; i < this.state.stars.length; i++) {
      const star = this.state.stars[i];
      const distance = Math.sqrt(Math.pow(star.x - x, 2) + Math.pow(star.y - y, 2));
      if (distance < 20) {
        return i;
      }
    }
    return -1;
  },
  
  // Find connection index near point
  findConnectionIndexNearPoint(x, y) {
    for (let i = 0; i < this.state.connections.length; i++) {
      const conn = this.state.connections[i];
      // Check if point is near the line
      const distance = this.distanceToLine(x, y, conn.star1.x, conn.star1.y, conn.star2.x, conn.star2.y);
      if (distance < 10) {
        return i;
      }
    }
    return -1;
  },
  
  // Distance from point to line
  distanceToLine(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) {
      param = dot / lenSq;
    }
    
    let xx, yy;
    
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  },
  
  // Highlight star
  highlightStar(star, color) {
    if (!this.ctx) return;
    
    this.ctx.beginPath();
    this.ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = 0.5;
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  },
  
  // Add wish
  addWish() {
    if (!this.elements.wishInput) return;
    
    const wishText = this.elements.wishInput.value.trim();
    if (!wishText) {
      this.showNotification('Silakan tulis harapanmu terlebih dahulu!');
      return;
    }
    
    const wish = {
      id: Date.now(),
      text: wishText,
      timestamp: new Date().toISOString()
    };
    
    this.state.wishes.push(wish);
    this.elements.wishInput.value = '';
    this.state.wishCount++;
    this.updateStats();
    
    // Add animation to wish form
    if (this.elements.wishFormContainer) {
      this.elements.wishFormContainer.style.animation = 'pulse 0.5s ease-in-out';
      setTimeout(() => {
        this.elements.wishFormContainer.style.animation = '';
      }, 500);
    }
    
    // Create a star from the wish
    this.createStarFromWish(wish);
    
    this.showNotification('Harapanmu telah ditambahkan ke langit mimpi!');
  },
  
  // Create star from wish
  createStarFromWish(wish) {
    // Create a star at a random position
    const x = Math.random() * (this.canvasWidth - 40) + 20;
    const y = Math.random() * (this.canvasHeight - 40) + 20;
    
    this.addStar(x, y);
    
    // Add animation effect when creating star
    if (this.elements.dreamCanvas) {
      const rect = this.elements.dreamCanvas.getBoundingClientRect();
      this.createStarAnimation(x + rect.left, y + rect.top);
    }
  },
  
  // Set mode
  setMode(mode) {
    this.state.mode = mode;
    
    // Add animation to mode buttons
    const buttons = [this.elements.drawModeButton, this.elements.connectModeButton, this.elements.eraseModeButton];
    buttons.forEach(button => {
      if (button) {
        button.style.animation = 'pulse 0.3s ease-in-out';
        setTimeout(() => {
          button.style.animation = '';
        }, 300);
      }
    });
    
    // Update button states
    if (this.elements.drawModeButton) {
      if (mode === 'draw') {
        this.elements.drawModeButton.classList.add('active');
      } else {
        this.elements.drawModeButton.classList.remove('active');
      }
    }
    
    if (this.elements.connectModeButton) {
      if (mode === 'connect') {
        this.elements.connectModeButton.classList.add('active');
      } else {
        this.elements.connectModeButton.classList.remove('active');
      }
    }
    
    if (this.elements.eraseModeButton) {
      if (mode === 'erase') {
        this.elements.eraseModeButton.classList.add('active');
      } else {
        this.elements.eraseModeButton.classList.remove('active');
      }
    }
    
    // Reset selection when changing modes
    this.state.selectedStar = null;
  },
  
  // Clear canvas
  clearCanvas() {
    // Add animation effect before clearing
    if (this.elements.dreamCanvas) {
      this.elements.dreamCanvas.style.animation = 'fadeOut 0.5s ease-out';
      setTimeout(() => {
        this.elements.dreamCanvas.style.animation = '';
      }, 500);
    }
    
    this.state.stars = [];
    this.state.connections = [];
    this.state.wishes = [];
    this.state.wishCount = 0;
    this.state.constellationCount = 0;
    this.state.starCount = 0;
    this.state.selectedStar = null;
    this.updateStats();
    
    if (this.elements.wishInput) {
      this.elements.wishInput.value = '';
    }
    
    this.showNotification('Langit mimpi telah dibersihkan!');
  },
  
  // Start animation
  startAnimation() {
    this.state.isAnimating = true;
    this.animate();
  },
  
  // Stop animation
  stopAnimation() {
    this.state.isAnimating = false;
    if (this.state.animationId) {
      cancelAnimationFrame(this.state.animationId);
    }
  },
  
  // Animation loop
  animate() {
    if (!this.state.isAnimating) return;
    
    // Clear canvas
    this.clearCanvasDraw();
    
    // Draw background
    this.drawBackground();
    
    // Update and draw stars
    this.updateStars();
    this.drawStars();
    
    // Draw connections
    this.drawConnections();
    
    // Continue animation loop
    this.state.animationId = requestAnimationFrame(() => this.animate());
  },
  
  // Clear canvas draw
  clearCanvasDraw() {
    if (!this.ctx) return;
    
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  },
  
  // Draw background
  drawBackground() {
    if (!this.ctx) return;
    
    // Draw gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Draw twinkling stars in background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 50; i++) {
      const x = (i * 37) % this.canvasWidth;
      const y = (i * 73) % this.canvasHeight;
      const size = Math.sin(Date.now() / 1000 + i) * 0.5 + 1;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  },
  
  // Update stars
  updateStars() {
    const time = Date.now() / 1000;
    
    for (const star of this.state.stars) {
      star.twinklePhase += star.twinkleSpeed;
      star.brightness = Math.sin(star.twinklePhase) * 0.3 + 0.7;
    }
  },
  
  // Draw stars
  drawStars() {
    if (!this.ctx) return;
    
    for (const star of this.state.stars) {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      this.ctx.fill();
      
      // Draw glow effect
      const gradient = this.ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.size * 3
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${star.brightness * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    }
  },
  
  // Draw connections
  drawConnections() {
    if (!this.ctx) return;
    
    for (const conn of this.state.connections) {
      this.ctx.beginPath();
      this.ctx.moveTo(conn.star1.x, conn.star1.y);
      this.ctx.lineTo(conn.star2.x, conn.star2.y);
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
  },
  
  // Update stats
  updateStats() {
    if (this.elements.wishCountElement) {
      this.elements.wishCountElement.textContent = this.state.wishCount;
    }
    
    if (this.elements.constellationCountElement) {
      this.elements.constellationCountElement.textContent = this.state.constellationCount;
    }
    
    if (this.elements.starCountElement) {
      this.elements.starCountElement.textContent = this.state.starCount;
    }
  },
  
  // Handle window resize
  handleResize() {
    this.resizeCanvas();
  },
  
  // Save to storage
  saveToStorage() {
    const data = {
      wishes: this.state.wishes,
      stars: this.state.stars,
      connections: this.state.connections,
      wishCount: this.state.wishCount,
      constellationCount: this.state.constellationCount,
      starCount: this.state.starCount
    };
    
    localStorage.setItem('heartverse-dream-data', JSON.stringify(data));
  },
  
  // Load from storage
  loadFromStorage() {
    const data = localStorage.getItem('heartverse-dream-data');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        this.state.wishes = parsed.wishes || [];
        this.state.stars = parsed.stars || [];
        this.state.connections = parsed.connections || [];
        this.state.wishCount = parsed.wishCount || 0;
        this.state.constellationCount = parsed.constellationCount || 0;
        this.state.starCount = parsed.starCount || 0;
        this.updateStats();
      } catch (e) {
        console.error('Failed to load dream data:', e);
      }
    }
  },
  
  // Create star animation effect
  createStarAnimation(x, y) {
    // Create multiple animated elements for star effect
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = '#ffd166';
        particle.style.boxShadow = '0 0 10px #ffd166';
        particle.style.zIndex = '1000';
        particle.style.pointerEvents = 'none';
        particle.style.animation = `starTwinkle 1s forwards`;
        
        // Add to document
        document.body.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 1000);
      }, i * 100);
    }
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
  DreamSky.init();
  
  // Expose DreamSky to global scope for debugging
  window.DreamSky = DreamSky;
});