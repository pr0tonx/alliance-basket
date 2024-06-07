'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.createTable('Tickets', {
          id: {
            type:Sequelize.DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
          },
          type: {
            type: Sequelize.DataTypes.ENUM('Ajuda', 'Reclamações', 'Sugestões', 'Outros'),
            allowNull: false
          },
          title: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          status: {
            type: Sequelize.DataTypes.ENUM('open', 'resolved'),
            allowNull: false,
            defaultValue: 'open'
          },
          createdAt: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
          },
          updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
          }
        }, {transaction: t}),
        queryInterface.createTable('Messages', {
          id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
          },
          from: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            references: {
              model: 'Clients',
              key: 'id'
            }
          },
          to: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            references: {
              model: 'Clients',
              key: 'id'
            }
          },
          message: {
            type: Sequelize.DataTypes.STRING(2000),
            allowNull: false,
          },
          idChat: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            references: {
              model: 'Tickets',
              key: 'id'
            }
          },
          createdAt: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
          },
          updatedAt: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
          }
        }, {transaction: t})
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.dropTable('Tickets', {transaction: t}),
        queryInterface.dropTable('Messages', {transaction: t})
      ]);
    });
  }
};
