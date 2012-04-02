#!/bin/sh
:
cat src/tash.js src/events/*.js > dist/tash-0.0.1.tmp.js
java -jar ~/bin/yuicompressor.jar dist/tash-0.0.1.tmp.js > dist/tash-0.0.1-min.tmp.js
#add header
cat HEAD.txt dist/tash-0.0.1.tmp.js > dist/tash-0.0.1.js
cat HEAD.txt dist/tash-0.0.1-min.tmp.js > dist/tash-0.0.1-min.js
rm dist/*.tmp.js
