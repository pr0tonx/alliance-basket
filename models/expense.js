'use strict';
const { Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Sequelize = new Sequelize(config.database, config.usernan, config.password, config);
  class Expense extends Model {
      static async create (req){
        const {name, value }= req.body
        const { id_client, id_group } = req.params;

        new_json = {
          id_client : id_client,
          id_group : id_group,

        }

        Object.assign(new_json,req.body)
      
        const expense = await Expense.create(new_json)

        return expense
        
      }




    static associate(models) {
      // define association here
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
