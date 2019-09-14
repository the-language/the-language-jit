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
    return new_delay((() => [env, x]), false, () => real_evaluate_with_environment(env, x))
}
export { evaluate_with_environment }

function real_evaluate_with_environment(env: Env, x: LangVal): LangVal {
    // WIP delay未正確處理(影響較小)
    const local_scope: CompilerScope = [env_null_v, clone_compiled_global_environment(compiled_global_environment)]
    env_foreach(env, (k, v) => {
        const v_added = compiled_global_environment_add__root_do(local_scope[1], v)
        local_scope[0] = env_set(local_scope[0], k, v_added)
    })
    const r = real_compile_with_environment(local_scope, x)
    const args = thislang_id('args')
    const init_stats: Array<ThisLang> = []
    for (let i = 0; i < local_scope[1][2].length; i++) {
        init_stats.push(thislang_statement_var_init(local_scope[1][2][i], thislang_array_lookup(args, thislang_number(i))))
    }
    init_stats.push(thislang_statement_return(r))
    const exported: Array<any> = local_scope[1][1]
    return thislang_eval_expression(thislang_lambda([args], thislang_concat_statements(init_stats)))(exported)
}

// 为外部传入编译结果的值的记录。
// [0]为gensym_state。
// [1]为值。
// [2]为ThisLang的标识符。
// [3]为已加入的东西的记录
type CompiledGlobalEnvironment = [Nat, Array<any>, Array<ThisLang>, Array<true | undefined>]

const compiled_global_environment: CompiledGlobalEnvironment = [0, [], [], []]
function compiled_global_environment_gensym_do(env: CompiledGlobalEnvironment): ThisLang {
    const id = env[0]
    const id_s = thislang_gensym(id)
    env[0]++
    return id_s
}
function compiled_global_environment_add__root_do(raw_env: CompiledGlobalEnvironment, x: any): (x: CompilerScope) => ThisLang {
    const id = raw_env[0]
    const id_s = thislang_gensym(id)
    raw_env[0]++
    return (scope) => { // 用于clone_compiled_global_environment后。
        if (scope[1][3][id] !== true) {
            scope[1][1].push(x)
            scope[1][2].push(id_s)
            scope[1][3][id] = true
        }
        return id_s
    }
}
const id__tmp_args = compiled_global_environment_gensym_do(compiled_global_environment)
// cogl为compiled_global_environment....的缩写
function cogl_do(x: any): (x: CompilerScope) => ThisLang {
    return compiled_global_environment_add__root_do(compiled_global_environment, x)
}
const cogl__null_v = cogl_do(null_v)
const cogl__apply = cogl_do(apply)
const cogl__new_data = cogl_do(new_data)
const cogl__new_data_optimized = cogl_do(new_data_optimized)
const cogl__jsArray_to_list = cogl_do(jsArray_to_list)
const cogl__function_atom = cogl_do(function_atom)
const cogl__new_data_optimized_closure = cogl_do(new_data_optimized_closure)
const cogl__evaluate_with_environment = cogl_do(evaluate_with_environment)
function clone_compiled_global_environment(x: CompiledGlobalEnvironment): CompiledGlobalEnvironment {
    return [x[0], x[1].slice(), x[2].slice(), x[3].slice()]
}
type CompilerScope = [EnvLangValG<(x: CompilerScope) => ThisLang>, CompiledGlobalEnvironment]
function scope_inner__replace_environment(scope: CompilerScope, env: EnvLangValG<(x: CompilerScope) => ThisLang>): CompilerScope {
    return [env, scope[1]]
}
function scope_gensym_do(scope: CompilerScope): ThisLang {
    return compiled_global_environment_gensym_do(scope[1])
}
function scope_global_add_do(scope: CompilerScope, x: any): ThisLang {
    const id_s = compiled_global_environment_gensym_do(scope[1])
    scope[1][1].push(x)
    scope[1][2].push(id_s)
    return id_s
}
// WIP delay未正確處理(影響較小)
function real_compile_with_environment(scope: CompilerScope, raw_input: LangVal): ThisLang {
    const x__comments = force_all(raw_input)
    let x = x__comments[0]
    const comments = x__comments[1]
    if (null_p(x)) {
        return cogl__null_v(scope)
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
    } else if (atom_p(x)) {
        const v: OrFalse<(x: CompilerScope) => ThisLang> = env_get(scope[0], x, false)
        if (v === false) {
            throw 'WIP'
        } else {
            return v(scope)
        }
    }
    throw 'WIP'
}
function apply(f: LangVal, args: Array<LangVal>): LangVal {
    throw 'WIP'
}
function compile_form(scope: CompilerScope, f: LangVal, raw_args: Array<LangVal>, comments: Array<LangVal>): ThisLang {
    const args0: Array<any> = raw_args
    for (let i = 0; i < args0.length; i++) {
        args0[i] = scope_global_add_do(scope, args0[i])
    }
    const args: Array<ThisLang> = args0
    args.unshift((() => { throw 'WIP: env' })())
    const f_compiled: string = ((x: any) => { throw 'WIP: macro->func' })(real_compile_with_environment(scope, f))
    return compile_apply(scope, f_compiled, args, comments)
}
function compile_function_builtin(scope: CompilerScope, f: LangVal, args: Array<ThisLang>, comments: Array<LangVal>): ThisLang {
    throw 'WIP'
}
function name_p(x: LangVal): boolean {
    throw 'WIP'
}
function make_quote(x: LangVal): LangVal {
    return jsArray_to_list([form_builtin_use_systemName, quote_form_builtin_systemName, x])
}
function compile_form_builtin(scope: CompilerScope, f: LangVal, args: Array<LangVal>, comments: Array<LangVal>): ThisLang {
    if (equal_p(f, quote_form_builtin_systemName)) {
        if (args.length !== 1) {
            throw 'WIP'
        }
        return scope_global_add_do(scope, args[0])
    } else if (equal_p(f, lambda_form_builtin_systemName)) {
        if (args.length !== 2) {
            throw 'WIP'
        }
        const body = args[1]
        const raw_pattern = args[0]
        let pattern_iter = force_all_with__coments_ref(comments, raw_pattern)
        const pattern_list: Array<LangVal> = []
        // WIP 未判断标识符类型是否正确
        while (construction_p(pattern_iter)) {
            pattern_list.push(construction_head(pattern_iter))
            pattern_iter = force_all_with__coments_ref(comments, construction_tail(pattern_iter))
        }
        const pattern_tail: LangVal | null = null_p(pattern_iter) ? null : pattern_iter
        let forced_pattern: LangVal = pattern_tail === null ? null_v : pattern_tail
        for (let i = pattern_list.length - 1; i >= 0; i--) {
            forced_pattern = new_construction(pattern_list[i], forced_pattern)
        }
        let inner_upvals_env: EnvLangValG<(x: CompilerScope) => ThisLang> = env_null_v
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
            inner_env = env_set(inner_env, pat_k, (_) => id)
        }
        let pattern_tail_id: ThisLang | null = null
        if (pattern_tail !== null) {
            const id = scope_gensym_do(scope)
            pattern_tail_id = id
            inner_env = env_set(inner_env, pattern_tail, (_) => id)
        }
        const compiled_statements: Array<ThisLang> = []
        for (const id_k of pattern_list_id) {
            compiled_statements.push(
                thislang_statement_var(id_k),
                thislang_statement_if(
                    thislang_array_p_empty(id__tmp_args),
                    (() => { throw 'WIP' })(),
                    thislang_statement_assign(id_k, thislang_array_do_shift(id__tmp_args))))
        }
        if (pattern_tail_id !== null) {
            compiled_statements.push(
                thislang_statement_var_init(pattern_tail_id,
                    thislang_call(cogl__jsArray_to_list(scope), [id__tmp_args])))
        }
        const body_compiled = real_compile_with_environment(scope_inner__replace_environment(scope, inner_env), body)
        compiled_statements.push(thislang_statement_return(body_compiled))
        const compiled = thislang_lambda([id__tmp_args], thislang_concat_statements(compiled_statements))
        return thislang_call(cogl__new_data_optimized_closure(scope), [
            thislang_call(
                cogl__jsArray_to_list(scope),
                [thislang_array([scope_global_add_do(scope, forced_pattern),
                thislang_call(cogl__jsArray_to_list(scope),
                    (() => { throw 'WIP' })()
                )])]),
            compiled])
    }
    throw 'WIP'
}
function compile_apply(scope: CompilerScope, f: ThisLang, args: Array<ThisLang>, comments: Array<LangVal>): ThisLang {
    return thislang_call(cogl__apply(scope), [f, thislang_array(args)])
}
