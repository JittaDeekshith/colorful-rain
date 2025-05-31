import React, { useEffect, useState } from 'react';
import './App.css';

const ROWS = 20;
const COLS = 30;
const DROP_HEIGHT = 6;
const DROP_CHANCE = 0.02; // Reduced drop spawn rate

const createEmptyGrid = () => {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
};

function App() {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [drops, setDrops] = useState([]);
  const [colorPhase, setColorPhase] = useState(0);

  // Color phase changes every 2 seconds
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setColorPhase((prev) => (prev + 1) % 6); // 6 color modes
    }, 2000);
    return () => clearInterval(colorInterval);
  }, []);

  // Rain update interval
  useEffect(() => {
    const interval = setInterval(() => {
      setDrops((oldDrops) => {
        let newDrops = [...oldDrops];

        // Add new drops randomly
        for (let col = 0; col < COLS; col++) {
          if (Math.random() < DROP_CHANCE) {
            newDrops.push({ column: col, headRow: 0 });
          }
        }

        // Move drops down
        newDrops = newDrops
          .map((drop) => ({ ...drop, headRow: drop.headRow + 1 }))
          .filter((drop) => drop.headRow - DROP_HEIGHT < ROWS);

        // Generate grid
        const newGrid = createEmptyGrid();
        for (const drop of newDrops) {
          for (let i = 0; i < DROP_HEIGHT; i++) {
            const row = drop.headRow - i;
            if (row >= 0 && row < ROWS) {
              newGrid[row][drop.column] = DROP_HEIGHT - i;
            }
          }
        }

        setGrid(newGrid);
        return newDrops;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => {
            const intensity = cell;
            let color = '#000';

            if (intensity > 0) {
              switch (colorPhase) {
                case 0:
                  color = `rgb(${255 - intensity * 10}, 0, ${255 - intensity * 40})`; // blueish
                  break;
                case 1:
                  color = `rgb(0, ${255 - intensity * 10}, ${255 - intensity * 40})`; // cyan
                  break;
                case 2:
                  color = `rgb(${255 - intensity * 40}, ${255 - intensity * 10}, 0)`; // orange
                  break;
                case 3:
                  color = `rgb(${255 - intensity * 10}, ${255 - intensity * 40}, 255)`; // pink
                  break;
                case 4:
                  color = `rgb(0, 255, ${255 - intensity * 30})`; // green
                  break;
                case 5:
                  color = `rgb(${255 - intensity * 10}, ${255 - intensity * 10}, ${255 - intensity * 10})`; // gray
                  break;
                default:
                  color = '#fff';
              }
            }

            return (
              <div
                key={colIndex}
                className="cell"
                style={{
                  backgroundColor: color,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default App;
