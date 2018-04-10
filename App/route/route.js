var path = require('path');
var fs = require('fs');
var config = require('../config/config');

const api = require('../api/streamvideo/streamvideo');

module.exports.get = function(req, res) {
	//var url = req.url;

	var filePath = '.' + req.url;
    if (filePath == './') {
        filePath = './index.html';
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';


    var fileLoc = path.resolve(appRoot + config.public, filePath);
	//console.log("fileLoc: ", fileLoc, extname);

    
    var videoCheck = [".m4v", ".mp4", ".wav"];
    if(videoCheck.indexOf(extname) >= 0) {
    	api.get(req, res);
    } else {

	    fs.readFile(fileLoc, function(error, content) {
	        if (error) {
	            if(error.code == 'ENOENT'){
	                console.log("404 :", path.resolve(appRoot + config.public + '/404.html'));

	                fs.readFile(path.resolve(appRoot + config.public + '/404.html'), function(error, content) {
	                    res.writeHead(200, { 'Content-Type': contentType });
	                    res.end(content, 'utf-8');
	                });
	            }
	            else {
	                res.writeHead(500);
	                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
	                res.end();
	            }
	        }
	        else {
	            res.writeHead(200, { 'Content-Type': contentType });
	            res.end(content, 'utf-8');
	        }
	    });
	}

}