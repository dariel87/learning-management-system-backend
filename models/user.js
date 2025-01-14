'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    User.init({
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        role: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'User',
        underscored: true,
        defaultScope: {
            attributes: { exclude: ["password"] } // ✅ Hide `password` by default
        },
        scopes: {
            withPassword: { attributes: { include: ["password"] } } // ✅ Allow retrieving password if needed
        }
    });
    
    return User;
};