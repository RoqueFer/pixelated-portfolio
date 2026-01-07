/**
 * RetroWindow Component
 * 
 * A reusable window component that mimics the classic Windows 95/98/2000 aesthetic.
 * Features functional minimize/maximize buttons and MSN-style "nudge" on close.
 * 
 * @principle Single Responsibility - Only handles window UI presentation
 * @principle Open/Closed - Extensible via props without modification
 */

import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const windowRef = useRef<HTMLElement>(null);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMaximized) setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (isMinimized) setIsMinimized(false);
  };

  const handleClose = () => {
    // MSN "nudge" effect
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setShowErrorDialog(true);
    }, 500);
  };

  return (
    <>
      <section
        ref={windowRef}
        id={id}
        className={cn(
          'bg-card border-2 border-border-dark',
          'retro-outset',
          'transition-all duration-300',
          isMaximized && 'fixed inset-4 z-50',
          isShaking && 'animate-shake',
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
            <WindowButton onClick={handleMinimize} title="Minimizar">_</WindowButton>
            <WindowButton onClick={handleMaximize} title="Maximizar">
              {isMaximized ? '❐' : '□'}
            </WindowButton>
            <WindowButton onClick={handleClose} title="Fechar" isClose>×</WindowButton>
          </div>
        </div>
        
        {/* Content Area */}
        <div 
          className={cn(
            'p-4 bg-card retro-inset m-1 transition-all duration-300 overflow-hidden',
            isMinimized ? 'max-h-0 p-0 m-0 border-0' : 'max-h-[5000px]'
          )}
        >
          {children}
        </div>
      </section>

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent className="bg-card border-2 border-border-dark retro-outset">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✕</span>
              </div>
              <AlertDialogTitle className="font-retro text-destructive">
                Erro do Sistema
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="font-mono text-foreground">
              I'm afraid I can't let you do that.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              className="retro-outset bg-secondary hover:bg-muted text-foreground border border-border-dark font-retro"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

/**
 * WindowButton Component
 * 
 * Small decorative button for the window title bar with interactive functionality.
 */
interface WindowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
  isClose?: boolean;
}

const WindowButton: React.FC<WindowButtonProps> = ({ 
  children, 
  onClick, 
  title,
  isClose 
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={cn(
      'w-5 h-5 bg-secondary text-foreground text-xs',
      'border border-border-dark',
      'retro-outset',
      'hover:bg-muted active:retro-inset',
      'flex items-center justify-center',
      'cursor-pointer transition-colors',
      isClose && 'hover:bg-destructive hover:text-white'
    )}
  >
    {children}
  </button>
);

export default RetroWindow;
