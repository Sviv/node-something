
var ObjectId = require('mongodb').ObjectId;
var Logging = require('../../routes/Utils/logging');
var Logging = new logging();
/**
Функция преобразует массив строк в массив объектов ObjectId
*/
utils = function() {
  this.getObjectIdArray = function(stringArray) {
    var objectIdArray = [];
    for (var i =0; i < stringArray.length; i++ ) {
      try{
       objectIdArray[i] = ObjectId(stringArray[i]);
     } catch (err) {
       Logging.printError(err);
     }
    }
    return objectIdArray;
  };
};
module.exports = utils;
