#!/usr/bin/env ts-node

(async () => {
  const { factory } = await import('./core');

  try {
    await factory();

    console.log('Done.');
  } catch (e) {
    console.error(e);

    process.exit(1);
  } finally {
  }
})();
