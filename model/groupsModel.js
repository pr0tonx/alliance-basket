const db = require('../database/database');
const EmptyException = require('../error/EmptyException');

class Group {
    constructor({id_group, group_name, id_admin, created_at, deleted_at}){
        this.id = id_group;
        this.name = group_name;
        this.id_admin = id_admin;
        this.created_at = created_at;
        this.deleted_at =deleted_at;
    }
}

async function getGroupByid(id) {
    const sqlQuery = `SELECT * FROM Groups WHERE id_group = ${id}`;

    const group = await db.DBX().query(sqlQuery);

    if (group.length === 0) {
        return null
    }

    return new Group(group[0][0]);
}

function isValidAdmin(group, adminId){
    return group.id_admin == adminId
}

async function getAllGroupsIdsFromClient(clientId) {
    const query = `SELECT id_group FROM Members WHERE id_client = ?`

    let [groupsIds] = await db.DBX().query(query, [clientId])

    if (groupsIds.length == 0) {
    throw new EmptyException("This client is in no group")
    }
    return groupsIds
}

async function getAllGroupsFromClient(clientId) {
    let groups = {}
    let groupsIds = await getAllGroupsIdsFromClient(clientId)

    await Promise.all(groupsIds.map(async (group) => {
        groups[group.id_group] = await getGroupByid(group.id_group);
    }))

    return groups
}

module.exports = {
    getGroupByid,
    isValidAdmin,
    getAllGroupsFromClient
}
