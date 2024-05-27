
const EmptyException = require('../error/EmptyException');
const InvalidFieldException = require('../error/InvalidFieldException');
const RequiredFieldException = require('../error/RequiredFieldException');
const UserExistsException = require('../error/UserExistsException');
const Client = require('../models/Client');
const Expense = require('../models/expense');

const createExpense = async (req, res) => {
  try {
    const expense = await Expense.createExpense(req);
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    await expense.update(req.body);
    res.status(200).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// TODO when deleting a user, the group admin must be transfered to another user if there is one

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    await expense.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
};
