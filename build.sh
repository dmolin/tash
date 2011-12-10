#!/bin/sh
:
cat src/tash.js src/events/tash.pubsub.js > dist/tash-0.0.1.js
java -jar ~/bin/yuicompressor.jar dist/tash-0.0.1.js > dist/tash-0.0.1-min.js
