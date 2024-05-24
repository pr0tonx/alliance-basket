const express = require('express');


const authMiddleware = require('../middleware/authMiddleware');
const despesaController = require('../controllers/ExpenseController');



const router = express.Router()

//Rotas para CRUDE despesas

router.post('/' , async (req, res) => despesaController.createDespesa(req, res));
router.get('/', authMiddleware.isAuth, async (req, res) => depesaController.getDespesas(req, res));
router.get('/:id', authMiddleware.isAuth, async (req, res) => despesaController.getDespesaById(req, res));
router.delete('/:id', authMiddleware.isAuth, async (req, res) => despesaController.deleteDespesa(req, res));
router.post('/search', authMiddleware.isAuth, async (req, res) => despesaController.search(req, res))


module.exports = router