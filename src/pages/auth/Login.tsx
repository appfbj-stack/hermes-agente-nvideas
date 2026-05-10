import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { BrainCircuit } from 'lucide-react';

export const Login: React.FC = () => {
  const { user, role } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Se já estiver logado, redireciona para a área correta
    if (user) {
      const destination = location.state?.from || (role === 'superadmin' ? '/admin' : '/t');
      navigate(destination, { replace: true });
    }
  }, [user, role, navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-primary p-4">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent shadow-lg shadow-secondary/30 mb-6">
            <BrainCircuit size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bem-vindo ao <span className="neon-text-primary">Hermes</span>
          </h1>
          <p className="text-gray-400 mt-2">Acesse sua plataforma inteligente</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#7b68ee',
                    brandAccent: '#9a8cf2',
                    brandButtonText: 'white',
                    defaultButtonBackground: 'rgba(255, 255, 255, 0.05)',
                    defaultButtonBackgroundHover: 'rgba(255, 255, 255, 0.1)',
                    defaultButtonBorder: 'rgba(255, 255, 255, 0.1)',
                    defaultButtonText: 'white',
                    dividerBackground: 'rgba(255, 255, 255, 0.1)',
                    inputBackground: 'rgba(0, 0, 0, 0.3)',
                    inputBorder: 'rgba(255, 255, 255, 0.1)',
                    inputBorderHover: 'rgba(123, 104, 238, 0.5)',
                    inputBorderFocus: '#7b68ee',
                    inputText: 'white',
                    inputPlaceholder: 'rgba(255, 255, 255, 0.4)',
                  },
                  space: {
                    buttonPadding: '12px 16px',
                    inputPadding: '12px 16px',
                  },
                  radii: {
                    borderRadiusButton: '12px',
                    buttonBorderRadius: '12px',
                    inputBorderRadius: '12px',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'transition-all duration-200 font-medium',
                input: 'transition-all duration-200',
                label: 'text-gray-300 font-medium mb-1',
                message: 'text-red-400 text-sm mt-1',
                anchor: 'text-secondary hover:text-secondary-light transition-colors',
                divider: 'my-6',
              }
            }}
            theme="dark"
            providers={['google']}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Endereço de Email',
                  password_label: 'Senha',
                  button_label: 'Entrar',
                  loading_button_label: 'Entrando...',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Já tem uma conta? Entre',
                },
                sign_up: {
                  email_label: 'Endereço de Email',
                  password_label: 'Senha',
                  button_label: 'Criar conta',
                  loading_button_label: 'Criando conta...',
                  social_provider_text: 'Cadastrar com {{provider}}',
                  link_text: 'Não tem uma conta? Cadastre-se',
                },
                forgot_password: {
                  link_text: 'Esqueceu a senha?',
                  button_label: 'Enviar instruções',
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};