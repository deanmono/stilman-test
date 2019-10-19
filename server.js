var express = require('express');
var app = express();

app.use(express.static('Interview'));

app.get('/', function(req, res, next) {
	res.redirect('/');
});

app.listen(8080, 'localhost');
console.log('started server on 8080');