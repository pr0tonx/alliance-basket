const express = require('express');

const clientController = require('../controllers/clientsController');
const groupsController = require('../controllers/groupsController');
const membersController = require('../controllers/membersController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router()

router.post('/', authMiddleware.isAuth, async (req, res) => clientController.createClient(req, res));
router.get('/', authMiddleware.isAuth,  async (req, res) => clientController.getClients(req, res));
router.get('/:id', authMiddleware.isAuth, async (req, res) => clientController.getClientById(req, res));
// FIX: https://trello.com/c/nG8WJd64/15-fix-updateusers-try-to-update-everything
router.put('/:id', authMiddleware.isAuth, async (req, res) => clientController.updateClient(req, res));
router.delete('/:id', authMiddleware.isAuth, async (req, res) => clientController.deleteClient(req, res));
router.patch('/:id', authMiddleware.isAuth, async (req, res) => clientController.reactivateClient(req, res));

/** GROUPS **/
// FIX: https://trello.com/c/fVvydRA0/25-move-groups-endpoint-to-groups-entity-insted-of-clients
router.post('/:idClient/groups', authMiddleware.isAuth, async (req, res) => groupsController.createGroup(req, res));
router.delete('/:idClient/groups/:idGroup', authMiddleware.isAuth, async (req, res) => groupsController.deleteGroup(req, res));
router.get('/:clientId/groups', async (req, res) => clientController.getAllGroups(req, res));

/** MEMBERS **/
router.post('/clients/:idClient/groups/:idGroup/members', async (req, res) => membersController.addGroupMember(req, res));

module.exports = router
