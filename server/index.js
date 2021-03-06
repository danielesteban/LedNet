'use strict';

const Config = require('./Config.js');
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const expressValidator = require('express-validator');
const fs = require('fs');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');
const Sessions = require('./Sessions.js');
const LedNet = require('./LedNet.js');

/* Express */
const app = express();
if(Config.production) {
	app.use(compression());
	app.use(helmet());
}
app.use(bodyParser.json());
app.use(expressValidator());
const ws = require('express-ws')(app).getWss();

/* Mongoose */
const connectMongoose = () => {
	mongoose.connect(Config.mongoURI, (err) => (err && console.log(err)));
};
mongoose.Promise = global.Promise;
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connectMongoose);
connectMongoose();

/* Sessions */
Sessions(app);

/* Backend */
LedNet(app);

/* App server */
const indexPath = path.join(__dirname, '../dist/index.html');
if(Config.production) {
	let indexCache = fs.readFileSync(indexPath, 'utf8');
	fs.watchFile(indexPath, () => (indexCache = fs.readFileSync(indexPath, 'utf8')));
	const index = (req, res) => (
		res.set('Cache-Control', 'no-cache').send(Sessions.inject(indexCache, req.user))
	);
	app.get('/', index);
	app.use(express.static(path.join(__dirname, '../dist'), {maxAge: 31536000000}));
	app.get('*', index);
} else {
	const webpack = require('webpack');
	const webpackMiddleware = require('webpack-dev-middleware');
	const webpackHotMiddleware = require('webpack-hot-middleware');
	const webpackConfig = require('../webpack.config.js');
	const compiler = webpack(webpackConfig);
	const middleware = webpackMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath,
		contentBase: 'src',
		stats: {
			colors: true,
			hash: false,
			timings: true,
			chunks: false,
			chunkModules: false,
			modules: false
		}
	});
	const index = (req, res) => (
		res.send(Sessions.inject(middleware.fileSystem.readFileSync(indexPath, 'utf8'), req.user))
	);
	app.get('/', index);
	app.use(middleware);
	app.use(webpackHotMiddleware(compiler));
	app.get('*', index);
}

/* Bind the server */
const http = app.listen(Config.port, Config.hostname);

/* Graceful exit */
process.on('SIGTERM', function() {
	const exit = function() {
		setTimeout(function() {
			process.exit(0);
		}, 5000);
	};
	let count = ws.clients.length;
	ws.clients.forEach(function(client) {
		client.on('close', function() {
			--count === 0 && exit();
		});
		client.close();
	});
	http.close(function() {
		count === 0 && exit();
	});
});
