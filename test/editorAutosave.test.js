import assert from 'node:assert/strict';
import test from 'node:test';
import { autosave } from '../src/editorAutosave.js';

test('saves the current document', async () => {
  const calls = [];
  const saveDocument = async (document) => {
    calls.push(document.id);
    return { ok: true };
  };

  assert.deepEqual(await autosave({ id: 'doc_123', version: 1 }, saveDocument), { ok: true });
  assert.deepEqual(calls, ['doc_123']);
});
