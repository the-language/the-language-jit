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

function evaluate_with_environment(env: Env, x: LangVal): LangVal {
    throw 'WIP'
}

function real_evaluate_with_environment(env: Env, x: LangVal): LangVal {
    throw 'WIP'
}

let compiled_global_environment__gensym_state: Nat = 0
const compiled_global_environment: Array<any> = []
const compiled_global_environment__recv: Array<ThisLang> = []
function compiled_global_environment_add(x: any): ThisLang {
    compiled_global_environment.push(x)
    const id_s = thislang_gensym(compiled_global_environment__gensym_state)
    compiled_global_environment__gensym_state++
    compiled_global_environment__recv.push(id_s)
    return id_s
}
const compiled_global_environment__null_v = compiled_global_environment_add(null_v)
const compiled_global_environment__apply = compiled_global_environment_add(apply)
// [0]为gensym_state。
type CompilerScope = [Nat, EnvLangValG<ThisLang>]
// WIP delay未正確處理(影響較小)
function real_compile_with_environment(scope: CompilerScope, raw_input: LangVal): ThisLang {
    const x__comments = force_all(raw_input)
    let x = x__comments[0]
    const comments = x__comments[1]
    if (null_p(raw_input)) {
        return compiled_global_environment__null_v
    } else if (construction_p(x)) {
        const xs = []
        while (construction_p(x)) {
            xs.push(construction_head(x))
            x = force_all_with__coments_ref(comments, construction_tail(x))
        }
        if (null_p(x)) {
            if (xs.length > 0) {
                const xs_head = xs[0]
                // WIP delay/comment未正確處理(影響較小)
                if (equal_p(xs_head, form_use_systemName)) {
                    if (xs.length < 1) {
                        throw 'WIP'
                    }
                    const f = xs[1]
                    xs.shift()
                    xs.shift()
                    const args = xs
                    return compile_form(scope, f, args, comments)
                } else if (equal_p(xs_head, function_builtin_use_systemName)) {
                    if (xs.length < 1) {
                        throw 'WIP'
                    }
                    const f = xs[1]
                    xs.shift()
                    xs.shift()
                    const args: Array<any> = xs
                    for (let i = 0; i < args.length; i++) {
                        args[i] = real_compile_with_environment(scope, args[i])
                    }
                    return compile_function_builtin(scope, f, args, comments)
                } else if (equal_p(xs_head, form_builtin_use_systemName)) {
                    if (xs.length < 1) {
                        throw 'WIP'
                    }
                    const f = xs[1]
                    xs.shift()
                    xs.shift()
                    const args = xs
                    return compile_form_builtin(scope, f, args, comments)
                } else {
                    const f = xs[0]
                    xs.shift()
                    const args: Array<any> = xs
                    for (let i = 0; i < args.length; i++) {
                        args[i] = real_compile_with_environment(scope, args[i])
                    }
                    return compile_apply(scope, real_compile_with_environment(scope, f), args, comments)
                }
            }
        } else {
            throw 'WIP'
        }
    }
    throw 'WIP'
}
function apply(f: LangVal, args: Array<LangVal>): LangVal {
    throw 'WIP'
}
function compile_form(scope: CompilerScope, f: LangVal, args: Array<LangVal>, comments: Array<LangVal>): ThisLang {
    throw 'WIP'
}
function compile_function_builtin(scope: CompilerScope, f: LangVal, args: Array<ThisLang>, comments: Array<LangVal>): ThisLang {
    throw 'WIP'
}
function compile_form_builtin(scope: CompilerScope, f: LangVal, args: Array<LangVal>, comments: Array<LangVal>): ThisLang {
    throw 'WIP'
}
function compile_apply(scope: CompilerScope, f: ThisLang, args: Array<ThisLang>, comments: Array<LangVal>): ThisLang {
    return thislang_call(compiled_global_environment__apply, [f, thislang_array(args)])
}
