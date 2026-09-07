import { PaymentMethodType } from '../../types';
import { PaymentProvider } from './types';
import { MTNMoMoProvider } from './mtnMoMoProvider';
import { PayPalProvider } from './payPalProvider';

export * from './types';
export * from './mtnMoMoProvider';
export * from './payPalProvider';

class PaymentRegistry {
  private providers: Map<PaymentMethodType, PaymentProvider> = new Map();

  constructor() {
    this.register(new MTNMoMoProvider());
    this.register(new PayPalProvider());
  }

  public register(provider: PaymentProvider) {
    this.providers.set(provider.id, provider);
  }

  public getProvider(id: PaymentMethodType): PaymentProvider {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new Error(`Payment provider ${id} not found.`);
    }
    return provider;
  }

  public getAllProviders(): PaymentProvider[] {
    return Array.from(this.providers.values());
  }
}

export const paymentRegistry = new PaymentRegistry();
