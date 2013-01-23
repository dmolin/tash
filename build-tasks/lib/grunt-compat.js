/*global module: true, require: true*/
var path = require("path"),
    fs = require("fs");

function patch(grunt) {
    if (typeof grunt.file.expandFiles === "function") {
        return;
    }

    var filterByType = function (type, cwd, matches) {
        return matches.filter(function (filepath) {
            try {
                // If the file is of the right type and exists, this should work.
                return fs.statSync(path.join(cwd, filepath))[type]();
            } catch (e) {
                // Otherwise, it's probably not the right type.
                return false;
            }
        });
    };
    var expandByType = function (type) {
        var args = grunt.util.toArray(arguments).slice(1);
        // If the first argument is an options object, grab it.
        var options = grunt.util.kindOf(args[0]) === "object" ? args[0] : {};
        // Match, then filter filepaths.
        return filterByType(type, options.cwd, grunt.file.expand.apply(grunt.file, args));
    };
    grunt.file.expandFiles = expandByType.bind(grunt.file, "isFile");
}

module.exports = {
    patch: patch
};