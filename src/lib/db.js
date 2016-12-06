import pick from 'lodash/fp/pick';
import db, { User, Post, Comment, Reaction } from '../models';

export async function syncDb() {
  await db.sync();
}

async function saveUser(user) {
  spinner.text = `Save user: ${user.id}`;
  await User.upsert(pick(['id', 'name'], user));
  return user;
}

async function saveComment(comment, post) {
  const user = await saveUser(comment.from);
  await Comment.upsert(
    Object.assign({
      userId: user.id,
      postId: post.id,
    }, pick(['id', 'message', 'like_count', 'parent', 'created_time'], comment))
  );
  if (comment.comments) {
    for (let c of comment.comments.data) {
      spinner.text = `Save comment: ${c.id}`;
      await saveComment(Object.assign({ parent: comment.id }, c), post);
    }
  }
  return comment;
}

async function saveReaction(reaction, post) {
  const user = await saveUser(reaction);
  await Reaction.upsert(
    Object.assign({
      userId: user.id,
      postId: post.id,
    }, pick(['type'], reaction))
  );
  return reaction;
}

export async function savePost(post) {
  spinner.text = `Save post: ${post.id}`;
  const { reactions, comments } = post;
  await Post.upsert(pick(['id', 'message', 'created_time'], post));
  if (reactions) {
    for (let reaction of reactions.data) {
      spinner.text = `Save reaction: ${reaction.type}`;
      await saveReaction(reaction, post);
    }
  }
  if (comments) {
    for (let comment of comments.data) {
      spinner.text = `Save comment: ${comment.id}`;
      await saveComment(comment, post);
    }
  }
  return post;
}

