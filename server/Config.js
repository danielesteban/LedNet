'use strict';

module.exports = {
	defaultUser: {
		email: 'admin@led.net',
		password: 'adm!n'
	},
	mongoURI: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://localhost/LedNet',
	port: process.env.PORT || 8080,
	hostname: process.env.HOSTNAME || '',
	sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',
	basename: process.env.BASENAME || '/',
	production: process.env.NODE_ENV === 'production'
};
