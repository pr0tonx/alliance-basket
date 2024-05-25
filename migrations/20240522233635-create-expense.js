'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Expenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull:false,
        type: Sequelize.STRING
      },
      value: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      id_group: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model:{
            tablename:'Group',
            schema:'schema'

          },
        }
      },
      id_client: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:{
            tablename:'Client',
            field:'id'
          }
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Expenses');
  }
};