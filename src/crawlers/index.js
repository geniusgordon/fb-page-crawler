import ora from 'ora';
import chalk from 'chalk';
import { fb, db } from '../lib/';

const noop = () => {};

function createCrawler(edge, saveItem = noop) {
  return async (id, options = {}, meta = {}) => {
    const limit = options.limit || 25;
    let data = [];
    while (true) {
      const spinner = ora(`Fetch ${limit} ${edge} ${id}`);
      spinner.spinner = { frames: [chalk.black.bgYellow(' RUN ')] };
      spinner.start();
      try {
        let res = await fb.apiP(`${id}/${edge}`, options);
        if (res.data.length === 0) {
          spinner.text = `Fetch 0 ${edge} ${id}`;
          spinner.stopAndPersist(chalk.black.bgGreen(' DONE '));
          break;
        }

        const length = res.data.length;
        spinner.text = `Save ${length} ${edge} ${id}`;
        spinner.spinner = { frames: [chalk.black.bgYellow(' RUN ')] };
        for (let item of res.data) {
          spinner.text = `Save ${edge} ${item.id}`;
          await saveItem(item, meta);
        }
        data = data.concat(res.data);
        Object.assign(options, res.paging);
        spinner.text = `Save ${length} ${edge} ${id}`;
        spinner.stopAndPersist(chalk.black.bgGreen(' DONE '));

        if(!res.paging) {
          break;
        }
      } catch (error) {
        spinner.stopAndPersist(chalk.black.bgRed(' ERROR '));
        throw(error);
      }
    }
    return data;
  };
}

const crawlPosts = createCrawler('posts', db.savePost);
const crawlComments = createCrawler('comments', db.saveComment);
const crawlReactions = createCrawler('reactions', db.saveReaction);

export { crawlPosts, crawlComments, crawlReactions };

