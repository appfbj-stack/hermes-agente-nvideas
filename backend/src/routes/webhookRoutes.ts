import { FastifyInstance } from 'fastify';
import { handleUazapWebhook } from '../controllers/webhookController';

export default async function webhookRoutes(fastify: FastifyInstance) {
  fastify.post('/uazap/:instanceId', handleUazapWebhook);
}
