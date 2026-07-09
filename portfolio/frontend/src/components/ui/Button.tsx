import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'accent';
  children: ReactNode;
}

export const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  const variants = {
    primary: 'border-primary/50 hover:border-primary text-white glow-purple',
    secondary: 'border-white/20 hover:border-primary/50 text-white',
    accent: 'border-accent/50 hover:border-accent text-white glow-gold',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`glass px-6 py-3 rounded-lg font-semibold border transition-all ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
