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

// 不比較delay。相等的delay可以返回false。
// 比较comment。
function jsbool_no_force_isomorphism_p(x: LangVal, y: LangVal): boolean {
    if (x === y) {
        return true
    }
    x = un_just_all(x)
    y = un_just_all(y)
    if (x === y) {
        return true
    }
    function end_2<T extends LangVal>(xx: T, yy: T, f1: (x: T) => LangVal, f2: (x: T) => LangVal): boolean {
        if (jsbool_no_force_isomorphism_p(f1(xx), f1(yy)) && jsbool_no_force_isomorphism_p(f2(xx), f2(yy))) {
            unsafe__lang_assert_equal_set_do(xx, yy)
            return true
        } else {
            return false
        }
    }
    if (null_p(x)) {
        if (!null_p(y)) { return false }
        unsafe__lang_assert_equal_set_do(x, null_v)
        unsafe__lang_assert_equal_set_do(y, null_v)
        return true
    } else if (atom_p(x)) {
        if (!atom_p(y)) { return false }
        return atom_equal_p(x, y)
    } else if (construction_p(x)) {
        if (!construction_p(y)) { return false }
        return end_2(x, y, construction_head, construction_tail)
    } else if (data_p(x)) {
        if (!data_p(y)) { return false }
        if (data_optimized(x) === false) {
            return end_2(x, y, data_name, data_list)
        } else {
            return end_2(y, x, data_name, data_list)
        }
    } else if (delay_p(x)) {
        return false
    } else if (comment_p(x)) {
        if (!comment_p(y)) { return false }
        return end_2(x, y, comment_comment, comment_x)
    }
    return LANG_ERROR()
}
function equal_p_inner(x: LangVal, y: LangVal, modifyed: [boolean]): boolean {
    if (x === y) {
        return true
    }
    x = un_just_all(x)
    y = un_just_all(y)
    if (x === y) {
        return true
    }
    if (delay_p(x) || delay_p(y)) {
        return equal_p_inner(force_all_keep_comment(x), force_all_keep_comment(y), modifyed)
    }
    if (comment_p(x) || comment_p(y)) {
        modifyed[0] = true
        return equal_p_inner(ignore_all_comment(x), ignore_all_comment(y), modifyed)
    }
    function end_2<T extends LangVal>(xx: T, yy: T, f1: (x: T) => LangVal, f2: (x: T) => LangVal): boolean {
        const p: [boolean] = [false]
        if (equal_p_inner(f1(xx), f1(yy), p) && equal_p_inner(f2(xx), f2(yy), p)) {
            if (p[0]) {
                modifyed[0] = true
            } else {
                unsafe__lang_assert_equal_set_do(xx, yy)
            }
            return true
        } else {
            return false
        }
    }
    if (null_p(x)) {
        if (!null_p(y)) { return false }
        unsafe__lang_assert_equal_set_do(x, null_v)
        unsafe__lang_assert_equal_set_do(y, null_v)
        return true
    } else if (atom_p(x)) {
        if (!atom_p(y)) { return false }
        return atom_equal_p(x, y)
    } else if (construction_p(x)) {
        if (!construction_p(y)) { return false }
        return end_2(x, y, construction_head, construction_tail)
    } else if (data_p(x)) {
        if (!data_p(y)) { return false }
        if (data_optimized(x) === false) {
            return end_2(x, y, data_name, data_list)
        } else {
            return end_2(y, x, data_name, data_list)
        }
    }
    return LANG_ERROR()
}
function equal_p(x: LangVal, y: LangVal) {
    return equal_p_inner(x, y, [false])
}
