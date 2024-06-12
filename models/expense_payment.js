const { Sequelize, DataTypes, Model } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

class expense_payment extends Model {}

expense_payment.init({
  expense_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount_owed: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0
  },
  amount_paid: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0
  },
  paid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  sequelize,
  modelName: 'expense_payment',
  tableName: 'expense_payments'
});

module.exports = expense_payment;
