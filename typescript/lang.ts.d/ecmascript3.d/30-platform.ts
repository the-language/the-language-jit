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

function reduce_comma(xs: Array<string>): string {
    if (xs.length === 0) { return "" }
    let result = xs[0]
    for (let i = 1; i < xs.length; i++) {
        result += `,${xs[i]}`
    }
    return result
}

function thislang_eval_statements(statements: ThisLang): any {
    return (new Function(`"use strict";${statements}`))()
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
        if (('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || ('0' <= c && c <= '9') || (c === '_')) {
            r += c
        } else {
            r += `$${c.charCodeAt(0).toString(36)}$`
        }
    }
    return r
}

function thislang_array(xs: Array<ThisLang>): ThisLang {
    return `[${reduce_comma(xs)}]`
}
function thislang_number(x: number): ThisLang {
    return x.toString()
}
function thislang_array_lookup(xs: ThisLang, k: ThisLang): ThisLang {
    return `${xs}[${k}]`
}
function thislang_array_do_shift(x: ThisLang): ThisLang {
    return `${x}.shift()`
}
function thislang_array_p_empty(x: ThisLang): ThisLang {
    return `${x}.length===0`
}
function thislang_call(f: ThisLang, args: Array<ThisLang>): ThisLang {
    return `${f}(${reduce_comma(args)})`
}
function thislang_if(cond: ThisLang, then: ThisLang, elsev: ThisLang): ThisLang {
    return `(${cond}?${then}:${elsev})`
}
function thislang_statement_call(f: ThisLang, args: Array<ThisLang>): ThisLang {
    return `${f}(${reduce_comma(args)});`
}
function thislang_statement_if(cond: ThisLang, then: ThisLang, elsev: ThisLang): ThisLang {
    return `if(${cond}){${then}}else{${elsev}}`
}
function thislang_lambda(args: Array<ThisLang>, statements: ThisLang): ThisLang {
    return `function(${reduce_comma(args)}){${statements}}`
}

function thislang_concat_statements(statements: Array<ThisLang>): ThisLang {
    return statements.join('')
}

// 此函数要求function内标识符唯一。
function thislang_statement_var(id: ThisLang): ThisLang {
    return `var ${id};`
}
function thislang_statement_var_init(id: ThisLang, val: ThisLang): ThisLang {
    return `var ${id}=${val};`
}
function thislang_statement_assign(id: ThisLang, val: ThisLang): ThisLang {
    return `${id}=${val};`
}
function thislang_statement_return(val: ThisLang): ThisLang {
    return `return ${val};`
}
