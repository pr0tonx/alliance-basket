const jwt = require('jsonwebtoken');

const {getClientByEmail} = require('../database/database');
const {createClient} = require('./clientsController');

// const crypto = require('crypto');

const signup = async function (req, res) {
    const {email, password} = req.body;

    try {
        const client = await getClientByEmail(email);

        console.log(client[0].id_client);

        if (client.length >= 1) {
            res.status(422).send({
                error: 'Unprocessable Entity',
                message: 'Email already registered.',
                code: 422
            });
            return;
        }

        // TODO use Cipheriv for a better password protection - 2nd sprint
        // const iv = crypto.randomBytes(16);
        // const data = Buffer.from(`${email}:${password}`).toString('base64');
        // const cipher = crypto.createCipheriv('aes-256-cbc', process.env.SECRET_TOKEN, iv);
        // let encryptedPassword = cipher.update(data, 'utf-8', 'hex');
        // encryptedPassword += cipher.final('hex');

        // req.headers.id = client.id;
        req.body.isFirstLogin = true;
        req.body.password = Buffer.from(`${email}:${process.env.SECRET_TOKEN}:${password}`).toString('base64');



        await createClient(req, res);

        await login(req, res);
    } catch (err) {
        res.status(500).send({
            error: 'Internal server error',
            message: 'Something went wrong while trying to register a new client',
            status: 500
        });
    }
}

const login = async function (req, res) {
    const {email} = req.body;

    const token = createToken(req.body.password);
    req.headers.authorization = {'Authorization': `Bearer ${token}`};

    console.log((req.headers.authorization).split(' ')[1]);

    const user = await getClientByEmail(email);

    try {
        if (!req.body.isFirstLogin) {
            req.body.password = Buffer.from(`${email}:${process.env.SECRET_TOKEN}:${req.body.password}`).toString('base64');

            if (req.body.password !== user.password) {
                res.status(401).send({
                    error: 'Unauthorized',
                    message: 'Email or password is incorrect.',
                    code: 401
                });
                return;
            }

            const token = createToken(req.body.password);
            req.headers.authorization = {'Authorization': `Bearer ${token}`};
        }

        // const clientId = user[0].id_client;
        // req.headers.id = clientId;

        // TODO redirect to some page
        // location.assign('/');

        // res.status(200).send({token});
        res.status(200).send() // FIXME
    } catch (err) {
        console.log(err);
        res.status(500).send({
            error: 'Internal server error',
            message: 'Something went wrong while trying to login',
            status: 500
        });
    }
}

const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET_TOKEN, {
        expiresIn: 3600
    });
}

const setAuthHeader = (req, token) => {
    req.headers.authorization = token;
}

module.exports = {
    signup,
    login
}