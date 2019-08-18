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

function jsbool_isomorphism_equal_p_inner(forcer: (x:LangVal)=>LangVal, x: LangVal, y: LangVal): boolean {
    if (x === y) {
        return true
    }
    x = forcer(x)
    y = forcer(y)
    if (x === y) {
        return true
    }
    function end_2<T extends LangVal>(xx: T, yy: T, f1: (x: T) => LangVal, f2: (x: T) => LangVal): boolean {
        if (jsbool_isomorphism_equal_p_inner(forcer, f1(xx), f1(yy)) && jsbool_isomorphism_equal_p_inner(forcer,f2(xx), f2(yy))) {
            lang_assert_equal_set_do(xx, yy)
            return true
        } else {
            return false
        }
    }
    if (null_p(x)) {
        if (!null_p(y)) { return false }
        lang_assert_equal_set_do(x, null_v)
        lang_assert_equal_set_do(y, null_v)
        return true
    } else if (atom_p(x)) {
        if (!atom_p(y)) { return false }
        return atom_equal_p(x, y)
    } else if (construction_p(x)) {
        if (!construction_p(y)) { return false }
        return end_2(x, y, construction_head, construction_tail)
    } else if (data_p(x)) {
        if (!data_p(y)) { return false }
        return end_2(x, y, data_name, data_list)
    } else if (delay_p(x)) {
        return false
    } else if (comment_p(x)) {
        if (!comment_p(y)) { return false }
        return end_2(x, y, comment_comment, comment_x)
    }
    return LANG_ERROR()
}
// 不比較delay。相等的delay可以返回false。
// 比较comment。
function jsbool_no_force_isomorphism_p(x: LangVal, y: LangVal): boolean {
    return jsbool_isomorphism_equal_p_inner(un_just_all, x, y)
}
function equal_p(x: LangVal, y: LangVal): boolean {
    return jsbool_isomorphism_equal_p_inner(force_all_ignore_comment, x, y)
}
