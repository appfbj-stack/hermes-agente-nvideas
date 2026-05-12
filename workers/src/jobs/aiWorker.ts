import { Worker } from 'bullmq';
import { connection } from '../utils/redis';
import { whatsappQueue } from '../queues';
import axios from 'axios';

export const startAiWorker = () => {
  const worker = new Worker(
    'ai-processing',
    async (job) => {
      console.log(`[AI Worker] Processando Job ${job.id}:`, job.data);
      const { tenantId, from, text, sessionId } = job.data;
      
      const hermesUrl = process.env.HERMES_URL || 'http://localhost:3334';
      
      try {
        // 1. Envia a mensagem do cliente para o microserviço do Hermes (IA) processar
        const response = await axios.post(`${hermesUrl}/api/hermes/chat`, {
          tenantId,
          sessionId,
          message: text
        });

        const aiReply = response.data?.response;

        if (aiReply) {
          console.log(`[AI Worker] Resposta do Hermes gerada. Colocando na fila de disparo do WhatsApp...`);
          
          // 2. Coloca a resposta pronta na fila de disparo do WhatsApp
          await whatsappQueue.add('send-whatsapp', {
            tenantId,
            to: from,
            text: aiReply
          });
        }
        
        console.log(`[AI Worker] Job ${job.id} processado pela IA com sucesso!`);
      } catch (error: any) {
        console.error(`[AI Worker] Falha ao processar mensagem na IA:`, error.message);
        throw error;
      }
    },
    { connection }
  );

  worker.on('failed', (job, err) => {
    console.error(`[AI Worker] Job ${job?.id} falhou:`, err);
  });

  return worker;
};
