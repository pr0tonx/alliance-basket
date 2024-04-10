const typeHandler = function (params, expected, res) {

    params.forEach((param, i) => {
        if (param !== expected[i]) {
            console.log(param, expected[i]);
            res.status(400).send('Paramaters validation error.').end();
        }
    });
}

const nullHandler = function (params, res) {
    params.forEach(param => {
        if (!param) {
            res.status(400).send('Missing parameters error.');
        }
    });
}

module.exports = {
    typeHandler,
    nullHandler
}