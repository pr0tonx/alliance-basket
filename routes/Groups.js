const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const groupsController = require('../controllers/groupsController');

const router = express.Router();

router.post('/clients/:idClient', authMiddleware.isAuth, (req, res) => groupsController.createGroup(req, res));
router.get('/:idGroup', authMiddleware.isAuth, (req, res) => groupsController.getGroupById(req, res));
router.get('/clients/:idClient', authMiddleware.isAuth, (req, res) => groupsController.getGroupsByClientId(req, res));
router.get('/:id_group/members', authMiddleware.isAuth, (req, res) => groupsController.getClientsfromGroups(req, res));
router.delete('/:idGroup/clients/:idClient', authMiddleware.isAuth, (req, res) => groupsController.deleteGroup(req, res));
router.post('/:idGroup/clients/:idClient', authMiddleware.isAuth, (req, res) => groupsController.leaveGroup(req, res));

module.exports = router;
