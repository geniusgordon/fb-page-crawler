import ora from 'ora';
import chalk from 'chalk';
import { getPageFeed } from './lib/fb';

function logError(error) {
  console.error(chalk.bgRed(' ERROR '), error);
}

async function fetchAllFeeds() {
  const limit = 10;
  const options = { limit };
  let data = [];
  while (true) {
    const from = data.length + 1;
    const to = data.length + limit;
    const spinner = ora(`Feed ${from} ~ ${to}`);
    spinner.spinner = { frames: [chalk.black.bgYellow(' FETCH ')] };
    spinner.start();
    try {
      let res = await getPageFeed(options);
      data = data.concat(res.data);
      Object.assign(options, res.paging);
      spinner.stopAndPersist(chalk.black.bgGreen(' DONE '));
      if (res.data.length < limit) {
        break;
      }
    } catch (error) {
      spinner.fail();
      throw(error);
    }
  }
  return data;
}

fetchAllFeeds().catch(logError);

