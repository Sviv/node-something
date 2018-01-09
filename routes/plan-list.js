var express = require('express');
var router = express.Router();
// var mongo = require('mongodb').MongoClient;
// var assert = require('assert');
//
// var dbConfig = require('../config');
// var url = dbConfig.database;

// var ObjectId = require('mongodb').ObjectId;

let planList = require('../mocks/plan-list');
let plan = require('../mocks/plan');

router.get('/get-all-mock', function(req, res) {
  console.log('get-all', planList);
  res.json(planList);
});


module.exports = router;
