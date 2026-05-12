import fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import tenantRoutes from './routes/tenantRoutes';
import whatsappRoutes from './routes/whatsappRoutes';
import webhookRoutes from './routes/webhookRoutes';

dotenv.config();

const app = fastify({ logger: true });

app.register(cors, {
  origin: '*'
});

// Registrar rotas
app.register(tenantRoutes, { prefix: '/api/tenants' });
app.register(whatsappRoutes, { prefix: '/api/whatsapp' });
app.register(webhookRoutes, { prefix: '/api/webhooks' });

app.get('/health', async (request, reply) => {
  return { status: 'ok', service: 'hermes-saas-backend', timestamp: new Date() };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Backend running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
