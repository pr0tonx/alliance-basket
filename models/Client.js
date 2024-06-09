const { Sequelize, DataTypes, Model } = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const RequiredFieldException = require('../error/RequiredFieldException');
const InvalidFieldException = require('../error/InvalidFieldException');
const UserExistsException = require('../error/UserExistsException');
const EmptyException = require('../error/EmptyException.js');
const Utils = require('../common/Utils.js')
const { Op } = require('sequelize');

const sequelize = new Sequelize(config.database, config.username, config.password, config);
class Client extends Model {
  static async create (values, options) {
    await this.validatePayload(values)
    values.password = Utils.hashPassword(values.password)

    const user = await super.create(values, options)
    return {
      user: user,
      token : Utils.createToken(user.email)
    }
  }
  
  static async login(values) {
    let {email, password} = values
    const user = await this.findOne({where: { email: email, status: 1, type: 1 }})

    password = Utils.hashPassword( values.password)

    if(password != user.password) {
      throw new InvalidFieldException("password")
    }

    return {
      user: user,
      token: Utils.createToken(user.email)
    }
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
    const client = await super.findOne(values)
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
    const client = await this.findOne({where : {
      id: id,
      status: 0,
      type: 1
      }
    })
    client.status = 1

    return await client.save()
  }

  static async updateClient (id, values) {
    const client = await this.findOne({where : {
      id: id,
      status: 1,
      type: 1
      }
    })

    const {email, password} = values
    
    const codePassword = Utils.hashPassword(values.oldPassword)

    if(codePassword != client.dataValues.password ){
     
      throw new InvalidFieldException(values.oldPassword)
    }

    if (email != null) {
      await this.validateEmail(email)
    }

    if (password != null) {
      values.password = Buffer.from(`${process.env.SECRET_TOKEN}:${password}`).toString('base64');
    }
    client.set(values)

    return await client.save() 
  }

  static async search(values) {
    const whereClause = Object.keys(values).reduce((acc, field) => {
      acc[field] = { [Op.like]: `${values[field]}%` };
      return acc;
    }, {});

    return await this.findAll({
      where: whereClause,
      rejectOnEmpty: true,
    });
  }

  static async searchEmail(values) {
    return await this.findAll({
      where: {email: values},
      rejectOnEmpty: false,
    });
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

