import ora from 'ora';
import chalk from 'chalk';
import get from 'lodash/fp/get';
import { fb, db } from '../lib/';

const noop = () => {};
const getId = get('id');

function createCrawler(edge, getDisplayName = getId, saveData = noop) {
  return async (id, options = {}, meta = {}) => {
    const limit = options.limit || 25;
    let data = [];
    let spinner;
    while (true) {
      spinner = ora(`Fetch ${limit} ${edge} ${id}`);
      spinner.spinner = { frames: [chalk.black.bgYellow(' RUN ')] };
      spinner.start();
      try {
        let res = await fb.apiP(`${id}/${edge}`, options);
        if (res.data.length === 0) {
          spinner.text = `Fetch 0 ${edge} ${id}`;
          spinner.stopAndPersist(chalk.black.bgGreen(' DONE '));
          break;
        }
        const last = res.data[res.data.length - 1];
        spinner.text = `Fetch ${res.data.length} ${edge} ${id} ${getDisplayName(last)}`;
        spinner.stopAndPersist(chalk.black.bgGreen(' DONE '));
        spinner = ora(`Save ${res.data.length} ${edge} ${id} ${getDisplayName(last)}`);
        spinner.spinner = { frames: [chalk.black.bgYellow(' RUN ')] };
        spinner.start();
        const savedData = await saveData(res.data, meta);
        spinner.stopAndPersist(chalk.black.bgGreen(' DONE '));
        data = data.concat(savedData);
        Object.assign(options, res.paging);

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

const crawlPosts = createCrawler('posts', get('created_time'), db.savePosts);
const crawlComments = createCrawler('comments', get('created_time'), db.saveComments);
const crawlReactions = createCrawler('reactions', get('id'), db.saveReactions);

export { crawlPosts, crawlComments, crawlReactions };

