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
    const query = `SELECT * FROM TB_clients WHERE (email, password) VALUES (?, ?)`;
    const values = [email, password];

    return await pool.query(query, values) || false;
}

/** CLIENTS **/
async function createClient(name, phoneNumber, email, password) {
    const query = `INSERT INTO TB_clients (name, phone_number, email, password) VALUES (?, ?, ?, ?)`;
    const values = [name, phoneNumber, email, password];

    const [rows] = await pool.query(query, values);

    return rows;
}

async function getClients() {
    const query = `SELECT * FROM TB_clients`;

    const [rows] = await pool.query(query);

    return rows;
}

async function getClientById(id) {
    const query = `SELECT * from TB_clients WHERE id_client=?`;
    const values = [id];

    const [rows] = await pool.query(query, values);

    return rows;
}

async function getClientByEmailAndPhone(email, phoneNumber) {
    const query = `SELECT * from TB_clients WHERE email=? OR phone_number=?`;
    const values = [email, phoneNumber];

    const [rows] = await pool.query(query, values);

    return rows;
}

async function getClientByEmail(email) {
    const query = `SELECT * FROM TB_clients WHERE email=?`;
    const values = [email];

    const [rows] = await pool.query(query, values);

    return rows;
}

async function updateClient(id, name, phoneNumber, email, password) {
    const query = `UPDATE TB_clients SET name=?, phone_number=?, email=?, password=? WHERE id_client=${id}`;
    const values = [name, phoneNumber, email, password];

    const [rows] = await pool.query(query, values);

    return rows;
}

async function deleteClient(idClient) {
    const query = `UPDATE TB_clients SET deleted_at=NOW() WHERE id_client=?`;
    const values = [idClient];

    const [rows] = await pool.query(query, values);

    return rows;
}

// TODO tá errado
async function reactivateClient(id) {
    const query = `UPDATE TB_clients SET deleted_at=${undefined} WHERE id_client=${id}`;

    const [rows] = await pool.query(query);

    return rows;
}

/** GROUPS **/
async function createGroup(groupName, idClient) {
    const query = `INSERT INTO TB_groups (group_name, id_admin) VALUES (?, ?)`;
    const values = [groupName, idClient];

    const [rows] = await pool.query(query, values);

    return rows;
}

async function getAllGroups() {
    const query = `SELECT * FROM TB_groups`;

    const [rows] = await pool.query(query);

    return rows;
}

// async function getGroupsByClient(idClient) {
//     const query = `SELECT * FROM TB_groups WHERE id_admin=?`;
//     const values = [idClient];
//
//     const [rows] = await pool.query(query, values);
//
//     return rows;
// }

async function editGroup(idGroup, groupName) {
    const query = `UPDATE TB_groups SET group_name=? WHERE id_group=?`;
    const values = [groupName, idGroup];

    const [rows] = await pool.query(query, values);

    return rows;
}

async function deleteGroup(idGroup) {
    const query = `DELETE FROM TB_groups WHERE id_group=?`;
    const values = [idGroup];

    const [rows] = await pool.query(query, values);

    return rows;
}

/** MEMBERS **/
async function addMemberToGroup(idGroup, member) {
    const query = `INSERT INTO TB_MEMBERS (id_group, id_client) VALUES(?, ?)`;
    const values = [idGroup, member];

    const [rows] = await pool.query(query, values);

    return rows;
}

module.exports = {
    signin,

    createClient,
    getClients,
    getClientById,
    getClientByEmailAndPhone,
    getClientByEmail,
    updateClient,
    deleteClient,
    reactivateClient,

    DBX,

    createGroup,
    getAllGroups,
    editGroup,
    deleteGroup,

    addMemberToGroup
}
