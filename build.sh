#!/bin/sh
:
cat src/tash.js src/events/*.js src/debug/*.js > dist/tash-0.0.1.js
java -jar ~/bin/yuicompressor.jar dist/tash-0.0.1.js > dist/tash-0.0.1-min.js
