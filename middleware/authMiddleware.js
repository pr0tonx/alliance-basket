const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {

    if (!req.headers.authorization) {
        res.status(401).send({
            error: 'Unauthorized',
            message: 'No token provided.',
            status: 401
        });
        res.redirect('/login');
        return;
    }

    const token = (req.headers.authorization).split(' ')[0];

    jwt.verify(token, process.env.SECRET_TOKEN, (err) => {
        if (err) {
            res.status(401).send({
                error: 'Unauthorized',
                message: 'Token expired.',
                status: 401
            });
        } else next();
    });
}

module.exports = {
    isAuth
}