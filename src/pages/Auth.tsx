/**
 * Auth Page
 * 
 * Login and signup page with retro Windows aesthetic.
 * Styled as a classic login dialog.
 * 
 * @principle Single Responsibility - Only handles authentication UI
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { RetroButton } from '@/components/ui/RetroButton';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate input
    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message === 'Invalid login credentials' 
            ? 'Credenciais inválidas. Verifique seu email e senha.' 
            : error.message);
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            setError('Este email já está cadastrado.');
          } else {
            setError(error.message);
          }
        } else {
          setError(null);
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError('Erro ao processar requisição.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 scanlines">
      <RetroWindow 
        title={isLogin ? "Logon do Windows" : "Criar Conta"} 
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">🔐</div>
          <p className="text-sm text-muted-foreground">
            {isLogin 
              ? 'Digite suas credenciais para acessar o sistema.' 
              : 'Crie sua conta para acessar o sistema.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-retro">
              📧 Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-sm focus:outline-none focus:border-primary"
              placeholder="usuario@exemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-retro">
              🔑 Senha:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-card border-2 border-border-dark retro-inset font-mono text-sm focus:outline-none focus:border-primary"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/20 border border-destructive text-destructive text-sm retro-inset">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <RetroButton 
              type="submit" 
              variant="primary" 
              className="flex-1"
              disabled={loading}
            >
              {loading ? '⏳ Aguarde...' : (isLogin ? '✓ Entrar' : '✓ Cadastrar')}
            </RetroButton>
            <RetroButton 
              type="button" 
              onClick={() => navigate('/')}
            >
              ✕ Cancelar
            </RetroButton>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-border text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin 
              ? 'Não tem uma conta? Cadastre-se' 
              : 'Já tem uma conta? Faça login'}
          </button>
        </div>

        <div className="mt-4 text-xs text-muted-foreground text-center">
          💡 Dica: Apenas administradores podem editar projetos e artigos.
        </div>
      </RetroWindow>
    </div>
  );
};

export default Auth;
