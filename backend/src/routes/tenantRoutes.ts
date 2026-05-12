import { FastifyInstance } from 'fastify';
import { getTenants } from '../controllers/tenantController';

export default async function tenantRoutes(fastify: FastifyInstance) {
  fastify.get('/', getTenants);
}
