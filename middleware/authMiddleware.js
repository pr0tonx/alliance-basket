const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    const token = (req.headers.authorization).split(' ')[1];
    console.log(token);

    if (!token) {
        res.status(401).send({
            error: 'Unauthorized',
            message: 'No token provided.',
            status: 401
        });

        res.redirect('/login');
        return;
    }

    jwt.verify(token, process.env.SECRET_TOKEN, (err) => {
        if (err) {
            res.status(401).send({
                error: 'Unauthorized',
                message: 'Token expired.',
                status: 401
            });

            res.redirect('/login');
        } else next();
    });
}

module.exports = {
    isAuth
}