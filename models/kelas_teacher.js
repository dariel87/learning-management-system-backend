'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KelasTeacher extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            KelasTeacher.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'teacher_id'
            })
        }
    }

    KelasTeacher.init({
        kelas_id: DataTypes.INTEGER,
        teacher_id: DataTypes.INTEGER,
        is_main: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'KelasTeacher',
        underscored: true,
    });

    return KelasTeacher;
};