const {Member} = require('../models/Member');

const EmptyException = require('../error/EmptyException');
const InvalidFieldException = require('../error/InvalidFieldException');
const RequiredFieldException = require('../error/RequiredFieldException');
const RequiredFieldLengthException = require('../error/InvalidFieldLengthException');

const clientsController = require('./clientsController');

const addMember = async function (req, res) {
  try {
    const clientsFound = await clientsController.getClientsByEmail(req, res);

    for (const client of clientsFound) {
      await Member.create({idGroup: req.body.idGroup, idClient: client.dataValues.id});
    }

    return res.status(200).send();
  } catch (err) {
    console.log('Deu erro no addMember', err);
    return res.status(500).send(); // TODO
  }
}

const getAllMembersFromGroup = async function (req, res) {

}

const getMemberById = async function (req, res) {
  const {idClient, idGroup} = req.body;

  try {
    const member = await Member.findOne();


  } catch (err) {
    console.log('Deu erro no getMemberById', err)
    return res.status(500).send();
  }
  // chamar o getAllMembers se precisar
}

const removeMember = async function (req, res) {

}

module.exports = {
  addMember,
  getMemberById
}