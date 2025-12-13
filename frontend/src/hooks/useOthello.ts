import { useState, useCallback } from 'react';
import { gameApi } from '../utils/gameApi';
import { getFlippedIndices, boardToString, hasValidMoves } from '../utils/othelloLogic';

type CellValue = -1 | 0 | 1;
// 0: Black (First), 1: White
type Turn = 0 | 1;

export const useOthello = () => {
  // Initial Board Setup: center 4 stones
  const initialBoard = Array(64).fill(-1);
  initialBoard[27] = 1;
  initialBoard[28] = 0;
  initialBoard[35] = 0;
  initialBoard[36] = 1;

  const [board, setBoard] = useState<CellValue[]>(initialBoard);
  const [turn, setTurn] = useState<Turn>(0); // Black starts
  const [isProcessing, setIsProcessing] = useState(false);
  const [winner, setWinner] = useState<Turn | 'Draw' | null>(null);

  const checkGameEnd = useCallback((currentBoard: CellValue[]) => {
    const blackCanMove = hasValidMoves(currentBoard, 0);
    const whiteCanMove = hasValidMoves(currentBoard, 1);

    if (!blackCanMove && !whiteCanMove) {
      const blackCount = currentBoard.filter(c => c === 0).length;
      const whiteCount = currentBoard.filter(c => c === 1).length;
      if (blackCount > whiteCount) setWinner(0);
      else if (whiteCount > blackCount) setWinner(1);
      else setWinner('Draw');
      return true;
    }
    return false;
  }, []);

  const executeMove = useCallback(async (index: number) => {
    // 1. Validation & Flipping (Client Side)
    const flippedIndices = getFlippedIndices(board, index, turn);
    if (flippedIndices.length === 0) {
      // Invalid move
      return;
    }

    // 2. Update Board (Player's Move)
    const newBoard = [...board];
    newBoard[index] = turn;
    flippedIndices.forEach(idx => {
      newBoard[idx] = turn;
    });
    setBoard(newBoard);

    const nextTurn = (1 - turn) as Turn;
    setTurn(nextTurn); // Temporarily switch turn (or actually switch)

    // Check game end before AI move?
    if (checkGameEnd(newBoard)) return;

    // 3. AI Turn (if it's White's turn and AI is White)
    // For now, assuming Player is Black (0) and AI is White (1)
    if (nextTurn === 1) {
      setIsProcessing(true);
      try {
        const boardString = boardToString(newBoard);
        const aiMoveIndex = await gameApi.fetchNextMove(boardString, nextTurn);

        // AI Logic: Wait a bit for UX?
        // await new Promise(r => setTimeout(r, 500)); 

        const aiFlipped = getFlippedIndices(newBoard, aiMoveIndex, nextTurn);
        if (aiFlipped.length > 0 || newBoard[aiMoveIndex] === -1) { // Basic sanity check
          newBoard[aiMoveIndex] = nextTurn;
          aiFlipped.forEach(idx => {
            newBoard[idx] = nextTurn;
          });
          setBoard([...newBoard]); // Trigger update
          setTurn(0); // Back to Black
          checkGameEnd(newBoard);
        }
      } catch (error) {
        console.error("AI Error:", error);
        // Handle error (skip turn? alert?)
      } finally {
        setIsProcessing(false);
      }
    }
  }, [board, turn, checkGameEnd]); // Added dependencies

  // Helper to skip turn if no moves
  // This logic is simplified; real Othello rules require passing if no moves but game not over.
  // For MVP, we'll implement pass logic later or let checkGameEnd handle valid moves checks.

  return {
    board,
    turn,
    isProcessing,
    winner,
    executeMove,
    resetGame: () => {
      setBoard(initialBoard);
      setTurn(0);
      setWinner(null);
    }
  };
};
