var fs = require("fs"),
    uglify = require('uglify-js');


module.exports = function (grunt) {

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.initConfig({
        jshint: [
            "src/*.js",
            "src/**/*.js"
        ],

        compile: {
            folder: "src",
            dest: "dist/tash-0.0.1-min.js",
            first: ["tash.js"],
            exclude: ["tash.console.js"]
        },

        /* add it when tests will be grunt-integrated */
        //watch: {
        //    files: [
        //        "src/*.js",
        //        "src/**/*.js",
        //    ],
        //    tasks: "jshint compile"
        //}

    });

    function groupAlias(alias, tasks) {
        grunt.registerTask(alias, function (target) {
            return grunt.task.run(tasks.split(" ").map(function (item) {
                return item + (target ? ":" + target : "");
            }));
        });
    }

    // Register alias tasks
    groupAlias("dev", "jshint compile");
    grunt.registerTask("default", ["dev"]);


    grunt.registerTask("compile", "Compile and minify all the source files", function () {
        var cfg = grunt.config.data.compile,
            list = [],
            firsts,
            files,
            excl,
            cfgfirst,
            seccfg;

        cfgfirst = grunt.util._.extend({include:cfg.first, first:[]}, cfg);
        delete cfgfirst.first;
        firsts = treeWalker(cfg.folder, cfgfirst);
        excl = (cfg.exclude || []).concat(cfg.first || []);
        seccfg = grunt.util._.extend( grunt.util._.extend({}, cfg), {exclude:excl});
        delete seccfg.first;
        files = treeWalker(cfg.folder, seccfg);

        files = firsts.concat(files);
        for (file in files) {
            if (files.hasOwnProperty(file)) {
                filename = files[file];
                list.push(uglify.minify(filename, 'utf8').code);
            }
        }

        fs.writeFile(cfg.dest, list.join('\n'), function (err) {
            if (err) {
                grunt.log.error("error writing dest file " + err );
            }
        });

    });


    function treeWalker(folder, cfg) {
        var file,
            filename,
            files,
            retlist = (cfg && cfg.list)||[];

        files = fs.readdirSync(folder); 

        for (file in files) {
            if (files.hasOwnProperty(file)) {
                filename = files[file];

                fileStat = fs.statSync(folder + "/" + filename);
                if( fileStat.isDirectory() ) {
                    treeWalker(folder + "/" + filename, grunt.util._.extend({list:retlist}, cfg));
                } else {
                    if (cfg.include ) {
                        if (cfg.include.indexOf(filename) >= 0) {
                            retlist.push(folder + "/" + filename);
                        }
                        continue;
                    }

                    if (cfg.first && (cfg.first.indexOf(folder + "/" + filename)) >= 0) {
                        continue;
                    }

                    if (cfg.exclude && (cfg.exclude.indexOf(filename)) >= 0) {
                        continue;
                    }

                    retlist.push(folder + "/" + filename);
                }
            }
        }

        return retlist; 
    }




};