const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 8080;

const routes = require('./routes');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors({
  origin: "*"
}));

app.use("/api", routes);
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;
