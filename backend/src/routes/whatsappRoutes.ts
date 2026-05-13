import { FastifyInstance } from 'fastify';
import { sendTextMessage, checkSession } from '../controllers/whatsappController';
import { createInstance, listInstances } from '../controllers/whatsappInstanceController';

export default async function whatsappRoutes(fastify: FastifyInstance) {
  fastify.post('/send', sendTextMessage);
  fastify.get('/session/:tenantId', checkSession);
  
  // Novas rotas Multi-instance SaaS
  fastify.post('/instances/create', createInstance);
  fastify.get('/instances/:tenantId', listInstances);
}
