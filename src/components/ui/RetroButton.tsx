/**
 * RetroButton Component
 * 
 * A button styled to match the classic Windows 95/98/2000 aesthetic.
 * Provides the characteristic raised/pressed visual feedback.
 * 
 * @principle Single Responsibility - Only handles button presentation
 * @principle Liskov Substitution - Can replace standard buttons
 */

import React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'primary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Content inside the button */
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-secondary text-secondary-foreground hover:bg-muted',
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  ghost: 'bg-transparent hover:bg-secondary',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

export const RetroButton: React.FC<RetroButtonProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        'font-mono border-2 border-border-dark',
        'retro-outset',
        'active:retro-inset active:translate-x-px active:translate-y-px',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
        'transition-none',
        'cursor-pointer',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default RetroButton;
