module.exports = function (grunt) {

    (function (grunt) {
        var fs = require('fs');
        var filterByType = function(type, cwd, matches) {
          return matches.filter(function(filepath) {
            try {
              // If the file is of the right type and exists, this should work.
              return fs.statSync(path.join(cwd, filepath))[type]();
            } catch(e) {
              // Otherwise, it's probably not the right type.
              return false;
            }
          });
        };
        var expandByType = function(type) {
          var args = grunt.util.toArray(arguments).slice(1);
          // If the first argument is an options object, grab it.
          var options = grunt.util.kindOf(args[0]) === 'object' ? args[0] : {};
          // Match, then filter filepaths.
          return filterByType(type, options.cwd, grunt.file.expand.apply(grunt.file, args));
        };
        grunt.file.expandFiles = expandByType.bind(grunt.file, 'isFile');
    }(grunt));

    grunt.loadTasks("build-tasks");
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.initConfig({
        jshint: {
            src: [
                "src/*.js",
                "src/**/*.js"
            ]
        },

        compile: {
            folder: "src",
            dest: "dist/tash-0.0.1",
            first: ["tash.js"],
            exclude: ["tash.console.js"]
        },

        jasmine: {
            run: {
                src: ['src/tash.js', 'src/**/*.js', '!src/**/*.spec.js'],
                options: {
                    specs: 'src/**/*.spec.js'
                }
            }
        },

        /* add it when tests will be grunt-integrated */
        watch: {
            files: [
                "src/*.js",
                "src/**/*.js",
            ],
            tasks: ["jshint", "compile"]
        }

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
};