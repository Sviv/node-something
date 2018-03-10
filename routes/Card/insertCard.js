var mongo = require('mongodb').MongoClient;
var dbConfig = require('../../config');
var url = dbConfig.database;
var Logging = require('../../routes/Utils/logging');
//var utils = require('../../routes/Utils/utils');
var constants = require('../../routes/Constansts/constants');

//var Utils = new utils();
var Logging = new logging();
var Constants = new constants();

//TODO Возможно есть лучший способ объявления общих методов и констант

prepareParams = function (req, res) {
  var rowCard = req.body;
  var wordCard = {};
  var result = {};

  if (rowCard.wholeWord) {
    wordCard.wholeWord = rowCard.wholeWord;
   } else {
    result.errorMessage = 'Не передан обязательный параметр wholeWord';
    res.send(result);
    return;
  }
  if (rowCard.dividedWord) {
    wordCard.dividedWord = rowCard.dividedWord;
  } else {
    result.errorMessage = 'Не передан обязательный параметр dividedWord';
    res.send(result);
    return;
  }
  if (rowCard.img) {
    wordCard.img = rowCard.img;
  }
  //printInsertParams(wordCard)
  return wordCard;
};
/*
printInsertParams = function(wordCard) {
  console.log('Будет произведена запись следующего объекта:')
  console.log(wordCard);
};*/

insertCard = function (req, res) {
  wordCard = prepareParams(req, res);
  Logging.callLogging(wordCard);
  if (wordCard) {
    result = {};
    mongo.connect(url, function(err, db) {
  		if (err) {
        Logging.printError(err);
        result.errorMessage = err.message;
        res.send(result);
  			//throw err;
        return;
  		} else {
  			Logging.printDebugMessage('Connection success');
  		}
  		db.collection(Constants.CARD_COLLECTION).insertOne(wordCard, function(err, result) {
  			if (err) {
          Logging.printError(err);
          result.errorMessage = err.message;
          res.send(result);
    			//throw err;
          return;
  			} else {
          Logging.printDebugMessage('Record added successfully!');
          Logging.resultLogging(result.ops[0]);
  				//console.log('Record added successfully! Result: ');
          //console.log(result.ops[0]._id);
  				res.send(result.ops[0]);
  			}
  		});
  		db.close();
  	});
  };
};
module.exports = insertCard;
