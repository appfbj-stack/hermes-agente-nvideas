import dotenv from 'dotenv';
import { startWhatsAppWorker } from './jobs/whatsappWorker';

dotenv.config();

console.log('🚀 Inicializando BullMQ Workers...');

// Inicia os workers
const whatsappWorker = startWhatsAppWorker();

// Lida com o desligamento gracioso
process.on('SIGTERM', async () => {
  console.log('Encerrando workers...');
  await whatsappWorker.close();
  process.exit(0);
});
