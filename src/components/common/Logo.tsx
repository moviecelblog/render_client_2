import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'white' | 'blue' | 'green';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  color = 'white',
  className = '' 
}) => {
  const getLogoPath = () => `/images/logos/logo-${size}-${color}.png`;

  // Tailwind classes for different sizes
  const sizeClasses = {
    small: 'h-8',    // 32px
    medium: 'h-12',  // 48px
    large: 'h-16'    // 64px
  };

  return (
    <img
      src={getLogoPath()}
      alt="Social Media AI"
      className={`object-contain ${sizeClasses[size]} ${className}`}
      style={{ maxWidth: 'none' }}
    />
  );
};

export default Logo;
