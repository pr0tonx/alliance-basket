

// const express = require('express');
// const app = express();
//
// const {getUsers, createUser, getUserById} = require('./database');
//
//
// const {createUser, getUsers, getUserById} = require("../database");
// app.post('/createUser', async (req, res) => {
//     const {username, password, cellphone, email} = req.body;
//
//     console.log(username, password, cellphone, email);
//     const user = await createUser(username, password, cellphone, email);
//     res.status(201).send(user);
// });
//
// app.get('/users', async (req, res) => {
//     const users = await getUsers();
//
//     res.status(200).send(users);
// })
//
// app.get('/users/:id', async (req, res) => {
//     const id = req.params.id;
//
//     const user = await getUserById(id);
//     res.status(200).send(user);
// })
