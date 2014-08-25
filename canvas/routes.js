var sys = require("sys"),
    path = require("path"),
    url = require("url"),
    fs = require("fs");

var save = function(req, res) {
    sys.puts("save");
}

var statics = function(req, res) {
    var pathname = url.parse(req.url).pathname;
    if (pathname.lastIndexOf("/") + 1 == pathname.length)
        pathname = "index.html";
    var full_path = path.join(process.cwd(), "public", pathname);
    fs.exists(full_path, function(exists) {
        if(!exists) {  
            res.writeHeader(404, {"Content-Type": "text/plain"});    
            res.write("404 Not Found\n");    
            res.end();  
        } else {
            fs.readFile(full_path, "binary", function(err, file) {    
                if(err) {
                    res.writeHeader(500, {"Content-Type": "text/plain"});    
                    res.write(err + "\n");    
                    res.end();    
                } else {
                    res.writeHeader(200);    
                    res.write(file, "binary");    
                    res.end();  
                }  
            });
        }
    });
}

module.exports = {
    '/save': save,
    'statics': statics
}