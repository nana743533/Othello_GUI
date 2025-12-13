#include <iostream>
#include <stdio.h>
#include "board.hpp"
#include "cell_evaluate.hpp"

#define inf 1000000000


// negaalpha法
int nega_alpha(board b, int depth, bool passed, int alpha, int beta) {
    // 葉ノードでは評価関数を実行する
    if (depth == 0)
        return evaluate(b);
    // 葉ノードでなければ子ノード全部に対して再帰する
    int coord, g, max_score = -inf;
    for (coord = 0; coord < hw2; ++coord) {
        if (b.legal_place(coord)) {
            g = -nega_alpha(b.move(coord), depth - 1, false, -beta, -alpha);
            if (g >= beta) // 興味の範囲よりもminimax値が上のときは枝刈り
                return g;
            alpha = max(alpha, g);
            max_score = max(max_score, g);
        }
    }
    // パスの処理 手番を交代して同じ深さで再帰する
    if (max_score == -inf) {
        // 2回連続パスなら評価関数を実行
        if (passed)
            return evaluate(b);
        b.player = 1 - b.player;
        return -nega_alpha(b, depth, true, -beta, -alpha);
    }
    return max_score;
}

// depth手読みの探索
int search(board b, int depth) {
    int coord, res = -1, score, alpha = -inf, beta = inf;
    for (coord = 0; coord < hw2; ++coord) {
        if (b.legal_place(coord)) {
            score = -nega_alpha(b.move(coord), depth, false, -beta, -alpha);
            if (alpha < score) {
                alpha = score;
                res = coord;
            }
        }
    }
    return res;
}

