module.exports = function (grunt) {

    var SimpleServer = require("./lib/simpleserver"),
        path = require("path");

	grunt.registerTask("test", "Start a custom web server", function () {

        var server = new SimpleServer(9000, false, "Grunt-Static"),
            basePath = grunt.config.data.test.path,
            done = this.async();

        console.log("base path = " + basePath);

        server.log = grunt.log.writeln.bind(grunt.log);
        server.logFatal = grunt.fail.fatal.bind(grunt.fail);
        server.logVerbose = grunt.verbose.writeln.bind(grunt.verbose);
        server.logDebug = grunt.verbose.debug.bind(grunt.verbose);
        server.handleError = function (errObj) {
            if (errObj.code === "EADDRINUSE") {
                grunt.fail.fatal("The requested port " + String(server.port).green + " is already in use".yellow);
            } else {
                grunt.fail.fatal("Uncaught server error: " + String(errObj.message).red);
            }
        };
        server.on("responded", function (con) {
            grunt.verbose.writeln(
                "Request: " + (":" + server.port + con.request.url.pathname).green + " " +
                "Response: " + String(con.response.statusCode).green + " " +
                "(" + String(con.response.headers["Content-Type"]).blue + ")");
        });

        server.route("code\\/?(?:index.html)?", function (con, callback) {
        	console.log("serving code...");
        	var files = [];
        	files.push(grunt.file.read(process.cwd() + "/dist/tash-0.0.1-min.js"));
        	
        	//add all the specs files
        	grunt.file.expand(["src/**/*.spec.js"]).forEach(function (src) {
        		console.log("seeking " + src);
        		files.push(grunt.file.read(src));
        	});

        	console.log("counted " + files.length + " files");

        	con.response.headers["Content-Type"] = "application/javascript";
        	con.response.body = files.join('\n');
        	callback();
        });


        server.route(".*", function (con, callback) {        	
            console.log("STATIC SERVER handling route " + con.request.url);
            //var name = "" + path.join(process.cwd() + "/" + basePath, con.request.url.pathname);
            var name = "test/" + con.request.url.pathname;
            //server.serveFile(basePath + con, name);
            try{ con.response.body = grunt.file.read(basePath + con.request.url.pathname); } catch (err) {}
            callback();
        });

        server.on("close", function () {
        	done();
        });

        server.start();

        console.log("Server ready");
	});
};