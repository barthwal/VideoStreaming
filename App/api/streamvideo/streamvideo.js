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
                return res.sendStatus(404);
            }
            res.end(err);
        }

        var range = req.headers.range;

        console.log("range: ", range, !range);
        if (!range) {
            // 416 Wrong range
            res.sendStatus(416);
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