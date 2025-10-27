/*
 * Heartverse Portal Page
 * 3D WebGL Heart Animation and Interactive Effects
 */

// Portal Application Object
const Portal = {
  // App state
  state: {
    isAnimating: true,
    heartRotation: 0,
    particles: [],
    animationId: null
  },
  
  // DOM Elements
  elements: {
    canvas: null,
    backButton: null,
    enterButton: null,
    ctaCards: null,
    touchTrailContainer: null
  },
  
  // Canvas Context
  ctx: null,
  canvasWidth: 0,
  canvasHeight: 0,
  
  // Initialize the portal
  init() {
    this.cacheElements();
    this.setupCanvas();
    this.setupEventListeners();
    this.startAnimation();
  },
  
  // Cache DOM elements
  cacheElements() {
    this.elements.canvas = document.getElementById('heart-canvas');
    this.elements.backButton = document.getElementById('back-button');
    this.elements.enterButton = document.getElementById('enter-button');
    this.elements.ctaCards = document.querySelectorAll('.cta-card');
    this.elements.touchTrailContainer = document.getElementById('touch-trail-container');
  },
  
  // Set up canvas
  setupCanvas() {
    if (!this.elements.canvas) return;
    
    // Set canvas dimensions
    this.resizeCanvas();
    
    // Get 2D context
    this.ctx = this.elements.canvas.getContext('2d');
    
    // Create initial particles
    this.createParticles(50);
  },
  
  // Resize canvas to fit container
  resizeCanvas() {
    if (!this.elements.canvas) return;
    
    const container = this.elements.canvas.parentElement;
    this.canvasWidth = container.clientWidth;
    this.canvasHeight = container.clientHeight;
    
    this.elements.canvas.width = this.canvasWidth;
    this.elements.canvas.height = this.canvasHeight;
  },
  
  // Set up event listeners
  setupEventListeners() {
    // Back button
    if (this.elements.backButton) {
      this.elements.backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
    
    // Enter button
    if (this.elements.enterButton) {
      this.elements.enterButton.addEventListener('click', () => {
        this.handleEnterClick();
      });
      
      // Add hover effect
      this.elements.enterButton.addEventListener('mouseenter', () => {
        this.createBloomEffect();
      });
    }
    
    // CTA Cards
    if (this.elements.ctaCards) {
      this.elements.ctaCards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
          const target = e.currentTarget.dataset.target;
          if (target) {
            // Add animation effect before navigation
            card.style.animation = 'pulse 0.3s ease-in-out';
            setTimeout(() => {
              window.location.href = `${target}.html`;
            }, 300);
          }
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', (e) => {
          this.createHeartTrail(e.clientX, e.clientY);
          
          // Add pulse animation on hover
          card.style.animation = 'pulse 0.5s ease-in-out';
          setTimeout(() => {
            card.style.animation = '';
          }, 500);
        });
        
        // Add staggered animation delay
        card.style.animationDelay = `${index * 0.1}s`;
      });
    }
    
    // Touch events for mobile
    document.addEventListener('touchstart', (e) => {
      this.handleTouchStart(e);
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
      this.handleTouchMove(e);
    }, { passive: false });
    
    // Window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  },
  
  // Start animation loop
  startAnimation() {
    this.state.isAnimating = true;
    this.animate();
  },
  
  // Stop animation loop
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
    this.clearCanvas();
    
    // Update and draw heart
    this.drawHeart();
    
    // Update and draw particles
    this.updateParticles();
    this.drawParticles();
    
    // Continue animation loop
    this.state.animationId = requestAnimationFrame(() => this.animate());
  },
  
  // Clear canvas
  clearCanvas() {
    if (!this.ctx) return;
    
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Draw gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
    gradient.addColorStop(0, getComputedStyle(document.documentElement).getPropertyValue('--midnight-blue').trim());
    gradient.addColorStop(1, getComputedStyle(document.documentElement).getPropertyValue('--twilight-purple').trim());
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  },
  
  // Draw 3D heart shape
  drawHeart() {
    if (!this.ctx) return;
    
    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;
    const size = Math.min(this.canvasWidth, this.canvasHeight) * 0.3;
    
    // Increment rotation
    this.state.heartRotation += 0.01;
    
    // Save context
    this.ctx.save();
    
    // Translate to center
    this.ctx.translate(centerX, centerY);
    
    // Rotate
    this.ctx.rotate(this.state.heartRotation);
    
    // Scale with pulsing effect
    const pulse = 1 + Math.sin(Date.now() / 500) * 0.05;
    this.ctx.scale(pulse, pulse);
    
    // Draw heart shape
    this.ctx.beginPath();
    
    // Heart curve points
    for (let i = 0; i <= Math.PI * 2; i += 0.01) {
      const x = 16 * Math.pow(Math.sin(i), 3);
      const y = -(13 * Math.cos(i) - 5 * Math.cos(2*i) - 2 * Math.cos(3*i) - Math.cos(4*i));
      
      if (i === 0) {
        this.ctx.moveTo(x * size/20, y * size/20);
      } else {
        this.ctx.lineTo(x * size/20, y * size/20);
      }
    }
    
    // Create gradient for heart
    const heartGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size/2);
    heartGradient.addColorStop(0, '#ff6b6b');
    heartGradient.addColorStop(0.7, '#ff8e8e');
    heartGradient.addColorStop(1, '#6a0dad');
    
    // Fill heart
    this.ctx.fillStyle = heartGradient;
    this.ctx.fill();
    
    // Add shine effect
    this.ctx.beginPath();
    this.ctx.ellipse(-size/8, -size/6, size/6, size/4, Math.PI/4, 0, Math.PI * 2);
    const shineGradient = this.ctx.createRadialGradient(-size/8, -size/6, 0, -size/8, -size/6, size/6);
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    this.ctx.fillStyle = shineGradient;
    this.ctx.fill();
    
    // Restore context
    this.ctx.restore();
  },
  
  // Create particles
  createParticles(count) {
    for (let i = 0; i < count; i++) {
      this.state.particles.push({
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        color: `rgba(255, 107, 107, ${Math.random() * 0.5 + 0.3})`,
        life: Math.random() * 100 + 50
      });
    }
  },
  
  // Update particles
  updateParticles() {
    for (let i = 0; i < this.state.particles.length; i++) {
      const particle = this.state.particles[i];
      
      // Move particle
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Decrease life
      particle.life--;
      
      // Reset particle if dead or out of bounds
      if (particle.life <= 0 || 
          particle.x < 0 || particle.x > this.canvasWidth || 
          particle.y < 0 || particle.y > this.canvasHeight) {
        particle.x = Math.random() * this.canvasWidth;
        particle.y = Math.random() * this.canvasHeight;
        particle.life = Math.random() * 100 + 50;
      }
    }
  },
  
  // Draw particles
  drawParticles() {
    if (!this.ctx) return;
    
    for (let i = 0; i < this.state.particles.length; i++) {
      const particle = this.state.particles[i];
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
    }
  },
  
  // Handle enter button click
  handleEnterClick() {
    // Create bloom effect
    this.createBloomEffect();
    
    // Add animation to enter button
    if (this.elements.enterButton) {
      this.elements.enterButton.style.animation = 'pulse 0.5s ease-in-out';
    }
    
    // Show notification
    this.showNotification('Selamat datang di Heartverse! ❤️');
    
    // Add slight delay before navigation
    setTimeout(() => {
      // In a full implementation, this would navigate to the main app
      // For now, we'll just reload the page to show the effect
      window.location.reload();
    }, 1000);
  },
  
  // Create bloom effect
  createBloomEffect() {
    if (!this.ctx) return;
    
    // Create radial gradient bloom
    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;
    
    const bloomGradient = this.ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, Math.max(this.canvasWidth, this.canvasHeight) / 2
    );
    
    bloomGradient.addColorStop(0, 'rgba(255, 107, 107, 0.8)');
    bloomGradient.addColorStop(1, 'rgba(255, 107, 107, 0)');
    
    this.ctx.fillStyle = bloomGradient;
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  },
  
  // Create heart trail effect
  createHeartTrail(x, y) {
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
  },
  
  // Handle touch start
  handleTouchStart(e) {
    if (e.touches.length > 0) {
      this.createHeartTrail(e.touches[0].clientX, e.touches[0].clientY);
    }
  },
  
  // Handle touch move
  handleTouchMove(e) {
    if (e.touches.length > 0) {
      this.createHeartTrail(e.touches[0].clientX, e.touches[0].clientY);
    }
  },
  
  // Handle window resize
  handleResize() {
    this.resizeCanvas();
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
      }, 300);
    }, 3000);
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  Portal.init();
  
  // Expose Portal to global scope for debugging
  window.Portal = Portal;
});