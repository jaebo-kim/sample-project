import assert from 'node:assert/strict';
import test from 'node:test';
import { getPayment, PaymentCache } from '../src/paymentService.js';

test('reuses a cached payment within the TTL', async () => {
  let queries = 0;
  const repository = {
    findById: async (id) => {
      queries += 1;
      return { id, status: 'paid' };
    }
  };
  const cache = new PaymentCache({ ttlMs: 30_000 });

  await getPayment('pay_123', repository, cache);
  await getPayment('pay_123', repository, cache);

  assert.equal(queries, 1);
});

test('refreshes an expired payment', async () => {
  let now = 0;
  let queries = 0;
  const repository = {
    findById: async (id) => ({ id, query: ++queries })
  };
  const cache = new PaymentCache({ ttlMs: 100, now: () => now });

  const first = await getPayment('pay_123', repository, cache);
  now = 101;
  const second = await getPayment('pay_123', repository, cache);

  assert.equal(first.query, 1);
  assert.equal(second.query, 2);
});
