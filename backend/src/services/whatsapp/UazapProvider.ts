import axios from 'axios';
import { IWhatsAppProvider, SendMediaParams, SendMessageParams } from './IWhatsAppProvider';

export class UazapWhatsAppProvider implements IWhatsAppProvider {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.UAZAP_API_URL || '';
    this.apiKey = process.env.UAZAP_API_KEY || '';

    if (!this.apiUrl || !this.apiKey) {
      console.warn('⚠️ Uazap credentials not fully configured in environment variables.');
    }
  }

  /**
   * Inicializa ou recupera o status da sessão do Tenant no Uazap
   */
  async getSessionStatus(tenantId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/instance/status/${tenantId}`, {
        headers: {
          'apikey': this.apiKey,
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
      const response = await axios.post(`${this.apiUrl}/message/sendText/${params.tenantId}`, {
        number: params.to,
        options: {
          delay: 1200,
          presence: 'composing'
        },
        textMessage: {
          text: params.text
        }
      }, {
        headers: {
          'apikey': this.apiKey,
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
      const response = await axios.post(`${this.apiUrl}/message/sendMedia/${params.tenantId}`, {
        number: params.to,
        options: {
          delay: 1200,
          presence: 'composing'
        },
        mediaMessage: {
          mediatype: 'document', // Pode precisar de ajuste dinâmico com base na extensão
          caption: params.caption,
          media: params.mediaUrl
        }
      }, {
        headers: {
          'apikey': this.apiKey,
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
      const response = await axios.post(`${this.apiUrl}/webhook/set/${tenantId}`, {
        enabled: true,
        url: webhookUrl,
        webhookBase64: false,
        events: [
          "MESSAGES_UPSERT",
          "MESSAGES_UPDATE",
          "CONNECTION_UPDATE"
        ]
      }, {
        headers: {
          'apikey': this.apiKey,
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
