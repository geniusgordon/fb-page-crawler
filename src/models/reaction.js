export default (sequelize, DataTypes) =>
  sequelize.define('reaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: DataTypes.ENUM('NONE', 'LIKE', 'LOVE', 'WOW', 'HAHA', 'SAD', 'ANGRY', 'THANKFUL'),
  }, {
    timestamps: false,
  });

