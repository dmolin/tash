var fs = require("fs"),
    uglify = require('uglify-js');

module.exports = function (grunt) {
    grunt.registerTask("compile", "Compile and minify all the source files", function () {
        var cfg = grunt.config.data.compile,
            file,
            list = [],
            firsts,
            filename,
            files,
            excl,
            cfgfirst,
            seccfg,
            out;

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
                //list.push(uglify.minify(filename, 'utf8').code);
                list.push(fs.readFileSync(filename, 'utf8'));
            }
        }

        //write the un-minified script
        grunt.file.write(cfg.dest + ".js", list.join('\n'));
        out = uglify.minify(files, 'utf8', {outSourceMap: cfg.dest + ".js.map"});
        grunt.file.write(cfg.dest + "-min.js", out.code);

        //write the source map too
        //grunt.file.write(cfg.dest + ".js.map", out.map);

    });

    function treeWalker(folder, cfg) {
        var file,
            filename,
            files,
            excludeGlob,
            toSkip,
            fileStat,
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

                    if (cfg.exclude) {
                        toSkip = false;
                        for(excludeGlob in cfg.exclude) {
                            if( cfg.exclude.hasOwnProperty(excludeGlob) ) {
                                excludeGlob = cfg.exclude[excludeGlob];
                                if(/REGEX:/.test(excludeGlob)) {
                                    excludeGlob = excludeGlob.match(/REGEX:(.*)/)[1];
                                    if(new RegExp(excludeGlob).test(filename)) {
                                        toSkip = true;
                                        break;
                                    }
                                } else if (cfg.exclude.indexOf(filename) >= 0) {
                                    toSkip = true;
                                    break;
                                }
                            }
                        }
                        if(toSkip) {
                            continue;
                        }
                    }

                    retlist.push(folder + "/" + filename);
                }
            }
        }

        return retlist;
    }
};