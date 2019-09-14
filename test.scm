(define (writeln-and-eval x) (write x) (newline) (eval x))
(test-describe '(complex-print complex-parse)
    (lambda () (for-each
        (lambda (x) (writeln-and-eval `(test-check-equal? (complex-print (complex-parse ,x)) ,x)))
        '("&+式形"
          "[[_:構物]?]?"
          "[[[_:[_:構物]]?]?]@h"
          "#(化滅 (序甲) (序甲 序甲))"
          ":>構物"
          "#(式形 #(化滅 (:映表 參形 :構物) (&+化滅 :>構物 (&+式形 引用:式形 化滅) (&+化滅 :>連頸 參形 (&+化滅 :>連頸 (&+化滅 :>連頸 (&+式形 引用:式形 &+化滅) (&+化滅 :>連頸 (&+式形 引用:式形 解算:化滅) (&+化滅 :>連頸 (&+化滅 :>連頸 (&+式形 引用:式形 &+式形) (&+化滅 :>連頸 (&+式形 引用:式形 引用:式形) (&+化滅 :>連頸 :映表 ()))) (&+化滅 :>連頸 (&+化滅 :>連頸 (&+式形 引用:式形 &+式形) (&+化滅 :>連頸 (&+式形 引用:式形 引用:式形) (&+化滅 :>連頸 :構物 ()))) ())))) ())))))"
          "(&+化滅 :>連頸 (&+式形 引用:式形 &+式形) (&+化滅 :>連頸 (&+式形 引用:式形 引用:式形) (&+化滅 :>連頸 (&+式形 引用:式形 A) ())))"
          "#(化滅 (序甲:化滅) ((&+式形 引用:式形 #(化滅 (吾自:化滅 序甲:化滅) (序甲:化滅 (吾自:化滅 吾自:化滅 序甲:化滅)))) (&+式形 引用:式形 #(化滅 (吾自:化滅 序甲:化滅) (序甲:化滅 (吾自:化滅 吾自:化滅 序甲:化滅)))) 序甲:化滅))"
          ";(#(序乙) 序甲)"
          "a/b/c/d"
          "a/b"
          "a/[_:b]/[c/d]"))))
(test-describe '(simple-print complex-parse)
    (lambda () (for-each
        (lambda (x) (writeln-and-eval `(test-check-equal? (simple-print (complex-parse ,x)) ,x)))
        '("(A B)"
          "#(#(A B) . C)"
          "((A) . #(B C C))"
          "(k 0 9 8 . o)"
          "(() ((((())))) . k)"
          ";(#(序乙) 序甲)"
          "()"
          "(() ())"
          "(h K)"
          "#(h . a)"
          "#(s . #(a . #(i)))"))))
(test-describe '(simple-print complex-parse complex-print)
    (lambda () (for-each
        (lambda (x)
            (let ((in (car x)) (out (cadr x)))
                (writeln-and-eval `(test-check-equal? (simple-print (complex-parse ,in)) ,out))
                (writeln-and-eval `(test-check-equal? (complex-print (complex-parse ,out)) ,in))))
        '(("構物.符名" "#(符名 太始初核 (一類何物 (化滅 (構物) 省略一物) 符名))")
          ("&式形" "#(符名 太始初核 (式形 式形))")
          ("解算:化滅" "#(符名 太始初核 (一類何物 化滅 解算))")
          ("&+式形" "#(符名 太始初核 (式形 (太始初核 式形)))")
          ("[_:構物]?" "#(符名 太始初核 (一類何物 化滅 (是非 (一類何物 構物 省略一物))))")
          ("等同?" "#(符名 太始初核 (一類何物 化滅 (是非 等同)))")
          ("化滅@應用" "#(符名 太始初核 (一類何物 (化滅 (化滅 . 省略一物) 省略一物) 應用))")
          (":&>化滅" "#(符名 太始初核 (一類何物 (式形 (化滅 省略一物 化滅)) 特定其物))")
          ("列序.[_:構物]" "#(符名 太始初核 (一類何物 (化滅 (列序) 省略一物) (一類何物 構物 省略一物)))")))))
(test-describe '(complex-print complex-parse machinetext-parse machinetext-print)
    (lambda () (for-each
        (lambda (x) (writeln-and-eval `(test-check-equal? (complex-print (machinetext-parse (machinetext-print (complex-parse ,x)))) ,x)))
        '("構物.符名"
          "()"
          "(a b)"
          "(a b . #(c d #(e)))"))))
(test-describe '(machinetext-print machinetext-parse)
    (lambda () (for-each
        (lambda (x) (writeln-and-eval `(test-check-equal? (machinetext-print (machinetext-parse ,x)) ,x)))
        '("_"
          "#^符名^.^太始初核^.._^一類何物^...^化滅^.._..^一類何物^.^列序^_^省略一物^_^構物^.^省略一物^_"))))
(test-describe '(evaluate-with-environment force-all-rec-ignore-comment)
    (lambda () (for-each
        (lambda (x) (writeln-and-eval `(test-check-equal? (force-all-rec-ignore-comment (evaluate-with-environment environment-null-v ,(car x))) ,(cadr x))))
        '((null-v null-v)))))
