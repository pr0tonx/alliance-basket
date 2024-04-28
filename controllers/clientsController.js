const db = require('../database/database');
const clientModel =  require('../model/clientModel')
const EmptyException = require('../error/EmptyException');
const Client = require('../models/Client');

const createClient = async function (req, res) {
    try {
      let user = await Client.create({name : "haha", "email": "dhasdkasd", "password": "dasdasda"})
      return res.status(200).send(user)
    } catch (err) {
        res.status(500).send({
            error: 'Internal server error',
            message: 'Something while trying to create a client.',
            code: 500
        });
        throw err;
    }
}

const getClients = async function (req, res) {
    try {
        const clients = await db.getClients();

        res.status(200).send(clients);
    } catch (err) {
        res.status(500).send('Something went wrong.');
        throw err;
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

        const client = await clientModel.getClientById(id);
        res.status(200).send(client);
    } catch (err) {
        res.status(500).send('Something went wrong.');
        throw err;
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
