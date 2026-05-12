import fastify from 'fastify';
import dotenv from 'dotenv';
import { HermesOrchestrator } from './agents/HermesOrchestrator';

dotenv.config();

const app = fastify({ logger: true });

app.post('/api/hermes/chat', async (request, reply) => {
  try {
    const { tenantId, sessionId, message } = request.body as any;

    if (!tenantId || !sessionId || !message) {
      return reply.status(400).send({ error: 'Missing required parameters' });
    }

    const response = await HermesOrchestrator.handleMessage(tenantId, sessionId, message);

    return reply.send({ success: true, response });
  } catch (error: any) {
    app.log.error(error);
    return reply.status(500).send({ success: false, error: error.message });
  }
});

app.get('/health', async () => {
  return { status: 'ok', service: 'hermes-ai-agent' };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3334;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🧠 Hermes AI Agent running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
