const db = require('../database/database')
const groupModel = require('../model/groupsModel')


async function getClientById (id) {
    const query = `SELECT * from TB_clients WHERE id_client=?`;
    const values = [id];

    const [client] = await db.DBX().query(query, values);

    return client[0];
}

async function getClientGroups (id) {
  return groupModel.getAllGroupsFromClient(id)
}

module.exports = {
  getClientById ,
  getClientGroups
}

