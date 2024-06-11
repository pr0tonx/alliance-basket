const EmptyException = require('../error/EmptyException');
const InvalidFieldException = require('../error/InvalidFieldException');
const RequiredFieldException = require('../error/RequiredFieldException');
const UserExistsException = require('../error/UserExistsException');
const Client = require('../models/Client');

const createClient = async function (req, res) {
  try {
    const user = await Client.create(req.body)

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

    return res.status(500).send(error);
  }
}

const login = async function (req, res) {
  try{
    const user = await Client.login(req.body)

    return res.status(200).send(user)
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
    let users = await Client.search(req.body)
    return res.status(200).send({users: users})
  } catch (err) {
    if (err.name === 'SequelizeEmptyResultError') {
        return res.status(204).send();
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

const getClientById2 = async function (id) {
  try {
    return await Client.findOne({where: {id}});

  } catch (err) {
    throw err;
  }
}

const getClientByEmail = async function (email) {
  try {
    const client = await Client.searchEmail(email);

    return client[0];
  } catch (err) {
    throw err;
  }
}

const getClientsToInviteByEmail = async function (req, res) {
  try {
    const {invites} = req.body;

    const users = [];
    for (const invite of invites) {
      const user = await Client.searchEmail(invite);

      if (user.length > 0) users.push(...user);
    }

    return users;
  } catch (err) {
    res.status(500).send('Problema no getClientByEmail');
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
  getClientById2,
  getClientByEmail,
  getClientsToInviteByEmail,
  login
}
