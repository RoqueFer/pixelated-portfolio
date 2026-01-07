/**
 * ArticlesSection Component
 * 
 * "Artigos" section displaying blog posts and articles.
 * Styled as a classic text-based article list with dates.
 * 
 * @principle Single Responsibility - Only handles articles display
 * @principle Open/Closed - Article data can be extended without modification
 */

import React from 'react';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { cn } from '@/lib/utils';

/** Article data structure */
interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  url?: string;
}

/** Sample articles data - can be moved to external config */
const ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Princípios SOLID no Frontend Moderno',
    excerpt: 'Como aplicar os princípios SOLID em aplicações React para código mais limpo e manutenível.',
    date: '2024-01-15',
    readTime: '8 min',
    category: 'Arquitetura',
    url: '#',
  },
  {
    id: 'art-2',
    title: 'TypeScript: Além do Básico',
    excerpt: 'Explorando recursos avançados do TypeScript que vão transformar seu código.',
    date: '2024-01-08',
    readTime: '12 min',
    category: 'TypeScript',
    url: '#',
  },
  {
    id: 'art-3',
    title: 'A Nostalgia da Web dos Anos 2000',
    excerpt: 'Uma reflexão sobre o design web do passado e o movimento Indie Web.',
    date: '2024-01-02',
    readTime: '5 min',
    category: 'Reflexão',
    url: '#',
  },
  {
    id: 'art-4',
    title: 'CSS Custom Properties: Guia Completo',
    excerpt: 'Dominando variáveis CSS para criar sistemas de design flexíveis e mantíveis.',
    date: '2023-12-20',
    readTime: '10 min',
    category: 'CSS',
    url: '#',
  },
];

export const ArticlesSection: React.FC = () => {
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
          <p>Total: {ARTICLES.length} artigos</p>
          <p>Última atualização: {ARTICLES[0]?.date}</p>
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
        {ARTICLES.map((article, index) => (
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

const ArticleRow: React.FC<ArticleRowProps> = ({ article, isEven }) => (
  <a
    href={article.url}
    className={cn(
      'grid grid-cols-12 gap-2 px-2 py-2 border border-border',
      'hover:bg-primary hover:text-primary-foreground',
      'transition-colors cursor-pointer group',
      isEven ? 'bg-card' : 'bg-muted/50'
    )}
  >
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
      {formatDate(article.date)}
    </span>

    {/* Read Time */}
    <span className="col-span-1 text-xs text-muted-foreground group-hover:text-primary-foreground self-center text-right">
      {article.readTime}
    </span>
  </a>
);

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
