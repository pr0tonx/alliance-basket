const express = require('express');


const authMiddleware = require('../middleware/authMiddleware');
const despesaController = require('../controllers/ExpenseController');



const router = express.Router()

//Rotas para CRUDE Expense

router.post('/' , async (req, res) => ExpenseController.createExpense(req, res));
router.get('/', authMiddleware.isAuth, async (req, res) => depesaController.getExpense(req, res));
router.get('/:id', authMiddleware.isAuth, async (req, res) => despesaController.getExpenseById(req, res));
router.delete('/:id', authMiddleware.isAuth, async (req, res) => despesaController.deleteExpense(req, res));
router.post('/search', authMiddleware.isAuth, async (req, res) => despesaController.search(req, res))


module.exports = router