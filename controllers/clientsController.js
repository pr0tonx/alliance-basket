const clientModel =  require('../model/clientModel')
const EmptyException = require('../error/EmptyException');
const InvalidFieldException = require('../error/InvalidFieldException');
const RequiredFieldException = require('../error/RequiredFieldException');
const UserExistsException = require('../error/UserExistsException');
const Client = require('../models/Client');
const { createToken } = require('./authController');

const createClient = async function (req, res) {
  try {
    let user = await Client.create(req.body)
    let token = createToken(user.email)
    let response = {
      user: user,
      token: token
    }

    return res.status(200).send(response)
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

    return res.status(500).send(error);
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
    res.status(500).send(err);
  }
}

const search = async function (req, res) {
    try {
        let users = await clientModel.search(req.body)
        return res.status(200).send(users)
    } catch (err) {
        
    if (err instanceof EmptyException) {
        return res.status(204).send(err);
      }
      return res.status(500).send(err);
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
    return res.status(200).send(client);
  } catch (err) {
    if (err instanceof EmptyException){
      return res.status(400).send(err)
    }
    return res.status(500).send(err);

  }
}

const updateClient = async function (req, res) {
  try {
    const {id} = req.params;
    let client = await Client.updateClient(id, req.body);

    return res.status(200).send(client);
  } catch (err) {
    if (err instanceof EmptyException) {
      return res.status(400).send(err)
    }
    if (err instanceof InvalidFieldException) {
      return res.status(400).send(err)
    }
    return res.status(500).send(err);
  }
}

// TODO when deleting a user, the group admin must be transfered to another user if there is one
const deleteClient = async function (req, res) {
  try {
    const {id} = req.params;
    await Client.softDeleteClient(id) 

    return res.status(200).send({message: 'User deleted successfully.'});
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

// FIXME sql error when trying to add a TIMESTAMP
const reactivateClient = async function (req, res) {
  try {
    const {id} = req.params;
    await Client.reactivateClient(id);
    
    return res.status(200).send({message: 'User reactivated successfully'});
  } catch (err) {
    if (err instanceof EmptyException) {
      return res.status(400).send(err)
    }
    return res.status(500).send(err.message);
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
