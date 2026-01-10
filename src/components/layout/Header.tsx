/**
 * Header Component
 * 
 * Main navigation header with retro taskbar aesthetic.
 * Contains navigation links to all portfolio sections.
 * 
 * @principle Single Responsibility - Handles only header/navigation
 * @principle Dependency Inversion - Uses abstract navigation items
 */

import React from 'react';
import { cn } from '@/lib/utils';

/** Navigation item configuration */
interface NavItem {
  label: string;
  href: string;
}

/** Available navigation items */
const NAV_ITEMS: NavItem[] = [
  { label: 'Sobre Mim', href: '#sobre' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Artigos', href: '#artigos' },
  { label: 'Contato', href: '#contato' },
];

export const Header: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/')) {
      // Let the browser handle route links normally
      return;
    }
    e.preventDefault();
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-secondary border-b-2 border-border-dark retro-outset">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {/* Logo / Site Title */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary flex items-center justify-center border border-border-dark">
              <span className="text-primary-foreground font-retro text-lg">@</span>
            </div>
            <span className="font-retro text-2xl text-foreground tracking-wide">
              portfolio.exe
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavButton
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </NavButton>
            ))}
          </nav>

          {/* Mobile Menu Indicator */}
          <div className="md:hidden">
            <MobileMenuButton />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-muted border-t border-border px-4 py-1 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Online
        </span>
        <span>|</span>
        <span>Visitante #{Math.floor(Math.random() * 9999).toString().padStart(4, '0')}</span>
        <span className="ml-auto">
          {new Date().toLocaleDateString('pt-BR')}
        </span>
      </div>
    </header>
  );
};

/**
 * NavButton Component
 * Individual navigation button with retro styling.
 */
interface NavButtonProps {
  href: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NavButton: React.FC<NavButtonProps> = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className={cn(
      'px-3 py-1 font-mono text-sm',
      'bg-secondary border border-border-dark',
      'retro-outset',
      'hover:bg-muted active:retro-inset',
      'transition-none'
    )}
  >
    {children}
  </a>
);

/**
 * MobileMenuButton Component
 * Hamburger menu button for mobile navigation.
 */
const MobileMenuButton: React.FC = () => (
  <button
    className={cn(
      'p-2 bg-secondary border border-border-dark',
      'retro-outset active:retro-inset'
    )}
    aria-label="Menu"
  >
    <div className="flex flex-col gap-1">
      <span className="w-4 h-0.5 bg-foreground" />
      <span className="w-4 h-0.5 bg-foreground" />
      <span className="w-4 h-0.5 bg-foreground" />
    </div>
  </button>
);

export default Header;
