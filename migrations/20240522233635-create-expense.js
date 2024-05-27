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
                model: 'Groups', // Nome da tabela referenciada
                key: 'id'       // Chave primária da tabela referenciada
            },
        
     
        tableName: 'Expenses'
        
      },
      id_client: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Clients', // Nome da tabela referenciada
          key: 'id'       // Chave primária da tabela referenciada
      },
        tableName: 'Expenses'
  
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