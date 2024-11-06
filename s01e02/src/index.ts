import { Application } from './app';

async function main() {
  try {
    const app = new Application();
    await app.run();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Application error:', error.message);
    }
    process.exit(1);
  }
}

main();
