#!/usr/bin/env ts-node -r tsconfig-paths/register

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
