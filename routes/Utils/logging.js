//var log4js = require('../../log4jsConfig');
const log4js = require('log4js');
log4js.configure('./log4js.json');
const logger = log4js.getLogger();

logging = function () {
  this.printLog = function() {
    console.log('Зашёл в логгер..........................................................')
    console.log(logger);
    console.log('........................................................................')
    logger.trace('message trace level');
    logger.debug('message debug level');
    logger.info('message info level');
    logger.warn('message warn level');
    logger.error('message error level');
    logger.fatal('message fatal level');
  };
  this.callLogging = function(params) {
    //logger.info((new Error().stack));
    if(logger.isDebugEnabled()) {
      logger.debug('Вызывется функция: ', ((new Error().stack).split("at ")[2].split(" ")[0]).trim());
      logger.debug('Входные параметры: \n', params);
    }
  };
  this.resultLogging = function(params) {
    if(logger.isDebugEnabled()) {
      //logger.debug('Результат вызова функции ', ((new Error().stack).split("at ")[2].split(" ")[0]).trim(), ':');
      //TODO в этом случае не пишет имя функции, т.к. вызывается из анонимной
      logger.debug('Выходные параметры: \n', params);
    }
  }
  this.printError = function(err) {
    logger.error(err);
  };
  this.printDebugMessage = function(message) {
    if(logger.isDebugEnabled()) {
      logger.debug(message);
    }
  };
};

module.exports = logging;
