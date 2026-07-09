import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  gradient?: string;
}

export const Card = ({ children, gradient, className = '', ...props }: CardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className={`glass rounded-xl p-6 cursor-pointer relative overflow-hidden ${className}`}
      {...props}
    >
      {gradient && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 hover:opacity-10 transition-opacity duration-300`} />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
