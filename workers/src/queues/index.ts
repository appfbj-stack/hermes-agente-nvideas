import { Queue } from 'bullmq';
import { connection } from '../utils/redis';

export const whatsappQueue = new Queue('whatsapp-messages', { connection: connection as any });
export const aiQueue = new Queue('ai-processing', { connection: connection as any });
export const crmQueue = new Queue('crm-automation', { connection: connection as any });
