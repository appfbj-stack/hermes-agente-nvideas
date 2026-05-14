export interface SendMessageParams {
  to: string;
  text: string;
  tenantId: string;
  instanceId?: string;
}

export interface SendMediaParams {
  to: string;
  mediaUrl: string;
  caption?: string;
  tenantId: string;
  instanceId?: string;
}

export interface IWhatsAppProvider {
  /**
   * Inicializa ou recupera o status da sessão para um determinado tenant/instância
   */
  getSessionStatus(tenantId: string, instanceId?: string): Promise<any>;

  /**
   * Envia uma mensagem de texto simples
   */
  sendMessage(params: SendMessageParams): Promise<any>;

  /**
   * Envia um arquivo de mídia (imagem, pdf, audio, etc)
   */
  sendMedia(params: SendMediaParams): Promise<any>;

  /**
   * Registra webhooks na API escolhida para receber as mensagens de volta
   */
  registerWebhook(tenantId: string, webhookUrl: string, instanceId?: string): Promise<any>;
}
