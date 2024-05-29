
const EmptyException = require('../error/EmptyException');
const InvalidFieldException = require('../error/InvalidFieldException');
const RequiredFieldException = require('../error/RequiredFieldException');
const UserExistsException = require('../error/UserExistsException');
const Expense = require('../models/expense');


const createExpenses = async (req, res) => {
  try {
    const expense = await Expense.create(req);

    return res.status(201).json(expense);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


const getAllByGroup = async (req, res) => {
  const { id_group } = req.params
  try {
    const expenses = await Expense.getAllByGroup(id_group);

    return res.status(200).json(expenses);
  } catch (error) {
    if (error.name === 'SequelizeEmptyResultError'){
      return res.status(204).send();
    }
    return res.status(500).send();
  }
};

const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    return res.status(200).json(expense);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.update(req);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    await expense.update(req.body);
    return res.status(200).json(expense);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.delete(req)
    return res.status(204).json();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const howMuchIOwe = async (req, res) => {
  try {
    const how = await Expense.howMuchIOwe(req)

    return res.status(200).send(how)
  } catch (err) {
    return res.status(400).send({error: "error"})
  }
}

module.exports = {
  howMuchIOwe,
  createExpenses,
  getAllByGroup,
  getExpenseById,
  updateExpense,
  deleteExpense
};
