/**
 * ArticleForm Component
 * 
 * Form template for creating/editing articles.
 * Validates input and handles submission.
 * 
 * @principle Single Responsibility - Only handles article form
 */

import React, { useState } from 'react';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { RetroButton } from '@/components/ui/RetroButton';
import { z } from 'zod';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string | null;
  category: string;
  read_time: string;
  url: string | null;
  sort_order: number;
  is_published: boolean;
}

interface ArticleFormProps {
  article: Article | null;
  onSave: (data: Partial<Article>) => void;
  onCancel: () => void;
}

const articleSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200),
  excerpt: z.string().min(1, 'Resumo é obrigatório').max(500),
  content: z.string().optional(),
  category: z.string().min(1, 'Categoria é obrigatória'),
  read_time: z.string().min(1, 'Tempo de leitura é obrigatório'),
  url: z.string().url().optional().or(z.literal('')),
  sort_order: z.number().int().min(0),
  is_published: z.boolean(),
});

const CATEGORIES = [
  'Desenvolvimento',
  'DevOps',
  'Frontend',
  'Backend',
  'Mobile',
  'IA',
  'Carreira',
  'Geral',
];

export const ArticleForm: React.FC<ArticleFormProps> = ({
  article,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    category: article?.category || 'Geral',
    read_time: article?.read_time || '5 min',
    url: article?.url || '',
    sort_order: article?.sort_order || 0,
    is_published: article?.is_published ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToValidate = {
      ...formData,
      url: formData.url || undefined,
      content: formData.content || undefined,
    };

    const result = articleSchema.safeParse(dataToValidate);
    
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
      excerpt: formData.excerpt,
      content: formData.content || null,
      category: formData.category,
      read_time: formData.read_time,
      url: formData.url || null,
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
    <RetroWindow title={article ? `Editando: ${article.title}` : 'Novo Artigo'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <label className="block text-sm font-retro">📝 Título:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-sm"
            placeholder="Título do artigo"
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        {/* Excerpt */}
        <div className="space-y-1">
          <label className="block text-sm font-retro">📄 Resumo:</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            className="w-full px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-sm h-20 resize-none"
            placeholder="Breve descrição do artigo"
          />
          {errors.excerpt && <p className="text-xs text-destructive">{errors.excerpt}</p>}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <label className="block text-sm font-retro">📃 Conteúdo (opcional):</label>
          <textarea
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            className="w-full px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-sm h-40 resize-none"
            placeholder="Conteúdo completo do artigo (suporta Markdown)"
          />
        </div>

        {/* Category and Read Time */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-retro">🏷️ Categoria:</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-sm"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-retro">⏱️ Tempo de leitura:</label>
            <input
              type="text"
              value={formData.read_time}
              onChange={(e) => handleChange('read_time', e.target.value)}
              className="w-full px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-sm"
              placeholder="5 min"
            />
            {errors.read_time && <p className="text-xs text-destructive">{errors.read_time}</p>}
          </div>
        </div>

        {/* URL */}
        <div className="space-y-1">
          <label className="block text-sm font-retro">🔗 URL externa (opcional):</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => handleChange('url', e.target.value)}
            className="w-full px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-sm"
            placeholder="https://medium.com/..."
          />
          {errors.url && <p className="text-xs text-destructive">{errors.url}</p>}
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
