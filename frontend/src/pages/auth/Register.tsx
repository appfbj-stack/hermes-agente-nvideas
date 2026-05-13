import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BrainCircuit, Building2, Wrench, BookOpen, Flag } from 'lucide-react';

const MODULES = {
  politica: { title: 'CRM Político', icon: Flag, color: 'text-blue-400' },
  oficina: { title: 'Oficina Mecânica', icon: Wrench, color: 'text-orange-400' },
  igreja: { title: 'Gestão Pastoral', icon: BookOpen, color: 'text-purple-400' },
  geral: { title: 'CRM Empresarial', icon: Building2, color: 'text-secondary-light' }
};

export const Register: React.FC = () => {
  const { moduleName } = useParams<{ moduleName: string }>();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Verifica se o módulo da URL existe, senão cai no 'geral'
  const appModule = moduleName && MODULES[moduleName as keyof typeof MODULES] ? moduleName : 'geral';
  const moduleInfo = MODULES[appModule as keyof typeof MODULES];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            app_module: appModule,
            company_name: companyName,
          }
        }
      });

      if (signUpError) throw signUpError;

      // Sucesso!
      alert('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login');
      
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

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
            Criar conta no <span className="neon-text-primary">Hermes</span>
          </h1>
          
          <div className="mt-4 flex items-center justify-center gap-2 bg-white/5 py-2 px-4 rounded-full border border-white/10 w-max mx-auto">
            <moduleInfo.icon size={18} className={moduleInfo.color} />
            <span className="text-gray-300 text-sm">Módulo Selecionado: <strong>{moduleInfo.title}</strong></span>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-4">
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-300 font-medium mb-1 text-sm">Nome da Empresa / Campanha</label>
              <input 
                type="text" 
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                placeholder="Ex: Campanha 2024"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1 text-sm">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1 text-sm">Senha</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-secondary hover:bg-secondary-light text-white font-medium py-3 rounded-xl mt-6 transition-all disabled:opacity-50"
            >
              {loading ? 'Criando conta...' : 'Cadastrar e Acessar'}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400 text-sm">
            Já tem uma conta? <Link to="/login" className="text-secondary hover:text-secondary-light">Fazer Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};