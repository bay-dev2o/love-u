/*
 * Heartverse Game Page
 * Interactive Love Game with Touch Controls and Visual Effects
 */

// Game Application Object
const Game = {
  // App state
  state: {
    isRunning: false,
    isPaused: false,
    score: 0,
    lives: 3,
    highScore: 0,
    player: null,
    hearts: [],
    obstacles: [],
    powerUps: [],
    particles: [],
    animationId: null,
    lastTime: 0,
    gameTime: 0,
    powerUpTimers: {
      slowTime: 0,
      magnet: 0,
      doublePoints: 0
    },
    comboCount: 0,
    comboActive: false,
    gameTime: 0,
    // New state for enhanced gameplay
    specialEffects: [],
    achievements: [],
    particleEffects: []
  },
  
  // Game settings
  settings: {
    gravity: 0.5,
    playerSpeed: 5,
    heartSpawnRate: 1000, // ms
    obstacleSpawnRate: 2000, // ms
    powerUpSpawnRate: 5000, // ms
    slowTimeFactor: 0.5,
    magnetRange: 100,
    doublePointsMultiplier: 2,
    // New settings for enhanced gameplay
    specialHeartChance: 0.3, // 30% chance for special hearts
    comboThreshold: 5, // Combo after 5 consecutive hearts
    comboMultiplier: 1.5, // 1.5x points for combos
    timeBonus: 100, // Bonus points for time-based achievements
    heartTypes: {
      normal: { points: 10, color: '#ff6b6b' },
      golden: { points: 50, color: '#ffd166' },
      rainbow: { points: 100, color: '#f72585' },
      diamond: { points: 200, color: '#4cc9f0' }
    }
  },
  
  // DOM Elements
  elements: {
    canvas: null,
    backButton: null,
    pauseButton: null,
    scoreElement: null,
    livesElement: null,
    powerUps: null,
    gameOverScreen: null,
    finalScore: null,
    highScore: null,
    restartButton: null,
    pauseScreen: null,
    resumeButton: null,
    touchTrailContainer: null
  },
  
  // Canvas Context
  ctx: null,
  canvasWidth: 0,
  canvasHeight: 0,
  
  // Initialize the game
  init() {
    this.cacheElements();
    this.setupCanvas();
    this.setupEventListeners();
    this.loadHighScore();
    this.startGame();
  },
  
  // Cache DOM elements
  cacheElements() {
    this.elements.canvas = document.getElementById('game-canvas');
    this.elements.backButton = document.getElementById('back-button');
    this.elements.pauseButton = document.getElementById('pause-button');
    this.elements.scoreElement = document.getElementById('score');
    this.elements.livesElement = document.getElementById('lives');
    this.elements.powerUps = document.querySelectorAll('.powerup');
    this.elements.gameOverScreen = document.getElementById('game-over');
    this.elements.finalScore = document.getElementById('final-score');
    this.elements.highScore = document.getElementById('high-score');
    this.elements.restartButton = document.getElementById('restart-button');
    this.elements.pauseScreen = document.getElementById('pause-screen');
    this.elements.resumeButton = document.getElementById('resume-button');
    this.elements.touchTrailContainer = document.getElementById('touch-trail-container');
  },
  
  // Set up canvas
  setupCanvas() {
    if (!this.elements.canvas) return;
    
    // Set canvas dimensions
    this.resizeCanvas();
    
    // Get 2D context
    this.ctx = this.elements.canvas.getContext('2d');
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
    
    // Pause button
    if (this.elements.pauseButton) {
      this.elements.pauseButton.addEventListener('click', () => {
        this.togglePause();
      });
    }
    
    // Restart button
    if (this.elements.restartButton) {
      this.elements.restartButton.addEventListener('click', () => {
        this.restartGame();
      });
    }
    
    // Resume button
    if (this.elements.resumeButton) {
      this.elements.resumeButton.addEventListener('click', () => {
        this.resumeGame();
      });
    }
    
    // Power-ups
    if (this.elements.powerUps) {
      this.elements.powerUps.forEach(powerUp => {
        powerUp.addEventListener('click', (e) => {
          const type = e.currentTarget.classList.contains('slow-time') ? 'slowTime' :
                      e.currentTarget.classList.contains('magnet') ? 'magnet' : 'doublePoints';
          this.activatePowerUp(type);
        });
      });
    }
    
    // Touch events for mobile
    if (this.elements.canvas) {
      this.elements.canvas.addEventListener('touchstart', (e) => {
        this.handleTouchStart(e);
      }, { passive: false });
      
      this.elements.canvas.addEventListener('touchmove', (e) => {
        this.handleTouchMove(e);
      }, { passive: false });
      
      this.elements.canvas.addEventListener('touchend', (e) => {
        this.handleTouchEnd(e);
      }, { passive: false });
    }
    
    // Mouse events for desktop
    if (this.elements.canvas) {
      this.elements.canvas.addEventListener('mousedown', (e) => {
        this.handleMouseDown(e);
      });
      
      this.elements.canvas.addEventListener('mousemove', (e) => {
        this.handleMouseMove(e);
      });
      
      this.elements.canvas.addEventListener('mouseup', (e) => {
        this.handleMouseUp(e);
      });
    }
    
    // Window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  },
  
  // Start game
  startGame() {
    this.state.isRunning = true;
    this.state.isPaused = false;
    this.state.score = 0;
    this.state.lives = 3;
    this.state.hearts = [];
    this.state.obstacles = [];
    this.state.powerUps = [];
    this.state.particles = [];
    this.state.specialEffects = [];
    this.state.achievements = [];
    this.state.particleEffects = [];
    this.state.comboCount = 0;
    this.state.comboActive = false;
    this.state.gameTime = 0;
    
    // Initialize player
    this.state.player = {
      x: this.canvasWidth / 2,
      y: this.canvasHeight - 100,
      width: 50,
      height: 50,
      velocityX: 0,
      velocityY: 0
    };
    
    // Update UI
    this.updateUI();
    
    // Hide game over screen
    if (this.elements.gameOverScreen) {
      this.elements.gameOverScreen.classList.add('hidden');
    }
    
    // Hide pause screen
    if (this.elements.pauseScreen) {
      this.elements.pauseScreen.classList.add('hidden');
    }
    
    // Start game loop
    this.gameLoop(0);
  },
  
  // Game loop
  gameLoop(timestamp) {
    if (!this.state.isRunning) return;
    
    if (!this.state.isPaused) {
      // Calculate delta time
      const deltaTime = timestamp - this.state.lastTime;
      this.state.lastTime = timestamp;
      this.state.gameTime += deltaTime;
      
      // Update game state
      this.update(deltaTime);
      
      // Render game
      this.render();
    }
    
    // Continue game loop
    this.state.animationId = requestAnimationFrame((time) => this.gameLoop(time));
  },
  
  // Update game state
  update(deltaTime) {
    // Apply time scaling for power-ups
    const timeScale = this.state.powerUpTimers.slowTime > 0 ? this.settings.slowTimeFactor : 1;
    const scaledDeltaTime = deltaTime * timeScale;
    
    // Update game time
    this.state.gameTime += deltaTime;
    
    // Update player
    this.updatePlayer(scaledDeltaTime);
    
    // Spawn hearts
    if (this.state.gameTime % this.settings.heartSpawnRate < scaledDeltaTime) {
      this.spawnHeart();
    }
    
    // Spawn obstacles
    if (this.state.gameTime % this.settings.obstacleSpawnRate < scaledDeltaTime) {
      this.spawnObstacle();
    }
    
    // Spawn power-ups
    if (this.state.gameTime % this.settings.powerUpSpawnRate < scaledDeltaTime) {
      this.spawnPowerUp();
    }
    
    // Update hearts
    this.updateHearts(scaledDeltaTime);
    
    // Update obstacles
    this.updateObstacles(scaledDeltaTime);
    
    // Update power-ups
    this.updatePowerUps(scaledDeltaTime);
    
    // Update particles
    this.updateParticles(scaledDeltaTime);
    
    // Update special effects
    this.updateSpecialEffects(scaledDeltaTime);
    
    // Update particle effects
    this.updateParticleEffects(scaledDeltaTime);
    
    // Update power-up timers
    this.updatePowerUpTimers(scaledDeltaTime);
    
    // Update combo state
    this.updateComboState();
    
    // Check collisions
    this.checkCollisions();
  },
  
  // Update player
  updatePlayer(deltaTime) {
    if (!this.state.player) return;
    
    // Apply gravity
    this.state.player.velocityY += this.settings.gravity;
    
    // Update position
    this.state.player.x += this.state.player.velocityX;
    this.state.player.y += this.state.player.velocityY;
    
    // Boundary checking
    if (this.state.player.x < 0) {
      this.state.player.x = 0;
      this.state.player.velocityX = 0;
    }
    
    if (this.state.player.x > this.canvasWidth - this.state.player.width) {
      this.state.player.x = this.canvasWidth - this.state.player.width;
      this.state.player.velocityX = 0;
    }
    
    if (this.state.player.y > this.canvasHeight - this.state.player.height) {
      this.state.player.y = this.canvasHeight - this.state.player.height;
      this.state.player.velocityY = 0;
    }
  },
  
  // Spawn heart
  spawnHeart() {
    // Determine heart type
    let type = 'normal';
    let color = '#ff6b6b';
    let points = 10;
    
    // Chance for special hearts
    const rand = Math.random();
    if (rand < 0.05) { // 5% chance for diamond
      type = 'diamond';
      color = '#4cc9f0';
      points = 200;
    } else if (rand < 0.15) { // 10% chance for rainbow
      type = 'rainbow';
      color = '#f72585';
      points = 100;
    } else if (rand < 0.3) { // 15% chance for golden
      type = 'golden';
      color = '#ffd166';
      points = 50;
    }
    
    this.state.hearts.push({
      x: Math.random() * (this.canvasWidth - 30),
      y: -30,
      width: 30,
      height: 30,
      velocityY: 2 + Math.random() * 2,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      type: type,
      color: color,
      points: points
    });
  },
  
  // Spawn obstacle
  spawnObstacle() {
    this.state.obstacles.push({
      x: Math.random() * (this.canvasWidth - 40),
      y: -40,
      width: 40,
      height: 40,
      velocityY: 3 + Math.random() * 2,
      type: Math.random() > 0.5 ? 'spike' : 'rock'
    });
  },
  
  // Spawn power-up
  spawnPowerUp() {
    const types = ['slowTime', 'magnet', 'doublePoints'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    this.state.powerUps.push({
      x: Math.random() * (this.canvasWidth - 40),
      y: -40,
      width: 40,
      height: 40,
      velocityY: 2 + Math.random() * 1,
      type: type,
      color: this.getPowerUpColor(type)
    });
  },
  
  // Get power-up color
  getPowerUpColor(type) {
    switch (type) {
      case 'slowTime': return '#4cc9f0';
      case 'magnet': return '#f72585';
      case 'doublePoints': return '#ffd166';
      default: return '#ff6b6b';
    }
  },
  
  // Update hearts
  updateHearts(deltaTime) {
    for (let i = this.state.hearts.length - 1; i >= 0; i--) {
      const heart = this.state.hearts[i];
      
      // Update position
      heart.y += heart.velocityY;
      heart.rotation += heart.rotationSpeed;
      
      // Remove if off screen
      if (heart.y > this.canvasHeight) {
        this.state.hearts.splice(i, 1);
      }
    }
  },
  
  // Update obstacles
  updateObstacles(deltaTime) {
    for (let i = this.state.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.state.obstacles[i];
      
      // Update position
      obstacle.y += obstacle.velocityY;
      
      // Remove if off screen
      if (obstacle.y > this.canvasHeight) {
        this.state.obstacles.splice(i, 1);
      }
    }
  },
  
  // Update power-ups
  updatePowerUps(deltaTime) {
    for (let i = this.state.powerUps.length - 1; i >= 0; i--) {
      const powerUp = this.state.powerUps[i];
      
      // Update position
      powerUp.y += powerUp.velocityY;
      
      // Remove if off screen
      if (powerUp.y > this.canvasHeight) {
        this.state.powerUps.splice(i, 1);
      }
    }
  },
  
  // Update particles
  updateParticles(deltaTime) {
    for (let i = this.state.particles.length - 1; i >= 0; i--) {
      const particle = this.state.particles[i];
      
      // Update position
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      
      // Update life
      particle.life -= deltaTime;
      
      // Remove if dead
      if (particle.life <= 0) {
        this.state.particles.splice(i, 1);
      }
    }
  },
  
  // Update power-up timers
  updatePowerUpTimers(deltaTime) {
    for (const powerUp in this.state.powerUpTimers) {
      if (this.state.powerUpTimers[powerUp] > 0) {
        this.state.powerUpTimers[powerUp] -= deltaTime;
        if (this.state.powerUpTimers[powerUp] <= 0) {
          this.state.powerUpTimers[powerUp] = 0;
          this.deactivatePowerUp(powerUp);
        }
      }
    }
  },
  
  // Update special effects
  updateSpecialEffects(deltaTime) {
    for (let i = this.state.specialEffects.length - 1; i >= 0; i--) {
      const effect = this.state.specialEffects[i];
      
      // Update progress
      effect.progress += deltaTime * 0.5;
      
      // Remove if completed
      if (effect.progress >= 100) {
        this.state.specialEffects.splice(i, 1);
      }
    }
  },
  
  // Update particle effects
  updateParticleEffects(deltaTime) {
    for (let i = this.state.particleEffects.length - 1; i >= 0; i--) {
      const effect = this.state.particleEffects[i];
      
      // Update particles
      for (let j = effect.particles.length - 1; j >= 0; j--) {
        const particle = effect.particles[j];
        
        // Update position
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        
        // Update life
        particle.life -= deltaTime;
        
        // Remove if dead
        if (particle.life <= 0) {
          effect.particles.splice(j, 1);
        }
      }
      
      // Remove effect if no particles left
      if (effect.particles.length === 0) {
        this.state.particleEffects.splice(i, 1);
      }
    }
  },
  
  // Update combo state
  updateComboState() {
    // Reset combo if no hearts collected for a while
    if (this.state.comboCount > 0) {
      // Combo timeout logic could be added here
    }
  },
  
  // Check collisions
  checkCollisions() {
    if (!this.state.player) return;
    
    // Check heart collisions
    for (let i = this.state.hearts.length - 1; i >= 0; i--) {
      const heart = this.state.hearts[i];
      
      if (this.isColliding(this.state.player, heart)) {
        // Collect heart
        this.collectHeart(heart);
        this.state.hearts.splice(i, 1);
      }
    }
    
    // Check obstacle collisions
    for (let i = this.state.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.state.obstacles[i];
      
      if (this.isColliding(this.state.player, obstacle)) {
        // Hit obstacle
        this.hitObstacle(obstacle);
        this.state.obstacles.splice(i, 1);
      }
    }
    
    // Check power-up collisions
    for (let i = this.state.powerUps.length - 1; i >= 0; i--) {
      const powerUp = this.state.powerUps[i];
      
      if (this.isColliding(this.state.player, powerUp)) {
        // Collect power-up
        this.collectPowerUp(powerUp);
        this.state.powerUps.splice(i, 1);
      }
    }
    
    // Check magnet effect
    if (this.state.powerUpTimers.magnet > 0) {
      this.applyMagnetEffect();
    }
  },
  
  // Check if two objects are colliding
  isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  },
  
  // Collect heart
  collectHeart(heart) {
    // Calculate points
    let points = heart.points || 10;
    
    // Apply double points multiplier
    if (this.state.powerUpTimers.doublePoints > 0) {
      points *= this.settings.doublePointsMultiplier;
    }
    
    // Apply combo multiplier
    if (this.state.comboActive) {
      points *= this.settings.comboMultiplier;
    }
    
    // Increase score
    this.state.score += Math.round(points);
    
    // Increase combo count
    this.state.comboCount++;
    
    // Check for combo activation
    if (this.state.comboCount >= this.settings.comboThreshold && !this.state.comboActive) {
      this.state.comboActive = true;
      this.showComboEffect();
    }
    
    // Create particles
    this.createParticles(heart.x + heart.width/2, heart.y + heart.height/2, heart.color || '#ff6b6b');
    
    // Create special effects for special hearts
    if (heart.type !== 'normal') {
      this.createSpecialEffect('explosion', {
        x: heart.x + heart.width/2,
        y: heart.y + heart.height/2,
        radius: 50
      });
      
      // Show notification for special hearts
      this.showNotification(`+${points} poin dari hati ${heart.type}!`);
    }
    
    // Update UI
    this.updateUI();
  },
  
  // Hit obstacle
  hitObstacle(obstacle) {
    // Decrease lives
    this.state.lives--;
    
    // Create particles
    this.createParticles(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, '#ef476f');
    
    // Update UI
    this.updateUI();
    
    // Check game over
    if (this.state.lives <= 0) {
      this.gameOver();
    }
  },
  
  // Collect power-up
  collectPowerUp(powerUp) {
    // Activate power-up
    this.activatePowerUp(powerUp.type);
    
    // Create particles
    this.createParticles(powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2, powerUp.color);
  },
  
  // Apply magnet effect
  applyMagnetEffect() {
    if (!this.state.player) return;
    
    // Pull hearts toward player
    for (let i = 0; i < this.state.hearts.length; i++) {
      const heart = this.state.hearts[i];
      const dx = this.state.player.x + this.state.player.width/2 - (heart.x + heart.width/2);
      const dy = this.state.player.y + this.state.player.height/2 - (heart.y + heart.height/2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.settings.magnetRange) {
        const force = 0.5;
        heart.velocityY += (dy / distance) * force;
        heart.x += (dx / distance) * force;
      }
    }
  },
  
  // Activate power-up
  activatePowerUp(type) {
    // Set timer (5 seconds)
    this.state.powerUpTimers[type] = 5000;
    
    // Update UI
    this.updatePowerUpUI(type, true);
    
    // Show notification
    this.showNotification(`Power-up ${type} diaktifkan!`);
  },
  
  // Deactivate power-up
  deactivatePowerUp(type) {
    // Update UI
    this.updatePowerUpUI(type, false);
    
    // Show notification
    this.showNotification(`Power-up ${type} dinonaktifkan`);
  },
  
  // Update power-up UI
  updatePowerUpUI(type, active) {
    if (!this.elements.powerUps) return;
    
    this.elements.powerUps.forEach(powerUp => {
      if (powerUp.classList.contains(type.replace(/([A-Z])/g, '-$1').toLowerCase())) {
        powerUp.dataset.active = active;
      }
    });
  },
  
  // Create particles
  createParticles(x, y, color) {
    for (let i = 0; i < 20; i++) {
      this.state.particles.push({
        x: x,
        y: y,
        velocityX: (Math.random() - 0.5) * 10,
        velocityY: (Math.random() - 0.5) * 10,
        size: Math.random() * 5 + 2,
        color: color,
        life: Math.random() * 500 + 500
      });
    }
  },
  
  // Create special effect
  createSpecialEffect(type, params) {
    this.state.specialEffects.push({
      type: type,
      x: params.x || 0,
      y: params.y || 0,
      radius: params.radius || 30,
      progress: 0,
      multiplier: params.multiplier || 1,
      message: params.message || ''
    });
  },
  
  // Show combo effect
  showComboEffect() {
    this.createSpecialEffect('combo', {
      x: this.canvasWidth / 2,
      y: this.canvasHeight / 2,
      multiplier: this.settings.comboMultiplier
    });
    
    this.showNotification(`COMBO ACTIVATED! ${this.settings.comboMultiplier}x points`);
  },
  
  // Render game
  render() {
    // Clear canvas
    this.clearCanvas();
    
    // Draw background
    this.drawBackground();
    
    // Draw player
    this.drawPlayer();
    
    // Draw hearts
    this.drawHearts();
    
    // Draw obstacles
    this.drawObstacles();
    
    // Draw power-ups
    this.drawPowerUps();
    
    // Draw particles
    this.drawParticles();
  },
  
  // Clear canvas
  clearCanvas() {
    if (!this.ctx) return;
    
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  },
  
  // Draw background
  drawBackground() {
    if (!this.ctx) return;
    
    // Draw gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
    gradient.addColorStop(0, getComputedStyle(document.documentElement).getPropertyValue('--midnight-blue').trim());
    gradient.addColorStop(1, getComputedStyle(document.documentElement).getPropertyValue('--twilight-purple').trim());
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Draw stars
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
  
  // Draw player
  drawPlayer() {
    if (!this.ctx || !this.state.player) return;
    
    // Save context
    this.ctx.save();
    
    // Translate to player center
    this.ctx.translate(
      this.state.player.x + this.state.player.width/2,
      this.state.player.y + this.state.player.height/2
    );
    
    // Draw heart-shaped player
    this.ctx.beginPath();
    for (let i = 0; i <= Math.PI * 2; i += 0.01) {
      const x = 16 * Math.pow(Math.sin(i), 3);
      const y = -(13 * Math.cos(i) - 5 * Math.cos(2*i) - 2 * Math.cos(3*i) - Math.cos(4*i));
      if (i === 0) {
        this.ctx.moveTo(x * 0.8, y * 0.8);
      } else {
        this.ctx.lineTo(x * 0.8, y * 0.8);
      }
    }
    this.ctx.closePath();
    
    // Fill player
    const playerGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
    playerGradient.addColorStop(0, '#ff6b6b');
    playerGradient.addColorStop(1, '#6a0dad');
    this.ctx.fillStyle = playerGradient;
    this.ctx.fill();
    
    // Restore context
    this.ctx.restore();
  },
  
  // Draw hearts
  drawHearts() {
    if (!this.ctx) return;
    
    for (let i = 0; i < this.state.hearts.length; i++) {
      const heart = this.state.hearts[i];
      
      // Save context
      this.ctx.save();
      
      // Translate to heart center
      this.ctx.translate(heart.x + heart.width/2, heart.y + heart.height/2);
      
      // Rotate
      this.ctx.rotate(heart.rotation);
      
      // Apply glow effect for special hearts
      if (heart.type !== 'normal') {
        this.ctx.shadowColor = heart.color;
        this.ctx.shadowBlur = 15;
      }
      
      // Draw heart
      this.ctx.beginPath();
      for (let j = 0; j <= Math.PI * 2; j += 0.01) {
        const x = 16 * Math.pow(Math.sin(j), 3);
        const y = -(13 * Math.cos(j) - 5 * Math.cos(2*j) - 2 * Math.cos(3*j) - Math.cos(4*j));
        if (j === 0) {
          this.ctx.moveTo(x * 0.5, y * 0.5);
        } else {
          this.ctx.lineTo(x * 0.5, y * 0.5);
        }
      }
      this.ctx.closePath();
      
      // Fill heart with type-specific color
      this.ctx.fillStyle = heart.color || '#ff6b6b';
      this.ctx.fill();
      
      // Draw inner highlight for special hearts
      if (heart.type !== 'normal') {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(-5, -5, 4, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      // Restore context
      this.ctx.restore();
    }
  },
  
  // Draw obstacles
  drawObstacles() {
    if (!this.ctx) return;
    
    for (let i = 0; i < this.state.obstacles.length; i++) {
      const obstacle = this.state.obstacles[i];
      
      // Draw obstacle based on type
      if (obstacle.type === 'spike') {
        this.drawSpike(obstacle);
      } else {
        this.drawRock(obstacle);
      }
    }
  },
  
  // Draw spike
  drawSpike(obstacle) {
    if (!this.ctx) return;
    
    this.ctx.beginPath();
    this.ctx.moveTo(obstacle.x + obstacle.width/2, obstacle.y);
    this.ctx.lineTo(obstacle.x, obstacle.y + obstacle.height);
    this.ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
    this.ctx.closePath();
    
    this.ctx.fillStyle = '#ef476f';
    this.ctx.fill();
  },
  
  // Draw rock
  drawRock(obstacle) {
    if (!this.ctx) return;
    
    this.ctx.beginPath();
    this.ctx.arc(
      obstacle.x + obstacle.width/2,
      obstacle.y + obstacle.height/2,
      obstacle.width/2,
      0,
      Math.PI * 2
    );
    
    this.ctx.fillStyle = '#8d5e2a';
    this.ctx.fill();
  },
  
  // Draw power-ups
  drawPowerUps() {
    if (!this.ctx) return;
    
    for (let i = 0; i < this.state.powerUps.length; i++) {
      const powerUp = this.state.powerUps[i];
      
      // Draw power-up
      this.ctx.beginPath();
      this.ctx.arc(
        powerUp.x + powerUp.width/2,
        powerUp.y + powerUp.height/2,
        powerUp.width/2,
        0,
        Math.PI * 2
      );
      
      this.ctx.fillStyle = powerUp.color;
      this.ctx.fill();
      
      // Draw inner symbol
      this.ctx.beginPath();
      this.ctx.arc(
        powerUp.x + powerUp.width/2,
        powerUp.y + powerUp.height/2,
        powerUp.width/4,
        0,
        Math.PI * 2
      );
      
      this.ctx.fillStyle = 'white';
      this.ctx.fill();
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
      this.ctx.globalAlpha = particle.life / 1000;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    }
  },
  
  // Draw animated background
  drawBackground() {
    if (!this.ctx) return;
    
    // Draw gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Draw floating hearts in background
    this.ctx.save();
    this.ctx.globalAlpha = 0.1;
    
    // Create a pattern of floating hearts
    for (let i = 0; i < 20; i++) {
      const x = (i * 73) % this.canvasWidth;
      const y = (i * 37 + this.state.gameTime * 0.5) % (this.canvasHeight + 100) - 50;
      
      this.ctx.beginPath();
      for (let j = 0; j <= Math.PI * 2; j += 0.1) {
        const heartX = 16 * Math.pow(Math.sin(j), 3);
        const heartY = -(13 * Math.cos(j) - 5 * Math.cos(2*j) - 2 * Math.cos(3*j) - Math.cos(4*j));
        if (j === 0) {
          this.ctx.moveTo(x + heartX * 0.2, y + heartY * 0.2);
        } else {
          this.ctx.lineTo(x + heartX * 0.2, y + heartY * 0.2);
        }
      }
      this.ctx.closePath();
      this.ctx.fillStyle = '#ff6b6b';
      this.ctx.fill();
    }
    
    this.ctx.restore();
  },
  
  // Draw special effects
  drawSpecialEffect(effect) {
    if (!this.ctx) return;
    
    this.ctx.save();
    
    // Draw effect based on type
    switch (effect.type) {
      case 'explosion':
        this.drawExplosion(effect);
        break;
      case 'combo':
        this.drawComboEffect(effect);
        break;
      case 'achievement':
        this.drawAchievementEffect(effect);
        break;
    }
    
    this.ctx.restore();
  },
  
  // Draw explosion effect
  drawExplosion(effect) {
    if (!this.ctx) return;
    
    const radius = effect.radius * (effect.progress / 100);
    
    // Draw outer ring
    this.ctx.beginPath();
    this.ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(255, 107, 107, ' + (1 - effect.progress / 100) + ')';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    
    // Draw inner circle
    this.ctx.beginPath();
    this.ctx.arc(effect.x, effect.y, radius * 0.5, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(255, 209, 102, ' + (1 - effect.progress / 100) + ')';
    this.ctx.fill();
  },
  
  // Draw combo effect
  drawComboEffect(effect) {
    if (!this.ctx) return;
    
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = 'rgba(255, 107, 107, ' + (1 - effect.progress / 100) + ')';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('COMBO x' + effect.multiplier, effect.x, effect.y - effect.progress);
  },
  
  // Draw achievement effect
  drawAchievementEffect(effect) {
    if (!this.ctx) return;
    
    this.ctx.font = 'bold 18px Arial';
    this.ctx.fillStyle = 'rgba(76, 201, 240, ' + (1 - effect.progress / 100) + ')';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(effect.message, effect.x, effect.y - effect.progress);
  },
  
  // Update UI
  updateUI() {
    // Update score
    if (this.elements.scoreElement) {
      this.elements.scoreElement.textContent = this.state.score;
    }
    
    // Update lives
    if (this.elements.livesElement) {
      this.elements.livesElement.innerHTML = '';
      for (let i = 0; i < this.state.lives; i++) {
        const heart = document.createElement('span');
        heart.className = 'life-heart';
        heart.textContent = '❤️';
        this.elements.livesElement.appendChild(heart);
      }
    }
  },
  
  // Toggle pause
  togglePause() {
    this.state.isPaused = !this.state.isPaused;
    
    // Update pause button icon
    if (this.elements.pauseButton) {
      const icon = this.elements.pauseButton.querySelector('.pause-icon');
      if (this.state.isPaused) {
        icon.innerHTML = '<path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>';
      } else {
        icon.innerHTML = '<path d="M14,19H18V5H14M6,19H10V5H6V19Z"/>';
      }
    }
    
    // Show/hide pause screen
    if (this.elements.pauseScreen) {
      if (this.state.isPaused) {
        this.elements.pauseScreen.classList.remove('hidden');
      } else {
        this.elements.pauseScreen.classList.add('hidden');
      }
    }
  },
  
  // Resume game
  resumeGame() {
    this.state.isPaused = false;
    
    // Update pause button icon
    if (this.elements.pauseButton) {
      const icon = this.elements.pauseButton.querySelector('.pause-icon');
      icon.innerHTML = '<path d="M14,19H18V5H14M6,19H10V5H6V19Z"/>';
    }
    
    // Hide pause screen
    if (this.elements.pauseScreen) {
      this.elements.pauseScreen.classList.add('hidden');
    }
  },
  
  // Game over
  gameOver() {
    this.state.isRunning = false;
    
    // Update high score
    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
      this.saveHighScore();
    }
    
    // Update game over screen
    if (this.elements.finalScore) {
      this.elements.finalScore.textContent = this.state.score;
    }
    
    if (this.elements.highScore) {
      this.elements.highScore.textContent = this.state.highScore;
    }
    
    // Show game over screen
    if (this.elements.gameOverScreen) {
      this.elements.gameOverScreen.classList.remove('hidden');
    }
  },
  
  // Restart game
  restartGame() {
    this.startGame();
  },
  
  // Load high score
  loadHighScore() {
    const savedHighScore = localStorage.getItem('heartverse-game-highscore');
    if (savedHighScore) {
      this.state.highScore = parseInt(savedHighScore);
    }
  },
  
  // Save high score
  saveHighScore() {
    localStorage.setItem('heartverse-game-highscore', this.state.highScore.toString());
  },
  
  // Handle touch start
  handleTouchStart(e) {
    e.preventDefault();
    if (e.touches.length > 0) {
      this.handlePlayerMovement(e.touches[0].clientX);
      this.createTouchEffect(e.touches[0].clientX, e.touches[0].clientY);
    }
  },
  
  // Handle touch move
  handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length > 0) {
      this.handlePlayerMovement(e.touches[0].clientX);
      this.createTouchEffect(e.touches[0].clientX, e.touches[0].clientY);
    }
  },
  
  // Handle touch end
  handleTouchEnd(e) {
    e.preventDefault();
    if (this.state.player) {
      this.state.player.velocityX = 0;
    }
  },
  
  // Handle mouse down
  handleMouseDown(e) {
    this.handlePlayerMovement(e.clientX);
    this.createTouchEffect(e.clientX, e.clientY);
  },
  
  // Handle mouse move
  handleMouseMove(e) {
    if (e.buttons > 0) {
      this.handlePlayerMovement(e.clientX);
      this.createTouchEffect(e.clientX, e.clientY);
    }
  },
  
  // Handle mouse up
  handleMouseUp(e) {
    if (this.state.player) {
      this.state.player.velocityX = 0;
    }
  },
  
  // Handle player movement
  handlePlayerMovement(clientX) {
    if (!this.state.player) return;
    
    const rect = this.elements.canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    
    // Move player toward mouse/touch position
    const dx = mouseX - (this.state.player.x + this.state.player.width/2);
    this.state.player.velocityX = dx * 0.1;
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
      }, 3000);
    }, 3000);
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  Game.init();
  
  // Expose Game to global scope for debugging
  window.Game = Game;
});

/*
 * Heartverse Memory Matching Game
 * Interactive Memory Game with Touch Controls and Visual Effects
 */

// Memory Game Application Object
const MemoryGame = {
  // App state
  state: {
    isRunning: false,
    isPaused: false,
    score: 0,
    moves: 0,
    time: 0,
    timerInterval: null,
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: 8,
    gameOver: false
  },
  
  // Game settings
  settings: {
    gridSize: 4, // 4x4 grid
    cardSymbols: ['❤️', '💖', '✨', '🌟', '🎵', '🔐', '🔑', '🌙']
  },
  
  // DOM Elements
  elements: {
    scoreElement: null,
    movesElement: null,
    timerElement: null,
    memoryGrid: null,
    gameCompleteScreen: null,
    finalScoreElement: null,
    finalMovesElement: null,
    finalTimeElement: null,
    restartButton: null,
    playAgainButton: null,
    pauseButton: null,
    backButton: null
  },
  
  // Initialize the game
  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.startGame();
  },
  
  // Cache DOM elements
  cacheElements() {
    this.elements.scoreElement = document.getElementById('score');
    this.elements.movesElement = document.getElementById('moves');
    this.elements.timerElement = document.getElementById('timer');
    this.elements.memoryGrid = document.getElementById('memory-grid');
    this.elements.gameCompleteScreen = document.getElementById('game-complete');
    this.elements.finalScoreElement = document.getElementById('final-score');
    this.elements.finalMovesElement = document.getElementById('final-moves');
    this.elements.finalTimeElement = document.getElementById('final-time');
    this.elements.restartButton = document.getElementById('restart-button');
    this.elements.playAgainButton = document.getElementById('play-again-button');
    this.elements.pauseButton = document.getElementById('pause-button');
    this.elements.backButton = document.getElementById('back-button');
  },
  
  // Set up event listeners
  setupEventListeners() {
    // Restart button
    if (this.elements.restartButton) {
      this.elements.restartButton.addEventListener('click', () => {
        this.restartGame();
      });
    }
    
    // Play again button
    if (this.elements.playAgainButton) {
      this.elements.playAgainButton.addEventListener('click', () => {
        this.restartGame();
      });
    }
    
    // Pause button
    if (this.elements.pauseButton) {
      this.elements.pauseButton.addEventListener('click', () => {
        this.togglePause();
      });
    }
    
    // Back button
    if (this.elements.backButton) {
      this.elements.backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
  },
  
  // Start game
  startGame() {
    this.state.isRunning = true;
    this.state.isPaused = false;
    this.state.score = 0;
    this.state.moves = 0;
    this.state.time = 0;
    this.state.flippedCards = [];
    this.state.matchedPairs = 0;
    this.state.gameOver = false;
    
    // Clear timer
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
    }
    
    // Start timer
    this.startTimer();
    
    // Create cards
    this.createCards();
    
    // Render game
    this.render();
    
    // Update UI
    this.updateUI();
    
    // Hide game complete screen
    if (this.elements.gameCompleteScreen) {
      this.elements.gameCompleteScreen.classList.add('hidden');
    }
  },
  
  // Start timer
  startTimer() {
    this.state.timerInterval = setInterval(() => {
      if (this.state.isRunning && !this.state.isPaused) {
        this.state.time++;
        this.updateTimerDisplay();
      }
    }, 1000);
  },
  
  // Update timer display
  updateTimerDisplay() {
    if (!this.elements.timerElement) return;
    
    const minutes = Math.floor(this.state.time / 60).toString().padStart(2, '0');
    const seconds = (this.state.time % 60).toString().padStart(2, '0');
    this.elements.timerElement.textContent = `${minutes}:${seconds}`;
  },
  
  // Create cards
  createCards() {
    this.state.cards = [];
    
    // Create pairs of cards
    const symbols = [...this.settings.cardSymbols.slice(0, this.state.totalPairs), 
                     ...this.settings.cardSymbols.slice(0, this.state.totalPairs)];
    
    // Shuffle symbols
    this.shuffleArray(symbols);
    
    // Create card objects
    symbols.forEach((symbol, index) => {
      this.state.cards.push({
        id: index,
        symbol: symbol,
        isFlipped: false,
        isMatched: false
      });
    });
  },
  
  // Shuffle array (Fisher-Yates algorithm)
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  },
  
  // Render game
  render() {
    if (!this.elements.memoryGrid) return;
    
    // Clear grid
    this.elements.memoryGrid.innerHTML = '';
    
    // Create card elements
    this.state.cards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.className = 'memory-card';
      cardElement.dataset.id = card.id;
      
      if (card.isFlipped || card.isMatched) {
        cardElement.classList.add('flipped');
        cardElement.innerHTML = `
          <div class="card-front">${card.symbol}</div>
          <div class="card-back"></div>
        `;
      } else {
        cardElement.innerHTML = `
          <div class="card-front"></div>
          <div class="card-back"></div>
        `;
      }
      
      // Add event listener
      cardElement.addEventListener('click', () => {
        this.flipCard(card.id);
      });
      
      this.elements.memoryGrid.appendChild(cardElement);
    });
  },
  
  // Flip card
  flipCard(cardId) {
    // Don't flip if game is paused or over
    if (this.state.isPaused || this.state.gameOver) return;
    
    // Don't flip if already flipped or matched
    const card = this.state.cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    // Don't flip if two cards are already flipped
    if (this.state.flippedCards.length >= 2) return;
    
    // Flip the card
    card.isFlipped = true;
    this.state.flippedCards.push(cardId);
    
    // Render to show flipped card
    this.render();
    
    // Check for match if two cards are flipped
    if (this.state.flippedCards.length === 2) {
      this.state.moves++;
      this.updateUI();
      setTimeout(() => {
        this.checkForMatch();
      }, 1000);
    }
  },
  
  // Check for match
  checkForMatch() {
    const [firstCardId, secondCardId] = this.state.flippedCards;
    const firstCard = this.state.cards.find(c => c.id === firstCardId);
    const secondCard = this.state.cards.find(c => c.id === secondCardId);
    
    if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
      // Match found
      firstCard.isMatched = true;
      secondCard.isMatched = true;
      this.state.matchedPairs++;
      this.state.score += 100;
      
      // Show match effect
      this.showNotification('Pasangan ditemukan! +100 poin');
    } else {
      // No match, flip cards back
      firstCard.isFlipped = false;
      secondCard.isFlipped = false;
      this.state.score = Math.max(0, this.state.score - 10); // Deduct points for wrong match
    }
    
    // Clear flipped cards
    this.state.flippedCards = [];
    
    // Update UI
    this.updateUI();
    
    // Render to update card states
    this.render();
    
    // Check for game completion
    this.checkGameCompletion();
  },
  
  // Check game completion
  checkGameCompletion() {
    if (this.state.matchedPairs === this.state.totalPairs) {
      this.completeGame();
    }
  },
  
  // Complete game
  completeGame() {
    this.state.gameOver = true;
    this.state.isRunning = false;
    
    // Clear timer
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
    }
    
    // Calculate bonus score based on time and moves
    const timeBonus = Math.max(0, 1000 - this.state.time * 5);
    const moveBonus = Math.max(0, 500 - this.state.moves * 10);
    const bonusScore = timeBonus + moveBonus;
    this.state.score += bonusScore;
    
    // Update final stats
    if (this.elements.finalScoreElement) {
      this.elements.finalScoreElement.textContent = this.state.score;
    }
    if (this.elements.finalMovesElement) {
      this.elements.finalMovesElement.textContent = this.state.moves;
    }
    if (this.elements.finalTimeElement) {
      const minutes = Math.floor(this.state.time / 60).toString().padStart(2, '0');
      const seconds = (this.state.time % 60).toString().padStart(2, '0');
      this.elements.finalTimeElement.textContent = `${minutes}:${seconds}`;
    }
    
    // Show game complete screen with animation
    if (this.elements.gameCompleteScreen) {
      this.elements.gameCompleteScreen.classList.remove('hidden');
      const content = this.elements.gameCompleteScreen.querySelector('.game-complete-content');
      if (content) {
        content.style.animation = 'bounceIn 0.8s ease-out';
      }
    }
    
    // Show completion notification
    this.showNotification(`Selamat! Skor akhir: ${this.state.score}`);
  },
  
  // Restart game
  restartGame() {
    this.startGame();
  },
  
  // Toggle pause
  togglePause() {
    this.state.isPaused = !this.state.isPaused;
    
    // Update pause button icon
    if (this.elements.pauseButton) {
      const icon = this.elements.pauseButton.querySelector('.pause-icon');
      if (this.state.isPaused) {
        icon.innerHTML = '<path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>';
      } else {
        icon.innerHTML = '<path d="M14,19H18V5H14M6,19H10V5H6V19Z"/>';
      }
    }
  },
  
  // Update UI
  updateUI() {
    if (this.elements.scoreElement) {
      this.elements.scoreElement.textContent = this.state.score;
    }
    if (this.elements.movesElement) {
      this.elements.movesElement.textContent = this.state.moves;
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
    notification.style.backgroundColor = 'rgba(255, 107, 107, 0.9)'; // Heart color
    notification.style.color = 'white';
    notification.style.fontWeight = 'bold';
    notification.style.textAlign = 'center';
    notification.style.maxWidth = '90%';
    notification.style.width = 'auto';
    notification.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.9), rgba(255, 175, 204, 0.9))';
    notification.style.border = '2px solid #ff6b6b';
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in with heart effect
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(-50%) translateY(-10px) scale(1.1)';
    }, 10);
    
    // Add pulse animation
    setTimeout(() => {
      notification.style.animation = 'pulse 1s infinite';
    }, 500);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(-50%) translateY(0) scale(1)';
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
  MemoryGame.init();
  
  // Expose MemoryGame to global scope for debugging
  window.MemoryGame = MemoryGame;
});

/*
 * Heartverse Love Questions Game
 * Interactive Love Questions Game with Touch Controls and Visual Effects
 */

// Love Questions Game Application Object
const LoveQuestionsGame = {
  // App state
  state: {
    isRunning: false,
    isPaused: false,
    score: 0,
    currentQuestionIndex: 0,
    time: 0,
    timerInterval: null,
    questions: [],
    gameOver: false
  },
  
  // Game settings
  settings: {
    timePerQuestion: 15 // seconds
  },
  
  // DOM Elements
  elements: {
    scoreElement: null,
    questionNumberElement: null,
    timerElement: null,
    questionContainer: null,
    questionTextElement: null,
    answersContainer: null,
    gameCompleteScreen: null,
    finalScoreElement: null,
    finalQuestionsElement: null,
    finalTimeElement: null,
    restartButton: null,
    playAgainButton: null,
    pauseButton: null,
    backButton: null
  },
  
  // Love questions database
  questions: [
    {
      question: "Apa kata paling indah yang pernah dia ucapkan untukmu?",
      answers: ["Aku mencintaimu", "Kamu istimewa", "Aku sayang kamu", "Kamu segalanya"],
      correctAnswer: 0
    },
    {
      question: "Apa momen paling romantis yang pernah kalian alami?",
      answers: ["Perjalanan pertama", "Saat diajukan pacaran", "Hari valentine", "Saat menonton bintang"],
      correctAnswer: 3
    },
    {
      question: "Apa hal terkecil yang dia lakukan yang membuatmu bahagia?",
      answers: ["Memeluk erat", "Mengatakan selamat pagi", "Membuatkan kopi", "Semua jawaban benar"],
      correctAnswer: 3
    },
    {
      question: "Apa impian terdalammu yang ingin dia ketahui?",
      answers: ["Menikah", "Memiliki anak", "Melihat dunia", "Semua jawaban benar"],
      correctAnswer: 3
    },
    {
      question: "Apa hal yang paling kamu sukai dari dirinya?",
      answers: ["Ketulusan hatinya", "Kecerdasannya", "Ketampanannya", "Keromantisan"],
      correctAnswer: 0
    },
    {
      question: "Apa lagu yang paling mengingatkanmu padanya?",
      answers: ["Lagu pertama kalian", "Lagu pernikahan impian", "Lagu favorit pribadi", "Semua jawaban benar"],
      correctAnswer: 0
    },
    {
      question: "Apa tempat paling spesial bagi kalian berdua?",
      answers: ["Tempat pertama kali bertemu", "Tempat pertama kali berkencan", "Tempat favorit untuk berdua", "Semua jawaban benar"],
      correctAnswer: 3
    },
    {
      question: "Apa doa terdalammu untuk hubungan kalian?",
      answers: ["Selalu saling mencintai", "Selalu saling mendukung", "Selalu saling memaafkan", "Semua jawaban benar"],
      correctAnswer: 3
    }
  ],
  
  // Initialize the game
  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.startGame();
  },
  
  // Cache DOM elements
  cacheElements() {
    this.elements.scoreElement = document.getElementById('score');
    this.elements.questionNumberElement = document.getElementById('question-number');
    this.elements.timerElement = document.getElementById('timer');
    this.elements.questionContainer = document.getElementById('question-container');
    this.elements.questionTextElement = document.getElementById('question-text');
    this.elements.answersContainer = document.getElementById('answers-container');
    this.elements.gameCompleteScreen = document.getElementById('game-complete');
    this.elements.finalScoreElement = document.getElementById('final-score');
    this.elements.finalQuestionsElement = document.getElementById('final-questions');
    this.elements.finalTimeElement = document.getElementById('final-time');
    this.elements.restartButton = document.getElementById('restart-button');
    this.elements.playAgainButton = document.getElementById('play-again-button');
    this.elements.pauseButton = document.querySelector('.pause-button');
    this.elements.backButton = document.querySelector('.back-button');
  },
  
  // Set up event listeners
  setupEventListeners() {
    // Restart button
    if (this.elements.restartButton) {
      this.elements.restartButton.addEventListener('click', () => {
        this.restartGame();
      });
    }
    
    // Play again button
    if (this.elements.playAgainButton) {
      this.elements.playAgainButton.addEventListener('click', () => {
        this.restartGame();
      });
    }
    
    // Pause button
    if (this.elements.pauseButton) {
      this.elements.pauseButton.addEventListener('click', () => {
        this.togglePause();
      });
    }
    
    // Back button
    if (this.elements.backButton) {
      this.elements.backButton.addEventListener('click', () => {
        window.location.href = 'portal.html';
      });
    }
  },
  
  // Start game
  startGame() {
    this.state.isRunning = true;
    this.state.isPaused = false;
    this.state.score = 0;
    this.state.currentQuestionIndex = 0;
    this.state.time = 0;
    this.state.questions = [...this.questions];
    this.state.gameOver = false;
    
    // Shuffle questions
    this.shuffleArray(this.state.questions);
    
    // Clear timer
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
    }
    
    // Start timer
    this.startTimer();
    
    // Show first question
    this.showQuestion();
    
    // Update UI
    this.updateUI();
    
    // Hide game complete screen
    if (this.elements.gameCompleteScreen) {
      this.elements.gameCompleteScreen.classList.add('hidden');
    }
    
    // Show welcome message
    this.showNotification('❤️ Selamat datang di perjalanan cinta! ❤️');
  },
  
  // Start timer
  startTimer() {
    this.state.timerInterval = setInterval(() => {
      if (this.state.isRunning && !this.state.isPaused) {
        this.state.time++;
        this.updateTimerDisplay();
      }
    }, 1000);
  },
  
  // Update timer display
  updateTimerDisplay() {
    if (!this.elements.timerElement) return;
    
    const minutes = Math.floor(this.state.time / 60).toString().padStart(2, '0');
    const seconds = (this.state.time % 60).toString().padStart(2, '0');
    this.elements.timerElement.textContent = `${minutes}:${seconds}`;
  },
  
  // Show question
  showQuestion() {
    if (this.state.currentQuestionIndex >= this.state.questions.length) {
      this.completeGame();
      return;
    }
    
    const question = this.state.questions[this.state.currentQuestionIndex];
    
    // Update question text
    if (this.elements.questionTextElement) {
      this.elements.questionTextElement.textContent = question.question;
    }
    
    // Update question number
    if (this.elements.questionNumberElement) {
      this.elements.questionNumberElement.textContent = `${this.state.currentQuestionIndex + 1}/${this.state.questions.length}`;
    }
    
    // Clear answers container
    if (this.elements.answersContainer) {
      this.elements.answersContainer.innerHTML = '';
    }
    
    // Add animation to question container
    if (this.elements.questionContainer) {
      this.elements.questionContainer.style.animation = 'fadeInUp 0.5s ease-out';
      setTimeout(() => {
        this.elements.questionContainer.style.animation = '';
      }, 500);
    }
    
    // Create answer buttons with staggered animation delays
    question.answers.forEach((answer, index) => {
      const answerButton = document.createElement('button');
      answerButton.className = 'answer-button';
      answerButton.textContent = answer;
      answerButton.style.animationDelay = `${index * 0.1}s`;
      answerButton.addEventListener('click', () => {
        this.checkAnswer(index, question.correctAnswer);
      });
      
      if (this.elements.answersContainer) {
        this.elements.answersContainer.appendChild(answerButton);
      }
    });
  },
  
  // Check answer
  checkAnswer(selectedIndex, correctIndex) {
    // Disable all answer buttons
    if (this.elements.answersContainer) {
      const buttons = this.elements.answersContainer.querySelectorAll('.answer-button');
      buttons.forEach(button => {
        button.disabled = true;
      });
    }
    
    // Check if answer is correct
    if (selectedIndex === correctIndex) {
      // Correct answer
      this.state.score += 100;
      const correctMessages = [
        'Jawaban benar! Cintamu semakin dalam! ❤️',
        'Tepat sekali! Kamu memang mengerti cinta! 💕',
        'Luar biasa! Hatimu penuh dengan cinta! 💖'
      ];
      const randomCorrectMessage = correctMessages[Math.floor(Math.random() * correctMessages.length)];
      this.showNotification(randomCorrectMessage);
      
      // Highlight correct answer
      if (this.elements.answersContainer) {
        const correctButton = this.elements.answersContainer.children[correctIndex];
        if (correctButton) {
          correctButton.classList.add('correct');
        }
      }
    } else {
      // Wrong answer
      const wrongMessages = [
        'Jawaban salah, tapi cinta tetap indah! 💫',
        'Tidak apa, belajarlah mencintai lebih dalam! 🌹',
        'Masih banyak kesempatan untuk memahami cinta! 💝'
      ];
      const randomWrongMessage = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
      this.showNotification(randomWrongMessage);
      
      // Highlight correct and wrong answers
      if (this.elements.answersContainer) {
        const correctButton = this.elements.answersContainer.children[correctIndex];
        const wrongButton = this.elements.answersContainer.children[selectedIndex];
        
        if (correctButton) {
          correctButton.classList.add('correct');
        }
        
        if (wrongButton) {
          wrongButton.classList.add('wrong');
        }
      }
    }
    
    // Update UI
    this.updateUI();
    
    // Move to next question after delay
    setTimeout(() => {
      this.state.currentQuestionIndex++;
      this.showQuestion();
      
      // Add animation to question container
      if (this.elements.questionContainer) {
        this.elements.questionContainer.style.animation = 'fadeInUp 0.5s ease-out';
        setTimeout(() => {
          this.elements.questionContainer.style.animation = '';
        }, 500);
      }
    }, 2500);
  },
  
  // Complete game
  completeGame() {
    this.state.gameOver = true;
    this.state.isRunning = false;
    
    // Clear timer
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
    }
    
    // Update final stats
    if (this.elements.finalScoreElement) {
      this.elements.finalScoreElement.textContent = this.state.score;
    }
    if (this.elements.finalQuestionsElement) {
      this.elements.finalQuestionsElement.textContent = this.state.currentQuestionIndex;
    }
    if (this.elements.finalTimeElement) {
      const minutes = Math.floor(this.state.time / 60).toString().padStart(2, '0');
      const seconds = (this.state.time % 60).toString().padStart(2, '0');
      this.elements.finalTimeElement.textContent = `${minutes}:${seconds}`;
    }
    
    // Show game complete screen with animation
    if (this.elements.gameCompleteScreen) {
      this.elements.gameCompleteScreen.classList.remove('hidden');
      const content = this.elements.gameCompleteScreen.querySelector('.game-complete-content');
      if (content) {
        content.style.animation = 'bounceIn 0.8s ease-out';
      }
    }
    
    // Show completion notification with romantic message
    const messages = [
      "Cinta sejati tidak diukur dengan skor, tapi dengan kedalaman hati!",
      "Setiap pertanyaan adalah langkah menuju pemahaman yang lebih dalam!",
      "Cintamu telah melewati ujian dengan indah!"
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    this.showNotification(`❤️ ${randomMessage} Skor cintamu: ${this.state.score} ❤️`);
  },

  // Restart game
  restartGame() {
    this.startGame();
  },
  
  // Toggle pause
  togglePause() {
    this.state.isPaused = !this.state.isPaused;
    
    // Update pause button icon
    if (this.elements.pauseButton) {
      const icon = this.elements.pauseButton.querySelector('.pause-icon');
      if (this.state.isPaused) {
        icon.innerHTML = '<path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>';
      } else {
        icon.innerHTML = '<path d="M14,19H18V5H14M6,19H10V5H6V19Z"/>';
      }
    }
  },
  
  // Update UI
  updateUI() {
    if (this.elements.scoreElement) {
      this.elements.scoreElement.textContent = this.state.score;
    }
    if (this.elements.questionNumberElement) {
      this.elements.questionNumberElement.textContent = `${this.state.currentQuestionIndex + 1}/${this.state.questions.length}`;
    }
  },
  
  // Shuffle array (Fisher-Yates algorithm)
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
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
      }, 3000);
    }, 3000);
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  LoveQuestionsGame.init();
  
  // Expose LoveQuestionsGame to global scope for debugging
  window.LoveQuestionsGame = LoveQuestionsGame;
});
