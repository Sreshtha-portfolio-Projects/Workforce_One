import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const EntryScreen = () => {
  const navigate = useNavigate();
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center space-y-12"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-4"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Sreshtha OS
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-xl text-gray-400"
          >
            Entering the developer playground...
          </motion.p>
        </motion.div>

        {showButtons && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/home')}
              className="glass px-12 py-4 rounded-xl text-lg font-semibold text-white border border-primary/50 hover:border-primary transition-all glow-purple"
            >
              Enter Playground
            </motion.button>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/resume')}
                className="glass px-8 py-3 rounded-lg text-base font-medium text-white border border-white/20 hover:border-primary/50 transition-all"
              >
                View Resume
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contact')}
                className="glass px-8 py-3 rounded-lg text-base font-medium text-white border border-accent/30 hover:border-accent transition-all"
              >
                Hire Me
              </motion.button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-1 h-16 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EntryScreen;
