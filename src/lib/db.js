import get from 'lodash/fp/get';
import pick from 'lodash/fp/pick';
import db, { User, Post, Comment, Reaction } from '../models';

export async function syncDb() {
  await db.sync();
}

export async function saveUsers(items) {
  const users = items.map(pick(['id', 'name']));
  await User.bulkCreate(users, { ignoreDuplicates: true });
  return users;
}

export async function saveComments(items, meta) {
  const users = await saveUsers(items.map(get(from)));
  const comments = items.map(item =>
    Object.assign({
      userId: item.from.id,
      postId: meta.postId,
    }, pick(['id', 'message', 'like_count', 'parent', 'created_time'], item))
  );
  await Comment.bulkCreate(comments, { ignoreDuplicates: true });
  return comments;
}

export async function saveReactions(items, meta) {
  const users = await saveUsers(items);
  const reactions = items.map(item =>
    Object.assign({
      userId: item.id,
      postId: meta.postId,
    }, pick(['type'], item))
  );
  await Reaction.bulkCreate(reactions, { ignoreDuplicates: true });
  return reactions;
}

export async function savePosts(items) {
  const posts = items.map(pick(['id', 'message', 'created_time']));
  await Post.bulkCreate(posts, { ignoreDuplicates: true });
  return posts;
}

