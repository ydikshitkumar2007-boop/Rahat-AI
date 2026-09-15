import { ProviderHealthStatus } from './types';

class ProviderHealthTracker {
  private healthStore: Map<string, ProviderHealthStatus> = new Map();

  recordHealth(status: ProviderHealthStatus) {
    this.healthStore.set(status.providerName, status);
  }

  getHealth(providerName: string): ProviderHealthStatus {
    return (
      this.healthStore.get(providerName) || {
        providerName,
        status: 'online',
        lastSuccessfulUpdate: new Date().toISOString(),
        latencyMs: 120,
        errorMessage: null,
        freshnessSeconds: 0,
      }
    );
  }

  getAllHealth(): ProviderHealthStatus[] {
    return Array.from(this.healthStore.values());
  }
}

export const providerHealthTracker = new ProviderHealthTracker();
