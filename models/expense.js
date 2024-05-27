'use strict';
const { Model} = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
module.exports = (sequelize, DataTypes) => {
  const Sequelize = new Sequelize(config.database, config.usernan, config.password, config);
  class Expense extends Model {
      static async create (req){
        const {name, value }= req.body
        const { id_client, id_group } = req.params;
        console.log(name,value,req.params)
        const newJson = {
          id_client: id_client,
          id_group: id_group,
          name: name,
          value: value
        };

        const expense = await super.create(newJson);
      
       

        return expense
        
      }
       static associate(models) {
      }
  }
  Expense.init({
    name: DataTypes.STRING,
    value: DataTypes.FLOAT,
    id_group: DataTypes.INTEGER,
    id_client: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Expense',
  });
  return Expense;

};
module.exports = Expense
