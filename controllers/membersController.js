const {Member} = require('../models/Member');

const EmptyException = require('../error/EmptyException');
const InvalidFieldException = require('../error/InvalidFieldException');
const RequiredFieldException = require('../error/RequiredFieldException');
const RequiredFieldLengthException = require('../error/InvalidFieldLengthException');

const clientsController = require('./clientsController');

const addMember = async function (req, res) {
  try {
    const clientsFound = await clientsController.getClientsToInviteByEmail(req, res);

    for (const client of clientsFound) {
      await Member.create({idGroup: req.body.idGroup, idClient: client.dataValues.id});
    }

    return res.status(200).send();
  } catch (err) {
    res.status(500).send(); // TODO
  }
}

const getAllMembersFromGroup = async function (req, res) {
  const {idGroup} = req.params;

  try {
    return Member.findAllGivenValue({idGroup});
  } catch (err) {
    return res.status(500).send(err);
  }
}

const getMembersFromGroup = async function (req, res) {
  const {idGroup} = req.params;

  try {
    const group = await Member.findAllGivenValue({idGroup});

    res.status(200).send(group);
  } catch (err) {
    return res.status(500).send(err);
  }
}

const getAllGroupsGivenMember = async function (req, res) {
  const {idClient} = req.params;

  try {
    return await Member.findAllGivenValue({idClient});
  } catch (err) {
    res.status(500).send(err);
  }
}

const removeMember = async function (idGroup, idMember) {
  try {
    return await Member.deleteMember({idClient: idMember});
  } catch (err) {
    throw err;
  }
}

const leaveAsMember = async function (req, res) {
  const {idClient, idGroup} = req.params;

  try {
    return await Member.deleteMember({idClient, idGroup});
  } catch (err) {
    return res.status(500).send(err);
  }
}

module.exports = {
  addMember,
  getAllMembersFromGroup,
  getMembersFromGroup,
  getAllGroupsGivenMember,
  removeMember,
  leaveAsMember
}