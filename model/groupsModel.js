const db = require('../database/database');

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
    const sqlQuery = `SELECT * FROM TB_groups WHERE id_group = ${id}`;

    const group = await db.DBX().query(sqlQuery);

    if (group.length === 0) {
        return null
    }

    return new Group(group[0][0]);
}

function isValidAdmin(group, adminId){
    return group.id_admin == adminId
}

module.exports = {
    getGroupByid,
    isValidAdmin
}