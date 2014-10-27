var sys = require("sys"),
    http = require("http"),
    url = require("url"),
    routes = require("./routes");

http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;
    // -------- Try resolve by pathname    
    for (var name in routes)
        if (pathname.indexOf(name) == 0)
            return routes[name](request, response);
    // ----- Go with statics files
    return routes['statics'](request, response);
}).listen(8080);
sys.puts("Server up and running on 8080");