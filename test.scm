;;
(test-describe 'simple-print
    (lambda () (for-each
        (lambda (x)
            (display `(test-check-equal? (simple-print (complex-parse ,x)) ,x))
            (newline)
            (test-check-equal? (simple-print (complex-parse x)) x))
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
