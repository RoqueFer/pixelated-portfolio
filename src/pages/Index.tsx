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
  <div className="text-center py-8 space-y-4">
    {/* ASCII Art Style Header */}
    <pre className="font-mono text-xs sm:text-sm text-primary overflow-x-auto">
{`
  ╔═══════════════════════════════════════════════════════╗
  ║   ____            _    __       _  _                  ║
  ║  |  _ \\ ___  _ __| |_ / _| ___ | |(_) ___             ║
  ║  | |_) / _ \\| '__| __| |_ / _ \\| || |/ _ \\            ║
  ║  |  __/ (_) | |  | |_|  _| (_) | || | (_) |           ║
  ║  |_|   \\___/|_|   \\__|_|  \\___/|_||_|\\___/            ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
`}
    </pre>

    {/* Subtitle */}
    <div className="space-y-2">
      <p className="font-retro text-2xl md:text-3xl text-foreground">
        Bem-vindo(a) à minha página pessoal!
      </p>
      <p className="text-muted-foreground max-w-xl mx-auto">
        Desenvolvedor(a) · Entusiasta de código limpo · Indie Web
      </p>
    </div>

    {/* Decorative Divider */}
    <div className="flex items-center justify-center gap-2 text-muted-foreground">
      <span>─────</span>
      <span>◆</span>
      <span>─────</span>
    </div>

    {/* Last Updated */}
    <p className="text-xs text-muted-foreground">
      Última atualização: {new Date().toLocaleDateString('pt-BR')} | 
      Feito com ♥ e TypeScript
    </p>
  </div>
);

export default Index;
