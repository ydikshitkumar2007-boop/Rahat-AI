import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'tactical' | 'accent' | 'warning';
}

export function Card({ children, className = '', variant = 'default', ...props }: CardProps) {
  let baseStyle = 'rounded-2xl border transition-colors duration-150 bg-white dark:bg-[#1B212B] border-[#E5DED3] dark:border-[#323C4B] text-earth-900 dark:text-gray-100 shadow-sm';

  let variantStyle = '';
  switch (variant) {
    case 'tactical':
      variantStyle = 'bg-white dark:bg-[#1B212B] border-[#E5DED3] dark:border-[#323C4B]';
      break;
    case 'accent':
      variantStyle = 'bg-white dark:bg-[#1B212B] border-saffron-border dark:border-saffron-primary/40';
      break;
    case 'warning':
      variantStyle = 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200';
      break;
    case 'default':
    default:
      variantStyle = 'bg-white dark:bg-[#1B212B] border-[#E5DED3] dark:border-[#323C4B]';
      break;
  }

  return (
    <div className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-5 sm:p-6 border-b border-[#E5DED3] dark:border-[#323C4B] flex items-center justify-between gap-4 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-base font-semibold tracking-tight text-earth-900 dark:text-white font-sans ${className}`} {...props}>{children}</h3>;
}

export function CardContent({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-5 sm:p-6 ${className}`} {...props}>{children}</div>;
}
