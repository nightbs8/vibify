import { motion } from 'framer-motion';
import VibifyLogo from './VibifyLogo';
import styles from '../styles/CenteredLogo.module.css';

interface CenteredLogoProps {
  size?: 'small' | 'medium' | 'large';
  showTitle?: boolean;
}

export const CenteredLogo = ({ size = 'medium', showTitle = true }: CenteredLogoProps) => {
  return (
    <div className={`${styles.container} ${styles[size]}`}>
      <motion.div 
        className={styles.logoWrapper}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.1
        }}
      >
        <VibifyLogo />
      </motion.div>
      
      {showTitle && (
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          audio effects app
        </motion.h1>
      )}
    </div>
  );
};

export default CenteredLogo; 