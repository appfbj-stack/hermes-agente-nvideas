import { IWhatsAppProvider } from './IWhatsAppProvider';

export class WhatsAppFactory {
  static getProvider(providerName: 'meta' | 'uazap' | 'evolution'): IWhatsAppProvider {
    switch (providerName) {
      case 'meta':
        // return new MetaWhatsAppProvider();
        throw new Error('Meta provider not implemented yet.');
      case 'uazap':
        // return new UazapWhatsAppProvider();
        throw new Error('Uazap provider not implemented yet.');
      case 'evolution':
        // return new EvolutionWhatsAppProvider();
        throw new Error('Evolution provider not implemented yet.');
      default:
        throw new Error(`Unsupported WhatsApp provider: ${providerName}`);
    }
  }
}
