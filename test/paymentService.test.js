import assert from 'node:assert/strict';
import test from 'node:test';
import { getPayment } from '../src/paymentService.js';

test('loads a payment from the repository', async () => {
  const repository = { findById: async (id) => ({ id, status: 'paid' }) };
  assert.deepEqual(await getPayment('pay_123', repository), {
    id: 'pay_123',
    status: 'paid'
  });
});
