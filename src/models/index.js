import path from 'path';
import Sequelize from 'sequelize';
import post from './post';

const dbName = process.env.DB_NAME || 'db';

const sequelize = new Sequelize(dbName, null, null, {
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../../database.sqlite'),
  logging: false,
});

export const Post = sequelize.import('post', post);
export default sequelize;

