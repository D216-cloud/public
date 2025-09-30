import React from 'react';

interface MobileLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MobileLogo: React.FC<MobileLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-16 w-16'
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 40" 
      className={`${sizeClasses[size] || sizeClasses.lg} ${className}`}
      style={{ background: 'transparent' }}
    >
      <defs>
        <linearGradient id="mobileBirdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1DA1F2" stopOpacity="1" />
          <stop offset="100%" stopColor="#1DA1F2" stopOpacity="1" />
        </linearGradient>
      </defs>
      
      {/* Modern Twitter Bird Icon for mobile */}
      <path 
        d="M40.5 15.5c-1.4 0.6-2.9 1-4.4 1.2 1.7-1 3-2.6 3.6-4.5-1.6 1-3.4 1.6-5.3 2-1.5-1.6-3.6-2.6-6-2.6-4.5 0-8.2 3.6-8.2 8.2 0 0.6 0.1 1.3 0.2 1.9-6.8-0.3-12.8-3.6-16.9-8.6-0.7 1.2-1 2.7-1 4.2 0 2.8 1.5 5.3 3.6 6.8-1.4 0-2.6-0.4-3.7-1.2v0.1c0 4 2.8 7.3 6.6 8.1-0.7 0.2-1.5 0.3-2.3 0.3-0.6 0-1.1 0-1.7-0.1 1.2 3.6 4.4 6.2 8.3 6.3-3.2 2.5-7.2 4-11.5 4-0.8 0-1.5 0-2.3-0.1 4.2 2.7 9.2 4.3 14.7 4.3 17.5 0 27.2-14.5 27.2-27.2v-2.2c1.9-1.4 3.6-3.1 5-5-1.8 0.8-3.7 1.4-5.8 1.7 2-1.2 3.6-3.2 4.4-5.3z" 
        fill="url(#mobileBirdGradient)"
      />
    </svg>
  );
};