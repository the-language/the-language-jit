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

// {{{ 相對獨立的部分。內建數據結構
const enum LangValType {
    atom_t,
    construction_t,
    null_t,
    data_t,

    just_t,

    delay_t,

    hole_t,

    comment_t,
}
const atom_t = LangValType.atom_t
const construction_t = LangValType.construction_t
const null_t = LangValType.null_t
const data_t = LangValType.data_t
const just_t = LangValType.just_t
const delay_t = LangValType.delay_t
type delay_t = LangValType.delay_t

// 以下爲對TypeScript類型系統的hack，因爲不支援遞回的`type`

type LangValAtomG<a extends string> = [LangValType.atom_t, a, false, false]
export type LangValAtom = LangValAtomG<string>

type LangValConsG<a extends LangVal, b extends LangVal> = [LangValType.construction_t, a, b, false]
interface LangValConsI extends LangValConsG<LangVal, LangVal> { }
export type LangValCons = LangValConsI & LangValConsG<LangValRecHack, LangValRecHack>

export type LangValNull = [LangValType.null_t, false, false, false]

type LangValDataG<a extends LangVal, b extends LangVal> = [LangValType.data_t, a, b, OrFalse<LangValDataOptimized>]
interface LangValDataI extends LangValDataG<LangVal, LangVal> { }
export type LangValData = LangValDataI & LangValDataG<LangValRecHack, LangValRecHack>

const enum LangValDataOptimizedType {
    closure_t,
}
export type LangValDataOptimizedClosure = [LangValDataOptimizedType.closure_t, (args: Array<LangVal>) => LangVal]
export type LangValDataOptimized = LangValDataOptimizedClosure

type LangValJustG<a extends LangVal> = [LangValType.just_t, a, false, false]
interface LangValJustI extends LangValJustG<LangVal> { }
export type LangValJust = LangValJustI & LangValJustG<LangValRecHack>

// exporter 为不计算，用于显示。
// dependency 为依赖的Delay
// exec 为计算
type LangValDelayG<exporter extends () => [Env, LangVal], dependency extends OrFalse<LangValDelay>, exec extends () => LangVal> = [delay_t, exporter, dependency, exec]
interface LangValDelayI extends LangValDelayG<() => [Env, LangVal], OrFalse<LangValDelay>, () => LangVal> { }
export type LangValDelay = LangValDelayI & LangValDelayG<() => [Env, LangVal], OrFalse<any>, () => LangVal>

export type LangValJustDelay = LangValJust | LangValDelay

const comment_t = LangValType.comment_t
type LangValCommentG<a extends LangVal, b extends LangVal> = [LangValType.comment_t, a, b, false]
interface LangValCommentI extends LangValCommentG<LangVal, LangVal> { }
export type LangValComment = LangValCommentI & LangValCommentG<LangValRecHack, LangValRecHack>

const hole_t = LangValType.hole_t
export type LangValHole = [LangValType.hole_t, false, false, false]

type LangValRecHack = [any, any, any, any]
export type LangVal = LangValRecHack & (LangValAtom | LangValCons | LangValNull | LangValData | LangValJust | LangValDelay | LangValComment | LangValHole)

function new_comment<C extends LangVal, X extends LangVal>(comment: C, x: X): LangValCommentG<C, X> {
    return [comment_t, comment, x, false]
}
function comment_p(x: LangVal): x is LangValComment {
    return x[0] === comment_t
}
function comment_comment<C extends LangVal, X extends LangVal>(x: LangValCommentG<C, X>): C {
    return x[1]
}
function comment_x<C extends LangVal, X extends LangVal>(x: LangValCommentG<C, X>): X {
    return x[2]
}
function un_comment_all(x: LangVal): LangVal {
    while (comment_p(x)) {
        x = comment_x(x)
    }
    return x
}
export { new_comment, comment_p, comment_comment, comment_x, un_comment_all }

function atom_p(x: LangVal): x is LangValAtom {
    return x[0] === atom_t
}
type New_Atom<X extends string> = LangValAtomG<X>
function new_atom<X extends string>(x: X): New_Atom<X> {
    return [atom_t, x, false, false]
}
function un_atom<X extends string>(x: New_Atom<X>): X {
    return x[1]
}
function atom_equal_p(x: LangValAtom, y: LangValAtom): boolean {
    if (x === y) {
        return true
    }
    if (un_atom(x) === un_atom(y)) {
        unsafe__lang_assert_equal_set_do(x, y)
        return true
    } else {
        return false
    }
}
export { new_atom, atom_p, un_atom, atom_equal_p }

type New_Construction<X extends LangVal, Y extends LangVal> = LangValConsG<X, Y>
function new_construction<X extends LangVal, Y extends LangVal>(x: X, y: Y): New_Construction<X, Y> {
    return [construction_t, x, y, false]
}
function construction_p(x: LangVal): x is LangValCons {
    return x[0] === construction_t
}
function construction_head<X extends LangVal, Y extends LangVal>(x: LangValConsG<X, Y>): X {
    return x[1]
}
function construction_tail<X extends LangVal, Y extends LangVal>(x: LangValConsG<X, Y>): Y {
    return x[2]
}
export { new_construction, construction_p, construction_head, construction_tail }

type Null_V = LangValNull
const null_v: Null_V = [null_t, false, false, false]
function null_p(x: LangVal): x is LangValNull {
    return x[0] === null_t
}
export { null_v, null_p }

type New_Data<X extends LangVal, Y extends LangVal> = LangValDataG<X, Y>
function new_data<X extends LangVal, Y extends LangVal>(x: X, y: Y): New_Data<X, Y> {
    return [data_t, x, y, false]
}
function new_data_optimized<X extends LangVal, Y extends LangVal>(x: X, y: Y, o: OrFalse<LangValDataOptimized>): New_Data<X, Y> {
    return [data_t, x, y, o]
}
function new_data_optimized_closure<X extends LangVal>(x: X, f: (args: Array<LangVal>) => LangVal): New_Data<Function_Atom, X> {
    return new_data_optimized(function_atom, x, [LangValDataOptimizedType.closure_t, f])
}
function data_p(x: LangVal): x is LangValData {
    return x[0] === data_t
}
function data_name<X extends LangVal, Y extends LangVal>(x: LangValDataG<X, Y>): X {
    return x[1]
}
function data_list<X extends LangVal, Y extends LangVal>(x: LangValDataG<X, Y>): Y {
    return x[2]
}
function data_optimized(x: LangValData): OrFalse<LangValDataOptimized> {
    return x[3]
}
export { new_data, data_p, data_name, data_list }

function just_p(x: LangVal): x is LangValJust {
    return x[0] === just_t
}
function un_just(x: LangValJust): LangVal {
    return x[1]
}
export { just_p, un_just }

function delay_p(x: LangVal): x is LangValDelay {
    return x[0] === delay_t
}
function new_delay(exporter: () => [Env, LangVal], dependency: OrFalse<LangValDelay>, exec: () => LangVal): LangValDelay {
    return [delay_t, exporter, dependency, exec]
}
function delay_exec_1(x: LangValDelay): LangVal {
    if (x[2] !== false) {
        const wait = un_just_all(delay_exec_1(x[2]))
        if (delay_p(wait)) {
            x[2] = wait
            return x
        } else {
            x[2] = false
        }
    }
    const r = x[3]()
    unsafe__lang_assert_equal_set_do(x, r)
    return r
}
function delay_export(x: LangValDelay): [Env, LangVal] {
    const r = x[1]()
    x[1] = () => r
    return r
}
export { delay_p, new_delay, delay_exec_1, delay_export }

function new_hole_do(): LangValHole {
    return [hole_t, false, false, false]
}
function hole_p(x: LangVal): x is LangValHole {
    return x[0] === hole_t
}
function unsafe__lang_assert_equal_set_do(x: LangVal, y: LangVal): void {
    // 当y是just或delay且x和y相等时，会出现问题。所以unsafe。
    // 只用于x与y等价的情况，且一般情況下要求y比x簡單。
    if (x === null_v) {
        x = y
        y = null_v
    }
    if (x === y) {
        return
    }
    x[0] = just_t
    x[1] = y
    x[2] = false
    x[3] = false
}
function hole_set_do(rawx: LangValHole, rawy: LangVal): void {
    LANG_ASSERT(hole_p(rawx)) // 可能曾经是hole，现在不是。
    LANG_ASSERT(!hole_p(rawy)) // 複製hole則意義改變。
    const x: [LangValType, any, any, any] = rawx
    const y: [LangValType, any, any, any] = rawy
    x[0] = y[0]
    x[1] = y[1]
    x[2] = y[2]
    x[3] = y[3]
}
function lang_copy_do<T extends LangVal>(x: T): T {
    const ret = new_hole_do()
    hole_set_do(ret, x)
    return ret as any // type WIP
}
// 相對獨立的部分。內建數據結構 }}}
