import React, { useState, useRef, useEffect } from 'react';
import { Search, MoreVertical, Paperclip, Smile, Mic, Send, Check, CheckCheck, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
}

interface WAMessage {
  id: string;
  text: string;
  time: string;
  isMe: boolean;
  status: 'sent' | 'delivered' | 'read';
}

// Mock Data
const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'João Silva', phone: '5511999999999', lastMessage: 'Perfeito, aguardo o contrato.', time: '10:45', unread: 2, isOnline: true },
  { id: '2', name: 'Maria Souza', phone: '5511888888888', lastMessage: 'Bom dia! Tem disponibilidade hoje?', time: '09:30', unread: 0, isOnline: false },
  { id: '3', name: 'Carlos Empresa', phone: '5511777777777', lastMessage: 'Obrigado pelo atendimento.', time: 'Ontem', unread: 0, isOnline: true },
  { id: '4', name: 'Ana Cliente Novo', phone: '5511666666666', lastMessage: 'Pode me enviar o catálogo?', time: 'Ontem', unread: 1, isOnline: false },
];

const MOCK_MESSAGES: Record<string, WAMessage[]> = {
  '1': [
    { id: 'm1', text: 'Olá João, tudo bem? Sou da Acme Corp.', time: '10:30', isMe: true, status: 'read' },
    { id: 'm2', text: 'Tudo ótimo! Recebi a proposta de vocês.', time: '10:35', isMe: false, status: 'read' },
    { id: 'm3', text: 'Excelente. Posso gerar o contrato então?', time: '10:40', isMe: true, status: 'read' },
    { id: 'm4', text: 'Perfeito, aguardo o contrato.', time: '10:45', isMe: false, status: 'read' },
  ]
};

export const WhatsAppClone: React.FC = () => {
  const { tenantId } = useAuthStore();
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, WAMessage[]>>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedContact = contacts.find(c => c.id === selectedContactId);
  const currentMessages = selectedContactId ? (messages[selectedContactId] || []) : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedContact || isSending) return;

    const newMessage: WAMessage = {
      id: Date.now().toString(),
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sent'
    };

    // Update UI immediately
    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
    }));
    
    // Update last message in contact list
    setContacts(prev => prev.map(c => 
      c.id === selectedContact.id 
        ? { ...c, lastMessage: inputText, time: newMessage.time } 
        : c
    ));

    const textToSend = inputText;
    setInputText('');
    setIsSending(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333';
      
      // Call Backend to send via Uazap using the real tenantId
      await fetch(`${backendUrl}/api/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: tenantId || 'tenant_demo_123',
          to: selectedContact.phone,
          text: textToSend
        })
      });

      // Update status to delivered (mocking successful send)
      setMessages(prev => {
        const chatMsgs = prev[selectedContact.id] || [];
        const updatedMsgs = chatMsgs.map(m => m.id === newMessage.id ? { ...m, status: 'delivered' as const } : m);
        return { ...prev, [selectedContact.id]: updatedMsgs };
      });

    } catch (error) {
      console.error('Erro ao enviar whatsapp:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectContact = (id: string) => {
    setSelectedContactId(id);
    // Mark as read
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  return (
    <div className="flex h-full w-full bg-[#111b21] rounded-2xl overflow-hidden shadow-2xl border border-white/5 font-sans">
      
      {/* Left Sidebar - Contacts List */}
      <div className="w-full md:w-[380px] lg:w-[420px] flex-shrink-0 flex flex-col border-r border-white/10 bg-[#111b21] z-10 transition-all">
        
        {/* Header */}
        <div className="h-16 bg-[#202c33] flex items-center justify-between px-4 shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
            <User size={24} className="text-gray-300" />
          </div>
          <div className="flex items-center gap-4 text-[#aebac1]">
            <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-2 bg-[#111b21] border-b border-white/5">
          <div className="bg-[#202c33] rounded-lg flex items-center px-3 py-1.5 gap-3">
            <Search size={18} className="text-[#aebac1]" />
            <input 
              type="text" 
              placeholder="Pesquisar ou começar uma nova conversa" 
              className="bg-transparent border-none outline-none text-[#d1d7db] text-sm w-full placeholder:text-[#8696a0]"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {contacts.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => handleSelectContact(contact.id)}
              className={`flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-[#202c33] transition-colors ${selectedContactId === contact.id ? 'bg-[#2a3942]' : ''}`}
            >
              <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 relative">
                <User size={24} className="text-gray-300" />
              </div>
              <div className="flex-1 min-w-0 border-b border-white/5 pb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#e9edef] font-medium truncate">{contact.name}</span>
                  <span className={`text-xs ${contact.unread > 0 ? 'text-[#00a884] font-medium' : 'text-[#8696a0]'}`}>
                    {contact.time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8696a0] text-sm truncate">{contact.lastMessage}</span>
                  {contact.unread > 0 && (
                    <span className="bg-[#00a884] text-[#111b21] text-[11px] font-bold px-1.5 min-w-[20px] h-5 rounded-full flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Area - Main Chat */}
      <div className={`flex-1 flex flex-col bg-[#0b141a] relative ${!selectedContactId ? 'hidden md:flex' : 'flex'}`}>
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="h-16 bg-[#202c33] flex items-center justify-between px-4 shrink-0 z-10">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                  <User size={24} className="text-gray-300" />
                </div>
                <div>
                  <h2 className="text-[#e9edef] font-medium">{selectedContact.name}</h2>
                  <p className="text-[#8696a0] text-xs">
                    {selectedContact.isOnline ? 'online' : 'visto por último hoje às ' + selectedContact.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[#aebac1]">
                <button className="hover:bg-white/10 p-2 rounded-full transition-colors"><Search size={20} /></button>
                <button className="hover:bg-white/10 p-2 rounded-full transition-colors"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Chat Messages */}
            <div 
              className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 relative"
              style={{
                backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                backgroundRepeat: 'repeat',
                backgroundSize: '400px',
                opacity: 0.8
              }}
            >
              {/* Overlay para escurecer o background padrao do whatsapp */}
              <div className="absolute inset-0 bg-[#0b141a]/80 z-0"></div>
              
              <div className="relative z-10 flex flex-col space-y-1.5">
                <div className="flex justify-center mb-4">
                  <span className="bg-[#182229] text-[#8696a0] text-xs px-3 py-1 rounded-lg uppercase shadow-sm">
                    Hoje
                  </span>
                </div>

                {currentMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] md:max-w-[65%] rounded-lg px-3 py-1.5 relative shadow-sm ${
                        msg.isMe 
                          ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none' 
                          : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'
                      }`}
                    >
                      <span className="text-[14px] leading-relaxed break-words block pb-3">{msg.text}</span>
                      <div className="absolute bottom-1 right-2 flex items-center gap-1">
                        <span className="text-[10px] text-white/60">{msg.time}</span>
                        {msg.isMe && (
                          msg.status === 'read' ? <CheckCheck size={14} className="text-[#53bdeb]" /> :
                          msg.status === 'delivered' ? <CheckCheck size={14} className="text-white/60" /> :
                          <Check size={14} className="text-white/60" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="min-h-[62px] bg-[#202c33] flex items-center px-4 py-2 gap-2 shrink-0 z-10">
              <button className="text-[#8696a0] hover:text-[#aebac1] p-2 rounded-full transition-colors">
                <Smile size={24} />
              </button>
              <button className="text-[#8696a0] hover:text-[#aebac1] p-2 rounded-full transition-colors">
                <Paperclip size={24} />
              </button>
              
              <form onSubmit={handleSendMessage} className="flex-1 flex items-center">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Mensagem"
                  className="w-full bg-[#2a3942] text-[#d1d7db] rounded-lg px-4 py-2.5 outline-none border-none placeholder:text-[#8696a0]"
                />
              </form>
              
              {inputText.trim() ? (
                <button 
                  onClick={handleSendMessage}
                  disabled={isSending}
                  className="text-[#8696a0] hover:text-[#aebac1] p-2 rounded-full transition-colors"
                >
                  <Send size={24} />
                </button>
              ) : (
                <button className="text-[#8696a0] hover:text-[#aebac1] p-2 rounded-full transition-colors">
                  <Mic size={24} />
                </button>
              )}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center bg-[#222e35] border-b-[6px] border-[#00a884]">
            <div className="w-[320px] h-[200px] bg-[url('https://static.whatsapp.net/rsrc.php/v3/y6/r/wa669aeJeom.png')] bg-contain bg-center opacity-80 mb-8"></div>
            <h1 className="text-3xl text-[#e9edef] font-light mb-4">WhatsApp Web SaaS</h1>
            <p className="text-[#8696a0] text-sm text-center max-w-md">
              Envie e receba mensagens rapidamente. Integrado com a Uazap API e a Inteligência Artificial do Hermes.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};