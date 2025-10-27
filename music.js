/*
 * Heartverse Music Player
 * Interactive Music Player with Visualizer and Playlist
 */

// Music Player Application Object
const MusicPlayer = {
  // App state
  state: {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    currentSongIndex: 0,
    volume: 0.7,
    isVisualizerActive: true,
    audioContext: null,
    analyser: null,
    audio: null,
    visualizationId: null
  },
  
  // DOM Elements
  elements: {
    backButton: null,
    visualizerToggle: null,
    albumArt: null,
    songTitle: null,
    songArtist: null,
    timeCurrent: null,
    timeDuration: null,
    progressBar: null,
    progressFill: null,
    playPauseButton: null,
    prevButton: null,
    nextButton: null,
    shuffleButton: null,
    repeatButton: null,
    volumeIcon: null,
    volumeSlider: null,
    volumeFill: null,
    visualizer: null,
    playlistItems: null
  },
  
  // Playlist data
  playlist: [
    {
      title: "Lagu Cinta Abadi",
      artist: "Penyanyi",
      file: "./assets/lagu/H1.mp3",
      duration: "3:45"
    },
    {
      title: "Hatiku Hanya Untukmu",
      artist: "Penyanyi",
      file: "./assets/lagu/H2.mp3",
      duration: "4:20"
    },
    {
      title: "Bintang di Langit",
      artist: "Penyanyi",
      file: "./assets/lagu/H3.mp3",
      duration: "3:15"
    },
    {
      title: "Kisah Cinta Kita",
      artist: "Penyanyi",
      file: "./assets/lagu/H4.mp3",
      duration: "5:10"
    },
    {
      title: "Matahari Terbenam",
      artist: "Penyanyi",
      file: "./assets/lagu/H5.mp3",
      duration: "4:05"
    },
    {
      title: "Surga di Hatimu",
      artist: "Penyanyi",
      file: "./assets/lagu/H6.mp3",
      duration: "3:50"
    }
  ],
  
  // Initialize the music player
  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.setupAudio();
    this.loadSong(this.state.currentSongIndex);
    this.updatePlaylistUI();
  },
  
  // Cache DOM elements
  cacheElements() {
    this.elements.backButton = document.querySelector('.back-button');
    this.elements.visualizerToggle = document.querySelector('.visualizer-toggle');
    this.elements.albumArt = document.querySelector('.vinyl');
    this.elements.songTitle = document.querySelector('.song-title');
    this.elements.songArtist = document.querySelector('.song-artist');
    this.elements.timeCurrent = document.querySelector('.time-current');
    this.elements.timeDuration = document.querySelector('.time-duration');
    this.elements.progressBar = document.querySelector('.progress-bar');
    this.elements.progressFill = document.querySelector('.progress-fill');
    this.elements.playPauseButton = document.querySelector('.play-pause-button');
    this.elements.prevButton = document.querySelector('.prev-button');
    this.elements.nextButton = document.querySelector('.next-button');
    this.elements.shuffleButton = document.querySelector('.shuffle-button');
    this.elements.repeatButton = document.querySelector('.repeat-button');
    this.elements.volumeIcon = document.querySelector('.volume-icon');
    this.elements.volumeSlider = document.querySelector('.volume-slider');
    this.elements.volumeFill = document.querySelector('.volume-fill');
    this.elements.visualizer = document.getElementById('visualizer');
    this.elements.playlistItems = document.querySelectorAll('.playlist-item');
  },
  
  // Set up event listeners
  setupEventListeners() {
    // Back button
    if (this.elements.backButton) {
      this.elements.backButton.addEventListener('click', () => {
        window.location.href = 'portal.html';
      });
    }
    
    // Visualizer toggle
    if (this.elements.visualizerToggle) {
      this.elements.visualizerToggle.addEventListener('click', () => {
        this.toggleVisualizer();
      });
    }
    
    // Progress bar
    if (this.elements.progressBar) {
      this.elements.progressBar.addEventListener('click', (e) => {
        this.seekTo(e);
      });
    }
    
    // Play/Pause button
    if (this.elements.playPauseButton) {
      this.elements.playPauseButton.addEventListener('click', () => {
        this.togglePlayPause();
      });
    }
    
    // Previous button
    if (this.elements.prevButton) {
      this.elements.prevButton.addEventListener('click', () => {
        this.prevSong();
      });
    }
    
    // Next button
    if (this.elements.nextButton) {
      this.elements.nextButton.addEventListener('click', () => {
        this.nextSong();
      });
    }
    
    // Shuffle button
    if (this.elements.shuffleButton) {
      this.elements.shuffleButton.addEventListener('click', () => {
        this.toggleShuffle();
      });
    }
    
    // Repeat button
    if (this.elements.repeatButton) {
      this.elements.repeatButton.addEventListener('click', () => {
        this.toggleRepeat();
      });
    }
    
    // Volume slider
    if (this.elements.volumeSlider) {
      this.elements.volumeSlider.addEventListener('click', (e) => {
        this.setVolume(e);
      });
    }
    
    // Playlist items
    if (this.elements.playlistItems) {
      this.elements.playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
          this.loadSong(index);
        });
      });
    }
  },
  
  // Set up audio
  setupAudio() {
    this.state.audio = new Audio();
    
    // Set up audio context for visualization
    try {
      this.state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.state.analyser = this.state.audioContext.createAnalyser();
      this.state.analyser.fftSize = 256;
      
      // Connect audio to analyser
      const source = this.state.audioContext.createMediaElementSource(this.state.audio);
      source.connect(this.state.analyser);
      this.state.analyser.connect(this.state.audioContext.destination);
    } catch (e) {
      console.warn('Web Audio API is not supported in this browser');
    }
    
    // Audio event listeners
    this.state.audio.addEventListener('timeupdate', () => {
      this.updateProgress();
    });
    
    this.state.audio.addEventListener('ended', () => {
      this.nextSong();
    });
    
    this.state.audio.addEventListener('play', () => {
      this.state.isPlaying = true;
      this.updatePlayPauseButton();
      this.startVisualization();
      this.rotateAlbumArt(true);
    });
    
    this.state.audio.addEventListener('pause', () => {
      this.state.isPlaying = false;
      this.updatePlayPauseButton();
      this.stopVisualization();
      this.rotateAlbumArt(false);
    });
    
    // Set initial volume
    this.state.audio.volume = this.state.volume;
    this.updateVolumeUI();
  },
  
  // Load song
  loadSong(index) {
    if (index < 0 || index >= this.playlist.length) return;
    
    // Pause current song
    if (this.state.audio) {
      this.state.audio.pause();
    }
    
    // Update current song index
    this.state.currentSongIndex = index;
    
    // Add animation to player container
    if (document.querySelector('.player-container')) {
      const playerContainer = document.querySelector('.player-container');
      playerContainer.style.animation = 'bounceIn 0.5s ease-out';
      setTimeout(() => {
        playerContainer.style.animation = '';
      }, 500);
    }
    
    // Update UI
    const song = this.playlist[index];
    if (this.elements.songTitle) {
      this.elements.songTitle.textContent = song.title;
      this.elements.songTitle.style.animation = 'fadeIn 0.3s ease-out';
    }
    if (this.elements.songArtist) {
      this.elements.songArtist.textContent = song.artist;
      this.elements.songArtist.style.animation = 'fadeIn 0.3s ease-out';
    }
    if (this.elements.timeDuration) {
      this.elements.timeDuration.textContent = song.duration;
    }
    
    // Set audio source
    this.state.audio.src = song.file;
    
    // Update playlist UI
    this.updatePlaylistUI();
    
    // Play the song
    this.play();
  },
  
  // Play song
  play() {
    // Resume audio context if needed
    if (this.state.audioContext && this.state.audioContext.state === 'suspended') {
      this.state.audioContext.resume();
    }
    
    this.state.audio.play()
      .then(() => {
        console.log('Playback started successfully');
      })
      .catch((e) => {
        console.error('Playback failed:', e);
        this.showNotification('Gagal memutar lagu. Silakan coba lagi.');
      });
  },
  
  // Toggle play/pause
  togglePlayPause() {
    if (this.state.isPlaying) {
      this.state.audio.pause();
      
      // Add animation to play button
      if (this.elements.playPauseButton) {
        this.elements.playPauseButton.style.animation = 'pulse 0.3s ease-in-out';
        setTimeout(() => {
          this.elements.playPauseButton.style.animation = '';
        }, 300);
      }
    } else {
      this.play();
      
      // Add animation to play button
      if (this.elements.playPauseButton) {
        this.elements.playPauseButton.style.animation = 'pulse 0.3s ease-in-out';
        setTimeout(() => {
          this.elements.playPauseButton.style.animation = '';
        }, 300);
      }
    }
  },
  
  // Update play/pause button
  updatePlayPauseButton() {
    if (!this.elements.playPauseButton) return;
    
    const playIcon = this.elements.playPauseButton.querySelector('.play-icon');
    if (playIcon) {
      if (this.state.isPlaying) {
        playIcon.innerHTML = '<path d="M14,19H18V5H14M6,19H10V5H6V19Z"/>';
      } else {
        playIcon.innerHTML = '<path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>';
      }
    }
  },
  
  // Previous song
  prevSong() {
    let newIndex = this.state.currentSongIndex - 1;
    if (newIndex < 0) {
      newIndex = this.playlist.length - 1;
    }
    this.loadSong(newIndex);
  },
  
  // Next song
  nextSong() {
    let newIndex = this.state.currentSongIndex + 1;
    if (newIndex >= this.playlist.length) {
      newIndex = 0;
    }
    this.loadSong(newIndex);
  },
  
  // Toggle shuffle
  toggleShuffle() {
    this.showNotification('Fitur shuffle akan segera tersedia!');
  },
  
  // Toggle repeat
  toggleRepeat() {
    this.showNotification('Fitur repeat akan segera tersedia!');
  },
  
  // Update progress
  updateProgress() {
    if (!this.state.audio) return;
    
    this.state.currentTime = this.state.audio.currentTime;
    this.state.duration = this.state.audio.duration || 0;
    
    // Update time display
    if (this.elements.timeCurrent) {
      this.elements.timeCurrent.textContent = this.formatTime(this.state.currentTime);
    }
    
    // Update progress bar
    if (this.elements.progressFill && this.state.duration > 0) {
      const progress = (this.state.currentTime / this.state.duration) * 100;
      this.elements.progressFill.style.width = `${progress}%`;
    }
  },
  
  // Seek to position
  seekTo(e) {
    if (!this.elements.progressBar || !this.state.audio || this.state.duration <= 0) return;
    
    const progressBar = this.elements.progressBar;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    this.state.audio.currentTime = pos * this.state.duration;
  },
  
  // Set volume
  setVolume(e) {
    if (!this.elements.volumeSlider) return;
    
    const volumeSlider = this.elements.volumeSlider;
    const rect = volumeSlider.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    this.state.volume = Math.max(0, Math.min(1, pos));
    this.state.audio.volume = this.state.volume;
    this.updateVolumeUI();
  },
  
  // Update volume UI
  updateVolumeUI() {
    if (this.elements.volumeFill) {
      this.elements.volumeFill.style.width = `${this.state.volume * 100}%`;
    }
  },
  
  // Rotate album art
  rotateAlbumArt(rotate) {
    if (!this.elements.albumArt) return;
    
    if (rotate) {
      this.elements.albumArt.classList.add('vinyl-playing');
    } else {
      this.elements.albumArt.classList.remove('vinyl-playing');
    }
  },
  
  // Toggle visualizer
  toggleVisualizer() {
    this.state.isVisualizerActive = !this.state.isVisualizerActive;
    
    // Add animation to visualizer toggle button
    if (this.elements.visualizerToggle) {
      this.elements.visualizerToggle.style.animation = 'pulse 0.3s ease-in-out';
      setTimeout(() => {
        this.elements.visualizerToggle.style.animation = '';
      }, 300);
    }
    
    // Add animation to visualizer container
    if (this.elements.visualizer) {
      const container = this.elements.visualizer.parentElement;
      if (container) {
        container.style.animation = this.state.isVisualizerActive ? 'fadeIn 0.5s ease-out' : 'fadeOut 0.5s ease-out';
        setTimeout(() => {
          container.style.animation = '';
        }, 500);
      }
    }
    
    this.showNotification(
      this.state.isVisualizerActive 
        ? 'Visualizer diaktifkan' 
        : 'Visualizer dinonaktifkan'
    );
  },
  
  // Start visualization
  startVisualization() {
    if (!this.state.isVisualizerActive || !this.state.analyser || !this.elements.visualizer) return;
    
    const canvas = this.elements.visualizer;
    const ctx = canvas.getContext('2d');
    const bufferLength = this.state.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    const draw = () => {
      if (!this.state.isVisualizerActive || !this.state.isPlaying) return;
      
      this.state.visualizationId = requestAnimationFrame(draw);
      
      this.state.analyser.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      
      // Draw frequency bars
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 255 * canvas.height;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(1, '#ffafcc');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
      
      // Draw heart particles
      this.drawHeartParticles(ctx, canvas);
    };
    
    draw();
  },
  
  // Draw heart particles for visualization
  drawHeartParticles(ctx, canvas) {
    // Create floating hearts with animation
    for (let i = 0; i < 8; i++) {
      const time = Date.now() / 1000;
      const x = (i * 50 + time * 20) % canvas.width;
      const y = (Math.sin(time + i) * 30 + canvas.height / 2);
      const size = Math.sin(time * 2 + i) * 5 + 10;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(
        x + size, y - size,
        x + size * 2, y,
        x + size, y + size
      );
      ctx.bezierCurveTo(
        x, y + size * 2,
        x - size, y + size,
        x, y
      );
      
      // Create gradient for heart
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, `rgba(255, 107, 107, ${Math.sin(time + i) * 0.3 + 0.4})`);
      gradient.addColorStop(1, `rgba(255, 175, 204, ${Math.sin(time + i + Math.PI) * 0.2 + 0.2})`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  },
  
  // Stop visualization
  stopVisualization() {
    if (this.state.visualizationId) {
      cancelAnimationFrame(this.state.visualizationId);
      this.state.visualizationId = null;
    }
  },
  
  // Update playlist UI
  updatePlaylistUI() {
    if (!this.elements.playlistItems) return;
    
    this.elements.playlistItems.forEach((item, index) => {
      item.classList.remove('active');
      if (index === this.state.currentSongIndex) {
        item.classList.add('active');
        
        // Add animation to active item
        item.style.animation = 'pulse 0.3s ease-in-out';
        setTimeout(() => {
          item.style.animation = '';
        }, 300);
      }
    });
  },
  
  // Format time (seconds to MM:SS)
  formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
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
  MusicPlayer.init();
  
  // Expose MusicPlayer to global scope for debugging
  window.MusicPlayer = MusicPlayer;
});