/**
 * AboutSection Component
 * 
 * "Sobre Mim" section with personal introduction and skills.
 * Styled as a classic personal homepage "about me" section.
 * 
 * @principle Single Responsibility - Only handles about section content
 * @principle Open/Closed - Data can be externalized without changing component
 */

import React from 'react';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { cn } from '@/lib/utils';

/** Skill item with name and proficiency level */
interface Skill {
  name: string;
  level: number; // 0-100
}

/** Sample skills data - can be moved to external config */
const SKILLS: Skill[] = [
  { name: 'TypeScript', level: 90 },
  { name: 'React', level: 85 },
  { name: 'Node.js', level: 80 },
  { name: 'CSS/Tailwind', level: 85 },
  { name: 'Git', level: 75 },
];

export const AboutSection: React.FC = () => {
  return (
    <RetroWindow title="C:\Sobre_Mim\readme.txt" id="sobre" className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Picture Area */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 bg-muted border-2 border-border-dark retro-inset flex items-center justify-center">
            <div className="text-6xl">👤</div>
          </div>
          <div className="text-center">
            <p className="font-retro text-xl text-foreground">Seu Nome</p>
            <p className="text-sm text-muted-foreground">Desenvolvedor(a)</p>
          </div>
          
          {/* Status */}
          <div className="w-full bg-muted border border-border-dark retro-inset p-2 text-xs">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Disponível para projetos
            </p>
          </div>
        </div>

        {/* Bio & Info */}
        <div className="md:col-span-2 space-y-4">
          {/* Welcome Text */}
          <div className="border-l-4 border-primary pl-4">
            <p className="font-retro text-2xl text-primary mb-2">
              Olá, Mundo! <span className="animate-blink">_</span>
            </p>
            <p className="text-foreground leading-relaxed">
              Bem-vindo(a) à minha página pessoal! Sou um(a) desenvolvedor(a) 
              apaixonado(a) por código limpo, interfaces intuitivas e pela 
              nostalgia da web dos anos 2000.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              ▸ Trabalho com desenvolvimento web há X anos
            </p>
            <p>
              ▸ Especializado(a) em aplicações React e TypeScript
            </p>
            <p>
              ▸ Entusiasta de código aberto e indie web
            </p>
            <p>
              ▸ Sempre aprendendo algo novo
            </p>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <h3 className="font-retro text-lg text-foreground border-b border-border pb-1">
              // Habilidades
            </h3>
            {SKILLS.map((skill) => (
              <SkillBar key={skill.name} skill={skill} />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative marquee */}
      <div className="mt-6 bg-muted border border-border retro-inset overflow-hidden">
        <div className="animate-marquee whitespace-nowrap py-1 text-sm text-muted-foreground">
          ★ TypeScript ★ React ★ Node.js ★ Tailwind CSS ★ Git ★ Clean Code ★ SOLID ★ 
        </div>
      </div>
    </RetroWindow>
  );
};

/**
 * SkillBar Component
 * Displays a single skill with a retro progress bar.
 */
interface SkillBarProps {
  skill: Skill;
}

const SkillBar: React.FC<SkillBarProps> = ({ skill }) => (
  <div className="flex items-center gap-3">
    <span className="w-24 text-sm font-mono text-foreground">{skill.name}</span>
    <div className="flex-1 h-4 bg-muted border border-border-dark retro-inset">
      <div
        className={cn(
          'h-full bg-primary transition-all duration-500',
          'bg-gradient-to-r from-primary to-accent'
        )}
        style={{ width: `${skill.level}%` }}
      />
    </div>
    <span className="w-12 text-xs text-muted-foreground text-right">
      {skill.level}%
    </span>
  </div>
);

export default AboutSection;
