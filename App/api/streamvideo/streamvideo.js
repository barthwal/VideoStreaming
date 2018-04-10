var path = require('path');
var fs = require('fs');
var config = require('../../config/config');

module.exports.get = function(req, res) {
	var filePath = '.' + req.url;
    var fileLoc = path.resolve(appRoot + config.public, filePath);

    fs.stat(fileLoc, function(err, stats) {
        if (err) {
            if (err.code === 'ENOENT') {
                // 404 Error if file not found
                fs.readFile(path.resolve(appRoot + config.public + '/404.html'), function(error, content) {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                });

                return;
            }
            res.end(err);
        }

        var range = req.headers.range;
        if (!range) {
            // 416 Wrong range
            //res.sendStatus(416);
            res.writeHead(416);
            res.end('Sorry, check with the site admin for error: 416 ..\n');
            res.end();

            return;
        }

        var positions = range.replace(/bytes=/, "").split("-");
        var start = parseInt(positions[0], 10);
        var total = stats.size;
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        var chunksize = (end - start) + 1;

        res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4"
        });

        var stream = fs.createReadStream(fileLoc, { start: start, end: end })
        .on("open", function() {
            stream.pipe(res);
        }).on("error", function(err) {
            res.end(err);
        });
    });
}