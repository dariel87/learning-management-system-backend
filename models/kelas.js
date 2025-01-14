'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Kelas extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Kelas.hasMany(models.KelasTeacher, {
                as: 'teachers',
                foreignKey: 'kelas_id'
            });

            Kelas.belongsTo(models.AcademicYear, {
                as: 'academic_year'
            });
        }
    }

    Kelas.init({
        name: DataTypes.STRING,
        academic_year_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Kelas',
        underscored: true,
    });

    return Kelas;
};
