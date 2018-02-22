global.router = require('express').Router();
var router = global.router;
var router = require('./food');
var router = require('./category');
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Demo NodeJS vs MongoDB' });
// });
router.get('/', (req, res, next) => {
	res.render('index', {title: 'Demo CRUD Express MongoDB'});
});

module.exports = router;
