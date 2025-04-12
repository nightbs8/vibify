import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Dropzone.module.css';

interface AudioFileDropzoneProps {
  onFileSelect: (file: File) => void;
}

export const AudioFileDropzone = ({ onFileSelect }: AudioFileDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Check if the file is an audio file
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file.');
      return;
    }
    
    setFileName(file.name);
    onFileSelect(file);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.container}>
      <motion.div 
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ''} ${fileName ? styles.hasFile : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileInput} 
          accept="audio/*" 
          className={styles.fileInput} 
        />
        
        {fileName ? (
          <div className={styles.fileInfo}>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={styles.fileIcon}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18V12M15 18V12M15 12L12 15M15 12L12 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 9H21M19 9L18.1327 18.1425C18.0579 18.6877 17.5929 19.1 17.0424 19.1H6.95759C6.4071 19.1 5.94214 18.6877 5.86731 18.1425L5 9H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M7 9V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </motion.div>
            <div className={styles.fileName}>{fileName}</div>
            <motion.button 
              className={styles.uploadNew}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setFileName(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              Upload New
            </motion.button>
          </div>
        ) : (
          <div className={styles.uploadContent}>
            <div className={styles.uploadIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3V16M12 3L7 8M12 3L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.uploadText}>
              <h3>Drag & drop your audio file</h3>
              <p>or click to browse</p>
            </div>
            <div className={styles.supportedFormats}>
              Supported formats: MP3, WAV, FLAC, OGG, AAC
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AudioFileDropzone; 