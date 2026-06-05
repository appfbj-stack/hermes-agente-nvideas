import { Queue } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const aiQueue = new Queue('ai-processing', { connection: connection as any });
export const whatsappQueue = new Queue('whatsapp-messages', { connection: connection as any });
export const crmQueue = new Queue('crm-automation', { connection: connection as any });
