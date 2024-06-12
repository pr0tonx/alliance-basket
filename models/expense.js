
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
<<<<<<< Updated upstream
=======
    
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

    static async payLoan(req) {
      const { client_id, group_id } = req.params;
      const { recipient_id, amount } = req.body;
      const clientIdInt = parseInt(client_id);
      const recipientIdInt = parseInt(recipient_id);
      const paymentAmount = parseFloat(amount);
  
      if (paymentAmount <= 0) {
          throw new Error('Payment amount must be greater than zero.');
      }
  
      const expenses = await this.findAll({
          where: { id_group: group_id }
      });
  
      const allPayments = await ExpensePayment.findAll({
          where: { expense_id: { [Op.in]: expenses.map(expense => expense.id) } }
      });
  
      const userPayments = allPayments.filter(payment => payment.user_id === clientIdInt);
      const recipientPayments = allPayments.filter(payment => payment.user_id === recipientIdInt);
  
      let totalDebt = 0;
      userPayments.forEach(payment => {
          if (expenses.find(exp => exp.id === payment.expense_id && exp.id_client === recipientIdInt)) {
              totalDebt += (payment.amount_owed - payment.amount_paid);
          }
      });
  
      if (paymentAmount > totalDebt) {
          throw new Error(`Payment amount exceeds the total debt. Total debt is ${totalDebt}.`);
      }
  
      let remainingPayment = paymentAmount;
      for (const payment of userPayments) {
          const relatedExpense = expenses.find(exp => exp.id === payment.expense_id && exp.id_client === recipientIdInt);
          if (relatedExpense && payment.amount_owed > payment.amount_paid) {
              const remainingDebt = payment.amount_owed - payment.amount_paid;
              const paymentPortion = Math.min(remainingPayment, remainingDebt);
  
              payment.amount_paid += paymentPortion;
              await payment.save();
  
              remainingPayment -= paymentPortion;
  
              if (remainingPayment <= 0) break;
          }
      }
  
      const updatedAmounts = await this.howMuchIOwe({ params: { client_id, group_id } });
  
      return updatedAmounts;
  }
    
    
}  
>>>>>>> Stashed changes

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
