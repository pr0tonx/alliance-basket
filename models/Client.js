const { Sequelize, DataTypes, Model } = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);
class Client extends Model {}

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
