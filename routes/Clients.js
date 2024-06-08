const express = require('express');

const clientController = require('../controllers/clientsController');
const groupsController = require('../controllers/groupsController');
const membersController = require('../controllers/membersController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router()

router.post('/' , async (req, res) => clientController.createClient(req, res));
router.get('/', authMiddleware.isAuth, async (req, res) => clientController.getClients(req, res));
router.get('/:id', authMiddleware.isAuth, async (req, res) => clientController.getClientById(req, res));
router.put('/:id', authMiddleware.isAuth, async (req, res) => clientController.updateClient(req, res));
router.delete('/:id', authMiddleware.isAuth, async (req, res) => clientController.deleteClient(req, res));
router.patch('/:id', authMiddleware.isAuth, async (req, res) => clientController.reactivateClient(req, res));
router.post('/search', authMiddleware.isAuth, async (req, res) => clientController.search(req, res))
router.post('/login',  async (req, res) => clientController.login(req, res))

module.exports = router
