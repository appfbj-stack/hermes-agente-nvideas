import { FastifyRequest, FastifyReply } from 'fastify';
import { aiQueue } from '../queues';
import { supabase } from '../utils/supabase';

export const handleUazapWebhook = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { instanceId } = request.params as { instanceId: string };
    const payload = request.body as any;

    // 1. Busca a instância no banco para descobrir o Tenant
    const { data: instanceData, error: instanceError } = await supabase
      .from('whatsapp_instances')
      .select('tenant_id, status')
      .eq('id', instanceId)
      .single();

    if (instanceError || !instanceData) {
      console.error(`[Webhook] Instância não encontrada ou inválida: ${instanceId}`);
      return reply.status(404).send({ error: 'Instance not found' });
    }

    const tenantId = instanceData.tenant_id;

    console.log(`[Webhook] Evento recebido da Uazap para Instância ${instanceId} (Tenant ${tenantId}): ${payload.event}`);

    // 2. Salva o log do webhook (Auditoria)
    await supabase.from('whatsapp_webhook_logs').insert({
      tenant_id: tenantId,
      instance_id: instanceId,
      event: payload.event,
      payload: payload
    });

    // 3. Atualiza o status da instância se for evento de conexão
    if (payload.event === 'CONNECTION_UPDATE' || payload.event === 'connection.update') {
      const state = payload.data?.state || payload.state;
      if (state === 'open') {
        await supabase.from('whatsapp_instances').update({ status: 'connected' }).eq('id', instanceId);
      } else if (state === 'close') {
        await supabase.from('whatsapp_instances').update({ status: 'disconnected' }).eq('id', instanceId);
      }
    }

    // 4. Processa mensagens recebidas
    if (payload.event === 'MESSAGES_UPSERT' || payload.event === 'messages.upsert') {
      const messages = payload.data?.messages || payload.messages || [];
      
      for (const msg of messages) {
        if (msg.key?.fromMe) continue;

        const remoteJid = msg.key?.remoteJid;
        const senderNumber = remoteJid?.split('@')[0];
        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;

        if (senderNumber && text && !remoteJid?.includes('@g.us')) {
          console.log(`[Webhook] Mensagem real de ${senderNumber}: ${text}`);
          
          // Envia para o Worker de IA
          await aiQueue.add('process-ai', {
            tenantId,
            instanceId,
            from: senderNumber,
            text: text,
            sessionId: senderNumber
          });
        }
      }
    }

    return reply.status(200).send({ success: true });
  } catch (error: any) {
    request.log.error(error);
    return reply.status(500).send({ success: false, error: error.message });
  }
};
