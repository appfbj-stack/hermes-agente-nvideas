import { FastifyRequest, FastifyReply } from 'fastify';
import { WhatsAppFactory } from '../services/whatsapp/WhatsAppFactory';

export const sendTextMessage = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { tenantId, instanceId, to, text } = request.body as any;

    if (!tenantId || !to || !text) {
      return reply.status(400).send({ error: 'Missing required parameters: tenantId, to, text' });
    }

    // Inicializa o provider que escolhemos (Uazap é o padrão atual)
    const whatsappProvider = WhatsAppFactory.getProvider('uazap');

    // Envia a mensagem
    const result = await whatsappProvider.sendMessage({
      tenantId,
      instanceId,
      to,
      text
    });

    return reply.send({ success: true, result });
  } catch (error: any) {
    request.log.error(error);
    return reply.status(500).send({ success: false, error: error.message });
  }
};

export const checkSession = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { tenantId } = request.params as any;
    const { instanceId } = request.query as any;

    if (!tenantId) {
      return reply.status(400).send({ error: 'Missing tenantId' });
    }

    const whatsappProvider = WhatsAppFactory.getProvider('uazap');
    const result = await whatsappProvider.getSessionStatus(tenantId, instanceId);

    return reply.send({ success: true, status: result });
  } catch (error: any) {
    request.log.error(error);
    return reply.status(500).send({ success: false, error: error.message });
  }
};
