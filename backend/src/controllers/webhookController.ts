import { FastifyRequest, FastifyReply } from 'fastify';
import { aiQueue } from '../queues';

export const handleUazapWebhook = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { tenantId } = request.params as { tenantId: string };
    const payload = request.body as any;

    console.log(`[Webhook] Evento recebido da Uazap para Tenant ${tenantId}: ${payload.event}`);

    // Uazap dispara eventos como "MESSAGES_UPSERT" quando chega mensagem
    if (payload.event === 'MESSAGES_UPSERT' || payload.event === 'messages.upsert') {
      // O formato do payload da Uazapi costuma encapsular as mensagens
      const messages = payload.data?.messages || payload.messages || [];
      
      for (const msg of messages) {
        // Ignorar mensagens que nós mesmos enviamos (evitar loop infinito)
        if (msg.key?.fromMe) continue;

        // O número remoto pode vir com @s.whatsapp.net
        const remoteJid = msg.key?.remoteJid;
        const senderNumber = remoteJid?.split('@')[0];
        
        // Pega o texto da mensagem, seja texto simples ou estendido
        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;

        if (senderNumber && text && !remoteJid?.includes('@g.us')) {
          console.log(`[Webhook] Mensagem real de ${senderNumber}: ${text}`);
          
          // Colocamos a mensagem na Fila da IA (BullMQ) para o Worker processar em background
          await aiQueue.add('process-ai', {
            tenantId,
            from: senderNumber,
            text: text,
            sessionId: senderNumber // O número de quem mandou é a sessão dele
          });
        }
      }
    }

    // Sempre responda 200 OK rapidamente para o webhook não dar timeout
    return reply.status(200).send({ success: true });
  } catch (error: any) {
    request.log.error(error);
    return reply.status(500).send({ success: false, error: error.message });
  }
};
