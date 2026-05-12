import { IWhatsAppProvider } from './IWhatsAppProvider';
import { UazapWhatsAppProvider } from './UazapProvider';

export class WhatsAppFactory {
  static getProvider(providerName: 'meta' | 'uazap' | 'evolution' = 'uazap'): IWhatsAppProvider {
    switch (providerName) {
      case 'meta':
        throw new Error('Meta provider not implemented yet.');
      case 'uazap':
        return new UazapWhatsAppProvider();
      case 'evolution':
        throw new Error('Evolution provider not implemented yet.');
      default:
        throw new Error(`Unsupported WhatsApp provider: ${providerName}`);
    }
  }
}
