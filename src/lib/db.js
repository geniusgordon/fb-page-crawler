import pick from 'lodash/fp/pick';
import db, { User, Post, Comment, Reaction } from '../models';

export async function syncDb() {
  await db.sync();
}

async function saveUser(values) {
  const user = pick(['id', 'name'], values);
  spinner.text = `Save user: ${user.id}`;
  await User.upsert(user);
  return user;
}

async function saveComment(values, post) {
  const user = await saveUser(values.from);
  const comment = Object.assign({
    userId: user.id,
    postId: post.id,
  }, pick(['id', 'message', 'like_count', 'parent', 'created_time'], values));
  spinner.text = `Save comment: ${comment.id}`;
  await Comment.upsert(comment);
  return comment;
}

async function saveReaction(values, post) {
  const user = await saveUser(values);
  const reaction = Object.assign({
    userId: user.id,
    postId: post.id,
  }, pick(['type'], values));
  spinner.text = `Save reaction: ${reaction.type}`;
  await Reaction.upsert(reaction);
  return reaction;
}

export async function savePost(values) {
  const post = pick(['id', 'message', 'created_time'], values);
  spinner.text = `Save post: ${post.id}`;
  await Post.upsert(post);
  return post;
}

