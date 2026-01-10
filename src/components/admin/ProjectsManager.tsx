/**
 * ProjectsManager Component
 * 
 * Admin component for managing projects (CRUD operations).
 * Displays list of projects and forms for editing.
 * 
 * @principle Single Responsibility - Only handles project management
 */

import React, { useState, useEffect } from 'react';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { RetroButton } from '@/components/ui/RetroButton';
import { supabase } from '@/integrations/supabase/client';
import { ProjectForm } from './ProjectForm';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  icon: string;
  demo_url: string | null;
  repo_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProjects(projects.filter(p => p.id !== id));
      toast({
        title: "Sucesso",
        description: "Projeto excluído com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o projeto.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (project: Partial<Project>) => {
    try {
      if (editingProject) {
        // Update existing
        const { error } = await supabase
          .from('projects')
          .update(project)
          .eq('id', editingProject.id);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Projeto atualizado com sucesso!",
        });
      } else {
        // Create new - ensure required fields
        const newProject = {
          title: project.title || '',
          description: project.description || '',
          technologies: project.technologies || [],
          icon: project.icon || '📁',
          demo_url: project.demo_url,
          repo_url: project.repo_url,
          sort_order: project.sort_order || 0,
          is_published: project.is_published ?? true,
        };
        
        const { error } = await supabase
          .from('projects')
          .insert([newProject]);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Projeto criado com sucesso!",
        });
      }

      setEditingProject(null);
      setIsCreating(false);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o projeto.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <RetroWindow title="Carregando...">
        <div className="text-center py-8">
          <div className="text-4xl animate-pulse">⏳</div>
        </div>
      </RetroWindow>
    );
  }

  if (isCreating || editingProject) {
    return (
      <ProjectForm
        project={editingProject}
        onSave={handleSave}
        onCancel={() => {
          setEditingProject(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <RetroWindow title="C:\Admin\Projetos">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
        <RetroButton onClick={() => setIsCreating(true)} variant="primary">
          ➕ Novo Projeto
        </RetroButton>
        <RetroButton onClick={fetchProjects}>
          🔄 Atualizar
        </RetroButton>
        <span className="text-xs text-muted-foreground ml-auto">
          {projects.length} projetos
        </span>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-4xl mb-2">📁</div>
          <p>Nenhum projeto cadastrado.</p>
          <p className="text-sm">Clique em "Novo Projeto" para começar.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-3 p-3 bg-card border border-border-dark retro-outset hover:bg-muted transition-colors"
            >
              <span className="text-2xl">{project.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-retro truncate">{project.title}</h3>
                  {!project.is_published && (
                    <span className="text-xs bg-muted px-1 border border-border">
                      Rascunho
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {project.description}
                </p>
              </div>
              <div className="flex gap-1">
                <RetroButton size="sm" onClick={() => setEditingProject(project)}>
                  ✏️ Editar
                </RetroButton>
                <RetroButton size="sm" onClick={() => handleDelete(project.id)}>
                  🗑️
                </RetroButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </RetroWindow>
  );
};
