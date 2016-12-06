import ora from 'ora';
import chalk from 'chalk';
import * as fb from './fb';
import * as db from './db';

export async function fetchAndSavePosts() {
  const limit = 100;
  const options = { limit };
  let count = 0;
  while (true) {
    const from = count + 1;
    const to = count + limit;
    global.spinner = ora(`Fetch posts ${from} ~ ${to}`);
    spinner.spinner = { frames: [chalk.black.bgYellow(' RUN ')] };
    spinner.start();
    try {
      let res = await fb.fetchPosts(options);
      spinner.text = `Save posts ${from} ~ ${to}`;
      spinner.spinner = { frames: [chalk.black.bgYellow(' RUN ')] };
      spinner.start();
      for (let post of res.data) {
        spinner.text = `Save post: ${post.id}`;
        await db.savePost(post);
      }
      Object.assign(options, res.paging);
      count += res.data.length;
      spinner.text = `Save posts ${from} ~ ${count}`;
      spinner.stopAndPersist(chalk.black.bgGreen(' DONE '));
      if (res.data.length < limit) {
        break;
      }
    } catch (error) {
      spinner.stopAndPersist(chalk.black.bgRed(' ERROR '));
      throw(error);
    }
  }
}

export { db, fb };

