export default (sequelize, DataTypes) =>
  sequelize.define('post', {
    id: { type: DataTypes.STRING(32), primaryKey: true },
    message: DataTypes.TEXT,
    created_time: DataTypes.DATE,
  });

