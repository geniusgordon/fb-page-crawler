module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'reaction',
    {
      userId: { type: DataTypes.STRING(20), primaryKey: true },
      postId: { type: DataTypes.STRING(40), primaryKey: true },
      type: DataTypes.ENUM(
        'NONE',
        'LIKE',
        'LOVE',
        'WOW',
        'HAHA',
        'SAD',
        'ANGRY',
        'THANKFUL'
      ),
    },
    {
      timestamps: false,
    }
  );
