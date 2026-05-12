import fastify from 'fastify';
import cors from '@fastify/cors';

const app = fastify({ logger: true });

app.register(cors, {
  origin: '*'
});

app.get('/health', async (request, reply) => {
  return { status: 'ok', service: 'hermes-saas-backend' };
});

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('Backend running on port 3333');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
