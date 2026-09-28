import assert from 'node:assert/strict';
import test from 'node:test';
import { autosave } from '../src/editorAutosave.js';

test('retries transient failures with the same idempotency key', async () => {
  const keys = [];
  let attempts = 0;
  const saveDocument = async (_document, { idempotencyKey }) => {
    keys.push(idempotencyKey);
    attempts += 1;
    if (attempts < 3) throw new Error('temporary network error');
    return { ok: true };
  };

  const result = await autosave(
    { id: 'doc_123', version: 4 },
    saveDocument,
    { baseDelayMs: 0, wait: async () => {} }
  );

  assert.deepEqual(result, { ok: true });
  assert.equal(attempts, 3);
  assert.deepEqual(keys, ['doc_123:4', 'doc_123:4', 'doc_123:4']);
});

test('stops after the configured maximum attempts', async () => {
  const saveDocument = async () => {
    throw new Error('persistent failure');
  };

  await assert.rejects(
    autosave(
      { id: 'doc_123', version: 4 },
      saveDocument,
      { maxAttempts: 2, baseDelayMs: 0, wait: async () => {} }
    ),
    /persistent failure/
  );
});
