import { motion } from 'framer-motion';
import styles from '../styles/VibifyLogo.module.css';

// Import SVG assets
import vSvg from '../assets/logo/V.svg';
import i1Svg from '../assets/logo/i1.svg';
import bSvg from '../assets/logo/b.svg';
import i2Svg from '../assets/logo/i2.svg';
import fSvg from '../assets/logo/f.svg';
import ySvg from '../assets/logo/y.svg';

export const VibifyLogo = () => {
  return (
    <motion.div 
      className={styles.vibifyLogo}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.logoContainer}>
        <motion.img 
          src={vSvg} 
          alt="V" 
          className={styles.logoChar}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 0 * 0.1,
            type: 'spring',
            stiffness: 200,
            damping: 10
          }}
          whileHover={{ 
            y: -5, 
            transition: { type: 'spring', stiffness: 300, damping: 10 }
          }}
        />
        <motion.img 
          src={i1Svg} 
          alt="i" 
          className={styles.logoChar}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 1 * 0.1,
            type: 'spring',
            stiffness: 200,
            damping: 10
          }}
          whileHover={{ 
            y: -5, 
            transition: { type: 'spring', stiffness: 300, damping: 10 }
          }}
        />
        <motion.img 
          src={bSvg} 
          alt="b" 
          className={styles.logoChar}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 2 * 0.1,
            type: 'spring',
            stiffness: 200,
            damping: 10
          }}
          whileHover={{ 
            y: -5, 
            transition: { type: 'spring', stiffness: 300, damping: 10 }
          }}
        />
        <motion.img 
          src={i2Svg} 
          alt="i" 
          className={styles.logoChar}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 3 * 0.1,
            type: 'spring',
            stiffness: 200,
            damping: 10
          }}
          whileHover={{ 
            y: -5, 
            transition: { type: 'spring', stiffness: 300, damping: 10 }
          }}
        />
        <motion.img 
          src={fSvg} 
          alt="f" 
          className={styles.logoChar}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 4 * 0.1,
            type: 'spring',
            stiffness: 200,
            damping: 10
          }}
          whileHover={{ 
            y: -5, 
            transition: { type: 'spring', stiffness: 300, damping: 10 }
          }}
        />
        <motion.img 
          src={ySvg} 
          alt="y" 
          className={styles.logoChar}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 5 * 0.1,
            type: 'spring',
            stiffness: 200,
            damping: 10
          }}
          whileHover={{ 
            y: -5, 
            transition: { type: 'spring', stiffness: 300, damping: 10 }
          }}
        />
      </div>
    </motion.div>
  );
};

export default VibifyLogo; 