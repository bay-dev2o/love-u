/*
 * Heartverse Garden Page
 * Interactive Lowpoly Garden with Touch and Audio Effects
 */

// Garden Application Object
const Garden = {
  // App state
  state: {
    isAnimating: true,
    season: 'spring',
    audioPlaying: false,
    currentAudio: null,
    animationId: null,
    plants: [],
    particles: [],
    plantCount: 0,
    memoryCount: 0
  },
  
  // Seasons configuration
  seasons: {
    spring: {
      name: 'Musim Semi',
      color: '#ff6b6b',
      bgColor: ['#1a1a2e', '#16213e'],
      plantColor: '#ff8e8e'
    },
    summer: {
      name: 'Musim Panas',
      color: '#ffd166',
      bgColor: ['#4a4e8c', '#2d305c'],
      plantColor: '#ffd166'
    },
    autumn: {
      name: 'Musim Gugur',
      color: '#ff9a76',
      bgColor: ['#5d407a', '#3d2a54'],
      plantColor: '#ff9a76'
    },
    winter: {
      name: 'Musim Dingin',
      color: '#a8d8ea',
      bgColor: ['#1e3a5f', '#152642'],
      plantColor: '#a8d8ea'
    }
  },
  
  // DOM Elements
  elements: {
    canvas: null,
    backButton: null,
    lockButton: null,
    personButton: null,
    seasonButton: null,
    interactiveObjects: null,
    quoteDisplay: null,
    quoteText: null,
    closeQuote: null,
    audioPlayer: null,
    playPause: null,
    progressBar: null,
    progressFill: null,
    closeAudio: null,
    touchTrailContainer: null,
    plantCountElement: null,
    memoryCountElement: null,
    seasonDisplayElement: null
  },
  
  // Canvas Context
  ctx: null,
  canvasWidth: 0,
  canvasHeight: 0,
  
  // Quotes database
  quotes: [
    "Cinta adalah ketika kebahagiaan orang lain lebih penting daripada milikmu sendiri.",
    "Dalam setiap detak jantung, aku merasakan namamu.",
    "Cinta sejati tidak pernah kehilangan waktu, meskipun waktu berlalu.",
    "Kamu adalah alasan aku percaya pada takdir.",
    "Cinta bukan tentang memiliki, tapi tentang menghargai.",
    "Setiap hari tanpamu terasa seperti musim dingin tanpa salju.",
    "Kamu adalah puisi yang tak pernah selesai kuteulis.",
    "Cinta adalah bahasa hati yang tidak perlu diterjemahkan."
  ],
  
  // Audio bites database
  audioBites: [
    { id: 1, file: './assets/lagu/H2.mp3', title: 'Whispers of Love' },
    { id: 2, file: './assets/lagu/H3.mp3', title: 'Gentle Breeze' }
  ],
  
  // Initialize the garden
  init() {
    this.cacheElements();
    this.setupCanvas();
    this.setupAudio(); // Setup audio context early
    this.setupEventListeners();
    this.createPlants();
    this.createParticles();
    this.startAnimation();
    this.updateStats();
  },
  
  // Cache DOM elements
  cacheElements() {
    this.elements.canvas = document.getElementById('garden-canvas');
    this.elements.backButton = document.querySelector('.back-button');
    this.elements.lockButton = document.querySelector('.lock-button');
    this.elements.personButton = document.querySelector('.person-button');
    this.elements.seasonButton = document.querySelector('.season-button');
    this.elements.interactiveObjects = document.querySelectorAll('.interactive-object');
    this.elements.quoteDisplay = document.getElementById('quote-display');
    this.elements.quoteText = document.querySelector('.quote-text');
    this.elements.closeQuote = document.getElementById('close-quote');
    this.elements.audioPlayer = document.getElementById('audio-player');
    this.elements.playPause = document.getElementById('play-pause');
    this.elements.progressBar = document.getElementById('progress-bar');
    this.elements.progressFill = document.getElementById('progress-fill');
    this.elements.closeAudio = document.getElementById('close-audio');
    this.elements.touchTrailContainer = document.getElementById('touch-trail-container');
    this.elements.plantCountElement = document.getElementById('plant-count');
    this.elements.memoryCountElement = document.getElementById('memory-count');
    this.elements.seasonDisplayElement = document.getElementById('season-display');
  },
  
  // Set up event listeners
  setupEventListeners() {
    // Back button
    if (this.elements.backButton) {
      this.elements.backButton.addEventListener('click', () => {
        window.location.href = 'portal.html';
      });
    }
    
    // Lock button
    if (this.elements.lockButton) {
      this.elements.lockButton.addEventListener('click', () => {
        this.handleLockButtonClick();
      });
    }
    
    // Person button
    if (this.elements.personButton) {
      this.elements.personButton.addEventListener('click', () => {
        this.handlePersonButtonClick();
      });
    }
    
    // Season button
    if (this.elements.seasonButton) {
      this.elements.seasonButton.addEventListener('click', () => {
        this.cycleSeason();
      });
    }
    
    // Interactive objects
    if (this.elements.interactiveObjects) {
      this.elements.interactiveObjects.forEach(obj => {
        obj.addEventListener('click', (e) => {
          this.handleObjectClick(e);
        });
        
        obj.addEventListener('touchstart', (e) => {
          this.handleObjectTouch(e);
        });
      });
    }
    
    // Quote display
    if (this.elements.closeQuote) {
      this.elements.closeQuote.addEventListener('click', () => {
        this.hideQuote();
      });
    }
    
    // Audio player
    if (this.elements.playPause) {
      this.elements.playPause.addEventListener('click', () => {
        this.toggleAudio();
      });
    }
    
    if (this.elements.closeAudio) {
      this.elements.closeAudio.addEventListener('click', () => {
        this.hideAudioPlayer();
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
  
  // Handle lock button click
  handleLockButtonClick() {
    // Navigate to secret portal
    window.location.href = 'secret.html';
  },
  
  // Handle person button click
  handlePersonButtonClick() {
    // Navigate to settings page
    window.location.href = 'settings.html';
  },
  
  // Set up canvas
  setupCanvas() {
    if (!this.elements.canvas) return;
    
    // Set canvas dimensions
    this.resizeCanvas();
    
    // Get 2D context
    this.ctx = this.elements.canvas.getContext('2d');
    
    // Set initial season
    this.setSeason('spring');
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
  
  // Set up audio context
  setupAudio() {
    try {
      // Create audio context
      this.state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume audio context on first user interaction
      const resumeAudioContext = () => {
        if (this.state.audioContext && this.state.audioContext.state === 'suspended') {
          this.state.audioContext.resume()
            .then(() => console.log('Audio context resumed'))
            .catch(e => console.error('Failed to resume audio context:', e));
        }
      };
      
      // Add event listeners to resume audio context
      document.addEventListener('touchstart', resumeAudioContext, { once: true });
      document.addEventListener('mousedown', resumeAudioContext, { once: true });
      document.addEventListener('click', resumeAudioContext, { once: true });
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
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
    
    // Draw background
    this.drawBackground();
    
    // Update and draw plants
    this.updatePlants();
    this.drawPlants();
    
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
  },
  
  // Draw background with gradient
  drawBackground() {
    if (!this.ctx) return;
    
    const season = this.seasons[this.state.season];
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
    gradient.addColorStop(0, season.bgColor[0]);
    gradient.addColorStop(1, season.bgColor[1]);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Draw ground
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.fillRect(0, this.canvasHeight * 0.8, this.canvasWidth, this.canvasHeight * 0.2);
  },
  
  // Create plants
  createPlants() {
    // Create grass
    for (let i = 0; i < 50; i++) {
      this.state.plants.push({
        type: 'grass',
        x: Math.random() * this.canvasWidth,
        y: this.canvasHeight * 0.8,
        height: Math.random() * 30 + 20,
        width: Math.random() * 3 + 1,
        sway: Math.random() * 0.05 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }
    
    // Create flowers
    for (let i = 0; i < 15; i++) {
      this.state.plants.push({
        type: 'flower',
        x: Math.random() * this.canvasWidth,
        y: this.canvasHeight * 0.75,
        size: Math.random() * 15 + 10,
        color: this.getRandomFlowerColor(),
        sway: Math.random() * 0.03 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }
    
    // Create trees
    for (let i = 0; i < 5; i++) {
      this.state.plants.push({
        type: 'tree',
        x: Math.random() * this.canvasWidth,
        y: this.canvasHeight * 0.7,
        height: Math.random() * 80 + 60,
        width: Math.random() * 20 + 15,
        sway: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2
      });
    }
    
    this.state.plantCount = this.state.plants.length;
    this.updateStats();
  },
  
  // Get random flower color
  getRandomFlowerColor() {
    const colors = ['#ff6b6b', '#ffd166', '#06d6a0', '#118ab2', '#ef476f'];
    return colors[Math.floor(Math.random() * colors.length)];
  },
  
  // Update plants
  updatePlants() {
    const time = Date.now() / 1000;
    
    for (let i = 0; i < this.state.plants.length; i++) {
      const plant = this.state.plants[i];
      plant.phase += plant.sway;
    }
  },
  
  // Draw plants
  drawPlants() {
    if (!this.ctx) return;
    
    const time = Date.now() / 1000;
    const season = this.seasons[this.state.season];
    
    for (let i = 0; i < this.state.plants.length; i++) {
      const plant = this.state.plants[i];
      
      // Save context
      this.ctx.save();
      
      // Apply swaying motion
      const sway = Math.sin(plant.phase + time) * 5;
      this.ctx.translate(plant.x + sway, plant.y);
      
      switch (plant.type) {
        case 'grass':
          this.drawGrass(plant);
          break;
        case 'flower':
          this.drawFlower(plant);
          break;
        case 'tree':
          this.drawTree(plant);
          break;
      }
      
      // Restore context
      this.ctx.restore();
    }
  },
  
  // Draw grass
  drawGrass(plant) {
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.quadraticCurveTo(plant.width, -plant.height/2, 0, -plant.height);
    this.ctx.quadraticCurveTo(-plant.width, -plant.height/2, 0, 0);
    this.ctx.fillStyle = season.plantColor;
    this.ctx.fill();
  },
  
  // Draw flower
  drawFlower(plant) {
    // Stem
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, -plant.size * 1.5);
    this.ctx.strokeStyle = '#2e8b57';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    // Flower
    this.ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x = Math.cos(angle) * plant.size;
      const y = -plant.size * 1.5 - Math.sin(angle) * plant.size;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.fillStyle = plant.color;
    this.ctx.fill();
    
    // Center
    this.ctx.beginPath();
    this.ctx.arc(0, -plant.size * 1.5, plant.size/3, 0, Math.PI * 2);
    this.ctx.fillStyle = '#ffd700';
    this.ctx.fill();
  },
  
  // Draw tree
  drawTree(plant) {
    // Trunk
    this.ctx.beginPath();
    this.ctx.rect(-plant.width/4, 0, plant.width/2, -plant.height);
    this.ctx.fillStyle = '#8b4513';
    this.ctx.fill();
    
    // Leaves
    this.ctx.beginPath();
    this.ctx.ellipse(0, -plant.height, plant.width, plant.width/2, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = season.plantColor;
    this.ctx.fill();
  },
  
  // Create particles
  createParticles() {
    for (let i = 0; i < 30; i++) {
      this.state.particles.push({
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: this.seasons[this.state.season].color,
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
      this.ctx.globalAlpha = particle.life / 150;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    }
  },
  
  // Set season
  setSeason(season) {
    this.state.season = season;
    document.documentElement.style.setProperty('--primary-heart', this.seasons[season].color);
    
    // Update particles color
    this.state.particles.forEach(particle => {
      particle.color = this.seasons[season].color;
    });
    
    // Update stats display
    if (this.elements.seasonDisplayElement) {
      this.elements.seasonDisplayElement.textContent = this.seasons[season].name;
    }
  },
  
  // Cycle through seasons
  cycleSeason() {
    const seasons = Object.keys(this.seasons);
    const currentIndex = seasons.indexOf(this.state.season);
    const nextIndex = (currentIndex + 1) % seasons.length;
    const nextSeason = seasons[nextIndex];
    
    this.setSeason(nextSeason);
    
    // Show notification
    this.showNotification(`Musim berubah menjadi ${this.seasons[nextSeason].name}`);
    
    // Create seasonal effect
    this.createSeasonalEffect();
  },
  
  // Create seasonal effect
  createSeasonalEffect() {
    // Create particles with seasonal colors
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'touch-trail';
        particle.style.left = `${Math.random() * window.innerWidth}px`;
        particle.style.top = `${Math.random() * window.innerHeight}px`;
        particle.style.background = `radial-gradient(circle, ${this.seasons[this.state.season].color}, transparent 70%)`;
        
        this.elements.touchTrailContainer.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 1000);
      }, i * 50);
    }
  },
  
  // Handle object click
  handleObjectClick(e) {
    const obj = e.currentTarget;
    const type = obj.dataset.type;
    const id = obj.dataset.id;
    
    // Create touch effect
    this.createTouchEffect(e.clientX, e.clientY);
    
    // Add animation effect to clicked object
    obj.style.animation = 'pulse 0.5s ease-in-out';
    setTimeout(() => {
      obj.style.animation = 'float 3s ease-in-out infinite';
      if (obj.style.animationDelay) {
        obj.style.animationDelay = obj.style.animationDelay;
      }
    }, 500);
    
    // Handle different object types
    switch (type) {
      case 'flower':
        this.showQuote();
        break;
      case 'tree':
        this.showAudioPlayer(id);
        break;
      case 'heart':
        this.showLoveEffect();
        break;
      case 'butterfly':
      case 'bird':
        this.showNotification('Hewan kecil ini membawa kenangan indah!');
        break;
    }
    
    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
    
    // Update memory count
    this.state.memoryCount++;
    this.updateStats();
  },
  
  // Handle object touch
  handleObjectTouch(e) {
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.handleObjectClick({
        currentTarget: e.currentTarget,
        clientX: touch.clientX,
        clientY: touch.clientY
      });
    }
  },
  
  // Show quote
  showQuote() {
    const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    if (this.elements.quoteText) {
      this.elements.quoteText.textContent = randomQuote;
    }
    if (this.elements.quoteDisplay) {
      this.elements.quoteDisplay.classList.remove('hidden');
      
      // Add animation to quote content
      const quoteContent = this.elements.quoteDisplay.querySelector('.quote-content');
      if (quoteContent) {
        quoteContent.style.animation = 'bounceIn 0.8s ease-out';
      }
    }
  },
  
  // Hide quote
  hideQuote() {
    if (this.elements.quoteDisplay) {
      // Add fade out animation
      const quoteContent = this.elements.quoteDisplay.querySelector('.quote-content');
      if (quoteContent) {
        quoteContent.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
          this.elements.quoteDisplay.classList.add('hidden');
        }, 300);
      } else {
        this.elements.quoteDisplay.classList.add('hidden');
      }
    }
  },
  
  // Hide audio player
  hideAudioPlayer() {
    // Pause any currently playing audio
    if (this.state.currentAudio) {
      this.state.currentAudio.pause();
      this.state.audioPlaying = false;
      
      // Reset UI
      const playIcon = this.elements.playPause.querySelector('.play-icon');
      if (playIcon) {
        playIcon.innerHTML = '<path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>';
      }
      if (this.elements.progressFill) {
        this.elements.progressFill.style.width = '0%';
      }
    }
    
    if (this.elements.audioPlayer) {
      // Add fade out animation
      this.elements.audioPlayer.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        this.elements.audioPlayer.classList.add('hidden');
        this.elements.audioPlayer.style.animation = '';
      }, 300);
    }
  },
  
  // Show audio player
  showAudioPlayer(id) {
    // Stop any currently playing audio
    if (this.state.currentAudio) {
      this.state.currentAudio.pause();
      this.state.currentAudio = null;
    }
    
    // Create new audio element
    this.state.currentAudio = new Audio();
    
    // Set audio source based on ID
    // For tree (id=1), play H2.mp3
    if (id === "1") {
      this.state.currentAudio.src = './assets/lagu/H2.mp3';
    } else {
      // Default to H3.mp3 for other cases
      this.state.currentAudio.src = './assets/lagu/H3.mp3';
    }
    
    // Set up event listeners for the audio
    this.state.currentAudio.addEventListener('play', () => {
      this.state.audioPlaying = true;
      console.log('Audio started playing');
    });
    
    this.state.currentAudio.addEventListener('pause', () => {
      this.state.audioPlaying = false;
      console.log('Audio paused');
    });
    
    this.state.currentAudio.addEventListener('ended', () => {
      this.state.audioPlaying = false;
      console.log('Audio finished playing');
      // Reset UI when audio ends
      const playIcon = this.elements.playPause.querySelector('.play-icon');
      if (playIcon) {
        playIcon.innerHTML = '<path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>';
      }
      if (this.elements.progressFill) {
        this.elements.progressFill.style.width = '0%';
      }
    });
    
    // Handle loading errors
    this.state.currentAudio.addEventListener('error', (e) => {
      console.error('Audio loading error:', e);
      this.showNotification('Gagal memuat audio: file tidak ditemukan atau korup');
    });
    
    // Show the audio player UI with animation
    if (this.elements.audioPlayer) {
      this.elements.audioPlayer.classList.remove('hidden');
      this.elements.audioPlayer.style.animation = 'fadeIn 0.5s ease-out';
    }
    
    // Auto-play the audio after a short delay to ensure everything is set up
    setTimeout(() => {
      this.playAudio();
    }, 100);
  },
  
  // Play audio
  playAudio() {
    if (this.state.currentAudio) {
      // Resume context if needed
      if (this.state.audioContext && this.state.audioContext.state === 'suspended') {
        this.state.audioContext.resume()
          .then(() => {
            this.attemptPlayAudio();
          })
          .catch(e => {
            console.error('Failed to resume audio context:', e);
            this.attemptPlayAudio();
          });
      } else {
        this.attemptPlayAudio();
      }
    }
  },
  
  // Attempt to play audio
  attemptPlayAudio() {
    if (this.state.currentAudio) {
      // Add a small delay to ensure the audio is ready
      setTimeout(() => {
        this.state.currentAudio.play()
          .then(() => {
            this.state.audioPlaying = true;
            console.log('Audio playing successfully');
            
            // Update UI
            const playIcon = this.elements.playPause.querySelector('.play-icon');
            if (playIcon) {
              playIcon.innerHTML = '<path d="M14,19H18V5H14M6,19H10V5H6V19Z"/>';
            }
            
            // Start progress simulation
            this.simulateProgress();
          })
          .catch(e => {
            console.error('Audio playback failed:', e);
            let errorMessage = 'Gagal memutar audio';
            if (e.name === 'NotAllowedError') {
              errorMessage = 'Harap klik tombol play untuk memutar audio (autoplay dibatasi oleh browser)';
            }
            this.showNotification(errorMessage);
          });
      }, 100);
    }
  },
  
  // Simulate progress
  simulateProgress() {
    if (!this.state.audioPlaying || !this.state.currentAudio) return;
    
    const updateProgress = () => {
      if (!this.state.audioPlaying) return;
      
      if (this.state.currentAudio && this.elements.progressFill) {
        const progress = (this.state.currentAudio.currentTime / this.state.currentAudio.duration) * 100;
        this.elements.progressFill.style.width = `${progress || 0}%`;
      }
      
      if (this.state.audioPlaying) {
        setTimeout(updateProgress, 100);
      }
    };
    
    updateProgress();
  },
  
  // Show love effect
  showLoveEffect() {
    // Create multiple heart particles with different animations
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'touch-trail';
        particle.style.left = `${Math.random() * window.innerWidth}px`;
        particle.style.top = `${Math.random() * window.innerHeight}px`;
        particle.style.background = 'radial-gradient(circle, #ff6b6b, transparent 70%)';
        particle.style.width = `${Math.random() * 30 + 10}px`;
        particle.style.height = particle.style.width;
        
        // Add random animation
        const animations = ['trailMove', 'float', 'pulse'];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        particle.style.animation = `${randomAnimation} ${Math.random() * 2 + 1}s forwards, trailFade ${Math.random() * 2 + 1}s forwards`;
        
        this.elements.touchTrailContainer.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 2000);
      }, i * 50);
    }
    
    // Show notification with animation
    this.showNotification('❤️ Cinta memenuhi taman ini! ❤️');
  },
  
  // Create touch effect
  createTouchEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'touch-trail';
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    effect.style.background = `radial-gradient(circle, ${this.seasons[this.state.season].color}, transparent 70%)`;
    
    this.elements.touchTrailContainer.appendChild(effect);
    
    // Remove after animation
    setTimeout(() => {
      if (effect.parentNode) {
        effect.parentNode.removeChild(effect);
      }
    }, 1000);
  },
  
  // Handle touch start
  handleTouchStart(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.createTouchEffect(touch.clientX, touch.clientY);
    }
  },
  
  // Handle touch move
  handleTouchMove(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.createTouchEffect(touch.clientX, touch.clientY);
    }
  },
  
  // Handle window resize
  handleResize() {
    this.resizeCanvas();
  },
  
  // Update stats display
  updateStats() {
    if (this.elements.plantCountElement) {
      this.elements.plantCountElement.textContent = this.state.plantCount;
    }
    if (this.elements.memoryCountElement) {
      this.elements.memoryCountElement.textContent = this.state.memoryCount;
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
  Garden.init();
  
  // Expose Garden to global scope for debugging
  window.Garden = Garden;
});