'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.createTable('Messages', {
          id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
          },
          from: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Clients',
              key: 'id'
            }
          },
          to: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Clients',
              key: 'id'
            }
          },
          type: {
            type: Sequelize.DataTypes.ENUM('Reclamações', 'Sugestões', 'Outros'),
            allowNull: false
          },
          title: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
          },
          message: {
            type: Sequelize.DataTypes.STRING(2000),
            allowNull: false,
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
          },
        }, {transaction: t})
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.dropTable('Messages', {transaction: t})
      ]);
    });
  }
};
