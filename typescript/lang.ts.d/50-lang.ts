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

// [0]为gensym_state。
type CompiledGlobalEnvironment = [Nat, Array<any>, Array<ThisLang>]

const compiled_global_environment: CompiledGlobalEnvironment = [0, [], []]

function compiled_global_environment_add(env: CompiledGlobalEnvironment, x: any): ThisLang {
    env[1].push(x)
    const id_s = thislang_gensym(env[0])
    env[0]++
    env[2].push(id_s)
    return id_s
}
const compiled_global_environment__null_v = compiled_global_environment_add(compiled_global_environment, null_v)
const compiled_global_environment__apply = compiled_global_environment_add(compiled_global_environment, apply)
type CompilerScope = [EnvLangValG<ThisLang>, CompiledGlobalEnvironment]
function scope_inner__replace_environment(scope: CompilerScope, env: EnvLangValG<ThisLang>): CompilerScope {
    return [env, scope[1]]
}
function scope_gensym_do(scope: CompilerScope): ThisLang {
    const result = thislang_gensym(scope[1][0])
    scope[1][0]++
    return result
}
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
function name_p(x: LangVal): boolean {
    throw 'WIP'
}
function compile_form_builtin(scope: CompilerScope, f: LangVal, args: Array<LangVal>, comments: Array<LangVal>): ThisLang {
    if (equal_p(f, quote_form_builtin_systemName)) {
        if (args.length !== 1) {
            throw 'WIP'
        }
        return compiled_global_environment_add(scope[1], args[0])
    } else if (equal_p(f, lambda_form_builtin_systemName)) {
        if (args.length !== 2) {
            throw 'WIP'
        }
        const body = args[1]
        let pattern_iter = force_all_with__coments_ref(comments, args[0])
        const pattern_list: Array<LangVal> = []
        // WIP 未判断标识符类型是否正确
        while (construction_p(pattern_iter)) {
            pattern_list.push(construction_head(pattern_iter))
            pattern_iter = force_all_with__coments_ref(comments, construction_tail(pattern_iter))
        }
        const pattern_tail: LangVal | null = null_p(pattern_iter) ? null : pattern_iter
        let inner_upvals_env: EnvLangValG<ThisLang> = env_null_v
        env_foreach(scope[0], (k, v) => {
            for (const pat_k of pattern_list) {
                if (equal_p(pat_k, k)) {
                    return // 此处return为env_foreach的countinue
                }
            }
            if (pattern_tail !== null && equal_p(pattern_tail, k)) {
                return // 此处return为env_foreach的countinue
            }
            inner_upvals_env = env_set(inner_upvals_env, k, v)
        })
        let inner_env = inner_upvals_env
        const pattern_list_id = []
        for (const pat_k of pattern_list) {
            const id = scope_gensym_do(scope)
            pattern_list_id.push(id)
            inner_env = env_set(inner_env, pat_k, id)
        }
        let pattern_tail_id: ThisLang | null = null
        if (pattern_tail !== null) {
            const id = scope_gensym_do(scope)
            pattern_tail_id = id
            inner_env = env_set(inner_env, pattern_tail, id)
        }
        const body_compiled = real_compile_with_environment(scope_inner__replace_environment(scope, inner_env), body)
        throw 'WIP'
    }
    throw 'WIP'
}
function compile_apply(scope: CompilerScope, f: ThisLang, args: Array<ThisLang>, comments: Array<LangVal>): ThisLang {
    return thislang_call(compiled_global_environment__apply, [f, thislang_array(args)])
}
