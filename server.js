var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const dividedWords = require('./routes/divided-words');
const planList = require('./routes/plan-list');

app.use('/plan-list', planList);
app.use('/divided-words', dividedWords);

//app.get('/test', (req, res) => res.send('Hello World!'));


module.exports = app;


const port = 3000;
app.listen(port, function() {
    console.log("Server running on port", port);
});