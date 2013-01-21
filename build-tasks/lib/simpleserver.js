/*global module: true, require: true, console: true, Buffer: true */
var url = require("url"),
    fs = require("fs"),
    path = require("path"),
    extMimeTypes = {
        json: "application/json",
        js: "application/javascript",
        map: "application/json", // SourceMaps
        woff: "application/font-woff",
        pdf: "application/pdf",
        zip: "application/zip",
        gz: "application/gzip",
        xml: "application/xml",
        gif: "image/gif",
        jpeg: "image/jpeg",
        jpg: "image/jpeg",
        png: "image/png",
        ico: "image/x-icon",
        svg: "image/svg+xml",
        html: "text/html",
        css: "text/css",
        csv: "text/csv"
    };

function guessMime(fileName) {
    var ext = path.extname(fileName).replace(/^\./, "");
    if (extMimeTypes[ext]) {
        return extMimeTypes[ext];
    }
}

function Server(port, secureCerts, serverName) {
    var opts, app, isSecure = secureCerts && secureCerts.key && secureCerts.cert;

    if (isSecure) {
        opts = {
            key: this.readFile(secureCerts.key),
            cert: this.readFile(secureCerts.cert)
        };
    }

    app = require("http" + (isSecure ? "s" : "")).createServer(opts),

    app.addListener("request", this.handleRequest.bind(this));

    ["addListener", "removeListener", "on", "once", "emit"].forEach(function (methodName) {
        this[methodName] = app[methodName].bind(app);
    }.bind(this));

    this._routes = [];

    app.on("error", function (a) {
        this.handleError.call(this, a);
    }.bind(this));

    this.port = port || 8080;

    this.start = function start() {
        this.logVerbose("Server started on port " + this.port);
        app.listen(this.port);
    };

    this.stop = app.close.bind(app);
    this.serverName = serverName;
}

Server.prototype = {

    log: console.log.bind(console, "Server: "),
    logFatal: console.log.bind(console, "Server: [F!] "),
    logVerbose: console.log.bind(console, "Server: [V] "),
    logDebug: console.log.bind(console, "Server: [D] "),
    readFile: fs.readFileSync.bind(fs),

    respond: function respond(conInst) {
        // Guess content length if not supplied.
        if (!conInst.response.headers["Content-Length"] && !conInst.response.headers["content-length"]) {
            conInst.response.headers["Content-Length"] = Buffer.byteLength(conInst.response.body, "utf8");
        }

        // Add our serverName to every response if present
        if (this.serverName) {
            conInst.response.headers["Server"] = this.serverName;
        }

        // Send our response
        conInst.response.writeHead(conInst.response.statusCode, conInst.response.headers);
        this.logDebug("Serving Headers: \n",  conInst.response.headers);
        this.logDebug("Serving Body: \"\"\"\n" + conInst.response.body + "\n\"\"\"");
        conInst.response.end(conInst.response.body);

        // Emit an event for implementors to catch when a response has happened.
        this.emit("responded", conInst);
        return this;
    },

    handleRequest: function handleRequest(request, response) {
        var conInst = { request: request, response: response };

        // Augment request.url with urlParts
        request.url = url.parse(request.url, true);
        Object.defineProperty(request.url, "toString", {
            value: function () { return this.href; },
            enumerable: false
        });
        request.body = "";

        request.on("data", function (chunk) {
            request.body += chunk.toString();
        });

        request.on("end", function () {
            // Augment basic response properties for use:
            response.statusCode = 0;
            response.headers = {};
            response.body = "";

            this.logDebug("Request parameters: \n", request.url, "\n", request.headers);
            if (request.body.length) {
                this.logDebug("Request Body \"\"\"\n" + request.body + "\n\"\"\"");
            }

            this.logDebug("Looking for routes for " + request.url.pathname);
            var routed = this._routes.some(function (route) {
                var regexp = route[0], cb = route[1], context = route[2] || null;

                if (regexp.test(conInst.request.url.pathname)) {
                    this.logDebug(String(regexp) + " sucessfully matched " + conInst.request.url.pathname);
                    cb.call(context, conInst, this.respond.bind(this, conInst));
                    return true;
                }
                this.logDebug(String(regexp) + " did not match against " + conInst.request.url.pathname);

            }.bind(this));

            if (!routed) {
                conInst.response.statusCode = 404;
                conInst.response.body = "No registered route for " + conInst.request.url.pathname;
                this.respond(conInst);
            }
        }.bind(this));

        return this;
    },

    handleError: function handleError(errObj) {
        this.logFatal("Uncaught server error: " + errObj.message);
        return this;
    },

    route: function route(routeReg, callback, context) {
        this._routes.push([new RegExp("^\/" + routeReg + "$"), callback, context]);
        return this;
    },

    serveFile: function serveFile(conInst, fileName, preResponseCallback) {
        //console.log("SimpleServer: got request for " + fileName );

        if (conInst.request.method !== "GET") {
            conInst.response.statusCode = 405;
            conInst.response.body = "Can only GET static files";
        } else if (!fs.existsSync(fileName)) {
            console.log("file " + fileName + " not found");
            conInst.response.statusCode = 404;
            conInst.response.body = "File " + fileName + " not found";
        } else if (fs.statSync(fileName).isDirectory()) {
            console.log("Directory listing denied for " + fileName );
            conInst.response.statusCode = 403;
            conInst.response.body = "Directory listing denied for " + fileName;
        } else {
            conInst.response.statusCode = 200;
            conInst.response.body = this.readFile(fileName);
            conInst.response.headers["Content-Type"] = guessMime(fileName) || "text/plain";
            this.logDebug("Found & serving " + fileName + " with mime of " + conInst.response.headers["Content-Type"]);

            if (typeof preResponseCallback === "function") {
                preResponseCallback(conInst);
            }

        }

        return this;
    }
};

module.exports = Server;