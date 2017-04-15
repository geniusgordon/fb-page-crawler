const get = require('lodash/fp/get');
const pick = require('lodash/fp/pick');
const { sequelize, User, Post, Comment, Reaction } = require('../models');

function createLazySaveFn(saveFn, threshold) {
  let memoizedItems = [];
  const save = async () => {
    const saved = memoizedItems.length;
    await saveFn(memoizedItems);
    memoizedItems = [];
    return saved;
  };
  const fn = items => {
    memoizedItems = memoizedItems.concat(items);
    if (memoizedItems.length >= threshold) {
      return save();
    }
    return 0;
  };
  fn.flush = save;
  return fn;
}

function saveUsers(items) {
  const users = items.map(pick(['id', 'name']));
  return User.bulkCreate(users, { ignoreDuplicates: true });
}

const lazySaveComments = createLazySaveFn(
  comments => Comment.bulkCreate(comments, { ignoreDuplicates: true }),
  1000
);

async function saveComments(items, meta) {
  const users = await saveUsers(items.map(get('from')));
  const comments = items.map(item =>
    Object.assign(
      {
        userId: item.from.id,
        postId: meta.postId,
      },
      pick(['id', 'message', 'like_count', 'parent', 'created_time'], item)
    )
  );
  return lazySaveComments(comments);
}
saveComments.flush = lazySaveComments.flush;

const lazySaveReactions = createLazySaveFn(
  reactions => Reaction.bulkCreate(reactions, { ignoreDuplicates: true }),
  1000
);

async function saveReactions(items, meta) {
  const users = await saveUsers(items);
  const reactions = items.map(item =>
    Object.assign(
      {
        userId: item.id,
        postId: meta.postId,
      },
      pick(['type'], item)
    )
  );
  return lazySaveReactions(reactions);
}
saveReactions.flush = lazySaveReactions.flush;

async function savePosts(items) {
  const posts = items.map(pick(['id', 'message', 'created_time']));
  await Post.bulkCreate(posts, { ignoreDuplicates: true });
  return posts;
}

module.exports = {
  createLazySaveFn,
  saveUsers,
  saveComments,
  saveReactions,
  savePosts,
  sequelize,
};
