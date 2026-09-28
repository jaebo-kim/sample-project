export class PaymentCache {
  constructor({ ttlMs = 30_000, now = Date.now } = {}) {
    this.ttlMs = ttlMs;
    this.now = now;
    this.entries = new Map();
  }

  get(key) {
    const entry = this.entries.get(key);
    if (!entry || entry.expiresAt <= this.now()) {
      this.entries.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key, value) {
    this.entries.set(key, {
      value,
      expiresAt: this.now() + this.ttlMs
    });
  }
}

export async function getPayment(paymentId, repository, cache = new PaymentCache()) {
  const cached = cache.get(paymentId);
  if (cached) return cached;

  const payment = await repository.findById(paymentId);
  cache.set(paymentId, payment);
  return payment;
}
