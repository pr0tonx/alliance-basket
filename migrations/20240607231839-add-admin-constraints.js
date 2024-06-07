'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addConstraint('Messages', {
          fields: ['to'],
          name: 'Messages_to_Clients_fk',
          type: 'foreign key',
          references: {
            table: 'Clients',
            field: 'id'
          },
        }),
        queryInterface.addConstraint('Messages', {
          fields: ['from'],
          name: 'Messages_from_Clients_fk',
          type: 'foreign key',
          references: {
            table: 'Clients',
            field: 'id'
          },
        }),
        queryInterface.addConstraint('Messages', {
          fields: ['idChat'],
          name: 'Messages_idChat_Tickets_fk',
          type: 'foreign key',
          references: {
            table: 'Tickets',
            field: 'id'
          },
        })
      ]);
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeConstraint('Messages', 'Messages_to_Clients_fk', {transaction: t}),
        queryInterface.removeConstraint('Messages', 'Messages_from_Clients_fk', {transaction: t}),
        queryInterface.removeConstraint('Messages', 'Messages_idChat_Tickets_fk', {transaction: t}),
      ]);
    });
  }
};
