import path from 'path';
import Sequelize from 'sequelize';
import user from './user';
import post from './post';
import comment from './comment';
import reaction from './reaction';

const dbName = process.env.DB_NAME || 'db';

const sequelize = new Sequelize(dbName, null, null, {
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../../database.sqlite'),
  logging: false,
});

export const User = sequelize.import('user', user);
export const Post = sequelize.import('post', post);
export const Comment = sequelize.import('comment', comment);
export const Reaction = sequelize.import('reaction', reaction);

Comment.belongsTo(User);
Comment.belongsTo(Post);
Comment.belongsTo(Comment, { foreignKey: 'parent' });

Reaction.belongsTo(User);
Reaction.belongsTo(Post);

export default sequelize;

