const express = require('express');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cfg = require('./cfg');

// MONGOOSE Setup
mongoose.connect('mongodb://localhost/stpl');
mongoose.Promise = global.Promise;
console.log('MONGODB: Connected');

// EXPRESS Middleware & Routes
app.use(session({
	name: 'session',
	keys: cfg.session.keys,
	maxAge: 365 * 24 * 60 * 60 * 1000,
	signed: true
}));
app.use((req, res, next) => {
	let msg = [req.get('x-real-ip'), req.method, req.originalUrl, req.headers['user-agent']].join(' ');
	console.log(msg);
	next();
});
app.use(express.static('./static'));
app.use(bodyParser.json());
app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/auth'));
app.use((err, req, res, next) => {
	res.status(422).send(err.message);
});

io.on('connection', socket => {
	console.log('SOCKET: Connect', socket.id);
	socket.on('disconnect', () => {
		console.log('SOCKET: Disconnect');
	});
});

// EXPRESS Listen
server.listen(1337, function() {
	console.log('EXPRESS: Now listening for requests');
});