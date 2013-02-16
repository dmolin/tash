module.exports = function (grunt) {

    require('./build-tasks/lib/grunt-compat').patch(grunt);

    grunt.loadTasks("build-tasks");
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.initConfig({
        jshint: {
            files: {
                src:['src/**/*.js']
            }
        },

        compile: {
            folder: "src",
            dest: "dist/tash-0.0.1",
            first: ["tash.js"],
            exclude: ["tash.console.js", "REGEX:.*.spec.js$", ".DS_Store"]
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