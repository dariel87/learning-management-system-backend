'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kelas_teachers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kelas_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName:'kelas'
          },
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName:'users'
          },
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      is_main: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('kelas_teachers');
  }
};