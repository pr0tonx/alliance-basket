const express = require('express');

const clientController = require('../controllers/clientsController');
const groupsController = require('../controllers/groupsController');
const membersController = require("../controllers/membersController");

const router = express.Router()

router.post('/', async (req, res) => clientController.createClient(req, res));
router.get('/', async (req, res) => clientController.getClients(req, res));
router.get('/:id', async (req, res) => clientController.getClientById(req, res));

// FIX: https://trello.com/c/nG8WJd64/15-fix-updateusers-try-to-update-everything
router.put('/:id', async (req, res) => clientController.updateClient(req, res));
router.delete('/:id', async (req, res) => clientController.deleteClient(req, res));
router.patch('/:id', async (req, res) => clientController.reactivateClient(req, res));

/** GROUPS **/
// FIX: https://trello.com/c/fVvydRA0/25-move-groups-endpoint-to-groups-entity-insted-of-clients
router.post('/:idClient/groups', async (req, res) => groupsController.createGroup(req, res));
// router.get('/clients/:idClient/groups', async (req, res) => getGroupsByClient(req, res));
router.delete('/:idClient/groups/:idGroup', async (req, res) => groupsController.deleteGroup(req, res));

/** MEMBERS **/
router.post('/clients/:idClient/groups/:idGroup/members', async (req, res) => membersController.addGroupMember(req, res));

module.exports = router
