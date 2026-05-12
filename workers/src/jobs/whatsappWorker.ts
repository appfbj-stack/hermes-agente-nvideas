import { Worker } from 'bullmq';
import { connection } from '../utils/redis';
// Simula a injeção do axios para não precisar importar todo o backend aqui
import axios from 'axios';

export const startWhatsAppWorker = () => {
  const worker = new Worker(
    'whatsapp-messages',
    async (job) => {
      console.log(`[WhatsApp Worker] Processando Job ${job.id}:`, job.data);
      const { tenantId, to, text } = job.data;
      
      // Chama o endpoint local do backend que já implementa a lógica do Uazap
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:3333';
      
      try {
        await axios.post(`${backendUrl}/api/whatsapp/send`, {
          tenantId,
          to,
          text
        });
        console.log(`[WhatsApp Worker] Job ${job.id} concluído com sucesso via Uazap!`);
      } catch (error: any) {
        console.error(`[WhatsApp Worker] Falha ao enviar mensagem:`, error.message);
        throw error;
      }
    },
    { connection }
  );

  worker.on('failed', (job, err) => {
    console.error(`[WhatsApp Worker] Job ${job?.id} falhou:`, err);
  });

  return worker;
};
