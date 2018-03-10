var express = require('express');
var router = express.Router();
var getCardList = require('../routes/Card/getCardList.js');
var insertCard = require('../routes/Card/insertCard.js');
var deleteCards = require('../routes/Card/deleteCards.js');
var updateCard = require('../routes/Card/updateCard.js');

/*Все возможные адреса запросов*/
router.post('/get-card-list', getCardList); //Получение списка карточек
router.post('/insert-card', insertCard); //Добавление карточки слова
router.post('/delete-cards', deleteCards); //Добавление карточки слова
router.post('/update-card', updateCard); //Добавление карточки слова

module.exports = router;
