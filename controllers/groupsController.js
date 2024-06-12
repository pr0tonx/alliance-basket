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
      membersController.addMember(req, res);
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
    const group = await Group.findByPK(idGroup);
    return res.status(200).send(group)
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

const removeMemberFromGroup = async function (req, res) {
  const {idGroup} = req.params;
  const {idClient, idMember} = req.body;

  try {
    const group = await Group.findByPK(idGroup);

    if (idClient !== group.dataValues.admin_id) throw new NotAllowedException('adminId');

    await membersController.removeMember(idGroup, idMember);

    res.status(200).send();
  } catch (err) {
    if (err instanceof NotAllowedException) {
      res.status(403).send(err);
    }
    res.status(500).send('Something went wrong while trying to remove a member from group');
  }
}

const leaveGroup = async function (req, res) {
  const {idClient, idGroup} = req.params;

  try {
    const group = await Group.findByPK(idGroup);

    if (idClient === group.dataValues.admin_id.toString()) {
      const groupMembers = await membersController.getAllMembersFromGroup(req, res);

      const members = groupMembers.map((group) => group.dataValues.id_client);

      if (members.length === 1) {
        await deleteGroup(req, res);
        return res.status(200).send();
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

const getClientsfromGroups = async function (req, res) {
  const { id_group } = req.params
  try {
    var clients = await Group.getClientsfromGroups(id_group)

    return res.status(200).send(clients)

  } catch (err) {
    return res.status(500).send("error")
  }
}

module.exports = {
  getClientsfromGroups,
  createGroup,
  getGroupById,
  getGroupsByClientId,
  removeMemberFromGroup,
  deleteGroup,
  leaveGroup
};
