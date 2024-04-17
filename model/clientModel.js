const db = require('../database/database')


async function getClientById (id) {
    const query = `SELECT * from TB_clients WHERE id_client=?`;
    const values = [id];

    const [client] = await db.DBX().query(query, values);

    return client[0];
}

module.exports = {
  getClientById 
}

