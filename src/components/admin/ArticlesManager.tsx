/**
 * ArticlesManager Component
 * 
 * Admin component for managing articles (CRUD operations).
 * Displays list of articles and forms for editing.
 * 
 * @principle Single Responsibility - Only handles article management
 */

import React, { useState, useEffect } from 'react';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { RetroButton } from '@/components/ui/RetroButton';
import { supabase } from '@/integrations/supabase/client';
import { ArticleForm } from './ArticleForm';
import { useToast } from '@/hooks/use-toast';

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
  created_at: string;
  updated_at: string;
}

export const ArticlesManager: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os artigos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setArticles(articles.filter(a => a.id !== id));
      toast({
        title: "Sucesso",
        description: "Artigo excluído com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o artigo.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (article: Partial<Article>) => {
    try {
      if (editingArticle) {
        // Update existing
        const { error } = await supabase
          .from('articles')
          .update(article)
          .eq('id', editingArticle.id);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Artigo atualizado com sucesso!",
        });
      } else {
        // Create new - ensure required fields
        const newArticle = {
          title: article.title || '',
          excerpt: article.excerpt || '',
          content: article.content,
          category: article.category || 'Geral',
          read_time: article.read_time || '5 min',
          url: article.url,
          sort_order: article.sort_order || 0,
          is_published: article.is_published ?? true,
        };
        
        const { error } = await supabase
          .from('articles')
          .insert([newArticle]);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Artigo criado com sucesso!",
        });
      }

      setEditingArticle(null);
      setIsCreating(false);
      fetchArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o artigo.",
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

  if (isCreating || editingArticle) {
    return (
      <ArticleForm
        article={editingArticle}
        onSave={handleSave}
        onCancel={() => {
          setEditingArticle(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <RetroWindow title="C:\Admin\Artigos">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
        <RetroButton onClick={() => setIsCreating(true)} variant="primary">
          ➕ Novo Artigo
        </RetroButton>
        <RetroButton onClick={fetchArticles}>
          🔄 Atualizar
        </RetroButton>
        <span className="text-xs text-muted-foreground ml-auto">
          {articles.length} artigos
        </span>
      </div>

      {/* Articles List */}
      {articles.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-4xl mb-2">📰</div>
          <p>Nenhum artigo cadastrado.</p>
          <p className="text-sm">Clique em "Novo Artigo" para começar.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex items-center gap-3 p-3 bg-card border border-border-dark retro-outset hover:bg-muted transition-colors"
            >
              <span className="text-2xl">📄</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-retro truncate">{article.title}</h3>
                  <span className="text-xs bg-primary/20 text-primary px-1 border border-primary">
                    {article.category}
                  </span>
                  {!article.is_published && (
                    <span className="text-xs bg-muted px-1 border border-border">
                      Rascunho
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {article.excerpt}
                </p>
              </div>
              <div className="flex gap-1">
                <RetroButton size="sm" onClick={() => setEditingArticle(article)}>
                  ✏️ Editar
                </RetroButton>
                <RetroButton size="sm" onClick={() => handleDelete(article.id)}>
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
