const BiwaScheme = require('@zaoqi/biwascheme')
const TheLanguage = require('./lang.js')
BiwaScheme.define_libfunc('test-describe', 2, 2, (ar, intp)=>{
    BiwaScheme.assert_symbol(ar[0])
    BiwaScheme.assert_closure(ar[1])
    const name=ar[0].name
    const body=BiwaScheme.js_closure(ar[1], intp)
    test(name,()=>{
        body()
    })
})
BiwaScheme.define_libfunc('test-check-equal?', 2, 2, (ar)=>{
    expect(BiwaScheme.equal(ar[0],ar[1])).toBe(true)
})
for(const [k, a, v] of [
    ['complex-parse', 1, TheLanguage.complex_parse],
    ['complex-print', 1, TheLanguage.complex_print],
    ['simple-print', 1, TheLanguage.simple_print],
]){
    BiwaScheme.define_libfunc(k, a, a, (ar)=>v.apply(null, ar))
}
BiwaScheme.run_file('../test.scm')
