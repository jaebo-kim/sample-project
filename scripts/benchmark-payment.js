import { performance } from 'node:perf_hooks';
import { getPayment, PaymentCache } from '../src/paymentService.js';

const repository = {
  findById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 5));
    return { id, status: 'paid' };
  }
};
const cache = new PaymentCache({ ttlMs: 60_000 });
const samples = [];

for (let index = 0; index < 50; index += 1) {
  const startedAt = performance.now();
  await getPayment('pay_123', repository, cache);
  samples.push(performance.now() - startedAt);
}

samples.sort((a, b) => a - b);
const p95 = samples[Math.floor(samples.length * 0.95)];
console.log(`cached payment lookup p95: ${p95.toFixed(2)}ms`);
