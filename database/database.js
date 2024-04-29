const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();


function DBX() {
     return mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.PASSWORD,
        database: process.env.MYSQL_DATABASE
    }).promise();
}

/** LOGIN **/
async function signin(email, password) {
    const query = `SELECT * FROM Clients WHERE (email, password) VALUES (?, ?)`;
    const values = [email, password];

    return await pool.query(query, values) || false;
}

/** GROUPS **/
async function createGroup(groupName, idClient, adminOnlyExpenses) {
    const query = `INSERT INTO Groups (group_name, id_admin, admin_only_expenses) VALUES (?, ?, ?)`;
    const values = [groupName, idClient, adminOnlyExpenses];

    const [rows] = await pool.query(query, values);

    return rows;
}

async function getAllGroups() {
    const query = `SELECT * FROM Groups`;

    const [rows] = await pool.query(query);

    return rows;
}

async function editGroup(idGroup, groupName, adminOnlyExpenses) {
    const query = `UPDATE Groups SET group_name=?, admin_only_expenses=? WHERE id_group=?`;
    const values = [groupName, idGroup, adminOnlyExpenses];

    const [rows] = await pool.query(query, values);

    return rows;
}

async function deleteGroup(idGroup) {
    const query = `DELETE FROM Groups WHERE id_group=?`;
    const values = [idGroup];

    const [rows] = await pool.query(query, values);

    return rows;
}

/** MEMBERS **/
async function addMemberToGroup(idGroup, member) {
    const query = `INSERT INTO Mermbers (id_group, id_client) VALUES(?, ?)`;
    const values = [idGroup, member];

    const [rows] = await pool.query(query, values);

    return rows;
}

module.exports = {
    signin,

    DBX,

    createGroup,
    getAllGroups,
    editGroup,
    deleteGroup,

    addMemberToGroup
}
