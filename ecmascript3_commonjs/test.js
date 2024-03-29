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
// ecmascript3_commonjs/test.js lua/test.js 完全相同。
const assert = require('assert').strict || require('assert')

const BiwaScheme = require('@zaoqi/biwascheme')
const TheLanguage = require('./lang.js')
BiwaScheme.define_libfunc('test-describe', 2, 2, (ar, intp)=>{
    BiwaScheme.assert_closure(ar[1])
    const name = BiwaScheme.to_write(ar[0])
    const body = BiwaScheme.js_closure(ar[1], intp)
    console.log(`[TEST Block Begin] ${name}`)
    body()
    console.log(`[TEST Block End] ${name}`)
})
BiwaScheme.define_libfunc('test-check-equal?', 2, 2, (ar)=>{
    assert.equal(BiwaScheme.equal(ar[0],ar[1]), true)
})
for(const [k, a, v] of [
    ['complex-parse', 1, TheLanguage.complex_parse],
    ['complex-print', 1, TheLanguage.complex_print],
    ['simple-print', 1, TheLanguage.simple_print],
    ['machinetext-parse', 1, TheLanguage.machinetext_parse],
    ['machinetext-print', 1, TheLanguage.machinetext_print],
    ['evaluate-with-environment', 2, TheLanguage.evaluate_with_environment],
    ['force-all-rec-ignore-comment', 1, TheLanguage.force_all_rec_ignore_comment],
    ['environment->value', 1, TheLanguage.env2val],
    ['value->environment', 1, TheLanguage.val2env],
]){
    BiwaScheme.define_libfunc(k, a, a, (ar)=>v.apply(null, ar))
}
for(const [k, v] of [
    ['environment-null-v', TheLanguage.env_null_v],
]){
    BiwaScheme.TopEnv[k] = v
}
BiwaScheme.run_file('../test.scm')
