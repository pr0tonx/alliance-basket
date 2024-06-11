const express = require('express');

const ticketsController = require('../controllers/ticketsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware.isAuth, (req, res) => ticketsController.createTicket(req, res));
router.post('/:id', authMiddleware.isAuth, (req, res) => ticketsController.createTicketMessage(req, res));
router.get('/', authMiddleware.isAuth, (req, res) => ticketsController.getAllTickets(req, res));
router.get('/clients/:id', authMiddleware.isAuth, (req, res) => ticketsController.getAllOpenTicketsByClientId(req, res));
router.get('/:idChat', authMiddleware.isAuth, (req, res) => ticketsController.getMessagesByTicketId(req, res));
router.patch('/', authMiddleware.isAuth, (req, res) => ticketsController.updateTicketStatus(req, res));

module.exports = router;
