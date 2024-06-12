'use strict';

const {Sequelize, DataTypes, Model} = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + './../config/config.json')[env];

const RequiredFieldException = require('../error/RequiredFieldException');
const EnumMismatchException = require('../error/EnumMismatchException');
const SupportRequestResolvedException = require('../error/SupportRequestResolvedException');
const InvalidFieldException = require('../error/InvalidFieldException');
const InvalidFieldLengthException = require('../error/InvalidFieldLengthException');

const sequelize = new Sequelize(config.database, config.username, config.password, config);

class Message extends Model {
  static async create(values, options) {
    await this.validatePayload(values);

    try {
      return await super.create(values, options);
    } catch (err) {
      throw err;
    }
  }

  static async findAllByValues(values) {
    return await this.findAll({
      where: values,
      rejectOnEmpty: false
    });
  }

  static async validatePayload(values) {
    if (!values.from) throw new RequiredFieldException('from');
    if (typeof values.from !== 'number') throw new InvalidFieldException('from');

    if (!values.to) throw new RequiredFieldException('to');
    if (typeof values.to !== 'number') throw new InvalidFieldException('to');

    if (values.message?.trim() === '') throw new RequiredFieldException('message');
    if (typeof values.message !== 'string') throw new InvalidFieldException('message');
    if (values.message.length > 2000) throw new InvalidFieldLengthException('message');

    if (values.status?.trim() === '') throw new RequiredFieldException('status');
    if (typeof values.status !== 'string') throw new InvalidFieldException('status');
    if (!['open', 'resolved'].includes(values.status)) throw new EnumMismatchException('status');
    if (values.status === 'resolved') throw new SupportRequestResolvedException('status');

    if (values.hasOwnProperty('idChat') && typeof values.idChat !== 'number') throw new InvalidFieldException('idChat');
  }
}

Message.init({
  from: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Clients',
      key: 'id'
    }
  },
  to: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Clients',
      key: 'id'
    }
  },
  message: {
    type: DataTypes.STRING(2000),
    allowNull: false
  },
  idChat: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: 'Tickets',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Message'
});

module.exports = {
  Message
}