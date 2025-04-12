import { useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'
import './styles/global.css'
import AudioFileDropzone from './components/AudioFileDropzone'
import AudioPlayer from './components/AudioPlayer'
import VibifyLogo from './components/VibifyLogo'

function App() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  
  const handleFileSelect = (file: File) => {
    setAudioFile(file)
  }
  
  return (
    <motion.div 
      className="app-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!audioFile ? (
        <div className="welcome-section">
          <motion.div 
            className="logo-container"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
          >
            <VibifyLogo />
          </motion.div>
          <AudioFileDropzone onFileSelect={handleFileSelect} />
        </div>
      ) : (
        <AudioPlayer audioFile={audioFile} />
      )}
    </motion.div>
  )
}

export default App
