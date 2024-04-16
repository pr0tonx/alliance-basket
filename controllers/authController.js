const jwt = require('jsonwebtoken');

const {getClientByEmail} = require('../database/database');
const {createClient} = require('./clientsController');

const signup = async function (req, res) {
    const {email, password} = req.body;

    try {
        const client = await getClientByEmail(email);

        if (client.length >= 1) {
            res.status(422).send({
                error: 'Unprocessable Entity',
                message: 'Email already registered.',
                code: 422
            });
            return;
        }

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

    try {
        const client = await getClientByEmail(email);

        if (client.length === 0) {
            res.status(401).send({
                error: 'Unauthorized',
                message: 'Email or password is incorrect.',
                code: 401
            });
            return;
        }

        if (!req.body.isFirstLogin) {
            req.body.password = Buffer.from(`${email}:${process.env.SECRET_TOKEN}:${req.body.password}`).toString('base64');

            if (req.body.password !== client[0].password) {
                res.status(401).send({
                    error: 'Unauthorized',
                    message: 'Email or password is incorrect.',
                    code: 401
                });
                return;
            }
        }

        const token = createToken(req.body.password);
        req.headers.authorization = token;

        res.status(200).send({
            id: client[0].id_client,
            email,
            token
        });
    } catch (err) {
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

module.exports = {
    signup,
    login
}