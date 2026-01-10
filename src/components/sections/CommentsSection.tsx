/**
 * CommentsSection Component
 * 
 * Public comments section for articles.
 * Allows visitors to post comments without login.
 * 
 * @principle Single Responsibility - Only handles comments display and submission
 */

import React, { useState, useEffect } from 'react';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { RetroButton } from '@/components/ui/RetroButton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { cn } from '@/lib/utils';

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface CommentsSectionProps {
  articleId: string;
}

const commentSchema = z.object({
  author_name: z.string().trim().min(2, 'Nome deve ter no mínimo 2 caracteres').max(50, 'Nome muito longo'),
  content: z.string().trim().min(5, 'Comentário deve ter no mínimo 5 caracteres').max(1000, 'Comentário muito longo'),
});

export const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('comments-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `article_id=eq.${articleId}`,
        },
        (payload) => {
          const newComment = payload.new as Comment;
          setComments(prev => [newComment, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [articleId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('id, author_name, content, created_at')
        .eq('article_id', articleId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate input
    const validation = commentSchema.safeParse({ author_name: authorName, content });
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.errors.forEach(err => {
        newErrors[err.path[0] as string] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          article_id: articleId,
          author_name: authorName.trim(),
          content: content.trim(),
        }]);

      if (error) throw error;

      setAuthorName('');
      setContent('');
      toast({
        title: "Comentário enviado!",
        description: "Obrigado por compartilhar sua opinião.",
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o comentário.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <RetroWindow title="C:\\Comentários" className="max-w-4xl mx-auto">
      {/* Comment Form */}
      <div className="mb-6 p-4 bg-muted border border-border retro-inset">
        <h3 className="font-retro text-lg mb-4 flex items-center gap-2">
          ✍️ Deixe seu comentário
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-retro">
              👤 Seu nome:
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-sm focus:outline-none focus:border-primary"
              placeholder="Visitante anônimo"
              maxLength={50}
            />
            {errors.author_name && (
              <p className="text-xs text-destructive">{errors.author_name}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-retro">
              💬 Comentário:
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-sm h-24 resize-none focus:outline-none focus:border-primary"
              placeholder="Escreva seu comentário aqui..."
              maxLength={1000}
            />
            {errors.content && (
              <p className="text-xs text-destructive">{errors.content}</p>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {content.length}/1000
            </p>
          </div>

          <div className="flex gap-2">
            <RetroButton type="submit" variant="primary" disabled={submitting}>
              {submitting ? '⏳ Enviando...' : '📤 Enviar Comentário'}
            </RetroButton>
            <RetroButton 
              type="button" 
              onClick={() => { setAuthorName(''); setContent(''); setErrors({}); }}
            >
              🗑️ Limpar
            </RetroButton>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-retro text-lg">
            💬 Comentários ({comments.length})
          </h3>
          <RetroButton size="sm" onClick={fetchComments}>
            🔄 Atualizar
          </RetroButton>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-4xl animate-pulse">⏳</div>
            <p className="mt-2 text-muted-foreground text-sm">Carregando comentários...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📭</div>
            <p>Nenhum comentário ainda.</p>
            <p className="text-sm">Seja o primeiro a comentar!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {comments.map((comment, index) => (
              <CommentCard 
                key={comment.id} 
                comment={comment} 
                isEven={index % 2 === 0}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-border text-xs text-muted-foreground">
        <p>💡 Dica: Os comentários são públicos e atualizados em tempo real.</p>
      </div>
    </RetroWindow>
  );
};

/**
 * CommentCard Component
 */
interface CommentCardProps {
  comment: Comment;
  isEven: boolean;
  formatDate: (date: string) => string;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, isEven, formatDate }) => (
  <div className={cn(
    'p-3 border border-border',
    isEven ? 'bg-card' : 'bg-muted/50'
  )}>
    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg">👤</span>
      <span className="font-retro text-sm text-foreground">
        {comment.author_name}
      </span>
      <span className="text-xs text-muted-foreground ml-auto">
        📅 {formatDate(comment.created_at)}
      </span>
    </div>
    <p className="text-sm text-muted-foreground font-mono pl-7 whitespace-pre-wrap">
      {comment.content}
    </p>
  </div>
);

export default CommentsSection;
