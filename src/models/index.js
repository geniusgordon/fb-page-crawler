const path = require('path');
const Sequelize = require('sequelize');
const user = require('./user');
const post = require('./post');
const comment = require('./comment');
const reaction = require('./reaction');

const dbName = process.env.DB_NAME || 'db';

const sequelize = new Sequelize(dbName, null, null, {
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../../database.sqlite'),
  logging: false,
});

const User = sequelize.import('user', user);
const Post = sequelize.import('post', post);
const Comment = sequelize.import('comment', comment);
const Reaction = sequelize.import('reaction', reaction);

Comment.belongsTo(User);
Comment.belongsTo(Post);
Comment.belongsTo(Comment, { foreignKey: 'parent' });

Reaction.belongsTo(User);
Reaction.belongsTo(Post);

module.exports = { User, Post, Comment, Reaction, sequelize };
