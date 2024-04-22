'use strict';
const db = require('../database/database');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await db.DBX().query(`CREATE TABLE Clients (
      id int PRIMARY KEY AUTO_INCREMENT,
      name varchar(100),
      phone_number char(11),
      email varchar(50),
      password varchar(20),
      created_at DATETIME NOT NULL DEFAULT NOW(),
      deleted_at DATETIME
  )`)

    await db.DBX().query(`CREATE TABLE Groups(
      id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
      name varchar(100) NOT NULL,
      admin_id int NOT NULL,
      created_at DATETIME NOT NULL DEFAULT NOW(),
      deleted_at DATETIME
    )`)

    await db.DBX().query(`CREATE TABLE Members(
      id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
      id_group int NOT NULL,
      id_client int NOT NULL,
      created_at DATETIME NOT NULL DEFAULT NOW(),
      deleted_at DATETIME,
      FOREIGN KEY (id_group) REFERENCES Groups(id),
      FOREIGN KEY (id_client) REFERENCES Clients(id)
  )`)
  },

  async down (queryInterface, Sequelize) {
    await db.DBX().query(`DROP TABLE groups`);
    await db.DBX().query(`DROP TABLE members`);
    await db.DBX().query(`DROP TABLE clients`);
  }
};
