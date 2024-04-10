const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    reactivateClient
} = require('./controllers/clientsController');
const {
    createGroup,
    getAllGroups,
    deleteGroup,
    editGroup
} = require('./controllers/groupsController');
const {addGroupMember} = require('./controllers/membersController');
const {login, signup} = require('./controllers/authController');
const {isAuth} = require("./middleware/authMiddleware");

app.listen(8080, () => console.log(`Server is running on port ${PORT}`));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Expose-Headers", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "86400");
    next();
});

/** LOGIN **/
app.post('/signup', (req, res) => signup(req, res));
app.post('/login', (req, res) => login(req, res));

/** HOME PAGE **/
app.get('/', (_, res) => res.send(200));

/** CLIENTS **/
app.post('/clients', async (req, res) => createClient(req, res));
app.get('/clients', async (req, res) => getClients(req, res));
app.get('/clients/:idClient', async (req, res) => getClientById(req, res));
app.put('/clients/:idClient', async (req, res) => updateClient(req, res));
app.delete('/clients/:idClient', async (req, res) => deleteClient(req, res)); // FIXME // TODO
app.patch('clients/:idClient', async (req, res) => reactivateClient(req, res)); // FIXME

/** GROUPS **/
app.post('/clients/:idClient/groups', async (req, res) => createGroup(req, res));
app.get('/groups', (req, res) => getAllGroups(req, res));
app.put('/groups/:idClient/groups/:idGroup', (req, res) => editGroup(req, res));
// app.get('/clients/:idClient/groups', async (req, res) => getGroupsByClient(req, res));
app.delete('/clients/:idClient/groups/:idGroup', async (req, res) => deleteGroup(req, res));

/** MEMBERS **/
app.post('/clients/:idClient/groups/:idGroup/members', async (req, res) => addGroupMember(req, res));

app.use((err, req, res, next) => {
    console.log(err);
    if (err.type === 'entity.parse.failed') res.status(400).send('Invalid JSON format').end();
    res.status(500).send('Something broke');
    next();
});

module.exports = {
    app
}
