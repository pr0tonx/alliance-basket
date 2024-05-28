const {Sequelize, DataTypes, Model} = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const RequiredFieldException = require('../error/RequiredFieldException');
const InvalidFieldException = require('../error/InvalidFieldException');
const InvalidFieldLengthException = require('../error/InvalidFieldLengthException');
const EmptyException = require('../error/EmptyException');
const { Member } = require('./Member');
const Client = require('./Client');

const sequelize = new Sequelize(config.database, config.username, config.password, config);

class Group extends Model {
  static async create(values, options) {
    await this.validatePayload(values);
    await this.keysToSnakeCase(values);

    try {
      return await super.create(values, options);
    } catch (err) {
      console.log(err);
    }
  }

  static async findByPK(value) {
    return await super.findByPk(value);
  }

  static async findOne(values) {
    try {
      const group = await super.findOne(values)

      if (!group) throw new EmptyException('Group not found.');

      return group;
    } catch (err) {
      if (err.name === 'SequelizeEmptyException') throw new EmptyException('Group not found.');
      throw err;
    }
  }

  static async hardDeleteGroup(id) {
    const group = await this.findOne({
      where: {id}
    });

    await group.destroy();
  }

  static async updateGroup(id, values) {
    try {
      await this.keysToSnakeCase(values);

      const group = await this.findOne({
        where: {id: id}
      });

      await group.update(values);
    } catch (err) {
      throw err;
    }
  }

  static async validatePayload(values) {
    if (!('name' in values) || values.name.trim() === '') throw new RequiredFieldException('name');
    if (values.name.length > 100) throw new InvalidFieldLengthException('name');

    if (!('type' in values) || values.type.trim() === '') throw new RequiredFieldException('type');

    if (values.description?.length > 255) throw new InvalidFieldLengthException('description');

    if (!('allowEdit' in values)) throw new RequiredFieldException('allowEdit');
    if (values.allowEdit === undefined || values.allowEdit === null) throw new InvalidFieldException('allowEdit');
  }

  static async keysToSnakeCase(values) {
    for (const key of Object.keys(values)) {
      const snakedKey = key.split(/(?=[A-Z])/).join('_').toLowerCase();

      if (snakedKey !== key) {
        values[snakedKey] = values[key];
        delete values[key];
      }
    }
  }

  static async getClientsfromGroups(id_group) {
    const members = await Member.findAll({ where: { id_group: id_group } });

    const clientPromises = members.map(async member => {
        const client = await Client.findOne({
          where: {
            id: member.id_client,
            status: 1,
            type: 1
          }
        });
        return client;

    });

    const clients = await Promise.all(clientPromises);

    return clients;
  }

}

Group.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    admin_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    allow_edit: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Group'
  }
);

module.exports = {
  Group
}