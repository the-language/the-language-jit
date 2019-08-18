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
function new_error<N extends LangVal, L extends LangVal>(name: N, list: L): New_Data<Error_Atom, New_Construction<N, New_Construction<L, Null_V>>> {
    return new_data(error_atom, new_construction(name, new_construction(list, null_v)))
}
function jsArray_to_list(xs: Array<LangVal>): LangVal {
    let ret: LangVal = null_v
    for (let i = xs.length - 1; i >= 0; i--) {
        ret = new_construction(xs[i], ret)
    }
    return ret
}

function list_to_jsArray<T>(
    xs: LangVal,
    k_done: (p0: Array<LangVal>) => T,
    k_tail: (p0: Array<LangVal>, p1: LangVal) => T): T {
    let ret: Array<LangVal> = []
    while (construction_p(xs)) {
        ret.push(construction_head(xs))
        xs = construction_tail(xs)
    }
    if (null_p(xs)) {
        return k_done(ret)
    }
    return k_tail(ret, xs)
}

function maybe_list_to_jsArray(xs: LangVal): OrFalse<Array<LangVal>> {
    return list_to_jsArray<OrFalse<Array<LangVal>>>(xs, (x) => x, (_1, _2) => false)
}
function new_list(...xs: Array<LangVal>): LangVal {
    return jsArray_to_list(xs)
}
export { jsArray_to_list, maybe_list_to_jsArray, new_list }

function un_just_all(raw: LangVal): LangVal {
    if (!just_p(raw)) { return raw }
    let x: LangVal = raw
    let xs: Array<LangVal> = []
    while (just_p(x)) {
        xs.push(x)
        x = un_just(x)
    }

    for (const v of xs) {
        lang_assert_equal_set_do(v, x)
    }

    return x
}
export { un_just_all }

function force_all_ignore_comment(x: LangVal): LangVal {
    let xs: Array<LangVal> = [x]
    while (true) {
        if (comment_p(x)) {
            for (const val of xs) {
                lang_assert_equal_set_do(val, x)
            }
            x = comment_x(x)
            xs = [x]
        } else if (delay_p(x)) {
            x = delay_exec_1(x)
        } else if (just_p(x)) {
            x = un_just(x)
        } else {
            for (const val of xs) {
                lang_assert_equal_set_do(val, x)
            }
            return x
        }
        xs.push(x)
    }
}

function force1(x: LangVal): LangVal {
    x = un_just_all(x)
    if (delay_p(x)) {
        return delay_exec_1(x)
    }
    return x
}

function force_all_delay_inner(comments: Array<LangVal>, x: LangVal, dis: () => LangVal, k: (comments: Array<LangVal>, v: LangVal) => LangVal): LangVal {
    x = force1(x)
    while (comment_p(x)) {
        comments.push(x)
        x = un_just_all(comment_x(x))
    }
    if (delay_p(x)) {
        return new_delay_wait(x, x => force_all_delay_inner(comments, x, dis, k), dis)
    }
    return k(comments, x)
}
function force_all_delay(x: LangVal, dis: () => LangVal, k: (comments: Array<LangVal>, v: LangVal) => LangVal): LangVal {
    return force_all_delay_inner([], x, dis, k)
}

// 相對獨立的部分。對內建數據結構的簡單處理 }}}
