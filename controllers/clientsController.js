const db = require('../database/database');
const clientModel =  require('../model/clientModel')
const EmptyException = require('../error/EmptyException');
const InvalidFieldException = require('../error/InvalidFieldException');
const RequiredFieldException = require('../error/RequiredFieldException');
const UserExistsException = require('../error/UserExistsException');
const Client = require('../models/Client');

const createClient = async function (req, res) {
    try {
      let user = await Client.create(req.body)
      return res.status(200).send(user)
    } catch (error) {
      if (error instanceof InvalidFieldException) {
        return res.status(400).send(error);
      }

      if (error instanceof RequiredFieldException) {
        return res.status(400).send(error);
      }

      if (error instanceof UserExistsException) {
        return res.status(400).send(error);
      }

      return res.status(500).send(error.message);
  }
}

const getClients = async function (req, res) {
  try {
    const clients = await Client.findAll({
      where : {
        status: 1,
        type: 1,
      }
    })
    res.status(200).send(clients);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

const search = async function (req, res) {
    try {
        let users = await clientModel.search(req.body)
        return res.status(200).send(users)
    } catch (err) {
        
    if (err instanceof EmptyException) {
        return res.status(204).send(err.message);
      }
      return res.status(500).send(err.message);
    }
}

const getClientById = async function (req, res) {
  try {
    const {id} = req.params;

    const client = await Client.findOne({where : {
      id: id,
      status: 1,
      type: 1
      }
    })

    if (client === null) {
      return res.status(404).send(new EmptyException('Client not found'))
    } 

    return res.status(200).send(client);
  } catch (err) {
    return res.status(500).send('Something went wrong.');
  }
}

const updateClient = async function (req, res) {
    try {
        const {id} = req.params;
        const {name, password, phoneNumber, email} = req.body;

        await db.updateClient(id, name, password, phoneNumber, email);

        res.status(200).send('User updated successfully.');
    } catch (err) {
        res.status(500).send('Something went wrong.');
        throw err;
    }
}

// FIXME sql error when trying to add a TIMESTAMP
// TODO when deleting a user, the group admin must be transfered to another user if there is one
const deleteClient = async function (req, res) {
    try {
        const {id} = req.params;

        await db.deleteClient(id);

        res.status(200).send('User deleted successfully.');
    } catch (err) {
        res.status(500).send('Something went wrong.');
        throw err;
    }
}

// FIXME sql error when trying to add a TIMESTAMP
const reactivateClient = async function (req, res) {
    try {
        const {id} = req.params;

        await db.reactivateClient(id);

        res.status(200).send('User reactivated successfully');
    } catch (err) {
        res.status(500).send('Something went wrong.');
        throw err;
    }
}
const getAllGroups = async function (req, res) {
  const {clientId} = req.params;

  try {

    let groups = await clientModel.getClientGroups(clientId);
    return res.status(200).send(groups)

  } catch (err) {

    if (err instanceof EmptyException) {
      return res.status(204).send(err.message);
    }

    return res.status(500).send(err.message)
  }
}

module.exports = {
    getClients,
    createClient,
    getClientById,
    updateClient,
    deleteClient,
    reactivateClient,
    search,
    getAllGroups,
}
