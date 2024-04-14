const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080;

const routes = require('./routes');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// FIXME setar individualmente no header 'Access-Control-Allow-Origin' no retorno da requisição (sprint 2)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Expose-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    next();
});

app.use("/", routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;
