import OpenAI from 'openai';
import { MemoryManager } from '../memory/MemoryManager';
import { supabase } from '../utils/supabase';
import dotenv from 'dotenv';

dotenv.config();

// Fallback to openrouter if OPENAI_API_KEY is not set but OPENROUTER_API_KEY is
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || 'dummy-key',
  baseURL: process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined
});

export class HermesOrchestrator {
  static async handleMessage(tenantId: string, sessionId: string, userMessage: string) {
    // 1. Recupera o contexto do Tenant no Supabase
    let companyName = "Empresa Parceira";
    let appModule = "geral";

    try {
      const { data: tenantData } = await supabase
        .from('tenants')
        .select('name, app_module')
        .eq('id', tenantId)
        .single();
        
      if (tenantData) {
        companyName = tenantData.name;
        appModule = tenantData.app_module;
      }
    } catch (e) {
      console.warn('Could not fetch tenant context:', e);
    }

    // 2. Define a Persona Baseada no Módulo
    let personaContext = "";
    
    if (appModule === 'politica') {
      personaContext = `Você é o assistente virtual do Gabinete do político/campanha "${companyName}". 
Seu objetivo é ser atencioso com os eleitores, coletar demandas para o Gabinete Digital e apoiar as lideranças políticas. 
Sempre mantenha um tom de serviço público e acolhedor.`;
    } else if (appModule === 'oficina') {
      personaContext = `Você é o assistente virtual da oficina mecânica "${companyName}".
Seu objetivo é agendar revisões, tirar dúvidas básicas sobre orçamentos, verificar status de ordens de serviço (OS) e avisar quando o veículo está pronto.
Sempre mantenha um tom profissional e prestativo.`;
    } else if (appModule === 'igreja') {
      personaContext = `Você é o assistente virtual da secretaria pastoral da igreja "${companyName}".
Seu objetivo é auxiliar membros com a agenda de cultos, informações sobre células, eventos e receber pedidos de oração.
Sempre mantenha um tom respeitoso, acolhedor e cristão.`;
    } else {
      personaContext = `Você é o assistente virtual da empresa "${companyName}".
Seu objetivo é fazer o atendimento ao cliente, qualificar leads e ajudar nas dúvidas gerais.`;
    }

    const systemPrompt = `${personaContext}\nResponda de forma clara, educada e direta. Você se chama Hermes.`;

    // 3. Salva mensagem do usuário na memória de curto prazo
    await MemoryManager.saveShortTerm(sessionId, { role: 'user', content: userMessage });

    // 4. Recupera o histórico recente da conversa
    const history = await MemoryManager.getShortTerm(sessionId);

    // 5. Monta a estrutura para enviar à OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history
    ];

    try {
      // 6. Chama o modelo de linguagem (LLM)
      const response = await openai.chat.completions.create({
        model: process.env.OPENROUTER_API_KEY ? 'deepseek/deepseek-chat' : 'gpt-4o-mini',
        messages: messages as any,
        temperature: 0.7,
      });

      const aiReply = response.choices[0].message.content || '';

      // 7. Salva a resposta da IA na memória
      await MemoryManager.saveShortTerm(sessionId, { role: 'assistant', content: aiReply });

      return aiReply;
    } catch (error) {
      console.error('Erro ao chamar IA:', error);
      return 'Desculpe, estou passando por uma instabilidade no momento. Tente novamente mais tarde.';
    }
  }
}
