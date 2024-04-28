'use strict';
const db = require('../database/database');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await db.DBX().query(`CREATE TABLE Clients (
      id int PRIMARY KEY AUTO_INCREMENT,
      name varchar(255),
      email varchar(255) ,
      password varchar(255),
      status BOOL,
      type INTEGER,
      createdAt DATETIME NOT NULL DEFAULT NOW(),
      updatedAt DATETIME NOT NULL DEFAULT NOW(),
      UNIQUE(email)
    )`)

    await db.DBX().query(`CREATE TABLE Groups(
      id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
      name varchar(100) NOT NULL,
      admin_id int NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT NOW(),
      updatedAt DATETIME NOT NULL DEFAULT NOW()
    )`)

    await db.DBX().query(`CREATE TABLE Members(
      id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
      id_group int NOT NULL,
      id_client int NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT NOW(),
      updatedAt DATETIME NOT NULL DEFAULT NOW(),
      FOREIGN KEY (id_client) REFERENCES Clients(id)
    )`)
  },

  async down (queryInterface, Sequelize) {
    await db.DBX().query(`DROP TABLE groups`);
    await db.DBX().query(`DROP TABLE members`);
    await db.DBX().query(`DROP TABLE clients`);
  }
};
