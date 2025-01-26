'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KelasStudent extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            KelasStudent.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'teacher_id'
            })
        }
    }

    KelasStudent.init({
        kelas_id: DataTypes.INTEGER,
        teacher_id: DataTypes.INTEGER,
        is_main: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'KelasStudent',
        underscored: true,
    });

    return KelasStudent;
};