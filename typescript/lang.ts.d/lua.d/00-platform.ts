/** @noSelfInFile */

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

type ThisLang = string

declare function load(func: () => string | null | undefined): any
declare function assert(...args: any[]): any

function thislang_eval_statements(statements: ThisLang): any {
    let s: string | null = statements
    return assert(load(() => {
        const r = s
        s = null
        return r
    }))()
}
function thislang_eval_expression(expression: ThisLang): any {
    return thislang_eval_statements(thislang_statement_return(expression))
}

function thislang_gensym(state: Nat): ThisLang {
    return `v${state.toString(36)}`
}
function thislang_id(x: string): ThisLang {
    let r = ''
    for (let i = 0; i < x.length; i++) {
        const c = x[i]
        if (('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || ('0' <= c && c <= '9')) {
            r += c
        } else {
            r += `_${c.charCodeAt(0).toString(36)}_`
        }
    }
    return r
}

function thislang_array(xs: Array<ThisLang>): ThisLang {
    return `{${reduce_comma(xs)}}`
}
function thislang_number(x: number): ThisLang {
    return x.toString()
}
function thislang_array_lookup(xs: ThisLang, k: ThisLang): ThisLang {
    return `${xs}[${k}+1]`
}
function thislang_array_do_shift(x: ThisLang): ThisLang {
    return `table.remove(${x},1)`
}
function thislang_array_p_empty(x: ThisLang): ThisLang {
    return `#${x}===0`
}
function thislang_call(f: ThisLang, args: Array<ThisLang>): ThisLang {
    return `${f}(${reduce_comma(args)})`
}
function thislang_if(cond: ThisLang, then: ThisLang, elsev: ThisLang): ThisLang {
    return `(function()if ${cond} then return ${then} else return ${elsev} end end)()`
}
function thislang_statement_call(f: ThisLang, args: Array<ThisLang>): ThisLang {
    return `${f}(${reduce_comma(args)})`
}
function thislang_statement_if(cond: ThisLang, then: ThisLang, elsev: ThisLang): ThisLang {
    return `if ${cond} then ${then} else ${elsev} end`
}
function thislang_lambda(args: Array<ThisLang>, statements: ThisLang): ThisLang {
    return `(function(${reduce_comma(args)}) ${statements} end)`
}

function thislang_concat_statements(statements: Array<ThisLang>): ThisLang {
    return statements.join('')
}

function thislang_statement_var(id: ThisLang): ThisLang {
    return `local ${id}=nil`
}
function thislang_statement_var_init(id: ThisLang, val: ThisLang): ThisLang {
    return `local ${id}=${val}`
}
function thislang_statement_assign(id: ThisLang, val: ThisLang): ThisLang {
    return `${id}=${val}`
}
function thislang_statement_return(val: ThisLang): ThisLang {
    return `return ${val}`
}
