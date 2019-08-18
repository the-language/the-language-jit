ALL = ecmascript3_commonjs/lang.js

all: $(ALL)
.PHONY: all

clean:
	rm $(ALL)
.PHONY: clean

typescript/node_modules: typescript/yarn.lock
	cd typescript && yarn

ecmascript3_commonjs/node_modules: ecmascript3_commonjs/yarn.lock
	cd ecmascript3_commonjs && yarn

ecmascript3_commonjs/lang.ts: typescript/lang.ts.d/*.ts typescript/lang.ts.d/ecmascript3.d/*.ts
	cat typescript/lang.ts.d/*.ts typescript/lang.ts.d/ecmascript3.d/*.ts > ecmascript3_commonjs/lang.ts

ecmascript3_commonjs/lang.js: ecmascript3_commonjs/lang.ts ecmascript3_commonjs/node_modules
	cd ecmascript3_commonjs && npx --no-install tsc
