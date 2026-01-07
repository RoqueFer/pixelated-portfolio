/**
 * RetroWindow Component
 * 
 * A reusable window component that mimics the classic Windows 95/98/2000 aesthetic.
 * Used as the main container for content sections throughout the portfolio.
 * 
 * @principle Single Responsibility - Only handles window UI presentation
 * @principle Open/Closed - Extensible via props without modification
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface RetroWindowProps {
  /** Window title displayed in the title bar */
  title: string;
  /** Content to render inside the window */
  children: React.ReactNode;
  /** Additional CSS classes for the window container */
  className?: string;
  /** Optional ID for navigation/anchoring */
  id?: string;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({
  title,
  children,
  className,
  id,
}) => {
  return (
    <section
      id={id}
      className={cn(
        'bg-card border-2 border-border-dark',
        'retro-outset',
        className
      )}
    >
      {/* Title Bar */}
      <div className="retro-titlebar px-2 py-1 flex items-center gap-2">
        {/* Window Icon */}
        <div className="w-4 h-4 bg-secondary border border-border-dark flex items-center justify-center">
          <span className="text-xs text-foreground">◊</span>
        </div>
        
        {/* Title */}
        <h2 className="font-retro text-xl text-primary-foreground tracking-wide flex-1">
          {title}
        </h2>
        
        {/* Window Controls */}
        <div className="flex gap-1">
          <WindowButton>_</WindowButton>
          <WindowButton>□</WindowButton>
          <WindowButton>×</WindowButton>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-4 bg-card retro-inset m-1">
        {children}
      </div>
    </section>
  );
};

/**
 * WindowButton Component
 * 
 * Small decorative button for the window title bar.
 */
const WindowButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <button
    type="button"
    className={cn(
      'w-5 h-5 bg-secondary text-foreground text-xs',
      'border border-border-dark',
      'retro-outset',
      'hover:bg-muted active:retro-inset',
      'flex items-center justify-center',
      'cursor-default'
    )}
    aria-hidden="true"
  >
    {children}
  </button>
);

export default RetroWindow;
