
const { Sequelize, DataTypes, Model } = require('sequelize');

const process = require('process');
const InvalidFieldException = require('../error/InvalidFieldException');
const EmptyException = require('../error/EmptyException');
const { Group } = require('./Group');
const { Member } = require('./Member');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];


const sequelize = new Sequelize(config.database, config.username, config.password, config);
  class Expense extends Model {
      static async create(req){    
        const {name, value }= req.body
        const { id_client, id_group } = req.params;
        if(value <= 0){
          throw new InvalidFieldException(value)
        } 
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


      static async getAllByGroup(id){
        return await this.findAll({
          where:{
            id_group : id
          } , 
          rejectOnEmpty: true,
        })
      };

      static async update(req){
        const { id } = req.params;
        const expense = await this.findByPk(id,{rejectOnEmpty:true});
        const { value } = req.body;
        if(value <= 0){
          throw new InvalidFieldException(value);
        } 
        expense.set(req.body);
        return await expense.save();
      };

      static async delete(req){
        const { id } = req.params;
        const expense = await this.findByPk(id,{rejectOnEmpty:true});
        if(!expense){
        throw new EmptyException('Expense not found');
        }
        else{
          expense.destroy();
        }
      }

      // finish this
      static async howMuchIOwe (req) {
        const { client_id, id_group } = req.params

        groupSize = await Member.findAll({where : {
          group_id: id_group
        }})

        console.log(groupSize)

        return 0



        // get how much you paid
        
        // get how much others paid

        // general value

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

module.exports = Expense;
