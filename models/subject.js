'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Subject extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Subject.init({
        name: DataTypes.STRING,
        type: {
            type: DataTypes.ENUM('regular', 'extracurricular', 'break'),
            allowNull: false,
            defaultValue: "user" // Optional: Default value
        }
    }, {
        sequelize,
        modelName: 'Subject',
        underscored: true,
    });
    return Subject;
};