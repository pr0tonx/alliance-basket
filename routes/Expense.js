const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const ExpenseController = require('../controllers/ExpenseController');

const router = express.Router()

router.post('/client/:id_client/group/:id_group',authMiddleware.isAuth, async (req, res) => ExpenseController.createExpenses(req, res));
router.get('/group/:id_group',authMiddleware.isAuth, async (req, res) => ExpenseController.getAllByGroup(req, res));
router.get('/:id',authMiddleware.isAuth, async (req, res) => ExpenseController.getExpenseById(req, res));
router.put('/:id',authMiddleware.isAuth, async (req, res) => ExpenseController.updateExpense(req, res));
router.delete('/:id',authMiddleware.isAuth, async (req, res) => ExpenseController.deleteExpense(req, res));
router.get('/client/:client_id/group/:group_id/howmuchiowe', authMiddleware.isAuth, async (req, res) => ExpenseController.howMuchIOwe(req, res));

module.exports = router
