var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var dbConfig = require('../../config');
var url = dbConfig.database;
var utils = require('../../routes/Utils/utils.js');
var Logging = require('../../routes/Utils/logging');
var constants = require('../../routes/Constansts/constants');

var Utils = new utils();
var Logging = new logging();
var Constants = new constants();

prepareParams3 = function (req, res) {
	//TODO Разобраться, почему функцию prepareParams видно одновременно из файла getCardList и insertCard
	//Объявление объекта подготовленных параметров поиска - фильтров и технических парамертров, таких как количество строк и номер страницы
	var preparedParams = {};
  var searchParams = {};
	var updateParams = {};
  var result = {};
  var rowCard = req.body;
  if (rowCard._id) {
    searchParams._id = ObjectId(rowCard._id);
   } else {
    result.errorMessage = 'Не передан обязательный параметр _id';
    res.send(result);
    return;
  }
  if (rowCard.wholeWord) {
    updateParams.wholeWord = rowCard.wholeWord;
   } else {
    result.errorMessage = 'Не передан обязательный параметр wholeWord';
    res.send(result);
    return;
  }
  if (rowCard.dividedWord) {
    updateParams.dividedWord = rowCard.dividedWord;
  } else {
    result.errorMessage = 'Не передан обязательный параметр dividedWord';
    res.send(result);
    return;
  }
  if (rowCard.img) {
    updateParams.img = rowCard.img;
  }
  preparedParams.updateParams = updateParams;
  preparedParams.searchParams = searchParams;
  //printInsertParams(wordCard)
  return preparedParams;
};
/*
printDeleteParams = function(preparedParams3) {
  Logging.printDebugMessage('Удаление производится по следующим параметрам:')
	Logging.printDebugMessage(preparedParams2.deleteParams);
  if (preparedParams2.deleteParams._id) {
    Logging.printDebugMessage('Список идентификаторов')
    for (var i = 0; i < preparedParams2.deleteParams._id.$in.length; i++) {
      Logging.printDebugMessage('id[' + i + '] : ' + preparedParams2.deleteParams._id.$in[i]);
    }
  } else {
    Logging.printDebugMessage('id записей: не заданы');
  }
};*/

updateCards = function (req, res) {
  //Метод удаления карточки   слова

  preparedParams = prepareParams3(req, res);
	Logging.callLogging(preparedParams);
  if (preparedParams) {
		result = {};
		mongo.connect(url, function(err, db) {
  		if (err) {
				//TODO Этот кусок часто повторяется, не знаю, как вынести в функцию
				Logging.printError(err);
				result.errorMessage = err.message;
				res.send(result);
				//throw err;
				return;
  		} else {
  			Logging.printDebugMessage('Connection success');
  		}
      db.collection(Constants.CARD_COLLECTION).updateOne(preparedParams.searchParams, {$set: preparedParams.updateParams}, function(err, result) {
  			if (err) {
					Logging.printError(err);
					result.errorMessage = err.message;
					res.send(result);
					//throw err;
					return;
  			} else {
					var updatingResult = {};//TODO придумать хорошее имя
					updatingResult.matchedCount = result.matchedCount;
					Logging.printDebugMessage('Record update successfully!');
          Logging.resultLogging(updatingResult);
  				res.send(updatingResult);
  			}
  		});
  		db.close();
  	});
  };
};
module.exports = updateCards;
