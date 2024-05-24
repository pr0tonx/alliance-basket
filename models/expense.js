'use strict';
const {
  Model,
  Error
} = require('sequelize');
const RequiredFieldException = require('../error/RequiredFieldException');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async create(values,options){
      
      //validar se o valor é positivo
      if(values.value <= 0){
        throw new RequiredFieldException("O valor precisa ser positivo.");
      }
      const expense = await super.create(values,options)

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