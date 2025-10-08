import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 50;
const CELL_SIZE = 10;

const createEmptyGrid = () => {
  return Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
};

const createRandomGrid = () => {
  return Array(GRID_SIZE).fill().map(() =>
    Array(GRID_SIZE).fill().map(() => Math.random() > 0.7)
  );
};

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const countNeighbors = (grid, i, j) => {
  let count = 0;
  operations.forEach(([x, y]) => {
    const newI = i + x;
    const newJ = j + y;
    if (newI >= 0 && newI < GRID_SIZE && newJ >= 0 && newJ < GRID_SIZE) {
      count += grid[newI][newJ] ? 1 : 0;
    }
  });
  return count;
};

const generateNextGrid = (grid) => {
  const newGrid = grid.map(arr => [...arr]);
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const neighbors = countNeighbors(grid, i, j);
      if (grid[i][j]) {
        if (neighbors < 2 || neighbors > 3) {
          newGrid[i][j] = false;
        }
      } else {
        if (neighbors === 3) {
          newGrid[i][j] = true;
        }
      }
    }
  }
  return newGrid;
};

export default function Home() {
  const [grid, setGrid] = useState(createEmptyGrid);
  const [running, setRunning] = useState(false);

  const runSimulation = useCallback(() => {
    if (!running) return;
    setGrid(currentGrid => generateNextGrid(currentGrid));
  }, [running]);

  useEffect(() => {
    const interval = setInterval(runSimulation, 100);
    return () => clearInterval(interval);
  }, [runSimulation]);

  const toggleCell = (i, j) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => (rowIndex === i && colIndex === j ? !cell : cell))
    );
    setGrid(newGrid);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1>Conway's Game of Life</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setRunning(!running)}>
          {running ? 'Stop' : 'Start'}
        </button>
        <button onClick={() => setGrid(createRandomGrid())}>
          Random
        </button>
        <button onClick={() => setGrid(createEmptyGrid())}>
          Clear
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gap: '1px',
          border: '1px solid #ccc',
          backgroundColor: '#f0f0f0',
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => toggleCell(i, j)}
              style={{
                width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`,
                backgroundColor: cell ? '#000' : '#fff',
                border: '1px solid #ddd',
                cursor: 'pointer',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}