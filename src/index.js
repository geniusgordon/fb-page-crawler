import dotenv from 'dotenv';
import chalk from 'chalk';
import { fb, db } from './lib';
import { crawlPosts } from './crawlers';

dotenv.config({ silent: true });

const accessToken = process.env.FB_ACCESS_TOKEN;
const pageId = process.env.FB_PAGE_ID;
fb.setAccessToken(accessToken);

function logError(error) {
  console.error(chalk.black.bgRed(' ERROR '), error);
}

async function main() {
  await db.syncDb();
  const posts = await crawlPosts(pageId);
}

main().catch(logError);

