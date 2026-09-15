import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'saffron' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  let baseStyle =
    'inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs';

  let sizeStyle = '';
  switch (size) {
    case 'sm':
      sizeStyle = 'px-2.5 py-1 text-xs';
      break;
    case 'lg':
      sizeStyle = 'px-5 py-2.5 text-base';
      break;
    case 'md':
    default:
      sizeStyle = 'px-3.5 py-1.5 text-sm';
      break;
  }

  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-[#754A2B] hover:bg-[#5D3820] dark:bg-[#C68A5A] dark:hover:bg-[#D8A779] text-white dark:text-gray-950 border border-[#5D3820] dark:border-[#C68A5A]';
      break;
    case 'saffron':
      variantStyle = 'bg-[#D97706] hover:bg-[#B45309] dark:bg-[#F59E0B] dark:hover:bg-[#FBBF24] text-white dark:text-gray-950 border border-[#F3C46F] dark:border-[#F59E0B]';
      break;
    case 'danger':
      variantStyle = 'bg-risk-severe hover:bg-red-700 text-white border border-red-800';
      break;
    case 'secondary':
      variantStyle = 'bg-sand-100 hover:bg-sand-200 dark:bg-[#202734] dark:hover:bg-[#252E3C] text-earth-900 dark:text-gray-100 border border-sand-300 dark:border-[#323C4B]';
      break;
    case 'outline':
      variantStyle = 'border border-sand-300 dark:border-[#323C4B] text-earth-800 dark:text-gray-200 hover:bg-sand-100 dark:hover:bg-[#202734]';
      break;
    case 'ghost':
      variantStyle = 'text-earth-800 dark:text-gray-300 hover:bg-sand-100 dark:hover:bg-[#202734] shadow-none';
      break;
  }

  return (
    <button className={`${baseStyle} ${sizeStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
}
