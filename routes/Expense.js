const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const ExpenseController = require('../controllers/ExpenseController');



const router = express.Router()

//Rotas para CRUDE despesas
router.post('/client/:id_client/group/:id_group',authMiddleware.isAuth, async (req, res) => ExpenseController.createExpenses(req, res));
router.get('/group/:id_group',authMiddleware.isAuth, async (req, res) => ExpenseController.getAllByGroup(req, res));
router.get('/expenses/:id',authMiddleware.isAuth, async (req, res) => ExpenseController.getExpenseById(req, res));
router.put('/:id',authMiddleware.isAuth, async (req, res) => ExpenseController.updateExpense(req, res));
router.delete('/expenses/:id',authMiddleware.isAuth, async (req, res) => ExpenseController.deleteExpense(req, res));


module.exports = router
