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
exports.__esModule = true;
function LANG_ERROR() {
    throw "TheLanguage PANIC";
}
function LANG_ASSERT(x) {
    if (!x) {
        return LANG_ERROR();
    }
}
function recordstring_null_p(x) {
    for (var k in x) {
        return false;
    }
    return true;
}
function recordstring_shadow_copy(x) {
    var result = {};
    for (var k in x) {
        result[k] = x[k];
    }
    return result;
}
function trampoline_return(x) {
    return function () { return [false, x]; };
}
exports.trampoline_return = trampoline_return;
function trampoline_delay(x) {
    return function () { return [true, x()]; };
}
exports.trampoline_delay = trampoline_delay;
function run_trampoline(x) {
    var i = x();
    while (i[0]) {
        i = i[1]();
    }
    return i[1];
}
exports.run_trampoline = run_trampoline;
var atom_t = 0 /* atom_t */;
var construction_t = 1 /* construction_t */;
var null_t = 2 /* null_t */;
var data_t = 3 /* data_t */;
var just_t = 4 /* just_t */;
var delay_t = 5 /* delay_t */;
var comment_t = 7 /* comment_t */;
var hole_t = 6 /* hole_t */;
function new_comment(comment, x) {
    return [comment_t, comment, x];
}
exports.new_comment = new_comment;
function comment_p(x) {
    return x[0] === comment_t;
}
exports.comment_p = comment_p;
function comment_comment(x) {
    return x[1];
}
exports.comment_comment = comment_comment;
function comment_x(x) {
    return x[2];
}
exports.comment_x = comment_x;
function un_comment_all(x) {
    while (comment_p(x)) {
        x = comment_x(x);
    }
    return x;
}
exports.un_comment_all = un_comment_all;
function atom_p(x) {
    return x[0] === atom_t;
}
exports.atom_p = atom_p;
function new_atom(x) {
    return [atom_t, x, false];
}
exports.new_atom = new_atom;
function un_atom(x) {
    return x[1];
}
exports.un_atom = un_atom;
function atom_equal_p(x, y) {
    if (x === y) {
        return true;
    }
    if (un_atom(x) === un_atom(y)) {
        lang_assert_equal_set_do(x, y);
        return true;
    }
    else {
        return false;
    }
}
exports.atom_equal_p = atom_equal_p;
function new_construction(x, y) {
    return [construction_t, x, y];
}
exports.new_construction = new_construction;
function construction_p(x) {
    return x[0] === construction_t;
}
exports.construction_p = construction_p;
function construction_head(x) {
    return x[1];
}
exports.construction_head = construction_head;
function construction_tail(x) {
    return x[2];
}
exports.construction_tail = construction_tail;
var null_v = [null_t, false, false];
exports.null_v = null_v;
function null_p(x) {
    return x[0] === null_t;
}
exports.null_p = null_p;
function new_data(x, y) {
    return [data_t, x, y];
}
exports.new_data = new_data;
function data_p(x) {
    return x[0] === data_t;
}
exports.data_p = data_p;
function data_name(x) {
    return x[1];
}
exports.data_name = data_name;
function data_list(x) {
    return x[2];
}
exports.data_list = data_list;
function just_p(x) {
    return x[0] === just_t;
}
exports.just_p = just_p;
function un_just(x) {
    return x[1];
}
exports.un_just = un_just;
function delay_p(x) {
    return x[0] === delay_t;
}
exports.delay_p = delay_p;
// Normal: exec為化簡，dis為不化簡。
function new_delay_normal(exec, dis) {
    return [delay_t, 0 /* normal_t */, [exec, dis]];
}
exports.new_delay_normal = new_delay_normal;
function new_delay_wait(x, next, dis) {
    return [delay_t, 1 /* wait_t */, [x, next, dis]];
}
exports.new_delay_wait = new_delay_wait;
function evaluate(x) {
    return new_delay_normal((function () { return real_evaluate_with_environment(env_null_v, x); }), (function () { return x; }));
}
function delay_exec_1(x) {
    if (x[1] === 1 /* wait_t */) {
        var vs = x[2];
        var wait = delay_exec_1(vs[0]);
        if (delay_p(wait)) {
            return x;
        }
        else {
            var n = vs[1](wait);
            lang_assert_equal_set_do(x, n);
            return n;
        }
    }
    else {
        var _t = x[1];
        var vs = x[2];
        var r = vs[0]();
        lang_assert_equal_set_do(x, r);
        return r;
    }
}
exports.delay_exec_1 = delay_exec_1;
function delay_display(x) {
    if (x[1] === 1 /* wait_t */) {
        var vs = x[2];
        var r_1 = vs[2]();
        vs[2] = function () { return r_1; };
        return r_1;
    }
    else {
        var _t = x[1];
        var vs = x[2];
        var r_2 = vs[1]();
        vs[1] = function () { return r_2; };
        return r_2;
    }
}
exports.delay_display = delay_display;
function new_hole_do() {
    return [hole_t, false, false];
}
function hole_p(x) {
    return x[0] === hole_t;
}
function lang_assert_equal_set_do(x, y) {
    // 只用于x与y等价的情况，且一般情況下要求y比x簡單。
    if (x === y) {
        return;
    }
    if (x === null_v) {
        x = y;
        y = null_v;
    }
    x[0] = just_t;
    x[1] = y;
    x[2] = false;
}
function hole_set_do(rawx, rawy) {
    LANG_ASSERT(hole_p(rawx)); // 可能曾经是hole，现在不是。
    LANG_ASSERT(!hole_p(rawy)); // 複製hole則意義改變。
    var x = rawx;
    var y = rawy;
    x[0] = y[0];
    x[1] = y[1];
    x[2] = y[2];
}
function lang_copy_do(x) {
    var ret = new_hole_do();
    hole_set_do(ret, x);
    return ret; // type WIP
}
var system_atom = new_atom("太始初核");
var name_atom = new_atom("符名");
var function_atom = new_atom("化滅");
var form_atom = new_atom("式形");
var equal_atom = new_atom("等同");
var evaluate_sym = new_atom("解算");
var theThing_atom = new_atom("特定其物");
var something_atom = new_atom("省略一物");
var mapping_atom = new_atom("映表");
var if_atom = new_atom("如若");
var typeAnnotation_atom = new_atom("一類何物");
var isOrNot_atom = new_atom("是非");
var sub_atom = new_atom("其子");
var true_atom = new_atom("爻陽");
var false_atom = new_atom("爻陰");
var quote_atom = new_atom("引用");
var apply_atom = new_atom("應用");
var null_atom = new_atom("間空");
var construction_atom = new_atom("連頸");
var data_atom = new_atom("構物");
var error_atom = new_atom("謬誤");
var atom_atom = new_atom("詞素");
var list_atom = new_atom("列序");
var head_atom = new_atom("首始");
var tail_atom = new_atom("尾末");
var thing_atom = new_atom("之物");
var theWorldStopped_atom = new_atom("宇宙亡矣");
var effect_atom = new_atom("效應");
//unused//const sequentialWordFormation_atom = new_atom('為符名連')
//unused//const inputOutput_atom = new_atom("出入改滅")
var comment_atom = new_atom("註疏");
var the_world_stopped_v = new_error(system_atom, new_list(theWorldStopped_atom, something_atom));
function systemName_make(x) {
    return new_data(name_atom, new_construction(system_atom, new_construction(x, null_v)));
}
function make_builtin_f_new_sym_f(x_sym) {
    return systemName_make(new_list(typeAnnotation_atom, new_list(function_atom, something_atom, x_sym), theThing_atom));
}
function make_builtin_f_get_sym_f(t_sym, x_sym) {
    return systemName_make(new_list(typeAnnotation_atom, new_list(function_atom, new_list(t_sym), something_atom), x_sym));
}
function make_builtin_f_p_sym_f(t_sym) {
    return systemName_make(new_list(typeAnnotation_atom, function_atom, new_list(isOrNot_atom, new_list(typeAnnotation_atom, t_sym, something_atom))));
}
var new_data_function_builtin_systemName = make_builtin_f_new_sym_f(data_atom);
var data_name_function_builtin_systemName = make_builtin_f_get_sym_f(data_atom, name_atom);
var data_list_function_builtin_systemName = make_builtin_f_get_sym_f(data_atom, list_atom);
var data_p_function_builtin_systemName = make_builtin_f_p_sym_f(data_atom);
var new_construction_function_builtin_systemName = make_builtin_f_new_sym_f(construction_atom);
var construction_p_function_builtin_systemName = make_builtin_f_p_sym_f(construction_atom);
var construction_head_function_builtin_systemName = make_builtin_f_get_sym_f(construction_atom, head_atom);
var construction_tail_function_builtin_systemName = make_builtin_f_get_sym_f(construction_atom, tail_atom);
var atom_p_function_builtin_systemName = make_builtin_f_p_sym_f(atom_atom);
var null_p_function_builtin_systemName = make_builtin_f_p_sym_f(null_atom);
var equal_p_function_builtin_systemName = systemName_make(new_list(typeAnnotation_atom, function_atom, new_list(isOrNot_atom, equal_atom)));
var apply_function_builtin_systemName = systemName_make(new_list(typeAnnotation_atom, new_list(function_atom, new_construction(function_atom, something_atom), something_atom), apply_atom));
var evaluate_function_builtin_systemName = systemName_make(new_list(typeAnnotation_atom, function_atom, evaluate_sym));
var list_chooseOne_function_builtin_systemName = make_builtin_f_get_sym_f(list_atom, new_list(typeAnnotation_atom, thing_atom, something_atom));
var if_function_builtin_systemName = systemName_make(new_list(typeAnnotation_atom, function_atom, if_atom));
var quote_form_builtin_systemName = systemName_make(new_list(typeAnnotation_atom, form_atom, quote_atom));
var lambda_form_builtin_systemName = systemName_make(new_list(typeAnnotation_atom, new_list(form_atom, new_list(function_atom, something_atom, function_atom)), theThing_atom));
var function_builtin_use_systemName = systemName_make(new_list(form_atom, new_list(system_atom, function_atom)));
var form_builtin_use_systemName = systemName_make(new_list(form_atom, new_list(system_atom, form_atom)));
var form_use_systemName = systemName_make(new_list(form_atom, form_atom));
var comment_function_builtin_systemName = systemName_make(new_list(typeAnnotation_atom, function_atom, comment_atom));
var comment_form_builtin_systemName = systemName_make(new_list(typeAnnotation_atom, form_atom, comment_atom));
var false_v = new_data(false_atom, new_list());
var true_v = new_data(true_atom, new_list());
// 相對獨立的部分。符號名稱 }}}
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
// {{{ 相對獨立的部分。對內建數據結構的簡單處理
function new_error(name, list) {
    return new_data(error_atom, new_construction(name, new_construction(list, null_v)));
}
function jsArray_to_list(xs) {
    var ret = null_v;
    for (var i = xs.length - 1; i >= 0; i--) {
        ret = new_construction(xs[i], ret);
    }
    return ret;
}
exports.jsArray_to_list = jsArray_to_list;
function list_to_jsArray(xs, k_done, k_tail) {
    var ret = [];
    while (construction_p(xs)) {
        ret.push(construction_head(xs));
        xs = construction_tail(xs);
    }
    if (null_p(xs)) {
        return k_done(ret);
    }
    return k_tail(ret, xs);
}
function maybe_list_to_jsArray(xs) {
    return list_to_jsArray(xs, function (x) { return x; }, function (_1, _2) { return false; });
}
exports.maybe_list_to_jsArray = maybe_list_to_jsArray;
function new_list() {
    var xs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        xs[_i] = arguments[_i];
    }
    return jsArray_to_list(xs);
}
exports.new_list = new_list;
function un_just_all(raw) {
    if (!just_p(raw)) {
        return raw;
    }
    var x = raw;
    var xs = [];
    while (just_p(x)) {
        xs.push(x);
        x = un_just(x);
    }
    for (var _i = 0, xs_1 = xs; _i < xs_1.length; _i++) {
        var v = xs_1[_i];
        lang_assert_equal_set_do(v, x);
    }
    return x;
}
exports.un_just_all = un_just_all;
function force_all_ignore_comment(x) {
    var xs = [x];
    while (true) {
        if (comment_p(x)) {
            for (var _i = 0, xs_2 = xs; _i < xs_2.length; _i++) {
                var val = xs_2[_i];
                lang_assert_equal_set_do(val, x);
            }
            x = comment_x(x);
            xs = [x];
        }
        else if (delay_p(x)) {
            x = delay_exec_1(x);
        }
        else if (just_p(x)) {
            x = un_just(x);
        }
        else {
            for (var _a = 0, xs_3 = xs; _a < xs_3.length; _a++) {
                var val = xs_3[_a];
                lang_assert_equal_set_do(val, x);
            }
            return x;
        }
        xs.push(x);
    }
}
function force1(x) {
    x = un_just_all(x);
    if (delay_p(x)) {
        return delay_exec_1(x);
    }
    return x;
}
function force_all_delay_inner(comments, x, dis, k) {
    x = force1(x);
    while (comment_p(x)) {
        comments.push(x);
        x = un_just_all(comment_x(x));
    }
    if (delay_p(x)) {
        return new_delay_wait(x, function (x) { return force_all_delay_inner(comments, x, dis, k); }, dis);
    }
    return k(comments, x);
}
function force_all_delay(x, dis, k) {
    return force_all_delay_inner([], x, dis, k);
}
function make_enviroment_null_v() {
    return [true, {}, null];
}
var enviroment_null_v = make_enviroment_null_v();
function enviroment_null_p(x) {
    if (x[0]) {
        return recordstring_null_p(x[1]);
    }
    return false;
}
function enviroment_helper_print0(x, refe, ret) {
    x = force_all_ignore_comment(x);
    if (atom_p(x)) {
        ret.push("^", un_atom(x));
    }
    else if (construction_p(x)) {
        ret.push(".");
        refe.push(construction_head(x), construction_tail(x));
    }
    else if (null_p(x)) {
        ret.push("_");
    }
    else if (data_p(x)) {
        ret.push("#");
        refe.push(data_name(x), data_list(x));
    }
    else {
        return LANG_ERROR();
    }
}
function enviroment_helper_print_step(xs) {
    var rs = [];
    var ss = [];
    for (var _i = 0, xs_4 = xs; _i < xs_4.length; _i++) {
        var x = xs_4[_i];
        enviroment_helper_print0(x, rs, ss);
    }
    return [ss, rs];
}
function enviroment_helper_node_expand(env) {
    var e = enviroment_helper_print_step(env[1]);
    var es = e[0];
    var ev = e[1];
    var t = {};
    LANG_ASSERT(es.length !== 0);
    t[es[es.length - 1]] = [false, ev, env[2]];
    var result = [true, t, null];
    for (var i = es.length - 2; i >= 0; i--) {
        var t_1 = {};
        t_1[es[i]] = result;
        result = [true, t_1, null];
    }
    return result;
}
function enviroment_helper_tree_shadow_copy(x) {
    return [true, recordstring_shadow_copy(x[1]), null];
}
function enviroment_set(env, key, val) {
    var result = make_enviroment_null_v();
    return run_trampoline(enviroment_set_helper(env, [key], val, result, result));
}
function enviroment_set_helper(env, key, val, return_pointer, real_return) {
    if (key.length === 0) {
        LANG_ASSERT(enviroment_null_p(env) || (env[0] === false && env[1].length === 0));
        return_pointer[0] = false;
        return_pointer[1] = key;
        return_pointer[2] = val;
        return trampoline_return(real_return);
    }
    if (env[0]) { // EnviromentTree
        var result_tmp = enviroment_helper_tree_shadow_copy(env);
        return_pointer[0] = result_tmp[0];
        return_pointer[1] = result_tmp[1];
        return_pointer[2] = result_tmp[2];
        var result = return_pointer;
        var a = enviroment_helper_print_step(key);
        var astr = a[0];
        var av_1 = a[1];
        var pointer_1 = result; // poiter表層為已複製，可修改的。
        for (var i = 0; i < astr.length; i++) {
            var k = astr[i];
            var m = null;
            if (k in pointer_1[1]) {
                var t = pointer_1[1][k];
                if (t[0]) {
                    m = enviroment_helper_tree_shadow_copy(t);
                }
                else {
                    if (t[1].length === 0) {
                        LANG_ASSERT(i === astr.length - 1);
                        var p = make_enviroment_null_v();
                        pointer_1[1][k] = p;
                        p[0] = false;
                        p[1] = av_1;
                        p[2] = val;
                        return trampoline_return(real_return);
                    }
                    m = enviroment_helper_node_expand(t);
                }
            }
            else {
                m = [true, {}, null];
            }
            LANG_ASSERT(m !== null);
            pointer_1[1][k] = m;
            pointer_1 = m;
        }
        if (enviroment_null_p(pointer_1)) {
            var p = pointer_1;
            p[0] = false;
            p[1] = av_1;
            p[2] = val;
            return trampoline_return(real_return);
        }
        else {
            return trampoline_delay(function () { return enviroment_set_helper(pointer_1, av_1, val, pointer_1, real_return); });
        }
    }
    else { // EnviromentNode
        return trampoline_delay(function () { return enviroment_set_helper(enviroment_helper_node_expand(env), key, val, return_pointer, real_return); });
    }
    return LANG_ERROR();
}
var env_null_v = [];
exports.env_null_v = env_null_v;
function env_set(env, key, val) {
    var ret = [];
    for (var i = 0; i < env.length; i = i + 2) {
        // WIP delay未正確處理(影響較小)
        if (equal_p(env[i + 0], key)) {
            ret[i + 0] = key;
            ret[i + 1] = val;
            for (i = i + 2; i < env.length; i = i + 2) {
                ret[i + 0] = env[i + 0];
                ret[i + 1] = env[i + 1];
            }
            return ret;
        }
        else {
            ret[i + 0] = env[i + 0];
            ret[i + 1] = env[i + 1];
        }
    }
    ret[env.length + 0] = key;
    ret[env.length + 1] = val;
    return ret;
}
exports.env_set = env_set;
function env_get(env, key, default_v) {
    for (var i = 0; i < env.length; i = i + 2) {
        if (equal_p(env[i + 0], key)) {
            return env[i + 1];
        }
    }
    return default_v;
}
exports.env_get = env_get;
function must_env_get(env, key) {
    for (var i = 0; i < env.length; i = i + 2) {
        if (equal_p(env[i + 0], key)) {
            return env[i + 1];
        }
    }
    return LANG_ERROR();
}
function env2val(env) {
    var ret = null_v;
    for (var i = 0; i < env.length; i = i + 2) {
        ret = new_construction(new_list(env[i + 0], env[i + 1]), ret);
    }
    return new_data(mapping_atom, new_list(ret));
}
exports.env2val = env2val;
function env_foreach(env, f) {
    for (var i = 0; i < env.length; i = i + 2) {
        f(env[i + 0], env[i + 1]);
    }
}
exports.env_foreach = env_foreach;
function val2env(x) {
    x = force_all_ignore_comment(x);
    if (!data_p(x)) {
        return false;
    }
    var s = force_all_ignore_comment(data_name(x));
    if (!atom_p(s)) {
        return false;
    }
    if (!atom_equal_p(s, mapping_atom)) {
        return false;
    }
    s = force_all_ignore_comment(data_list(x));
    if (!construction_p(s)) {
        return false;
    }
    if (!null_p(force_all_ignore_comment(construction_tail(s)))) {
        return false;
    }
    var ret = [];
    var xs = force_all_ignore_comment(construction_head(s));
    while (!null_p(xs)) {
        if (!construction_p(xs)) {
            return false;
        }
        var x_1 = force_all_ignore_comment(construction_head(xs));
        xs = force_all_ignore_comment(construction_tail(xs));
        if (!construction_p(x_1)) {
            return false;
        }
        var k = construction_head(x_1);
        x_1 = force_all_ignore_comment(construction_tail(x_1));
        if (!construction_p(x_1)) {
            return false;
        }
        var v = construction_head(x_1);
        if (!null_p(force_all_ignore_comment(construction_tail(x_1)))) {
            return false;
        }
        var not_breaked = true;
        for (var i = 0; i < ret.length; i = i + 2) {
            if (equal_p(ret[i + 0], k)) {
                ret[i + 1] = v;
                not_breaked = false;
                break;
            }
        }
        if (not_breaked) {
            ret.push(k, v);
        }
    }
    return ret;
}
exports.val2env = val2env;
// 相對獨立的部分。變量之環境 }}}
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
function jsbool_isomorphism_equal_p_inner(forcer, x, y) {
    if (x === y) {
        return true;
    }
    x = forcer(x);
    y = forcer(y);
    if (x === y) {
        return true;
    }
    function end_2(xx, yy, f1, f2) {
        if (jsbool_isomorphism_equal_p_inner(forcer, f1(xx), f1(yy)) && jsbool_isomorphism_equal_p_inner(forcer, f2(xx), f2(yy))) {
            lang_assert_equal_set_do(xx, yy);
            return true;
        }
        else {
            return false;
        }
    }
    if (null_p(x)) {
        if (!null_p(y)) {
            return false;
        }
        lang_assert_equal_set_do(x, null_v);
        lang_assert_equal_set_do(y, null_v);
        return true;
    }
    else if (atom_p(x)) {
        if (!atom_p(y)) {
            return false;
        }
        return atom_equal_p(x, y);
    }
    else if (construction_p(x)) {
        if (!construction_p(y)) {
            return false;
        }
        return end_2(x, y, construction_head, construction_tail);
    }
    else if (data_p(x)) {
        if (!data_p(y)) {
            return false;
        }
        return end_2(x, y, data_name, data_list);
    }
    else if (delay_p(x)) {
        return false;
    }
    else if (comment_p(x)) {
        if (!comment_p(y)) {
            return false;
        }
        return end_2(x, y, comment_comment, comment_x);
    }
    return LANG_ERROR();
}
// 不比較delay。相等的delay可以返回false。
// 比较comment。
function jsbool_no_force_isomorphism_p(x, y) {
    return jsbool_isomorphism_equal_p_inner(un_just_all, x, y);
}
function equal_p(x, y) {
    return jsbool_isomorphism_equal_p_inner(force_all_ignore_comment, x, y);
}
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
function evaluate_with_environment(env, x) {
    throw 'WIP';
}
function real_evaluate_with_environment(env, x) {
    return force_all_delay(x, function () { return evaluate_with_environment(env, x); }, function (comments, x) {
        if (null_p(x)) {
            return null_v;
        }
        else {
            throw 'WIP';
        }
    });
}
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
// {{{ 相對獨立的部分。simple printer
function simple_print(x) {
    // [[[ 大量重複代碼 simple_print <-> complex_print
    x = un_just_all(x);
    var temp = "";
    var prefix = "";
    if (null_p(x)) {
        return "()";
    }
    else if (construction_p(x)) {
        temp = "(";
        prefix = "";
        while (construction_p(x)) {
            temp += prefix + simple_print(construction_head(x));
            prefix = " ";
            x = un_just_all(construction_tail(x));
        }
        if (null_p(x)) {
            temp += ")";
        }
        else {
            temp += " . " + simple_print(x) + ")";
        }
        return temp;
    }
    else if (data_p(x)) {
        return "#" + simple_print(new_construction(data_name(x), data_list(x)));
    }
    else if (atom_p(x)) {
        return un_atom(x);
    }
    else if (comment_p(x)) {
        return ";(" + simple_print(comment_comment(x)) + " " + simple_print(comment_x(x)) + ")";
    }
    else if (delay_p(x)) {
        return "$(" + simple_print(delay_display(x)) + ")";
    }
    return LANG_ERROR(); // 大量重複代碼 simple_print <-> complex_print ]]]
}
exports.simple_print = simple_print;
// 相對獨立的部分。simple printer }}}
// {{{ 相對獨立的部分。complex parser/complex printer
function complex_parse(x) {
    var state_const = x; // TODO 修復UTF8處理（現在只支持UTF16中的字符）（typescript-to-lua只正確支持ASCII）
    var state = 0;
    function eof() {
        return state_const.length === state;
    }
    function get() {
        LANG_ASSERT(!eof());
        var ret = state_const[state];
        state++;
        return ret;
    }
    function put(chr) {
        LANG_ASSERT(state_const[state - 1] === chr);
        state--;
    }
    function parse_error(x) {
        if (x === void 0) { x = ""; }
        throw "TheLanguage parse ERROR!" + x;
    }
    function a_space_p(chr) {
        return chr === " " || chr === "\n" || chr === "\t" || chr === "\r";
    }
    function space() {
        if (eof()) {
            return false;
        }
        var x = get();
        if (!a_space_p(x)) {
            put(x);
            return false;
        }
        while (a_space_p(x) && !eof()) {
            x = get();
        }
        if (!a_space_p(x)) {
            put(x);
        }
        return true;
    }
    function atom() {
        if (eof()) {
            return false;
        }
        var x = get();
        var ret = "";
        if (!a_atom_p(x)) {
            put(x);
            return false;
        }
        while (a_atom_p(x) && !eof()) {
            ret += x;
            x = get();
        }
        if (a_atom_p(x)) {
            ret += x;
        }
        else {
            put(x);
        }
        return new_atom(ret);
    }
    function readlist() {
        if (eof()) {
            return false;
        }
        var x = get();
        if (x !== "(") {
            put(x);
            return false;
        }
        var ret_last = new_hole_do();
        var ret = ret_last;
        function last_add_do(val) {
            var ret_last2 = new_hole_do();
            hole_set_do(ret_last, new_construction(val, ret_last2));
            ret_last = ret_last2;
        }
        while (true) {
            space();
            if (eof()) {
                return parse_error();
            }
            x = get();
            if (x === ")") {
                hole_set_do(ret_last, null_v);
                return ret;
            }
            if (x === ".") {
                space();
                var e_1 = val();
                hole_set_do(ret_last, e_1);
                space();
                if (eof()) {
                    return parse_error();
                }
                x = get();
                if (x !== ")") {
                    return parse_error();
                }
                return ret;
            }
            put(x);
            var e = val();
            last_add_do(e);
        }
    }
    function data() {
        if (eof()) {
            return false;
        }
        var x = get();
        if (x !== "#") {
            put(x);
            return false;
        }
        var xs = readlist();
        if (xs === false) {
            return parse_error();
        }
        if (!construction_p(xs)) {
            return parse_error();
        }
        return new_data(construction_head(xs), construction_tail(xs));
    }
    function make_read_one(prefix, k) {
        return function () {
            if (eof()) {
                return false;
            }
            var c = get();
            if (c !== prefix) {
                put(c);
                return false;
            }
            var xs = readlist();
            if (xs === false) {
                return parse_error();
            }
            if (!construction_p(xs)) {
                return parse_error();
            }
            if (!null_p(construction_tail(xs))) {
                return parse_error();
            }
            return k(construction_head(xs));
        };
    }
    function make_read_two(prefix, k) {
        return function () {
            if (eof()) {
                return false;
            }
            var c = get();
            if (c !== prefix) {
                put(c);
                return false;
            }
            var xs = readlist();
            if (xs === false) {
                return parse_error();
            }
            if (!construction_p(xs)) {
                return parse_error();
            }
            var x = construction_tail(xs);
            if (!(construction_p(x) && null_p(construction_tail(x)))) {
                return parse_error();
            }
            return k(construction_head(xs), construction_head(x));
        };
    }
    function make_read_three(prefix, k) {
        return function () {
            if (eof()) {
                return false;
            }
            var c = get();
            if (c !== prefix) {
                put(c);
                return false;
            }
            var xs = readlist();
            if (xs === false) {
                return parse_error();
            }
            if (!construction_p(xs)) {
                return parse_error();
            }
            var x = construction_tail(xs);
            if (!construction_p(x)) {
                return parse_error();
            }
            var x_d = construction_tail(x);
            if (!(construction_p(x_d) && null_p(construction_tail(x_d)))) {
                return parse_error();
            }
            return k(construction_head(xs), construction_head(x), construction_head(x_d));
        };
    }
    var readeval = make_read_one("$", evaluate);
    var readcomment = make_read_two(";", function (comment, x) { return new_comment(comment, x); });
    function a_atom_p(chr) {
        if (a_space_p(chr)) {
            return false;
        }
        for (var _i = 0, _a = ["(", ")", "!", "#", ".", "$", "%", "^", "@",
            '~', '/', '-', '>', '_', ':', '?', '[', ']', '&', ';'
        ]; _i < _a.length; _i++) {
            var v = _a[_i];
            if (v === chr) {
                return false;
            }
        }
        return true;
    }
    function val() {
        space();
        var fs = [readlist, readsysname, data, readeval, readcomment];
        for (var _i = 0, fs_1 = fs; _i < fs_1.length; _i++) {
            var f = fs_1[_i];
            var x_2 = f();
            if (x_2 !== false) {
                return x_2;
            }
        }
        return parse_error();
    }
    return val();
    function un_maybe(vl) {
        if (vl === false) {
            return parse_error();
        }
        return vl;
    }
    function not_eof() {
        return !eof();
    }
    function assert_get(c) {
        un_maybe(not_eof());
        un_maybe(get() === c);
    }
    function readsysname_no_pack_inner_must(strict) {
        if (strict === void 0) { strict = false; }
        function readsysname_no_pack_bracket() {
            assert_get('[');
            var x = readsysname_no_pack_inner_must();
            assert_get(']');
            return x;
        }
        // 重複自val()
        var fs;
        if (strict) {
            fs = [readlist, atom, readsysname_no_pack_bracket, data,
                readeval, readcomment];
        }
        else {
            fs = [readlist, readsysname_no_pack, data,
                readeval, readcomment];
        }
        for (var _i = 0, fs_2 = fs; _i < fs_2.length; _i++) {
            var f = fs_2[_i];
            var x_3 = f();
            if (x_3 !== false) {
                return x_3;
            }
        }
        return parse_error();
    }
    function may_xfx_xf(vl) {
        if (eof()) {
            return vl;
        }
        var head = get();
        if (head === '.') {
            var y = readsysname_no_pack_inner_must();
            return new_list(typeAnnotation_atom, new_list(function_atom, new_list(vl), something_atom), y);
        }
        else if (head === ':') {
            var y = readsysname_no_pack_inner_must();
            return new_list(typeAnnotation_atom, y, vl);
        }
        else if (head === '~') {
            return new_list(isOrNot_atom, vl);
        }
        else if (head === '@') {
            var y = readsysname_no_pack_inner_must();
            return new_list(typeAnnotation_atom, new_list(function_atom, new_construction(vl, something_atom), something_atom), y);
        }
        else if (head === '?') {
            return new_list(typeAnnotation_atom, function_atom, new_list(isOrNot_atom, vl));
        }
        else if (head === '/') {
            var ys = [vl];
            while (true) {
                var y = readsysname_no_pack_inner_must(true);
                ys.push(y);
                if (eof()) {
                    break;
                }
                var c0 = get();
                if (c0 !== '/') {
                    put(c0);
                    break;
                }
            }
            return new_list(sub_atom, jsArray_to_list(ys));
        }
        else {
            put(head);
            return vl;
        }
    }
    function readsysname_no_pack() {
        if (eof()) {
            return false;
        }
        var head = get();
        if (head === '&') {
            un_maybe(not_eof());
            var c0 = get();
            if (c0 === '+') {
                var x_4 = readsysname_no_pack_inner_must();
                return new_list(form_atom, new_list(system_atom, x_4));
            }
            else {
                put(c0);
            }
            var x_5 = readsysname_no_pack_inner_must();
            return new_list(form_atom, x_5);
        }
        else if (head === ':') {
            un_maybe(not_eof());
            var c0 = get();
            if (c0 === '&') {
                assert_get('>');
                var x_6 = readsysname_no_pack_inner_must();
                return new_list(typeAnnotation_atom, new_list(form_atom, new_list(function_atom, something_atom, x_6)), theThing_atom);
            }
            else if (c0 === '>') {
                var x_7 = readsysname_no_pack_inner_must();
                return new_list(typeAnnotation_atom, new_list(function_atom, something_atom, x_7), theThing_atom);
            }
            else {
                put(c0);
            }
            var x_8 = readsysname_no_pack_inner_must();
            return new_list(typeAnnotation_atom, x_8, theThing_atom);
        }
        else if (head === '+') {
            var x_9 = readsysname_no_pack_inner_must();
            return new_list(system_atom, x_9);
        }
        else if (head === '[') {
            var x_10 = readsysname_no_pack_inner_must();
            assert_get(']');
            return may_xfx_xf(x_10);
        }
        else if (head === '_') {
            assert_get(':');
            var x_11 = readsysname_no_pack_inner_must();
            return new_list(typeAnnotation_atom, x_11, something_atom);
        }
        else {
            put(head);
            var x_12 = atom();
            if (x_12 === false) {
                return false;
            }
            return may_xfx_xf(x_12);
        }
    }
    function readsysname() {
        var x = readsysname_no_pack();
        if (x === false) {
            return false;
        }
        if (atom_p(x)) {
            return x;
        }
        return systemName_make(x);
    }
}
exports.complex_parse = complex_parse;
function complex_print(val) {
    function print_sys_name(x, is_inner_bool) {
        // 是 complex_print(systemName_make(x))
        if (atom_p(x)) {
            return un_atom(x);
        }
        function inner_bracket(vl) {
            if (is_inner_bool) {
                return '[' + vl + ']';
            }
            else {
                return vl;
            }
        }
        var maybe_xs = maybe_list_to_jsArray(x);
        if (maybe_xs !== false && maybe_xs.length === 3 && jsbool_no_force_isomorphism_p(maybe_xs[0], typeAnnotation_atom)) {
            // new_list(typeAnnotation_atom, maybe_xs[1], maybe_xs[2])
            var maybe_lst_2 = maybe_list_to_jsArray(maybe_xs[1]);
            if (maybe_lst_2 !== false && maybe_lst_2.length === 3 && jsbool_no_force_isomorphism_p(maybe_lst_2[0], function_atom)) {
                var var_2_1 = maybe_lst_2[1];
                // new_list(typeAnnotation_atom, new_list(function_atom, var_2_1, maybe_lst_2[2]), maybe_xs[2])
                var maybe_lst_3 = maybe_list_to_jsArray(var_2_1);
                if (maybe_lst_3 !== false && maybe_lst_3.length === 1 && jsbool_no_force_isomorphism_p(maybe_lst_2[2], something_atom)) {
                    // new_list(typeAnnotation_atom, new_list(function_atom, new_list(maybe_lst_3[0]), something_atom), maybe_xs[2])
                    return inner_bracket(print_sys_name(maybe_lst_3[0], true) + '.' + print_sys_name(maybe_xs[2], true));
                }
                else if (construction_p(var_2_1) && jsbool_no_force_isomorphism_p(construction_tail(var_2_1), something_atom) && jsbool_no_force_isomorphism_p(maybe_lst_2[2], something_atom)) {
                    // new_list(typeAnnotation_atom, new_list(function_atom, new_construction(construction_head(var_2_1), something_atom), something_atom), maybe_xs[2])
                    return inner_bracket(print_sys_name(construction_head(var_2_1), true) + '@' + print_sys_name(maybe_xs[2], true));
                }
                else if (jsbool_no_force_isomorphism_p(var_2_1, something_atom) && jsbool_no_force_isomorphism_p(maybe_xs[2], theThing_atom)) {
                    // new_list(typeAnnotation_atom, new_list(function_atom, something_atom, maybe_lst_2[2]), theThing_atom)
                    return inner_bracket(':>' + print_sys_name(maybe_lst_2[2], true));
                }
            }
            var maybe_lst_44 = maybe_list_to_jsArray(maybe_xs[2]);
            if (jsbool_no_force_isomorphism_p(maybe_xs[1], function_atom) && maybe_lst_44 !== false && maybe_lst_44.length === 2 && jsbool_no_force_isomorphism_p(maybe_lst_44[0], isOrNot_atom)) {
                // new_list(typeAnnotation_atom, function_atom, new_list(isOrNot_atom, maybe_lst_44[1]))
                return inner_bracket(print_sys_name(maybe_lst_44[1], true) + '?');
            }
            if (maybe_lst_2 !== false && maybe_lst_2.length === 2 && jsbool_no_force_isomorphism_p(maybe_xs[2], theThing_atom) && jsbool_no_force_isomorphism_p(maybe_lst_2[0], form_atom)) {
                // new_list(typeAnnotation_atom, new_list(form_atom, var_2_1), theThing_atom)
                var maybe_lst_88 = maybe_list_to_jsArray(maybe_lst_2[1]);
                if (maybe_lst_88 !== false && maybe_lst_88.length === 3 && jsbool_no_force_isomorphism_p(maybe_lst_88[0], function_atom) && jsbool_no_force_isomorphism_p(maybe_lst_88[1], something_atom)) {
                    // new_list(typeAnnotation_atom, new_list(form_atom, new_list(function_atom, something_atom, maybe_lst_88[2])), theThing_atom)
                    return inner_bracket(':&>' + print_sys_name(maybe_lst_88[2], true));
                }
            }
            var hd = void 0;
            if (jsbool_no_force_isomorphism_p(maybe_xs[2], something_atom)) {
                hd = '_';
            }
            else if (jsbool_no_force_isomorphism_p(maybe_xs[2], theThing_atom)) {
                hd = '';
            }
            else {
                hd = print_sys_name(maybe_xs[2], true);
            }
            return inner_bracket(hd + ':' + print_sys_name(maybe_xs[1], true));
        }
        else if (maybe_xs !== false && maybe_xs.length === 2) {
            if (jsbool_no_force_isomorphism_p(maybe_xs[0], form_atom)) {
                // new_list(form_atom, maybe_xs[1])
                var maybe_lst_288 = maybe_list_to_jsArray(maybe_xs[1]);
                if (maybe_lst_288 !== false && maybe_lst_288.length === 2 && jsbool_no_force_isomorphism_p(maybe_lst_288[0], system_atom)) {
                    // new_list(form_atom, new_list(system_atom, maybe_lst_288[1]))
                    return inner_bracket('&+' + print_sys_name(maybe_lst_288[1], true));
                }
                return inner_bracket('&' + print_sys_name(maybe_xs[1], true));
            }
            else if (jsbool_no_force_isomorphism_p(maybe_xs[0], isOrNot_atom)) {
                // new_list(isOrNot_atom, maybe_xs[1])
                return inner_bracket(print_sys_name(maybe_xs[1], true) + '~');
            }
            else if (jsbool_no_force_isomorphism_p(maybe_xs[0], system_atom)) {
                // new_list(system_atom, maybe_xs[1])
                return inner_bracket('+' + print_sys_name(maybe_xs[1], true));
            }
            else if (jsbool_no_force_isomorphism_p(maybe_xs[0], sub_atom)) {
                // new_list(sub_atom, maybe_xs[1])
                var maybe_lst_8934 = maybe_list_to_jsArray(maybe_xs[1]);
                if (maybe_lst_8934 !== false && maybe_lst_8934.length > 1) {
                    var tmp = print_sys_name(maybe_lst_8934[0], true);
                    for (var i = 1; i < maybe_lst_8934.length; i++) {
                        tmp += '/' + print_sys_name(maybe_lst_8934[i], true);
                    }
                    return inner_bracket(tmp);
                }
            }
        }
        if (is_inner_bool) {
            return simple_print(x);
        }
        else {
            return simple_print(systemName_make(x));
        }
    }
    // [[[ 大量重複代碼 simple_print <-> complex_print
    var x = complex_parse(simple_print(val)); // 去除所有just
    var temp = "";
    var prefix = "";
    if (null_p(x)) {
        return "()";
    }
    else if (construction_p(x)) {
        temp = "(";
        prefix = "";
        while (construction_p(x)) {
            temp += prefix + complex_print(construction_head(x));
            prefix = " ";
            x = construction_tail(x);
        }
        if (null_p(x)) {
            temp += ")";
        }
        else {
            temp += " . " + complex_print(x) + ")";
        }
        return temp;
    }
    else if (data_p(x)) {
        var name_1 = data_name(x);
        var list = data_list(x);
        var maybe_xs = maybe_list_to_jsArray(list);
        if (maybe_xs !== false && maybe_xs.length === 2 && jsbool_no_force_isomorphism_p(name_1, name_atom) && jsbool_no_force_isomorphism_p(maybe_xs[0], system_atom)) {
            // systemName_make(maybe_xs[1])
            return print_sys_name(maybe_xs[1], false);
        }
        return "#" + complex_print(new_construction(name_1, list));
    }
    else if (atom_p(x)) {
        return un_atom(x);
    }
    else if (comment_p(x)) {
        return ";(" + complex_print(comment_comment(x)) + " " + complex_print(comment_x(x)) + ")";
    }
    else if (delay_p(x)) {
        return "$(" + simple_print(delay_display(x)) + ")";
    }
    return LANG_ERROR(); // 大量重複代碼 simple_print <-> complex_print ]]]
}
exports.complex_print = complex_print;
// 相對獨立的部分。complex parser/complex printer }}}
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
// {{{ 相對獨立的部分。machinetext parse/print
// 類似與Stack-based解釋器。
function machinetext_parse(rawstr) {
    var state = rawstr.length;
    function parse_error(x) {
        if (x === void 0) { x = ""; }
        throw 'MT parse ERROR ' + x;
    }
    function parse_assert(x) {
        if (!x) {
            return parse_error();
        }
    }
    function get_do() {
        parse_assert(is_not_eof());
        state--;
        return rawstr[state];
    }
    function is_eof() {
        return state === 0;
    }
    function is_not_eof() {
        return !is_eof();
    }
    var stack = [];
    function conslike(c) {
        var y = stack.pop();
        var x = stack.pop();
        if (x === undefined || y === undefined) {
            return parse_error();
        }
        else {
            return stack.unshift(c(x, y));
        }
    }
    while (is_not_eof()) {
        var chr = get_do();
        if (chr === '^') {
            var tmp = '';
            while (true) {
                var chr_1 = get_do();
                if (chr_1 === '^') {
                    break;
                }
                tmp = chr_1 + tmp;
            }
            stack.unshift(new_atom(tmp));
        }
        else if (chr === '.') {
            conslike(new_construction);
        }
        else if (chr === '#') {
            conslike(new_data);
        }
        else if (chr === ';') {
            conslike(new_comment);
        }
        else if (chr === '$') {
            var x = stack.pop();
            if (x === undefined) {
                return parse_error();
            }
            else {
                stack.unshift(evaluate(x));
            }
        }
        else if (chr === '_') {
            stack.unshift(null_v);
        }
        else {
            return parse_error();
        }
    }
    parse_assert(is_eof());
    parse_assert(stack.length === 1);
    return stack[0];
}
exports.machinetext_parse = machinetext_parse;
// 此print或許可以小幅度修改後用於equal,合理的print無限數據... （廣度優先）
function machinetext_print(x) {
    var stack = [x];
    var result = "";
    var _loop_1 = function () {
        var new_stack = [];
        for (var _i = 0, stack_1 = stack; _i < stack_1.length; _i++) {
            var x_13 = stack_1[_i];
            x_13 = un_just_all(x_13);
            var conslike = function (xx, s, g1, g2) {
                result += (s);
                return new_stack.push(g1(xx), g2(xx));
            };
            if (atom_p(x_13)) {
                result += ('^' + un_atom(x_13) + '^');
            }
            else if (construction_p(x_13)) {
                conslike(x_13, '.', construction_head, construction_tail);
            }
            else if (null_p(x_13)) {
                result += ('_');
            }
            else if (data_p(x_13)) {
                conslike(x_13, '#', data_name, data_list);
            }
            else if (delay_p(x_13)) {
                result += '$';
                new_stack.push(delay_display(x_13));
            }
            else if (comment_p(x_13)) {
                conslike(x_13, ';', comment_comment, comment_x);
            }
            else {
                return { value: LANG_ERROR() };
            }
        }
        stack = new_stack;
    };
    while (stack.length !== 0) {
        var state_1 = _loop_1();
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return result;
}
exports.machinetext_print = machinetext_print;
function reduce_comma(xs) {
    if (xs.length === 0) {
        return "";
    }
    var result = xs[0];
    for (var i = 1; i < xs.length; i++) {
        result = result + "," + xs[i];
    }
    return result;
}
function thislang_eval_statements(statements) {
    return Function("\"use strict\";" + statements)();
}
function thislang_eval_expression(expression) {
    return thislang_eval_statements(thislang_return(expression));
}
function thislang_array(xs) {
    return "[" + reduce_comma(xs) + "]";
}
function thislang_call(f, args) {
    return f + "(" + reduce_comma(args) + ")";
}
function thislang_lambda(args, statements) {
    return "function(" + reduce_comma(args) + "){" + statements + "}";
}
function thislang_return(val) {
    return "return " + val + ";";
}
