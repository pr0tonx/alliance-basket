const { Sequelize, DataTypes, Model } = require('sequelize');
const process = require('process');
const InvalidFieldException = require('../error/InvalidFieldException');
const EmptyException = require('../error/EmptyException');
const { Group } = require('./Group');
const { Member } = require('./Member');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const ExpensePayment = require('./expense_payment');
const { Op } = require('sequelize');



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

        const members = await Member.findAll({
          where: {
            id_group: id_group
          }
        });

        const splitValue = parseFloat((value / members.length).toFixed(2));
        console.log(splitValue);
        const payments = members.map(member => ({
          expense_id: expense.id,
          user_id: member.id_client,
          amount_paid: member.id_client === parseInt(id_client) ? splitValue : 0,
          amount_owed: splitValue,
          paid: member.id_client === parseInt(id_client),
          payment_date: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        }));

        await ExpensePayment.bulkCreate(payments);

        return expense
        
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
    
      static async howMuchIOwe(req) {
        const { client_id, group_id } = req.params;
        const clientIdInt = parseInt(client_id);
    
        const expenses = await this.findAll({
            where: { id_group: group_id }
        });
    
        const groupMembers = await Member.findAll({
            where: { id_group: group_id }
        });
    
        const allPayments = await ExpensePayment.findAll({
            where: { expense_id: { [Op.in]: expenses.map(expense => expense.id) } }
        });
    
        const paymentsByUser = allPayments.reduce((acc, payment) => {
            if (!acc[payment.user_id]) acc[payment.user_id] = [];
            acc[payment.user_id].push(payment);
            return acc;
        }, {});
    
        let totalAmountOwedToUser = 0;
        let totalAmountUserOwes = 0;
        const amountsOwedToMembers = {};
    
        const calculateOwedAmount = (payments, createdBy) => {
            return payments.reduce((sum, payment) => {
                return sum + (payment.amount_owed - payment.amount_paid);
            }, 0);
        };
    
        for (const member of groupMembers) {
          const memberId = member.id_client;
          if (memberId === clientIdInt) continue;
      
          const memberPayments = paymentsByUser[memberId] || [];
          const userPayments = paymentsByUser[clientIdInt] || [];
      
          const memberOwesUser = calculateOwedAmount(memberPayments.filter(payment => {
              return expenses.find(exp => exp.id === payment.expense_id && exp.id_client === clientIdInt);
          }), true);
      
          const userOwesMember = calculateOwedAmount(userPayments.filter(payment => {
              return expenses.find(exp => exp.id === payment.expense_id && exp.id_client === memberId);
          }), false);
      
          console.log("Member ID:", memberId);
          console.log("User Owes Member:", userOwesMember);
      
          amountsOwedToMembers[memberId] = -userOwesMember; 
          totalAmountOwedToUser += memberOwesUser;
          totalAmountUserOwes += userOwesMember;
      }
    
        const totalAmountOwed = totalAmountOwedToUser - totalAmountUserOwes;
        return {
            totalAmountOwed,
            amountsOwedToMembers
        };
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
