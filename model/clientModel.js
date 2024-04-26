const db = require('../database/database');
const EmptyException = require('../error/EmptyException');
const groupModel = require('../model/groupsModel')

async function getClientById (id) {
    const query = `SELECT * from TB_clients WHERE id_client=?`;
    const values = [id];

    const [client] = await db.DBX().query(query, values);

    return client[0];
}

async function search (queryParams) {
  let clients = await searchClient(queryParams)
  
  if (clients.length == 0) {
    throw new EmptyException("No clients found")
  }

  let clientsObj = {}

  clients.forEach((client) => {
    clientsObj[client.id_client] = client;
  });
  
  return clientsObj
}

async function getClientGroups (id) {
  return groupModel.getAllGroupsFromClient(id)
}

async function searchClient (params) {
  let queryParams = Object.keys(params)
  let query = `SELECT * FROM TB_clients WHERE `

  queryParams.forEach(column => {
    const value = typeof params[column] === 'string' ? `'${params[column]}'` : params[column];
    query += `${column} = ${value} AND `;
  });
  
  query = query.slice(0, -5);
  let [Clients] = await db.DBX().query(query)

  return Clients
}

module.exports = {
  getClientById,
  search,
  getClientGroups,
}

