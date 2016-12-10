import chalk from 'chalk';
import { fb, db } from './lib';
import * as crawler from './crawlers';

const accessToken = process.env.FB_ACCESS_TOKEN;
const pageId = process.env.FB_PAGE_ID;
fb.setAccessToken(accessToken);

function logError(error) {
  console.error(chalk.black.bgRed(' ERROR '), error);
}

async function main() {
  await db.sequelize.sync();
  const posts = await crawler.crawlPosts(pageId);
  for (let post of posts) {
    await crawler.crawlReactions(post.id, {}, { postId: post.id });
    const comments = await crawler.crawlComments(post.id, {
      fields: 'from,like_count,created_time,message,message_tags',
    }, { postId: post.id });
    for (let comment of comments) {
      await crawler.crawlComments(comment.id, {
        fields: 'from,like_count,created_time,message,message_tags',
      }, { postId: post.id });
    }
  }
  console.log(chalk.black.bgGreen(' DONE '));
}

main().catch(logError);

