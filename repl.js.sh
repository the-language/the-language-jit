#!/bin/sh
set -e
oldpwd="$(pwd)"
cd "$(dirname "$0")"
bin="$(pwd)"
make ecmascript3_commonjs/lang.js
cd "$oldpwd"
node -r "$bin"/repl.js.r.js "$@"
