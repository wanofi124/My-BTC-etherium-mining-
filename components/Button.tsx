import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'danger';
  glow?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  glow = true, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative px-8 py-3 font-display font-bold uppercase tracking-widest transition-all duration-300 clip-path-polygon disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-cyan-500/10 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black",
    gold: "bg-yellow-500/10 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black",
    danger: "bg-red-500/10 border border-red-400 text-red-400 hover:bg-red-400 hover:text-white",
  };

  const glowStyles = glow ? 
    (variant === 'primary' ? "shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]" :
     variant === 'gold' ? "shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_40px_rgba(234,179,8,0.6)]" :
     "shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)]") 
    : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${glowStyles} ${className}`}
      style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;