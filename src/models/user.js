module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'user',
    {
      id: { type: DataTypes.STRING(20), primaryKey: true },
      name: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );
