import ora from 'ora';
import chalk from 'chalk';
import { fb, db } from '../lib/';

async function crawlPosts(pageId, options = {}) {
  const limit = options.limit || 25;
  let posts = [];
  while (true) {
    global.spinner = ora(`Fetch ${limit} posts`);
    spinner.spinner = { frames: [chalk.black.bgYellow(' RUN ')] };
    spinner.start();
    try {
      let res = await fb.apiP(`${pageId}/posts`, options);
      if (res.data.length === 0) {
        spinner.text = 'Fetch 0 posts';
        spinner.stopAndPersist(chalk.black.bgGreen(' DONE '));
        break;
      }

      const length = res.data.length;
      const from = res.data[0].created_time;
      const to = res.data[length - 1].created_time;
      spinner.text = `Save ${length} posts ${from} ~ ${to}`;
      spinner.spinner = { frames: [chalk.black.bgYellow(' RUN ')] };
      for (let post of res.data) {
        spinner.text = `Save post ${post.id}`;
        await db.savePost(post);
      }
      posts = posts.concat(res.data);
      Object.assign(options, res.paging);
      spinner.text = `Save ${length} posts ${from} ~ ${to}`;
      spinner.stopAndPersist(chalk.black.bgGreen(' DONE '));

      if(!res.paging) {
        break;
      }
    } catch (error) {
      spinner.stopAndPersist(chalk.black.bgRed(' ERROR '));
      throw(error);
    }
  }
  return posts;
}

export default crawlPosts;

