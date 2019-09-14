/*
    The Language
    Copyright (C) 2018, 2019  Zaoqi <zaomir@outlook.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/
const assert = require('assert').strict
const {luaconf, lua, lauxlib, lualib} = require('fengari')
const fengari = require('fengari')
const lua_interop = require('fengari-interop')
const L = lauxlib.luaL_newstate()
lualib.luaL_openlibs(L)
lauxlib.luaL_requiref(L, fengari.to_luastring("js"), lua_interop.luaopen_js, 0)
assert.equal(lauxlib.luaL_loadfile(L, 'lang.lua'),0)
lua.lua_call(L, 0, 1)
const TheLanguage = lua_interop.tojs(L, -1)
lua.lua_pop(L, 1)
for(const [k, _] of TheLanguage) {
    const raw_v = TheLanguage.get(k)
    let v = raw_v
    lua_interop.push(L, raw_v)
    const typ = fengari.to_jsstring(lauxlib.luaL_typename(L, -1))
    lua.lua_pop(L, 1)
    if(typ === 'function'){
        v = (...args)=>(x=>x).call.call(raw_v, ...args)
    }
    exports[k] = v
}
exports._lua_module = TheLanguage
exports._lua_state = L
exports._fengari = fengari
exports._fengari_interop = lua_interop
