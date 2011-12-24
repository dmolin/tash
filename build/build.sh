#!/bin/sh
:


cat ../src/tash.js ../src/events/*.js ../src/debug/*.js > ../dist/tash-0.0.1.js
java -jar ~/bin/yuicompressor.jar ../dist/tash-0.0.1.js > ../dist/tash-0.0.1-premin.js
cat prefix.txt ../dist/tash-0.0.1-premin.js > ../dist/tash-0.0.1-min.js
rm ../dist/tash-0.0.1-premin.js
