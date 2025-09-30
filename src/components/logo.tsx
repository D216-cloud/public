import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-20 w-20'
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 40" 
      className={`${sizeClasses[size] || sizeClasses.lg} ${className}`}
      style={{ background: 'transparent' }}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="birdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1DA1F2" stopOpacity="1" />
          <stop offset="100%" stopColor="#1DA1F2" stopOpacity="1" />
        </linearGradient>
      </defs>
      
      {/* Modern Twitter Bird Icon */}
      <path 
        d="M40.5 15.5c-1.4 0.6-2.9 1-4.4 1.2 1.7-1 3-2.6 3.6-4.5-1.6 1-3.4 1.6-5.3 2-1.5-1.6-3.6-2.6-6-2.6-4.5 0-8.2 3.6-8.2 8.2 0 0.6 0.1 1.3 0.2 1.9-6.8-0.3-12.8-3.6-16.9-8.6-0.7 1.2-1 2.7-1 4.2 0 2.8 1.5 5.3 3.6 6.8-1.4 0-2.6-0.4-3.7-1.2v0.1c0 4 2.8 7.3 6.6 8.1-0.7 0.2-1.5 0.3-2.3 0.3-0.6 0-1.1 0-1.7-0.1 1.2 3.6 4.4 6.2 8.3 6.3-3.2 2.5-7.2 4-11.5 4-0.8 0-1.5 0-2.3-0.1 4.2 2.7 9.2 4.3 14.7 4.3 17.5 0 27.2-14.5 27.2-27.2v-2.2c1.9-1.4 3.6-3.1 5-5-1.8 0.8-3.7 1.4-5.8 1.7 2-1.2 3.6-3.2 4.4-5.3z" 
        fill="url(#birdGradient)"
      />
      
      {showText && (
        <>
          {/* Modern "AI" text with gradient */}
          <text x="50" y="25" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="20" fill="url(#logoGradient)">AI</text>
          
          {/* "Pro" badge with modern styling */}
          <rect x="75" y="8" width="22" height="12" rx="6" fill="url(#logoGradient)" opacity="0.9"/>
          <text x="86" y="17" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="8" fill="white" textAnchor="middle">PRO</text>
        </>
      )}
    </svg>
  );
};