/**
 * ProjectsSection Component
 * 
 * "Projetos" section showcasing portfolio projects.
 * Each project is displayed as a mini file explorer window.
 * Fetches data from database or uses fallback data.
 * 
 * @principle Single Responsibility - Only handles projects display
 * @principle Interface Segregation - Project interface contains only needed data
 */

import React, { useState, useEffect } from 'react';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { RetroButton } from '@/components/ui/RetroButton';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

/** Project data structure */
interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  icon: string;
  demo_url?: string | null;
  repo_url?: string | null;
}

/** Fallback projects data */
const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'projeto-1',
    title: 'E-Commerce App',
    description: 'Uma aplicação completa de e-commerce com carrinho, checkout e integração de pagamentos.',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    icon: '🛒',
    demo_url: '#',
    repo_url: '#',
  },
  {
    id: 'projeto-2',
    title: 'Task Manager',
    description: 'Gerenciador de tarefas com drag-and-drop, categorias e sincronização em tempo real.',
    technologies: ['React', 'Firebase', 'Tailwind'],
    icon: '📋',
    demo_url: '#',
    repo_url: '#',
  },
];

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, description, technologies, icon, demo_url, repo_url')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          setProjects(data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <RetroWindow title="C:\Meus_Projetos" id="projetos" className="max-w-5xl mx-auto">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
        <ToolbarButton>📁 Novo</ToolbarButton>
        <ToolbarButton>📂 Abrir</ToolbarButton>
        <ToolbarButton>🔄 Atualizar</ToolbarButton>
        <span className="text-xs text-muted-foreground ml-auto">
          {loading ? '...' : `${projects.length} itens`}
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Status Bar */}
      <div className="mt-4 pt-2 border-t border-border text-xs text-muted-foreground">
        <p>Dica: Clique nos projetos para ver mais detalhes</p>
      </div>
    </RetroWindow>
  );
};

/**
 * ProjectCard Component
 * Individual project card styled as a file/folder.
 */
interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <article
    className={cn(
      'bg-card border border-border-dark',
      'retro-outset hover:bg-muted',
      'transition-colors cursor-pointer',
      'group'
    )}
  >
    {/* Card Header */}
    <div className="flex items-center gap-2 px-3 py-2 bg-secondary border-b border-border">
      <span className="text-2xl">{project.icon}</span>
      <h3 className="font-retro text-lg text-foreground group-hover:text-primary transition-colors">
        {project.title}
      </h3>
    </div>

    {/* Card Content */}
    <div className="p-3 space-y-3">
      <p className="text-sm text-muted-foreground line-clamp-2">
        {project.description}
      </p>

      {/* Technologies */}
      <div className="flex flex-wrap gap-1">
        {project.technologies.map((tech) => (
          <TechBadge key={tech}>{tech}</TechBadge>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-border">
        {project.demo_url && (
          <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
            <RetroButton size="sm" variant="primary">
              ▶ Demo
            </RetroButton>
          </a>
        )}
        {project.repo_url && (
          <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
            <RetroButton size="sm">
              📂 Código
            </RetroButton>
          </a>
        )}
      </div>
    </div>
  </article>
);

/**
 * TechBadge Component
 * Small badge for displaying technology tags.
 */
const TechBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex px-1.5 py-0.5 bg-muted border border-border text-xs font-mono text-muted-foreground">
    {children}
  </span>
);

/**
 * ToolbarButton Component
 * Small button for the toolbar area.
 */
const ToolbarButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <button className="px-2 py-1 text-xs bg-secondary border border-border-dark retro-outset hover:bg-muted active:retro-inset">
    {children}
  </button>
);

export default ProjectsSection;
