import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/AudioPlayer.module.css';
import { useAudio } from '../hooks/useAudio';
import VibifyLogo from './VibifyLogo';

type AudioEffect = 'slowed-reverb' | 'nightcore' | 'bassboost' | 'flanger' | 'lofi' | '5d-audio' | 'none';

interface AudioPlayerProps {
  audioFile: File | null;
}

export const AudioPlayer = ({ audioFile }: AudioPlayerProps) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const {
    wavesurfer,
    isPlaying,
    currentTime,
    duration,
    activeEffect,
    setActiveEffect,
    togglePlayPause,
    handleFileUpload,
    downloadProcessedAudio
  } = useAudio(waveformRef as React.RefObject<HTMLDivElement>);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [processingEffect, setProcessingEffect] = useState<AudioEffect | null>(null);
  
  // Format time in MM:SS format
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get filename without extension
  const getFileName = (file: File | null) => {
    if (!file) return '';
    const name = file.name;
    return name.substring(0, name.lastIndexOf('.')) || name;
  };
  
  // Handle applying effect with loading state
  const applyEffect = (effect: AudioEffect) => {
    // If clicking the active effect, turn it off
    if (activeEffect === effect) {
      setProcessingEffect('none');
      setActiveEffect('none');
      setTimeout(() => setProcessingEffect(null), 500);
      return;
    }
    
    // Otherwise apply the new effect
    setProcessingEffect(effect);
    setActiveEffect(effect);
    
    // Clear processing state after a reasonable time
    setTimeout(() => setProcessingEffect(null), 500);
  };
  
  // Handle audio file upload
  useEffect(() => {
    if (audioFile && wavesurfer) {
      handleFileUpload(audioFile);
    }
  }, [audioFile, wavesurfer, handleFileUpload]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    
    if (!isDarkMode) {
      // Dark mode
      document.documentElement.style.setProperty('--color-background', '#121212');
      document.documentElement.style.setProperty('--color-text-primary', '#FFFFFF');
      document.documentElement.style.setProperty('--color-text-secondary', '#B0B0B0');
      document.documentElement.style.setProperty('--color-text-tertiary', 'rgba(255, 255, 255, 0.7)');
      document.documentElement.style.setProperty('--color-border', 'rgba(255, 255, 255, 0.1)');
      document.documentElement.style.setProperty('--color-slider-background', '#333333');
      document.documentElement.style.setProperty('--playbutton-background', '#2A2A2A');
      document.documentElement.style.setProperty('--playbutton-icon', '#FFFFFF');
      document.documentElement.style.setProperty('--effect-background', '#2A2A2A');
      document.documentElement.style.setProperty('--effect-text', '#E0E0E0');
      document.documentElement.style.setProperty('--frame-background', '#1E1E1E');
      document.documentElement.style.setProperty('--card-background', '#232323');
      document.documentElement.style.setProperty('--card-shadow', '0px 0px 30px -10px rgba(0, 0, 0, 0.3)');
      document.documentElement.style.setProperty('--toggle-background', '#555555');
    } else {
      // Light mode
      document.documentElement.style.setProperty('--color-background', '#FFFFFF');
      document.documentElement.style.setProperty('--color-text-primary', '#424242');
      document.documentElement.style.setProperty('--color-text-secondary', '#676767');
      document.documentElement.style.setProperty('--color-text-tertiary', 'rgba(66, 66, 66, 0.75)');
      document.documentElement.style.setProperty('--color-border', 'rgba(0, 0, 0, 0.1)');
      document.documentElement.style.setProperty('--color-slider-background', '#F0F0F0');
      document.documentElement.style.setProperty('--playbutton-background', '#FFFFFF');
      document.documentElement.style.setProperty('--playbutton-icon', '#4B4B4B');
      document.documentElement.style.setProperty('--effect-background', 'white');
      document.documentElement.style.setProperty('--effect-text', 'var(--color-text-primary)');
      document.documentElement.style.setProperty('--frame-background', '#FFFFFF');
      document.documentElement.style.setProperty('--card-background', '#FFFFFF');
      document.documentElement.style.setProperty('--card-shadow', '0px 0px 30px -10px rgba(0, 0, 0, 0.06)');
      document.documentElement.style.setProperty('--toggle-background', '#E5EAF0');
    }
  };
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <VibifyLogo />
        </div>
      </header>
      
      <main className={styles.mainContent}>
        <div className={styles.songInfo}>
          <h1 className={styles.songTitle}>{getFileName(audioFile)}</h1>
          <p className={styles.songArtist}>Apply audio effects to vibe</p>
        </div>
        
        <div className={styles.playerCard}>
          <div className={styles.effectsContainer}>
            <motion.button
              className={`${styles.effect} ${styles.redEffect} ${activeEffect === 'slowed-reverb' ? styles.activeEffect : ''} ${processingEffect === 'slowed-reverb' ? styles.processingEffect : ''}`}
              onClick={() => applyEffect('slowed-reverb')}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              disabled={processingEffect !== null}
            >
              <span className={styles.effectIcon}>
                {processingEffect === 'slowed-reverb' ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    ⏳
                  </motion.div>
                ) : (
                  <span role="img" aria-label="dying rose">🥀</span>
                )}
              </span>
              Slowed & Reverb
            </motion.button>
            
            <motion.button
              className={`${styles.effect} ${styles.greenEffect} ${activeEffect === 'nightcore' ? styles.activeEffect : ''}`}
              onClick={() => applyEffect('nightcore')}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              disabled={processingEffect !== null}
            >
              <span className={styles.effectIcon}>
                {processingEffect === 'nightcore' ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    ⏳
                  </motion.div>
                ) : (
                  <span role="img" aria-label="sparkles">✨</span>
                )}
              </span>
              Nightcore
            </motion.button>
            
            <motion.button
              className={`${styles.effect} ${styles.redEffect} ${activeEffect === 'bassboost' ? styles.activeEffect : ''}`}
              onClick={() => applyEffect('bassboost')}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              disabled={processingEffect !== null}
            >
              <span className={styles.effectIcon}>
                {processingEffect === 'bassboost' ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    ⏳
                  </motion.div>
                ) : (
                  <span role="img" aria-label="speaker">🔊</span>
                )}
              </span>
              Bassboost
            </motion.button>
            
            <motion.button
              className={`${styles.effect} ${styles.yellowEffect} ${activeEffect === 'flanger' ? styles.activeEffect : ''}`}
              onClick={() => applyEffect('flanger')}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              disabled={processingEffect !== null}
            >
              <span className={styles.effectIcon}>
                {processingEffect === 'flanger' ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    ⏳
                  </motion.div>
                ) : (
                  <span role="img" aria-label="electric plug">🔌</span>
                )}
              </span>
              Flanger
            </motion.button>
            
            <motion.button
              className={`${styles.effect} ${styles.purpleEffect} ${activeEffect === 'lofi' ? styles.activeEffect : ''}`}
              onClick={() => applyEffect('lofi')}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              disabled={processingEffect !== null}
            >
              <span className={styles.effectIcon}>
                {processingEffect === 'lofi' ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    ⏳
                  </motion.div>
                ) : (
                  <span role="img" aria-label="vinyl record">💿</span>
                )}
              </span>
              Lo-fi
            </motion.button>
            
            <motion.button
              className={`${styles.effect} ${styles.orangeEffect} ${activeEffect === '5d-audio' ? styles.activeEffect : ''}`}
              onClick={() => applyEffect('5d-audio')}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              disabled={processingEffect !== null}
            >
              <span className={styles.effectIcon}>
                {processingEffect === '5d-audio' ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    ⏳
                  </motion.div>
                ) : (
                  <span role="img" aria-label="globe">🌍</span>
                )}
              </span>
              5D Audio
            </motion.button>
          </div>
          
          <div className={styles.waveformContainer} ref={waveformRef} />
          
          <div className={styles.timelineContainer}>
            <div className={styles.progressContainer}>
              <div className={styles.progressBackground}></div>
              <div 
                className={styles.progressFill} 
                style={{ 
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` 
                }}
              ></div>
            </div>
            
            <div className={styles.timeDisplay}>
              <div>{formatTime(currentTime)}</div>
              <div>{formatTime(duration)}</div>
            </div>
          </div>
          
          <div className={styles.controlsContainer}>
            <motion.button
              className={styles.playButton}
              onClick={togglePlayPause}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div
                    key="pause"
                    className={styles.playIcon}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="6" y="4" width="4" height="16" rx="1" fill="#4B4B4B" />
                      <rect x="14" y="4" width="4" height="16" rx="1" fill="#4B4B4B" />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    className={styles.playIcon}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5.14275V18.8572C8 19.391 8.627 19.7204 9.068 19.4281L20.5 12.0709C20.8814 11.8158 20.8814 11.2842 20.5 11.0291L9.068 3.67188C8.627 3.37962 8 3.70899 8 4.24281V5.14275Z" fill="#4B4B4B" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className={styles.rainbowBorder}></div>
            </motion.button>
          </div>
          
          <div className={styles.exportSection}>
            <motion.button
              className={styles.downloadButton}
              onClick={downloadProcessedAudio}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download
            </motion.button>
          </div>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <div className={styles.footerInfo}>
          <div className={styles.footerTitle}>vibesoft</div>
          <div className={styles.footerLinks}>
            Contact vibify.app@gmail.com<br />
            About
          </div>
        </div>
        
        <div 
          className={styles.darkModeToggle} 
          onClick={toggleDarkMode}
        >
          <motion.div 
            className={`${styles.toggleCircle} ${isDarkMode ? styles.active : ''}`}
            animate={{ x: isDarkMode ? 20 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {isDarkMode ? (
                <path d="M21.5287 14.9289C21.3687 14.9889 21.1987 14.9989 21.0387 14.9989C19.4787 14.9989 18.0987 13.9089 17.7487 12.3689C17.3087 10.4189 18.5487 8.53893 20.4987 8.11893C20.9587 8.01893 21.3987 8.05893 21.8287 8.16893C21.2687 5.96893 19.9387 4.04893 18.0787 2.68893C16.2087 1.31893 13.9787 0.63893 11.6987 0.77893C6.76867 1.08893 2.71867 5.32893 2.57867 10.2689C2.41867 15.9989 7.10867 20.7989 12.8087 20.9989C15.5587 21.0989 18.0887 20.0489 19.9587 18.2989C21.4787 16.8789 22.5187 14.9989 22.9987 12.8689C22.5187 13.4889 22.0887 14.3089 21.5287 14.9289Z" fill="#18191B"/>
              ) : (
                <>
                  <circle cx="12" cy="12" r="5" stroke="#18191B" strokeWidth="2"/>
                  <path d="M12 2V4" stroke="#18191B" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 20V22" stroke="#18191B" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4 12L2 12" stroke="#18191B" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M22 12L20 12" stroke="#18191B" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M19.7782 4.22183L18.364 5.63604" stroke="#18191B" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M5.63608 18.364L4.22187 19.7782" stroke="#18191B" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M19.7782 19.7782L18.364 18.364" stroke="#18191B" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M5.63608 5.63604L4.22187 4.22183" stroke="#18191B" strokeWidth="2" strokeLinecap="round"/>
                </>
              )}
            </svg>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default AudioPlayer; 