module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      "user", 
      {
        // Attributes
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4, 
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          unique: true,
        },
        email: {
          type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
          },
        password: {
          type: DataTypes.STRING,
        },
      },
      {
     
        timestamps: true,
        underscored: true, 
        createdAt: "created_at",
        updatedAt: "updated_at",
      }
    );
  
    return User;
  };
  