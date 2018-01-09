var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

const planList = require('./routes/plan-list');
app.use('/plan-list', planList);

const port = 3000;
app.listen(port, function() {
    console.log("Server running on port", port);
});
