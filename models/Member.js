const {Sequelize, DataTypes, Model} = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const RequiredFieldException = require('../error/RequiredFieldException');
const InvalidFieldException = require('../error/InvalidFieldException');
const InvalidFieldLengthException = require('../error/InvalidFieldLengthException');
const EmptyException = require('../error/EmptyException');

const sequelize = new Sequelize(config.database, config.username, config.password, config);

class Member extends Model {
  static async create(values, options) {
    try {
      await this.validatePayload(values);
      await this.keysToSnakeCase(values);

      let member = await this.findOne({where: values});
      if (!member) member = await super.create(values, options);

      return member; // todo um error avisando que nao foi adicionado se já existir
    } catch (err) {
      throw err; // TODO
    }
  }

  static async findOne(values) {
    const member = await super.findOne(values);

    if (!member) return null // TODO e arrumar o if no create quando arrumar aqui
    return member;
  }

  static async findAllGivenValue(value) {
    await this.keysToSnakeCase(value);

    try {
      return await this.findAll({
        where: value,
        rejectOnEmpty: false,
      });
    } catch (err) {
      throw err;
    }
  }

  static async deleteMember(values) {
    await this.keysToSnakeCase(values);

    const member = await this.findOne({
      where: values
    });

    await member.destroy();
  }

  static async validatePayload(values) {

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
}

Member.init(
  {
    id_group: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_client: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['id_client', 'id_group']
      }
    ],
    sequelize,
    modelName: 'Member'
  }
);

// Member.associate = function (models) {
//   Member.belongsTo(models.Client, {foreignKey: 'id_client', as: 'id_client'});
//   Member.belongsTo(models.Group, {foreignKey: 'id_group', as: 'id_group'});
// }

module.exports = {
  Member
}