import { HTMLAttributes, forwardRef } from 'react';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`glass rounded-2xl p-6 transition-all duration-300 hover:border-white/20 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
