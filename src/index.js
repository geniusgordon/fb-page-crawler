import dotenv from 'dotenv';
import ora from 'ora';
import chalk from 'chalk';
import { fetchAndSaveAllPosts, syncDb } from './lib';

dotenv.config({ silent: true });

function logError(error) {
  console.error(chalk.black.bgRed(' ERROR '), error);
}

async function main() {
  await syncDb();
  await fetchAndSaveAllPosts();
}

main().catch(logError);

