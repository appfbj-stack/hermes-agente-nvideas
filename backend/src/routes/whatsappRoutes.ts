import { FastifyInstance } from 'fastify';
import { sendTextMessage, checkSession } from '../controllers/whatsappController';

export default async function whatsappRoutes(fastify: FastifyInstance) {
  fastify.post('/send', sendTextMessage);
  fastify.get('/session/:tenantId', checkSession);
}
