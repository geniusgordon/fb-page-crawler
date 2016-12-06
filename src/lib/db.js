import pick from 'lodash/fp';
import db, { Post } from '../models';

export async function syncDb() {
  await db.sync();
}

export async function savePost(post) {
  return await Post.findOrCreate({
    where: pick(['id', 'message', 'created_time'], post),
  });
}

