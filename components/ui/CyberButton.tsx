
import React from 'react';
import { motion } from 'framer-motion';
import { Haptics } from '../../services/Haptics';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'critical' | 'ghost';
  children: React.ReactNode;
  icon?: string;
  fullWidth?: boolean;
}

const CyberButton: React.FC<CyberButtonProps> = ({ 
  variant = 'primary', 
  children, 
  icon, 
  fullWidth = true,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = "relative h-14 font-display font-bold text-lg tracking-[0.15em] uppercase transition-all duration-200 group overflow-hidden border";
  
  const variants = {
    primary: "border-primary text-primary hover:text-black bg-transparent hover:bg-primary hover:shadow-glow-strong",
    critical: "border-critical text-critical hover:text-black bg-transparent hover:bg-critical hover:shadow-glow-critical",
    ghost: "border-white/20 text-white/60 hover:text-white hover:border-white hover:bg-white/5",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger Haptics on click
    if (variant === 'critical') {
        Haptics.heavy();
    } else {
        Haptics.light();
    }
    
    // Pass event up
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : 'w-auto px-8'} ${className}`}
      onClick={handleClick}
      {...(props as any)}
    >
      <div className="relative z-10 flex items-center justify-center gap-3">
        {icon && <span className="material-symbols-outlined">{icon}</span>}
        <span>{children}</span>
      </div>
      
      {/* Decorative Glitch Overlay on Hover (simulated via opacity/transform) */}
      <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out skew-x-12 origin-left"></div>
    </motion.button>
  );
};

export default CyberButton;
