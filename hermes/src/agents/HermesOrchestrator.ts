import OpenAI from 'openai';
import { MemoryManager } from '../memory/MemoryManager';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class HermesOrchestrator {
  static async handleMessage(tenantId: string, sessionId: string, userMessage: string) {
    // 1. Recupera contexto/prompt do Tenant (via Supabase - mockado por enquanto)
    const systemPrompt = "Você é o Hermes, o assistente virtual super inteligente da plataforma. Responda de forma clara, educada e direta.";

    // 2. Salva mensagem do usuário na memória de curto prazo
    await MemoryManager.saveShortTerm(sessionId, { role: 'user', content: userMessage });

    // 3. Recupera o histórico recente da conversa
    const history = await MemoryManager.getShortTerm(sessionId);

    // 4. Monta a estrutura para enviar à OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history
    ];

    try {
      // 5. Chama o modelo de linguagem (LLM)
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages as any,
        temperature: 0.7,
      });

      const aiReply = response.choices[0].message.content || '';

      // 6. Salva a resposta da IA na memória
      await MemoryManager.saveShortTerm(sessionId, { role: 'assistant', content: aiReply });

      return aiReply;
    } catch (error) {
      console.error('Erro ao chamar OpenAI:', error);
      return 'Desculpe, estou passando por uma instabilidade no momento. Tente novamente mais tarde.';
    }
  }
}
