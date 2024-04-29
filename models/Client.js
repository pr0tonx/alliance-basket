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
      values.password = Buffer.from(`${values.email}:${process.env.SECRET_TOKEN}:${values.password}`).toString('base64');

      return await super.create(values, options)
  }

  static async validatePayload (values) {
    if (!('name' in values) || values.name.trim() === '') {
      throw new RequiredFieldException("name") 
    }

    if (!('email' in values) || values.email.trim() === '') {
      throw new RequiredFieldException("email") 
    }
    try {
      await this.validateEmail(values.email)

    } catch(err) {
      if (!(err instanceof EmptyException)){
        throw err
      }
    }

    if (!('password' in values) || values.password.trim() === '') {
      throw new RequiredFieldException("password") 
    }
  }

  static async validateEmail (email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      throw new InvalidFieldException(email) 
    }
    if (await this.findOne({ where : { email: email}})) {
        throw new UserExistsException(email)
    }
  }

  static async findOne (values) {

    let client = await super.findOne(values)
    if (client === null) {
      throw new EmptyException('Client not found')
    } 

    return client
  }

  static async softDeleteClient (id) {
    let client = await this.findOne({where : {
      id: id,
      status: 1,
      type: 1
      }
    })
    client.status = 0

    return await client.save()
  }

  static async reactivateClient (id) {
    let client = await this.findOne({where : {
      id: id,
      status: 0,
      type: 1
      }
    })
    client.status = 1

    return await client.save()
  }

  static async updateClient (id, values) {
    let client = await this.findOne({where : {
      id: id,
      status: 1,
      type: 1
      }
    })

    let {email, password} = values 
    if (email != null) {
      throw new InvalidFieldException(email)
    }

    if (password != null) {
      values.password = Buffer.from(`${email}:${process.env.SECRET_TOKEN}:${password}`).toString('base64');
    }
    client.set(values)

    return await client.save() 
  }

  static async search (values) {
    return await this.findAll({
      where: values, 
      rejectOnEmpty: true,
    })
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

