/**
 * Footer Component
 * 
 * Classic retro footer with visitor counter and nostalgic elements.
 * Includes decorative "under construction" and "best viewed" badges.
 * 
 * @principle Single Responsibility - Only handles footer presentation
 */

import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary border-t-2 border-border-dark mt-8">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Retro Badges */}
          <div className="flex items-center gap-4">
            <RetroBadge>
              🚧 Em Construção
            </RetroBadge>
            <RetroBadge>
              📧 Webmaster
            </RetroBadge>
          </div>

          {/* Visitor Counter */}
          <div className="flex items-center gap-2 bg-card border-2 border-border-dark retro-inset px-3 py-1">
            <span className="text-xs text-muted-foreground">Você é o visitante nº</span>
            <span className="font-retro text-lg text-primary">
              {String(Math.floor(Math.random() * 99999)).padStart(5, '0')}
            </span>
          </div>

          {/* Best Viewed Badge */}
          <div className="text-xs text-muted-foreground text-center">
            <p>Melhor visualizado em</p>
            <p className="font-retro text-foreground">800x600 @ 256 cores</p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-muted border-t border-border px-4 py-2 text-center text-xs text-muted-foreground">
        <p>
          © {currentYear} - Feito com ♥ e muito café |{' '}
          <span className="retro-link cursor-pointer">Livro de Visitas</span> |{' '}
          <span className="retro-link cursor-pointer">Mapa do Site</span>
        </p>
        <p className="mt-1 font-mono">
          &lt;/&gt; Powered by TypeScript + React
        </p>
      </div>

      {/* Decorative Scanlines */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
    </footer>
  );
};

/**
 * RetroBadge Component
 * Small decorative badge with retro styling.
 */
const RetroBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-2 py-1 bg-card border border-border-dark text-xs font-mono retro-outset">
    {children}
  </span>
);

export default Footer;
