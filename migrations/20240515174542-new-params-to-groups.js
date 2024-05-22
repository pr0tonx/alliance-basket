'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          'Groups',
          'description',
          {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
            max: 255
          },
          {transaction: t}
        ),
        queryInterface.addColumn(
          'Groups',
          'type',
          {
            type: Sequelize.DataTypes.STRING, // notepad 2 TODO check if it's appropriate to be an ENUM instead
            allowNull: false
          },
          {transaction: t}
        ),
        queryInterface.addColumn(
          'Groups',
          'allow_edit',
          {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false
          },
          {transaction: t}
        )
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Groups', 'description', {transaction: t}),
        queryInterface.removeColumn('Groups', 'type', {transaction: t}),
        queryInterface.removeColumn('Groups', 'allowEdit', {transaction: t})
      ]);
    });
  }
};
