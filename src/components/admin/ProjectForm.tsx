/**
 * ProjectForm Component
 * 
 * Form template for creating/editing projects.
 * Validates input and handles submission.
 * 
 * @principle Single Responsibility - Only handles project form
 */

import React, { useState } from 'react';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { RetroButton } from '@/components/ui/RetroButton';
import { z } from 'zod';

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
}

interface ProjectFormProps {
  project: Project | null;
  onSave: (data: Partial<Project>) => void;
  onCancel: () => void;
}

const projectSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100),
  description: z.string().min(1, 'Descrição é obrigatória').max(500),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  technologies: z.array(z.string()).min(1, 'Adicione pelo menos uma tecnologia'),
  demo_url: z.string().url().optional().or(z.literal('')),
  repo_url: z.string().url().optional().or(z.literal('')),
  sort_order: z.number().int().min(0),
  is_published: z.boolean(),
});

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    icon: project?.icon || '📁',
    technologies: project?.technologies?.join(', ') || '',
    demo_url: project?.demo_url || '',
    repo_url: project?.repo_url || '',
    sort_order: project?.sort_order || 0,
    is_published: project?.is_published ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const technologiesArray = formData.technologies
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const dataToValidate = {
      ...formData,
      technologies: technologiesArray,
      demo_url: formData.demo_url || undefined,
      repo_url: formData.repo_url || undefined,
    };

    const result = projectSchema.safeParse(dataToValidate);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        newErrors[err.path[0] as string] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    onSave({
      title: formData.title,
      description: formData.description,
      icon: formData.icon,
      technologies: technologiesArray,
      demo_url: formData.demo_url || null,
      repo_url: formData.repo_url || null,
      sort_order: formData.sort_order,
      is_published: formData.is_published,
    });
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <RetroWindow title={project ? `Editando: ${project.title}` : 'Novo Projeto'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Icon */}
        <div className="space-y-1">
          <label className="block text-sm font-retro">🎨 Ícone (emoji):</label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => handleChange('icon', e.target.value)}
            className="w-20 px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-2xl text-center"
          />
          {errors.icon && <p className="text-xs text-destructive">{errors.icon}</p>}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="block text-sm font-retro">📝 Título:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-sm"
            placeholder="Nome do projeto"
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-sm font-retro">📄 Descrição:</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-sm h-24 resize-none"
            placeholder="Descrição do projeto"
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
        </div>

        {/* Technologies */}
        <div className="space-y-1">
          <label className="block text-sm font-retro">🛠️ Tecnologias (separadas por vírgula):</label>
          <input
            type="text"
            value={formData.technologies}
            onChange={(e) => handleChange('technologies', e.target.value)}
            className="w-full px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-sm"
            placeholder="React, TypeScript, Node.js"
          />
          {errors.technologies && <p className="text-xs text-destructive">{errors.technologies}</p>}
        </div>

        {/* URLs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-retro">🌐 URL Demo:</label>
            <input
              type="url"
              value={formData.demo_url}
              onChange={(e) => handleChange('demo_url', e.target.value)}
              className="w-full px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-sm"
              placeholder="https://..."
            />
            {errors.demo_url && <p className="text-xs text-destructive">{errors.demo_url}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-retro">📂 URL Repositório:</label>
            <input
              type="url"
              value={formData.repo_url}
              onChange={(e) => handleChange('repo_url', e.target.value)}
              className="w-full px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-sm"
              placeholder="https://github.com/..."
            />
            {errors.repo_url && <p className="text-xs text-destructive">{errors.repo_url}</p>}
          </div>
        </div>

        {/* Order and Status */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-retro">📊 Ordem:</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-sm"
              min="0"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-retro">📢 Status:</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => handleChange('is_published', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Publicado</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-border">
          <RetroButton type="submit" variant="primary">
            💾 Salvar
          </RetroButton>
          <RetroButton type="button" onClick={onCancel}>
            ✕ Cancelar
          </RetroButton>
        </div>
      </form>
    </RetroWindow>
  );
};
