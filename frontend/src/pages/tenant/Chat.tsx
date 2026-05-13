import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Paperclip, MoreVertical, Sparkles, MessageSquare, Phone } from 'lucide-react';
import { generateChatResponse, ChatMessage } from '../../lib/openrouter';
import { WhatsAppClone } from '../../components/whatsapp/WhatsAppClone';

export const HermesChat: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hermes' | 'whatsapp'>('whatsapp');
  
  // Hermes AI State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Olá! Sou o Hermes, seu assistente inteligente. Como posso ajudar você e sua empresa hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendHermes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const contextMessages: ChatMessage[] = [
        { role: 'system', content: 'Você é o Hermes, um assistente virtual inteligente e proativo.' },
        ...messages,
        userMessage
      ];

      const response = await generateChatResponse(contextMessages);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response || 'Desculpe, não consegui gerar uma resposta.' }]);
    } catch (error) {
      console.error('Failed to get response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Ocorreu um erro ao conectar com o serviço de IA. Por favor, verifique a chave da API (OpenRouter) no painel do Superadmin.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-primary/50 relative">
      {/* Tabs Header */}
      <div className="glass-panel border-b border-white/10 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 z-10 shrink-0">
        <div className="flex bg-primary p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('hermes')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
              activeTab === 'hermes' 
                ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot size={18} />
            <span className="font-medium">Hermes IA</span>
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
              activeTab === 'whatsapp' 
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare size={18} />
            <span className="font-medium">Atendimento (WhatsApp)</span>
          </button>
        </div>

        {activeTab === 'hermes' && (
          <div className="flex items-center gap-2">
            <span className="bg-secondary/20 text-secondary-light text-xs px-3 py-1 rounded-full border border-secondary/30 flex items-center gap-1">
              <Sparkles size={12} />
              OpenRouter / DeepSeek
            </span>
          </div>
        )}
        
        {activeTab === 'whatsapp' && (
          <div className="flex items-center gap-2">
            <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30 flex items-center gap-1">
              <Phone size={12} />
              Uazap API Conectada
            </span>
          </div>
        )}
      </div>

      {activeTab === 'hermes' ? (
        <>
          {/* Messages Area - Hermes */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-white/10' : 'bg-secondary/20 text-secondary-light border border-secondary/30'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                
                <div className={`px-5 py-3.5 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-secondary/80 text-white rounded-tr-sm' 
                    : 'glass-panel rounded-tl-sm text-gray-200'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 max-w-4xl mx-auto">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-secondary/20 text-secondary-light border border-secondary/30">
                  <Bot size={16} />
                </div>
                <div className="glass-panel px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary-light animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-secondary-light animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-secondary-light animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Hermes */}
          <div className="p-6 bg-gradient-to-t from-primary via-primary to-transparent z-10 shrink-0">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSendHermes} className="glass-panel rounded-2xl p-2 flex items-end gap-2 border-white/20 focus-within:border-secondary/50 focus-within:shadow-[0_0_20px_rgba(123,104,238,0.15)] transition-all">
                <button type="button" className="p-3 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors shrink-0">
                  <Paperclip size={20} />
                </button>
                
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendHermes(e);
                    }
                  }}
                  placeholder="Digite sua mensagem para o Hermes..."
                  className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none outline-none py-3 text-white placeholder-gray-500"
                  rows={1}
                />
                
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-3 bg-secondary hover:bg-secondary-light text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-lg shadow-secondary/20"
                >
                  <Send size={20} />
                </button>
              </form>
              <div className="text-center mt-3">
                <p className="text-xs text-gray-500">Hermes pode cometer erros. Considere verificar informações importantes.</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Disparo WhatsApp Area (Clone do WhatsApp Web) */
        <div className="flex-1 p-2 md:p-4 lg:p-6 overflow-hidden flex justify-center items-center">
          <div className="w-full max-w-7xl h-[calc(100vh-140px)] min-h-[600px]">
            <WhatsAppClone />
          </div>
        </div>
      )}
    </div>
  );
};