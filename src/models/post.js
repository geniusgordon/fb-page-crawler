module.exports = (sequelize, DataTypes) =>
  sequelize.define('post', {
    id: { type: DataTypes.STRING(40), primaryKey: true },
    message: DataTypes.TEXT,
    created_time: DataTypes.DATE,
  }, {
    timestamps: false,
  });

