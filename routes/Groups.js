const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const groupsController = require('../controllers/groupsController');

const router = express.Router();

router.post('/clients/:idClient', authMiddleware.isAuth, (req, res) => groupsController.createGroup(req, res));
router.get('/:idGroup', authMiddleware.isAuth, (req, res) => groupsController.getGroupById(req, res));
router.get('/clients/:idClient', authMiddleware.isAuth, (req, res) => groupsController.getGroupsByClientId(req, res));
router.delete('/:idGroup/clients/:idClient', authMiddleware.isAuth, (req, res) => groupsController.deleteGroup(req, res));
router.post('/:idGroup/clients/:idClient', authMiddleware.isAuth, (req, res) => groupsController.leaveGroup(req, res));

// router.get('/', (req, res) => groupsController.getAllGroups(req, res));
// router.put('/:idClient/groups/:idGroup', (req, res) => groupsController.editGroup(req, res));

module.exports = router;
