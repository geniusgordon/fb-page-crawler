module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'post',
    {
      id: { type: DataTypes.STRING(40), primaryKey: true },
      cowbei_id: DataTypes.INTEGER,
      message: DataTypes.TEXT,
      created_time: DataTypes.DATE,
    },
    {
      timestamps: false,
    }
  );
