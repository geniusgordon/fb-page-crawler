import ora from 'ora';
import chalk from 'chalk';
import { fetchPosts } from './fb';
import { syncDb, savePost } from './db';

export async function fetchAndSaveAllPosts() {
  const limit = 10;
  const options = { limit };
  let count = 0;
  while (true) {
    const from = count + 1;
    const to = count + limit;
    const spinner = ora(`Feed ${from} ~ ${to}`);
    spinner.spinner = { frames: [chalk.black.bgYellow(' FETCH ')] };
    spinner.start();
    try {
      let res = await fetchPosts(options);
      spinner.spinner = { frames: [chalk.black.bgYellow(' SAVE ')] };
      await Promise.all(res.data.map(savePost));
      Object.assign(options, res.paging);
      spinner.stopAndPersist(chalk.black.bgGreen(' DONE '));
      if (res.data.length < limit) {
        break;
      }
      count += res.data.length;
    } catch (error) {
      spinner.stopAndPersist(chalk.black.bgRed(' ERROR '));
      throw(error);
    }
  }
}

export { syncDb };

