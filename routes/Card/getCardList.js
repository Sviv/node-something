var mongo = require('mongodb').MongoClient;
var dbConfig = require('../../config');
var url = dbConfig.database;
var utils = require('../../routes/Utils/utils.js');
var constants = require('../../routes/Constansts/constants');
var Logging = require('../../routes/Utils/logging');

var Utils = new utils();
var Logging = new logging();
var Constants = new constants();
//TODO Возможно есть лучший способ объявления общих методов и констант

prepareParams1 = function (req, res) {
	//TODO Разобраться, почему функцию prepareParams видно одновременно из файла getCardList и insertCard
	//Объявление объекта подготовленных параметров поиска - фильтров и технических парамертров, таких как количество строк и номер страницы
	var preparedParams = {};
	var searchParams = {};


	//Подготовка фильтра по части наименования
	(req.body.part) ? searchParams.wholeWord = {'$regex': req.body.part} : true;
	//Подготовка количесва отображаемых строк, этот параметр не входит в фильтр поиска
	(req.body.count) ? preparedParams.count = Number(req.body.count) : preparedParams.count = 20;
	//Подготовка номера страницы, этот параметр не входит в фильтр поиска
	(req.body.page) ? preparedParams.page = Number(req.body.page) : preparedParams.page = 0;
	//Подготовка фильтра по списку идентификаторов, ожидаю в запросе массив idList
	if (req.body.idList) {
		searchParams._id = {};
		searchParams._id.$in = Utils.getObjectIdArray(req.body.idList);
	};

	preparedParams.searchParams = searchParams;
	printSearchParams(preparedParams);
	return preparedParams;
};

printSearchParams = function(preparedParams) {
	Logging.printDebugMessage('Поиск производится по следующим параметрам:')
	Logging.printDebugMessage(preparedParams.searchParams);
	Logging.printDebugMessage('Выводится страница № ' + preparedParams.page);
	Logging.printDebugMessage('Всего записей на одной странице отображается ' + preparedParams.count + ' шт.');
	if (preparedParams.searchParams._id) {
		Logging.printDebugMessage('Список идентификаторов')
		for (var i = 0; i < preparedParams.searchParams._id.$in.length; i++) {
			Logging.printDebugMessage('id[' + i + '] : ' + preparedParams.searchParams._id.$in[i]);
		}
	} else {
		Logging.printDebugMessage('id записей: не заданы');
	}
	if (preparedParams.searchParams.wholeWord) {
		Logging.printDebugMessage('Слово содержит \'' + preparedParams.searchParams.wholeWord.$regex + '\'');
	} else {
		Logging.printDebugMessage('фильтрации по подстроке нет');
	}
};

getCardList = function (req, res) {
	preparedParams = prepareParams1(req, res);
	Logging.callLogging(preparedParams);
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
		//printSearchParams(preparedParams);
		db.collection(Constants.CARD_COLLECTION)
		.find(preparedParams.searchParams)
		.limit(preparedParams.count)
		.sort({wholeWord : 1})
		.skip(preparedParams.count*preparedParams.page)
		.toArray(function(err, result) {
			if (err) {
				//Logging.printError(err);
        result.errorMessage = err.message;
        res.send(result);
  			//throw err;
        return;
			} else {
				Logging.resultLogging(result);
				res.send(result);
				//console.log(result);
			}
		});
		db.close();
	});
};
module.exports = getCardList;
