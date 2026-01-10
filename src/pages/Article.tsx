/**
 * Article Page
 * 
 * Individual article view with comments section.
 * Allows visitors to leave comments without login.
 * 
 * @principle Single Responsibility - Only handles article display
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { RetroButton } from '@/components/ui/RetroButton';
import { CommentsSection } from '@/components/sections/CommentsSection';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string | null;
  category: string;
  read_time: string;
  created_at: string;
}

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, excerpt, content, category, read_time, created_at')
          .eq('id', id)
          .eq('is_published', true)
          .maybeSingle();

        if (error) throw error;
        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background scanlines">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <RetroWindow title="Carregando..." className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="text-4xl animate-pulse">⏳</div>
              <p className="mt-2 text-muted-foreground">Carregando artigo...</p>
            </div>
          </RetroWindow>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background scanlines">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <RetroWindow title="Erro 404" className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-xl font-retro text-foreground mb-2">Artigo não encontrado</h2>
              <p className="text-muted-foreground mb-6">
                O artigo que você procura não existe ou foi removido.
              </p>
              <RetroButton onClick={() => navigate('/')}>
                🏠 Voltar ao Início
              </RetroButton>
            </div>
          </RetroWindow>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background scanlines">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Article Content */}
        <RetroWindow title={`C:\\Artigos\\${article.title.replace(/\s+/g, '_')}.txt`} className="max-w-4xl mx-auto">
          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
            <RetroButton size="sm" onClick={() => navigate('/#artigos')}>
              ← Voltar
            </RetroButton>
            <span className="text-xs text-muted-foreground ml-auto">
              📅 {formatDate(article.created_at)} | ⏱️ {article.read_time} | 🏷️ {article.category}
            </span>
          </div>

          {/* Article Header */}
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-retro text-foreground mb-3">
              📰 {article.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {article.excerpt}
            </p>
          </header>

          {/* Article Body */}
          <article className="prose prose-sm max-w-none">
            {article.content ? (
              <div className="p-4 bg-card border border-border retro-inset font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            ) : (
              <div className="p-4 bg-muted border border-border retro-inset text-center text-muted-foreground">
                <p>📝 Conteúdo completo em breve...</p>
              </div>
            )}
          </article>

          {/* Share Bar */}
          <div className="mt-6 pt-4 border-t border-border flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Compartilhar:</span>
            <RetroButton size="sm">📧 Email</RetroButton>
            <RetroButton size="sm">🐦 Twitter</RetroButton>
            <RetroButton size="sm">📋 Copiar Link</RetroButton>
          </div>
        </RetroWindow>

        {/* Comments Section */}
        <CommentsSection articleId={article.id} />
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;
