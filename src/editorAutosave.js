const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function autosave(
  document,
  saveDocument,
  { maxAttempts = 3, baseDelayMs = 10, wait = sleep } = {}
) {
  const idempotencyKey = `${document.id}:${document.version}`;
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await saveDocument(document, { idempotencyKey });
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await wait(baseDelayMs * 2 ** (attempt - 1));
      }
    }
  }

  throw lastError;
}
