/**
 * ArticlesSection Component
 * 
 * "Artigos" section displaying blog posts and articles.
 * Styled as a classic text-based article list with dates.
 * Fetches data from database or uses fallback data.
 * 
 * @principle Single Responsibility - Only handles articles display
 * @principle Open/Closed - Article data can be extended without modification
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

/** Article data structure */
interface Article {
  id: string;
  title: string;
  excerpt: string;
  created_at: string;
  read_time: string;
  category: string;
  url?: string | null;
}

/** Fallback articles data */
const FALLBACK_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Princípios SOLID no Frontend Moderno',
    excerpt: 'Como aplicar os princípios SOLID em aplicações React para código mais limpo e manutenível.',
    created_at: '2024-01-15',
    read_time: '8 min',
    category: 'Arquitetura',
    url: '#',
  },
  {
    id: 'art-2',
    title: 'TypeScript: Além do Básico',
    excerpt: 'Explorando recursos avançados do TypeScript que vão transformar seu código.',
    created_at: '2024-01-08',
    read_time: '12 min',
    category: 'TypeScript',
    url: '#',
  },
];

export const ArticlesSection: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(FALLBACK_ARTICLES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, excerpt, created_at, read_time, category, url')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          setArticles(data);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <RetroWindow title="C:\Artigos\index.html" id="artigos" className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
        <div>
          <h3 className="font-retro text-xl text-foreground">📰 Meus Escritos</h3>
          <p className="text-xs text-muted-foreground">
            Pensamentos sobre código, design e a web
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p>Total: {loading ? '...' : `${articles.length} artigos`}</p>
          <p>Última atualização: {articles[0]?.created_at ? formatDate(articles[0].created_at) : '-'}</p>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-1">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 px-2 py-1 bg-secondary border border-border text-xs font-mono text-muted-foreground">
          <span className="col-span-1">📄</span>
          <span className="col-span-6">Nome</span>
          <span className="col-span-2">Categoria</span>
          <span className="col-span-2">Data</span>
          <span className="col-span-1">⏱️</span>
        </div>

        {/* Article Rows */}
        {articles.map((article, index) => (
          <ArticleRow key={article.id} article={article} isEven={index % 2 === 0} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 p-3 bg-muted border border-border retro-inset text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <span>💡</span>
          <em>
            "Escrever é a melhor forma de aprender. Ensinar é a melhor forma de dominar."
          </em>
        </p>
      </div>
    </RetroWindow>
  );
};

/**
 * ArticleRow Component
 * Single article row in the list view.
 */
interface ArticleRowProps {
  article: Article;
  isEven: boolean;
}

const ArticleRow: React.FC<ArticleRowProps> = ({ article, isEven }) => {
  // Check if it's a database article (UUID format) or fallback
  const isDbArticle = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(article.id);
  const href = isDbArticle ? `/artigo/${article.id}` : (article.url || '#');
  
  const content = (
    <>
      {/* Icon */}
      <span className="col-span-1 text-center">📝</span>

      {/* Title & Excerpt */}
      <div className="col-span-6">
        <p className="font-mono text-sm text-foreground group-hover:text-primary-foreground truncate">
          {article.title}
        </p>
        <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/70 truncate">
          {article.excerpt}
        </p>
      </div>

      {/* Category */}
      <span className="col-span-2 text-xs text-muted-foreground group-hover:text-primary-foreground self-center">
        [{article.category}]
      </span>

      {/* Date */}
      <span className="col-span-2 text-xs text-muted-foreground group-hover:text-primary-foreground self-center">
        {formatDate(article.created_at)}
      </span>

      {/* Read Time */}
      <span className="col-span-1 text-xs text-muted-foreground group-hover:text-primary-foreground self-center text-right">
        {article.read_time}
      </span>
    </>
  );

  const className = cn(
    'grid grid-cols-12 gap-2 px-2 py-2 border border-border',
    'hover:bg-primary hover:text-primary-foreground',
    'transition-colors cursor-pointer group',
    isEven ? 'bg-card' : 'bg-muted/50'
  );

  if (isDbArticle) {
    return (
      <Link to={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {content}
    </a>
  );
};

/**
 * Format date to DD/MM/YY format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

export default ArticlesSection;
