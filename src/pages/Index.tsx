/**
 * Index Page
 * 
 * Main portfolio page that composes all sections together.
 * Acts as the entry point and layout coordinator.
 * 
 * @principle Single Responsibility - Only handles page composition
 * @principle Open/Closed - Sections can be added/removed without modification
 */

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ArticlesSection } from '@/components/sections/ArticlesSection';
import { ContactSection } from '@/components/sections/ContactSection';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background relative scanlines">
      {/* Header / Navigation */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Portfolio Sections */}
        <AboutSection />
        <ProjectsSection />
        <ArticlesSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

/**
 * WelcomeBanner Component
 * Hero section with retro welcome message.
 */
const WelcomeBanner: React.FC = () => (
  <div className="text-center py-12 space-y-6">
    {/* Name in Retro Pixel Font */}
    <div className="space-y-2">
      <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-primary tracking-wider">
        Fernando Roque
      </h1>
      <p className="font-pixel text-xs sm:text-sm text-muted-foreground">
        developer
      </p>
    </div>

    {/* Decorative Divider */}
    <div className="flex items-center justify-center gap-2 text-muted-foreground">
      <span className="text-primary">━━━━━</span>
      <span className="text-primary">◆</span>
      <span className="text-primary">━━━━━</span>
    </div>

    {/* Subtitle */}
    <div className="space-y-2">
      <p className="font-retro text-xl md:text-2xl text-foreground">
        Bem-vindo(a) à minha página pessoal!
      </p>
      <p className="text-muted-foreground max-w-xl mx-auto">
        Desenvolvedor · Entusiasta de código limpo · Indie Web
      </p>
    </div>

    {/* Last Updated */}
    <p className="text-xs text-muted-foreground">
      Última atualização: {new Date().toLocaleDateString('pt-BR')} | 
      Feito com ♥ e TypeScript
    </p>
  </div>
);

export default Index;
