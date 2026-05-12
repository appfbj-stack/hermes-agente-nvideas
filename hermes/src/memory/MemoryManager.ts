import { redis } from '../utils/redis';

export class MemoryManager {
  /**
   * Armazena o histórico recente na memória RAM (Redis) para resposta rápida
   */
  static async saveShortTerm(sessionId: string, message: any) {
    const key = `session:${sessionId}:history`;
    await redis.rpush(key, JSON.stringify(message));
    // Expira em 24h
    await redis.expire(key, 86400);
  }

  static async getShortTerm(sessionId: string): Promise<any[]> {
    const key = `session:${sessionId}:history`;
    const data = await redis.lrange(key, 0, -1);
    return data.map(item => JSON.parse(item));
  }

  static async clearShortTerm(sessionId: string) {
    await redis.del(`session:${sessionId}:history`);
  }
}
