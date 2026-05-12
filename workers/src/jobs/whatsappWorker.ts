import { Worker } from 'bullmq';
import { connection } from '../utils/redis';

export const startWhatsAppWorker = () => {
  const worker = new Worker(
    'whatsapp-messages',
    async (job) => {
      console.log(`[WhatsApp Worker] Processando Job ${job.id}:`, job.data);
      // Aqui vamos integrar com o WhatsAppFactory do backend depois
      
      // Simula um processamento demorado (envio de mensagem)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`[WhatsApp Worker] Job ${job.id} concluído!`);
    },
    { connection }
  );

  worker.on('failed', (job, err) => {
    console.error(`[WhatsApp Worker] Job ${job?.id} falhou:`, err);
  });

  return worker;
};
