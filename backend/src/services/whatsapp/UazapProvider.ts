import axios from 'axios';
import { IWhatsAppProvider, SendMediaParams, SendMessageParams } from './IWhatsAppProvider';

export class UazapWhatsAppProvider implements IWhatsAppProvider {
  private apiUrl: string;
  private apiToken: string;

  constructor() {
    this.apiUrl = process.env.UAZAP_API_URL || '';
    // Aqui usamos o token global da instância para os disparos
    this.apiToken = process.env.UAZAP_API_KEY || '';

    if (!this.apiUrl || !this.apiToken) {
      console.warn('⚠️ Uazap credentials not fully configured in environment variables.');
    }
  }

  /**
   * Inicializa ou recupera o status da sessão
   */
  async getSessionStatus(tenantId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/instance/status`, {
        headers: {
          'token': this.apiToken,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao buscar sessão no Uazap para o tenant ${tenantId}:`, error?.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Envia uma mensagem de texto via Uazap
   */
  async sendMessage(params: SendMessageParams): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/send/text`, {
        number: params.to,
        text: params.text,
        delay: 1200
      }, {
        headers: {
          'token': this.apiToken,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao enviar mensagem via Uazap (Tenant ${params.tenantId}):`, error?.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Envia mídia via Uazap
   */
  async sendMedia(params: SendMediaParams): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/send/media`, {
        number: params.to,
        media: params.mediaUrl,
        caption: params.caption,
        delay: 1200
      }, {
        headers: {
          'token': this.apiToken,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao enviar mídia via Uazap (Tenant ${params.tenantId}):`, error?.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Registra o Webhook para receber as respostas do cliente no nosso SaaS
   */
  async registerWebhook(tenantId: string, webhookUrl: string): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/webhook/set`, {
        enabled: true,
        url: webhookUrl,
        events: [
          "MESSAGES_UPSERT",
          "MESSAGES_UPDATE",
          "CONNECTION_UPDATE"
        ]
      }, {
        headers: {
          'token': this.apiToken,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao configurar webhook no Uazap (Tenant ${tenantId}):`, error?.response?.data || error.message);
      throw error;
    }
  }
}
