const {Group} = require('../models/Group');

const EmptyException = require('../error/EmptyException');
const InvalidFieldException = require('../error/InvalidFieldException');
const RequiredFieldException = require('../error/RequiredFieldException');
const RequiredFieldLengthException = require('../error/InvalidFieldLengthException');
const NotAllowedException = require('../error/NotAllowedException');

const membersController = require('./membersController');

const createGroup = async function (req, res) {
  const adminId = Number(req.params.idClient);
  const {invites, ...groupValues} = req.body;

  try {
    const group = await Group.create({adminId, ...groupValues});
    req.body.idGroup = group.dataValues.id;

    if (req.body.invites.length > 0) {
      await membersController.addMember(req, res);
    }

    return res.status(200).send({group});
  } catch (err) {
    return res.status(500).send();
    // TODO errors
  }
};

const getGroupById = async function (req, res) {
  const {idGroup} = req.params;

  try {
    return await Group.findByPK(idGroup);
  } catch (err) {
    if (err instanceof EmptyException) {
      return res.status(400).send(err);
    }
    return res.status(500).send(err);
  }
}

const getGroupsByClientId = async function (req, res) {
  try {
    const groups = await membersController.getAllGroupsGivenMember(req, res);

    return res.status(200).send(groups);
  } catch (err) {
    return res.status(500).send(err);
  }
}

const deleteGroup = async function (req, res) {
  const {idGroup, idClient} = req.params;

  try {
    const group = await Group.findByPK(idGroup);

    if (group?.dataValues.admin_id.toString() === idClient) {
      await Group.hardDeleteGroup(idGroup);

      return res.status(200).send(group);
    }

    return res.status(200).send(new NotAllowedException('idAdmin'));
  } catch (err) {
    if (err instanceof EmptyException) {
      return res.status(400).send(err);
    }
    return res.status(500).send(err);
  }
}

const leaveGroup = async function (req, res) {
  const {idClient, idGroup} = req.params;

  try {
    const group = await getGroupById(req, res);

    if (idClient === group.dataValues.admin_id.toString()) {
      const groupMembers = await membersController.getAllMembersFromGroup(req, res);

      const members = groupMembers.map((group) => group.dataValues.id_client);

      if (members.length === 1) {
        await deleteGroup(req, res);
      }

      const adminIndex = members.findIndex(val => val.toString() === idClient)
      members.splice(adminIndex, 1);

      await Group.updateGroup(idGroup, {adminId: members[0]});
    }

    await membersController.leaveAsMember(req, res);
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send(err);
  }
}

module.exports = {
  createGroup,
  getGroupById,
  getGroupsByClientId,
  deleteGroup,
  leaveGroup
};
