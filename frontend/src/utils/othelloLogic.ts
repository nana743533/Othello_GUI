type CellValue = -1 | 0 | 1;

/**
 * Directions provided as [row, col] offsets.
 * Up, Down, Left, Right, Diagonals.
 */
const DIRECTIONS = [
  [-1, 0], [1, 0], [0, -1], [0, 1],
  [-1, -1], [-1, 1], [1, -1], [1, 1],
];

/**
 * Checks if a move is valid and returns the indices of stones that would be flipped.
 */
export const getFlippedIndices = (
  board: CellValue[],
  index: number,
  turn: number
): number[] => {
  if (board[index] !== -1) return [];

  const flipped: number[] = [];
  const row = Math.floor(index / 8);
  const col = index % 8;
  const opponent = 1 - turn;

  for (const [dRow, dCol] of DIRECTIONS) {
    const tempFlipped: number[] = [];
    let r = row + dRow;
    let c = col + dCol;

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const idx = r * 8 + c;
      if (board[idx] === opponent) {
        tempFlipped.push(idx);
      } else if (board[idx] === turn) {
        // Found duplicate logic stone, commit the flipped ones
        flipped.push(...tempFlipped);
        break;
      } else {
        // Empty cell or invalid, break
        break;
      }
      r += dRow;
      c += dCol;
    }
  }

  return flipped;
};

/**
 * Checks if the specified player has any valid moves.
 */
export const hasValidMoves = (board: CellValue[], turn: number): boolean => {
  for (let i = 0; i < 64; i++) {
    if (board[i] === -1) {
      if (getFlippedIndices(board, i, turn).length > 0) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Converts board array to string format for API.
 * -1 (Empty) -> '0'
 * 0 (Black) -> '1'
 * 1 (White) -> '2'
 */
export const boardToString = (board: CellValue[]): string => {
  return board.map(cell => {
    if (cell === -1) return '0';
    if (cell === 0) return '1';
    if (cell === 1) return '2';
    return '0';
  }).join('');
};
