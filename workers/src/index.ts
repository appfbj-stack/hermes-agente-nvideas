import dotenv from 'dotenv';
import { startWhatsAppWorker } from './jobs/whatsappWorker';
import { startAiWorker } from './jobs/aiWorker';

dotenv.config();

console.log('🚀 Inicializando BullMQ Workers...');

// Inicia os workers
const whatsappWorker = startWhatsAppWorker();
const aiWorker = startAiWorker();

// Lida com o desligamento gracioso
process.on('SIGTERM', async () => {
  console.log('Encerrando workers...');
  await whatsappWorker.close();
  await aiWorker.close();
  process.exit(0);
});
