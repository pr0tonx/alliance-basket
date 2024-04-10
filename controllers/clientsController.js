const db = require('../database/database');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

const createClient = async function (req, res) {
    try {
        const {name, password, phoneNumber, email} = req.body;

        const client = await db.getClientByEmail(email);

        if (client) {
            res.status(200).send('Email already registered.');
            return;
        }

        await db.createClient(name, phoneNumber, email, password);
        res.status(201).send('User created successfully!');

    } catch (err) {
        res.status(500).send('Something went wrong.');
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

const getClientById = async function (req, res) {
    try {
        const {id} = req.params;

        const client = await db.getClientById(id);

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

module.exports = {
    getClients,
    createClient,
    getClientById,
    updateClient,
    deleteClient,
    reactivateClient
}