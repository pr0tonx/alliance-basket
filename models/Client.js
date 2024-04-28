const { Sequelize, DataTypes, Model } = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const RequiredFieldException = require('../error/RequiredFieldException');
const InvalidFieldException = require('../error/InvalidFieldException');
const UserExistsException = require('../error/UserExistsException');
const EmptyException = require('../error/EmptyException.js');

const sequelize = new Sequelize(config.database, config.username, config.password, config);
class Client extends Model {
  static async create (values, options) {
      await this.validatePayload(values)

      return super.create(values, options)
  }

  static async validatePayload(values) {
    if (!('name' in values) || values.name.trim() === '') {
      throw new RequiredFieldException("name") 
    }

    if (!('email' in values) || values.email.trim() === '') {
      throw new RequiredFieldException("email") 
    }
    
    await this.validateEmail(values.email)

    if (!('password' in values) || values.password.trim() === '') {
      throw new RequiredFieldException("password") 
    }
  }

  static async validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      throw new InvalidFieldException(email) 
    }
    if (await this.findOne({ where : { email: email}})) {
      throw new UserExistsException(email)
    }
  }

  static async findOne(values) {
    let client = await super.findOne(values)
    console.log(client)
    if (client === null) {
      throw new EmptyException('Client not found')
    } 

    return client
  }

  static async softDeleteClient(id) {
    let client = await this.findOne({where : {
      id: id,
      status: 1,
      type: 1
      }
    })
    client.status = 0

    return await client.save()
  }
}

Client.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    type: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  },
  {
    sequelize, 
    modelName: 'Client', 
  },
);

module.exports = Client

