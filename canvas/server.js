var sys = require("sys"),
    http = require("http"),
    url = require("url"),
    routes = require("./routes");

http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;
    var resolved = false;
    for (var name in routes) {
        if (pathname.indexOf(name) == 0)
            routes[name](request, response);
    }
    if (!resolved)
        routes['statics'](request, response);
}).listen(8080);
sys.puts("Server up and running on 8080");