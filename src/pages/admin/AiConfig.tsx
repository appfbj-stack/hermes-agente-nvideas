import React, { useState } from 'react';
import { BrainCircuit, Save, Key, Server, Zap, RefreshCw } from 'lucide-react';

export const AiConfig: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState({
    provider: 'openrouter',
    model: 'deepseek/deepseek-chat',
    apiKey: 'sk-or-v1-****************************************',
    systemPrompt: 'Você é o Hermes, um assistente virtual inteligente criado para ajudar empresas a gerenciar seus negócios, agendar compromissos e atender clientes de forma eficiente.',
    temperature: 0.7,
    maxTokens: 2000
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call to Supabase Edge Functions config
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 h-full overflow-auto pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configuração de IA</h2>
          <p className="text-gray-400 mt-1">Gerencie chaves de API, modelos padrão e prompts de sistema globais.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="glass-button flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-secondary/20 hover:border-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          <span>{isSaving ? 'Salvando...' : 'Salvar Configurações'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Provider & Model */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-secondary/20 text-secondary-light">
                <Server size={20} />
              </div>
              <h3 className="text-lg font-medium">Provedor Principal</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Plataforma de Roteamento</label>
              <select 
                value={config.provider}
                onChange={e => setConfig({...config, provider: e.target.value})}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white"
              >
                <option value="openrouter">OpenRouter (Recomendado)</option>
                <option value="openai">OpenAI Direto</option>
                <option value="anthropic">Anthropic Direto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Modelo Padrão Global</label>
              <select 
                value={config.model}
                onChange={e => setConfig({...config, model: e.target.value})}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white"
              >
                <optgroup label="DeepSeek (Custo-Benefício)">
                  <option value="deepseek/deepseek-chat">DeepSeek Chat V3</option>
                  <option value="deepseek/deepseek-coder">DeepSeek Coder</option>
                </optgroup>
                <optgroup label="OpenAI">
                  <option value="openai/gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </optgroup>
                <optgroup label="Anthropic">
                  <option value="anthropic/claude-3-opus">Claude 3 Opus</option>
                  <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet</option>
                </optgroup>
              </select>
              <p className="text-xs text-gray-500 mt-2">O modelo DeepSeek Chat via OpenRouter oferece o melhor custo-benefício para a maioria das tarefas do Hermes.</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                <Key size={20} />
              </div>
              <h3 className="text-lg font-medium">Autenticação</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Chave de API (OpenRouter)</label>
              <div className="relative">
                <input 
                  type="password"
                  value={config.apiKey}
                  onChange={e => setConfig({...config, apiKey: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white font-mono"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Esta chave será armazenada de forma segura nas variáveis de ambiente (Edge Functions).</p>
            </div>
          </div>
        </div>

        {/* Right Column - Prompt & Tuning */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                <Zap size={20} />
              </div>
              <h3 className="text-lg font-medium">Ajuste Fino Global (Fine-Tuning)</h3>
            </div>

            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-gray-400 mb-2">Prompt de Sistema Base (Global)</label>
              <p className="text-xs text-gray-500 mb-3">Este prompt será injetado antes de qualquer configuração específica de tenant ou módulo.</p>
              <textarea 
                value={config.systemPrompt}
                onChange={e => setConfig({...config, systemPrompt: e.target.value})}
                className="w-full flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-gray-300 resize-none font-mono"
                rows={8}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-400">Temperatura</label>
                  <span className="text-sm text-secondary-light font-mono">{config.temperature}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="2" step="0.1"
                  value={config.temperature}
                  onChange={e => setConfig({...config, temperature: parseFloat(e.target.value)})}
                  className="w-full accent-secondary"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-600">
                  <span>Preciso</span>
                  <span>Criativo</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-400">Max Tokens</label>
                  <span className="text-sm text-secondary-light font-mono">{config.maxTokens}</span>
                </div>
                <input 
                  type="range" 
                  min="256" max="8000" step="256"
                  value={config.maxTokens}
                  onChange={e => setConfig({...config, maxTokens: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-600">
                  <span>Curto</span>
                  <span>Longo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};