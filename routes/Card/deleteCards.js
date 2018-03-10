var mongo = require('mongodb').MongoClient;
var dbConfig = require('../../config');
var url = dbConfig.database;
var utils = require('../../routes/Utils/utils.js');
var Logging = require('../../routes/Utils/logging');
var constants = require('../../routes/Constansts/constants');

var Utils = new utils();
var Logging = new logging();
var Constants = new constants();

prepareParams2 = function (req, res) {
	//TODO Разобраться, почему функцию prepareParams видно одновременно из файла getCardList и insertCard
	//Объявление объекта подготовленных параметров поиска - фильтров и технических парамертров, таких как количество строк и номер страницы
	var preparedParams = {};
	var deleteParams = {};
  var result = {};

	//Подготовка фильтра по списку идентификаторов, ожидаю в запросе массив idList
	if (req.body.idList) {
		deleteParams._id = {};
		deleteParams._id.$in = Utils.getObjectIdArray(req.body.idList)
	} else {
    result.errorMessage = 'Не передан обязательный параметр idList(Массив идентификаторов карточек слов)';
    res.send(result);
    return;
  }

	preparedParams.deleteParams = deleteParams;
	printDeleteParams(preparedParams);
	return preparedParams;
};

printDeleteParams = function(preparedParams2) {
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
};

deleteCards = function (req, res) {
  //Метод удаления карточки   слова
  preparedParams = prepareParams2(req, res);
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
      db.collection(Constants.CARD_COLLECTION).deleteMany(preparedParams.deleteParams, function(err, result) {
  			if (err) {
					Logging.printError(err);
					result.errorMessage = err.message;
					res.send(result);
					//throw err;
					return;
  			} else {
					var deletingResult = {};//TODO придумать хорошее имя
					deletingResult.deletedCount = result.deletedCount;
					Logging.printDebugMessage('Record delete successfully!');
          Logging.resultLogging(deletingResult);
  				res.send(deletingResult);
  			}
  		});
  		db.close();
  	});
  };
};
module.exports = deleteCards;
