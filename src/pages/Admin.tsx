import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RetroWindow } from '@/components/ui/RetroWindow';
import { RetroButton } from '@/components/ui/RetroButton';
import { useAuth } from '@/hooks/useAuth';
import { ProjectsManager } from '@/components/admin/ProjectsManager';
import { ArticlesManager } from '@/components/admin/ArticlesManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Admin: React.FC = () => {
  // Pegamos os dados, mas IGNORAMOS o isAdmin propositalmente
  const { user, loading, signOut } = useAuth(); 
  const navigate = useNavigate();

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Mostra carregando enquanto verifica a sessão
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center scanlines">
        <RetroWindow title="Carregando..." className="w-80">
          <div className="text-center py-8">
            <div className="text-4xl animate-pulse">⏳</div>
            <p className="mt-2 text-muted-foreground">Carregando sistema...</p>
          </div>
        </RetroWindow>
      </div>
    );
  }

  // AQUI ESTAVA A TRAVA DE SEGURANÇA QUE NÓS REMOVEMOS
  // O código agora pula direto para o painel principal
  
  return (
    <div className="min-h-screen bg-background p-4 scanlines">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-4">
        <RetroWindow title="Painel de Controle - Administrador (Modo Dev)" className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🖥️</span>
              <div>
                <h1 className="font-retro text-lg">Console de Administração</h1>
                <p className="text-xs text-muted-foreground">
                  Logado como: {user?.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <RetroButton onClick={() => navigate('/')}>
                🏠 Ver Site
              </RetroButton>
              <RetroButton onClick={handleSignOut}>
                🚪 Sair
              </RetroButton>
            </div>
          </div>
        </RetroWindow>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="w-full bg-secondary border border-border-dark retro-outset mb-4">
            <TabsTrigger 
              value="projects" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-retro"
            >
              📁 Projetos
            </TabsTrigger>
            <TabsTrigger 
              value="articles" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-retro"
            >
              📰 Artigos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>

          <TabsContent value="articles">
            <ArticlesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;