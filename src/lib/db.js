import pick from 'lodash/fp/pick';
import db, { User, Post, Comment, Reaction } from '../models';

export async function syncDb() {
  await db.sync();
}

export async function saveUser(values) {
  const user = pick(['id', 'name'], values);
  await User.upsert(user);
  return user;
}

export async function saveComment(values, meta) {
  const user = await saveUser(values.from);
  const comment = Object.assign({
    userId: user.id,
    postId: meta.postId,
  }, pick(['id', 'message', 'like_count', 'parent', 'created_time'], values));
  await Comment.upsert(comment);
  return comment;
}

export async function saveReaction(values, meta) {
  const user = await saveUser(values);
  const reaction = Object.assign({
    userId: user.id,
    postId: meta.postId,
  }, pick(['type'], values));
  await Reaction.upsert(reaction);
  return reaction;
}

export async function savePost(values) {
  const post = pick(['id', 'message', 'created_time'], values);
  await Post.upsert(post);
  return post;
}

