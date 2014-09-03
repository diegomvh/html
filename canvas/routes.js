var sys = require("sys"),
    path = require("path"),
    url = require("url"),
    fs = require("fs");

var save = function(req, res) {
    // Request body is binary
    req.setBodyEncoding("binary");

    // Handle request as multipart
    var stream = new multipart.Stream(req);
    
    // Create promise that will be used to emit event on file close
    var closePromise = new events.Promise();

    // Add handler for a request part received
    stream.addListener("part", function(part) {
        sys.debug("Received part, name = " + part.name + ", filename = " + part.filename);
        
        var openPromise = null;

        // Add handler for a request part body chunk received
        part.addListener("body", function(chunk) {
            // Calculate upload progress
            var progress = (stream.bytesReceived / stream.bytesTotal * 100).toFixed(2);
            var mb = (stream.bytesTotal / 1024 / 1024).toFixed(1);
     
            sys.debug("Uploading " + mb + "mb (" + progress + "%)");

            // Ask to open/create file (if not asked before)
            if (openPromise == null) {
                sys.debug("Opening file");
                openPromise = posix.open("./uploads/" + part.filename, process.O_CREAT | process.O_WRONLY, 0600);
            }

            // Add callback to execute after file is opened
            // If file is already open it is executed immediately
            openPromise.addCallback(function(fileDescriptor) {
                // Write chunk to file
                write_chunk(req, fileDescriptor, chunk, 
                    (stream.bytesReceived == stream.bytesTotal), closePromise);
            });
        });
    });

    // Add handler for the request being completed
    stream.addListener("complete", function() {
        sys.debug("Request complete");

        // Wait until file is closed
        closePromise.addCallback(function() {
            // Render response
            res.sendHeader(200, {"Content-Type": "text/plain"});
            res.sendBody("Thanks for playing!");
            res.finish();
        
            sys.puts("\n=> Done");
        });
    });
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