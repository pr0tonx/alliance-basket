const express = require('express');

const membersController = require('../controllers/membersController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/clients/:id/groups', authMiddleware.isAuth, (req, res) => membersController.addMember(req, res));
router.get('/groups/:idGroup', authMiddleware.isAuth, (req, res) => membersController.getMembersFromGroup(req, res));

module.exports = router;
