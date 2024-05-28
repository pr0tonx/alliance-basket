'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      return queryInterface.sequelize.transaction(t => {
        return Promise.all([
          queryInterface.addConstraint('Members', {
            fields: ['id_client', 'id_group'],
            type: 'unique',
            name: 'unique_client_group',
            transaction: t
          }),
        ]);
      });
    } catch(err) {
      console.log(err);
    }

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeConstraint('Members', 'unique_client_group', {transaction: t})
      ]);
    });
  }
};