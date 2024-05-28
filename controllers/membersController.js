const {Member} = require('../models/Member');

const EmptyException = require('../error/EmptyException');
const InvalidFieldException = require('../error/InvalidFieldException');
const RequiredFieldException = require('../error/RequiredFieldException');
const RequiredFieldLengthException = require('../error/InvalidFieldLengthException');

const clientsController = require('./clientsController');
// const groupsController = require('./groupsController');

const addMember = async function (req, res) {
  try {
    const clientsFound = await clientsController.getClientsByEmail(req, res);

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
    return res.status(500).send(err)
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

const removeMember = async function (req, res) {
  // const {idGroup, idClient} = req.params;
  // const {member} = req.body;
  //
  // try {
  //   const group = await groupsController.getGroupById(req, res);
  //   console.log(group.dataValues.admin_id);
  //
  //   return res.status(200).send();
  // } catch (err) {
  //   // if (err instanceof EmptyException) res.status(400).send(err);
  //   return res.status(500).send('Deu ruim no removeMember');
  // }
  return res.status(200).send('Not implemented');
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