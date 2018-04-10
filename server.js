const http = require('http');
const path = require('path');

const config = require('./App/config/config');
const route = require('./App/route/route');

global.appRoot = path.resolve(__dirname)+'/';


const server = http.createServer((req, res) => {
	route.get(req, res);
});

server.listen(config.port, config.hostname, () => {
	console.log(`Server running at http://${config.hostname}:${config.port}/`);
});