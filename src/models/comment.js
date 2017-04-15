module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'comment',
    {
      id: { type: DataTypes.STRING(40), primaryKey: true },
      message: DataTypes.TEXT,
      like_count: DataTypes.INTEGER,
      created_time: DataTypes.DATE,
    },
    {
      timestamps: false,
    }
  );
