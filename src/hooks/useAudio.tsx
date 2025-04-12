import { useState, useRef, useEffect, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';

type AudioEffect = 'slowed-reverb' | 'nightcore' | 'bassboost' | 'flanger' | 'lofi' | '5d-audio' | 'none';

interface UseAudioReturn {
  wavesurfer: WaveSurfer | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  activeEffect: AudioEffect;
  setActiveEffect: (effect: AudioEffect) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  handleFileUpload: (file: File) => void;
  seek: (time: number) => void;
  downloadProcessedAudio: () => void;
}

export const useAudio = (containerRef: React.RefObject<HTMLDivElement>): UseAudioReturn => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [activeEffect, setActiveEffect] = useState<AudioEffect>('none');
  
  const audioContext = useRef<AudioContext | null>(null);
  const sourceNode = useRef<AudioBufferSourceNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const biquadFilter = useRef<BiquadFilterNode | null>(null);
  const convolver = useRef<ConvolverNode | null>(null);
  const delayNode = useRef<DelayNode | null>(null);
  const audioBuffer = useRef<AudioBuffer | null>(null);
  const processedBuffer = useRef<AudioBuffer | null>(null);

  // Initialize WaveSurfer
  useEffect(() => {
    if (containerRef.current && !wavesurfer) {
      const ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: '#E6E6E6',
        progressColor: 'rgba(123, 71, 233, 0.7)',
        cursorColor: 'transparent',
        barWidth: 2,
        barGap: 1,
        barRadius: 3,
        height: 80,
        normalize: true,
      });

      ws.on('ready', () => {
        setDuration(ws.getDuration());
      });

      ws.on('audioprocess', () => {
        setCurrentTime(ws.getCurrentTime());
      });

      // Use timeupdate instead of seek event
      ws.on('timeupdate', () => {
        setCurrentTime(ws.getCurrentTime());
      });

      ws.on('play', () => {
        setIsPlaying(true);
      });

      ws.on('pause', () => {
        setIsPlaying(false);
      });

      setWavesurfer(ws);

      return () => {
        ws.destroy();
      };
    }
  }, [containerRef]);

  // Initialize Web Audio API
  useEffect(() => {
    audioContext.current = new AudioContext();
    gainNode.current = audioContext.current.createGain();
    biquadFilter.current = audioContext.current.createBiquadFilter();
    convolver.current = audioContext.current.createConvolver();
    delayNode.current = audioContext.current.createDelay(5.0);

    return () => {
      if (audioContext.current && audioContext.current.state !== 'closed') {
        audioContext.current.close();
      }
    };
  }, []);

  const togglePlayPause = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  }, [wavesurfer]);

  const seek = useCallback(
    (time: number) => {
      if (wavesurfer) {
        wavesurfer.seekTo(time / duration);
      }
    },
    [wavesurfer, duration]
  );

  const handleFileUpload = useCallback(
    (file: File) => {
      if (wavesurfer) {
        wavesurfer.loadBlob(file);
        
        // Also load the file into our audio context for processing
        const reader = new FileReader();
        reader.onload = async (e) => {
          if (e.target?.result && audioContext.current) {
            try {
              const arrayBuffer = e.target.result as ArrayBuffer;
              audioBuffer.current = await audioContext.current.decodeAudioData(arrayBuffer);
            } catch (error) {
              console.error('Error decoding audio data:', error);
            }
          }
        };
        reader.readAsArrayBuffer(file);
      }
    },
    [wavesurfer]
  );

  // Apply audio effects
  useEffect(() => {
    const applyEffect = async () => {
      if (!audioBuffer.current || !audioContext.current) return;
      
      // Save the current playback state and position
      const wasPlaying = isPlaying;
      const currentPos = wavesurfer ? wavesurfer.getCurrentTime() / wavesurfer.getDuration() : 0;
      
      // Reset processed buffer
      processedBuffer.current = null;
      
      // Create a new buffer for processing
      const newBuffer = audioContext.current.createBuffer(
        audioBuffer.current.numberOfChannels,
        audioBuffer.current.length,
        audioBuffer.current.sampleRate
      );
      
      // Copy original data to new buffer
      for (let channel = 0; channel < audioBuffer.current.numberOfChannels; channel++) {
        const channelData = audioBuffer.current.getChannelData(channel);
        newBuffer.copyToChannel(channelData, channel);
      }
      
      // Create an offline audio context for processing
      const offlineCtx = new OfflineAudioContext(
        newBuffer.numberOfChannels,
        newBuffer.length,
        newBuffer.sampleRate
      );
      
      // Create source, gain and filter nodes for offline processing
      const offlineSource = offlineCtx.createBufferSource();
      const offlineGain = offlineCtx.createGain();
      const offlineBiquad = offlineCtx.createBiquadFilter();
      const offlineDelay = offlineCtx.createDelay(5.0);
      const offlineConvolver = offlineCtx.createConvolver();
      
      offlineSource.buffer = newBuffer;
      
      switch (activeEffect) {
        case 'slowed-reverb':
          // Slow down playback rate and add reverb
          offlineSource.playbackRate.value = 0.8;
          
          // Create reverb impulse response
          const reverbLength = 2;
          const reverbSampleRate = offlineCtx.sampleRate;
          const reverbBuffer = offlineCtx.createBuffer(2, reverbSampleRate * reverbLength, reverbSampleRate);
          
          for (let channel = 0; channel < 2; channel++) {
            const channelData = reverbBuffer.getChannelData(channel);
            for (let i = 0; i < channelData.length; i++) {
              channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (reverbSampleRate * 0.5));
            }
          }
          
          offlineConvolver.buffer = reverbBuffer;
          offlineSource.connect(offlineConvolver);
          offlineConvolver.connect(offlineCtx.destination);
          break;
          
        case 'nightcore':
          // Speed up playback rate
          offlineSource.playbackRate.value = 1.3;
          offlineSource.connect(offlineCtx.destination);
          break;
          
        case 'bassboost':
          // Apply bass boost EQ
          offlineBiquad.type = 'lowshelf';
          offlineBiquad.frequency.value = 100;
          offlineBiquad.gain.value = 15;
          
          offlineSource.connect(offlineBiquad);
          offlineBiquad.connect(offlineCtx.destination);
          break;
          
        case 'flanger':
          // Create flanger effect
          const oscillator = offlineCtx.createOscillator();
          const oscillatorGain = offlineCtx.createGain();
          
          oscillator.frequency.value = 0.5; // Flanger speed
          oscillatorGain.gain.value = 0.005; // Flanger depth
          
          oscillator.connect(oscillatorGain);
          oscillatorGain.connect(offlineDelay.delayTime);
          
          offlineDelay.delayTime.value = 0.01; // Base delay
          
          // Split signal path
          const flangerMix = offlineCtx.createGain();
          flangerMix.gain.value = 0.5;
          
          offlineSource.connect(offlineDelay);
          offlineSource.connect(flangerMix);
          offlineDelay.connect(flangerMix);
          flangerMix.connect(offlineCtx.destination);
          
          oscillator.start(0);
          break;
          
        case 'lofi':
          // Apply bitcrusher effect + lowpass filter
          const bufferLength = newBuffer.length;
          
          // Downsample
          for (let channel = 0; channel < newBuffer.numberOfChannels; channel++) {
            const channelData = newBuffer.getChannelData(channel);
            
            // Bitcrushing and sample rate reduction
            const reduction = 2; // Keep every nth sample
            for (let i = 0; i < bufferLength; i++) {
              if (i % reduction !== 0) {
                channelData[i] = channelData[i - (i % reduction)];
              }
              
              // Add some noise and slight distortion
              const noise = Math.random() * 0.03;
              channelData[i] = Math.tanh(channelData[i] * 1.1) + noise;
            }
          }
          
          // Low pass filter
          offlineBiquad.type = 'lowpass';
          offlineBiquad.frequency.value = 3500;
          
          offlineSource.connect(offlineBiquad);
          offlineBiquad.connect(offlineCtx.destination);
          break;
          
        case '5d-audio':
          // Stereo widening and spatial effect
          if (newBuffer.numberOfChannels === 2) {
            // Create a stereo widening effect
            const leftChannel = newBuffer.getChannelData(0);
            const rightChannel = newBuffer.getChannelData(1);
            
            for (let i = 0; i < newBuffer.length; i++) {
              // Add slight delay to one channel
              if (i < newBuffer.length - 800) {
                const temp = leftChannel[i];
                leftChannel[i] = leftChannel[i] * 0.6 + rightChannel[i] * 0.4;
                rightChannel[i] = rightChannel[i] * 0.6 + temp * 0.4;
              }
            }
          }
          
          // Add reverb too
          const spatialReverb = offlineCtx.createConvolver();
          const spatialReverbLength = 1.5;
          const spatialReverbBuffer = offlineCtx.createBuffer(
            2, 
            offlineCtx.sampleRate * spatialReverbLength, 
            offlineCtx.sampleRate
          );
          
          for (let channel = 0; channel < 2; channel++) {
            const channelData = spatialReverbBuffer.getChannelData(channel);
            for (let i = 0; i < channelData.length; i++) {
              channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (offlineCtx.sampleRate * 0.3));
            }
          }
          
          spatialReverb.buffer = spatialReverbBuffer;
          
          offlineSource.connect(spatialReverb);
          spatialReverb.connect(offlineCtx.destination);
          break;
          
        default:
          // No effect, just pass through
          offlineSource.connect(offlineCtx.destination);
          break;
      }
      
      offlineSource.start(0);
      
      try {
        const renderedBuffer = await offlineCtx.startRendering();
        processedBuffer.current = renderedBuffer;
        
        // Update wavesurfer with processed audio
        if (wavesurfer) {
          const blob = audioBufferToWavBlob(renderedBuffer);
          wavesurfer.loadBlob(blob);
          
          // Add event listener to restore playback position and state once loaded
          const onReady = () => {
            // Restore the playback position
            wavesurfer.seekTo(currentPos);
            
            // Restore the playback state if it was playing
            if (wasPlaying) {
              setTimeout(() => wavesurfer.play(), 50);
            }
            
            // Remove the event listener
            wavesurfer.un('ready', onReady);
          };
          
          wavesurfer.on('ready', onReady);
        }
      } catch (err) {
        console.error('Offline rendering failed:', err);
      }
    };
    
    if (audioBuffer.current && activeEffect !== 'none') {
      applyEffect();
    } else if (audioBuffer.current && wavesurfer && activeEffect === 'none' && audioBuffer.current) {
      // Save current playback state and position
      const wasPlaying = isPlaying;
      const currentPos = wavesurfer.getCurrentTime() / wavesurfer.getDuration();
      
      // Reset to original buffer
      const blob = audioBufferToWavBlob(audioBuffer.current);
      wavesurfer.loadBlob(blob);
      
      // Add event listener to restore playback position and state once loaded
      const onReady = () => {
        // Restore the playback position
        wavesurfer.seekTo(currentPos);
        
        // Restore the playback state if it was playing
        if (wasPlaying) {
          setTimeout(() => wavesurfer.play(), 50);
        }
        
        // Remove the event listener
        wavesurfer.un('ready', onReady);
      };
      
      wavesurfer.on('ready', onReady);
    }
  }, [activeEffect, wavesurfer, isPlaying]);

  const downloadProcessedAudio = useCallback(() => {
    if (!processedBuffer.current && !audioBuffer.current) return;
    
    const bufferToUse = processedBuffer.current || audioBuffer.current;
    if (!bufferToUse) return;
    
    const wav = audioBufferToWav(bufferToUse);
    const blob = new Blob([wav], { type: 'audio/wav' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vibify-${activeEffect !== 'none' ? activeEffect : 'original'}.wav`;
    link.click();
    URL.revokeObjectURL(url);
  }, [processedBuffer, audioBuffer, activeEffect]);

  // Helper function to convert AudioBuffer to Blob
  const audioBufferToWavBlob = (buffer: AudioBuffer): Blob => {
    const wav = audioBufferToWav(buffer);
    return new Blob([wav], { type: 'audio/wav' });
  };

  return {
    wavesurfer,
    isPlaying,
    currentTime,
    duration,
    volume,
    activeEffect,
    setActiveEffect,
    togglePlayPause,
    setVolume,
    handleFileUpload,
    seek,
    downloadProcessedAudio
  };
};

// Helper function to convert AudioBuffer to WAV format
function audioBufferToWav(buffer: AudioBuffer): Uint8Array {
  const numOfChannels = buffer.numberOfChannels;
  const length = buffer.length * numOfChannels * 2 + 44;
  const sampleRate = buffer.sampleRate;
  const arrayBuffer = new ArrayBuffer(length);
  const data = new DataView(arrayBuffer);
  
  // RIFF chunk descriptor
  writeString(data, 0, 'RIFF');
  data.setUint32(4, length - 8, true);
  writeString(data, 8, 'WAVE');
  
  // FMT sub-chunk
  writeString(data, 12, 'fmt ');
  data.setUint32(16, 16, true); // subchunk size
  data.setUint16(20, 1, true); // PCM
  data.setUint16(22, numOfChannels, true);
  data.setUint32(24, sampleRate, true);
  data.setUint32(28, sampleRate * numOfChannels * 2, true); // byte rate
  data.setUint16(32, numOfChannels * 2, true); // block align
  data.setUint16(34, 16, true); // bits per sample
  
  // Data sub-chunk
  writeString(data, 36, 'data');
  data.setUint32(40, length - 44, true);
  
  // Write audio data
  const channels = [];
  for (let i = 0; i < numOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }
  
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      data.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }
  
  return new Uint8Array(arrayBuffer);
}

function writeString(dataView: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    dataView.setUint8(offset + i, string.charCodeAt(i));
  }
} 