'use strict';
const db = require('../database/database');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await db.DBX().query(`
    CREATE DEFINER= \`root\`@\`localhost\` TRIGGER \`Groups_AFTER_INSERT\` AFTER INSERT ON \`Groups\` FOR EACH ROW BEGIN
    SET @id_group =  NEW.id;
    SET @id_admin =  NEW.admin_id;
    INSERT INTO Members (id_group, id_client) VALUES (@id_group, @id_admin);
    END`)
  },

  async down (queryInterface, Sequelize) {
    await db.DBX().query(`DROP TRIGGER IF EXISTS \`Groups_AFTER_INSERT\
    `)
  }
};
