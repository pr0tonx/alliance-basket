'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addConstraint('Members', {
          fields: ['id_group'],
          name: 'Members_id_group_Groups_fk',
          type: 'foreign key',
          references: {
            table: 'Groups',
            field: 'id'
          },
          onDelete: 'CASCADE'
        }), {transaction: t}
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeConstraint('Members', 'Members_id_group_Groups_fk', {transaction: t})
      ]);
    });
  }
};