#!/bin/sh
set -e
make typescript/node_modules
cd typescript
proc_ts(){
    local tmpfile="$(mktemp)"
    ./node_modules/.bin/tsfmt "$1" | dos2unix > "$tmpfile"
    mv "$tmpfile" "$1"
}
for f in lang.ts.d/*.ts lang.ts.d/*/*.ts; do
    proc_ts "$f" &
done
wait
