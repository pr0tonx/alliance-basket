const jwt = require('jsonwebtoken');

const db = require('../database/database');
const clientsController = require('./clientsController');

const signup = async function (req, res) {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        res.status(400).send({
            error: 'Bad Request',
            message: 'No empty field allowed.',
            code: 400
        });
        return;
    }

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        res.status(400).send({
            error: 'Bad Request',
            message: 'Email format not allowed.',
            status: 400
        });
        return;
    }

    if (!password.match(/^(?=.*[A-Z])(?=.*\d).{6,}$/)) {
        res.status(400).send({
            error: 'Bad Request',
            message: 'The password must contains at least six characters, which at least one is a capital letter and a number.',
            code: 400
        });
        return;
    }

    try {
        const client = await db.getClientByEmail(email);

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
        await clientsController.createClient(req, res);

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
    const {email, password} = req.body;

    if (!req.body.isFirstLogin) {
        if (!email || !password) {
            res.status(400).send({
                error: 'Bad Request',
                message: 'No empty field allowed.',
                code: 400
            });
            return;
        }

        if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            res.status(400).send({
                error: 'Bad Request',
                message: 'Email format not allowed.',
                status: 400
            });
            return;
        }

        if (!password.match(/^(?=.*[A-Z])(?=.*\d).{6,}$/)) {
            res.status(400).send({
                error: 'Bad Request',
                message: 'The password must contains at least six characters, which at least one is a capital letter and a number.',
                code: 400
            });
            return;
        }
    }

    try {
        const client = await db.getClientByEmail(email);

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
            message: err.message,
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