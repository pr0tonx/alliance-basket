'use strict';

const {Sequelize, DataTypes, Model} = require('sequelize');

const RequiredFieldException = require('../error/RequiredFieldException');
const InvalidFieldException = require('../error/InvalidFieldException');
const EnumMismatchException = require('../error/EnumMismatchException');
const InvalidFieldLengthException = require('../error/InvalidFieldLengthException');
const EmptyException = require('../error/EmptyException');

const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + './../config/config.json')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// TODO adicionar Ticket.hook no final pra adicionar trigger via sequelize

class Ticket extends Model {

  static async create(values, options) {
    await this.validatePayload(values);

    try {
      return await super.create({type: values.type, title: values.title}, options);
    } catch (err) {
      throw err;
    }
  };

  static async validatePayload(values) {
    if (values.type?.trim() === '') throw new RequiredFieldException('type');
    if (typeof values.type !== 'string') throw new InvalidFieldException('type');
    if (!['Reclamações', 'Sugestões', 'Outros'].includes(values.type)) throw new EnumMismatchException('type');

    if (values.title?.trim() === '') throw new RequiredFieldException('title');
    if (typeof values.title !== 'string') throw new InvalidFieldException('title');
    if (values.title.length > 255) throw new InvalidFieldLengthException('title');
  }

  static async findOne(values) {
    return await super.findOne({
      where: values,
      rejectOnEmpty: false
    });
  }

  static async findAllTickets() {
    return await this.findAll({
      rejectOnEmpty: false
    });
  }

  static async updateTicketStatus(id) {
    if (!id) throw new RequiredFieldException('id');
    if (typeof id !== 'number') throw new InvalidFieldException('id');

    const ticket = await this.findOne({id: id});

    if (!ticket) throw new EmptyException('Ticket not found');

    ticket.status = 'Resolved';
    return await ticket.save();
  }
}

Ticket.init({
  type: {
    type: DataTypes.ENUM('Ajuda', 'Reclamações', 'Sugestões', 'Outros'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('open', 'resolved'),
    defaultValue: 'open',
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Tickets'
});

module.exports = {
  Tickets: Ticket
}
