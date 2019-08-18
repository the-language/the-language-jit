# TheLanguage JIT

以下為zh_*與en_US的混合物。

多層JIT架構。

TheLanguage JIT -> JS/Lua/PHP -> 一些有bug和JIT的CPU (比如: Intel)

## 方式

`eval`為先transpile再交給底層語言的`eval`。
運行時/前transpile盡量多的代碼，內部部分難以transpile的保留`eval`。

## 自舉

可能可以自舉。自舉結果內的`eval`調用自舉結果本身進行transpile。
