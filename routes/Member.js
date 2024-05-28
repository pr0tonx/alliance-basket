const express = require('express');

const membersController = require('../controllers/membersController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/clients/:id/groups', authMiddleware.isAuth, (req, res) => membersController.addMember(req, res));
router.delete('/groups/:idGroup/clients/:idClient', authMiddleware.isAuth, (req, res) => membersController.removeMember(req, res));

// router.get('/group/:id', (req, res) => membersController.listAllMembers(req, res));

module.exports = router;
