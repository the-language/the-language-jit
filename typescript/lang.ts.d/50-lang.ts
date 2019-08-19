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

const compiled_global_environment:Array<any> = []
function compiled_global_environment_add(x:any):number{
    const id=compiled_global_environment.length
    compiled_global_environment.push(x)
    return id
}
const compiled_global_environment__null_v=compiled_global_environment_add(null_v)

function real_compile_with_environment(env: Env, raw_input: LangVal): ThisLang {
    const x__comments=force_all(raw_input)
    const x=x__comments[0]
    const comments=x__comments[1]
    throw 'WIP'
}
