import React, { useState, useEffect } from 'react';

const Squares = ({ 
  speed = 0.5, 
  squareSize = 40, 
  direction = 'diagonal',
  borderColor = '#fff',
  hoverFillColor = '#222'
}) => {
  const [grid, setGrid] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowSize.width === 0 || windowSize.height === 0) return;
    
    const cols = Math.ceil(windowSize.width / squareSize);
    const rows = Math.ceil(windowSize.height / squareSize);
    
    const newGrid = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        newGrid.push({
          id: `${i}-${j}`,
          x: j * squareSize,
          y: i * squareSize,
          delay: direction === 'diagonal' 
            ? (i + j) * (speed / 10) 
            : direction === 'horizontal' 
              ? j * (speed / 10) 
              : i * (speed / 10)
        });
      }
    }
    
    setGrid(newGrid);
  }, [windowSize, squareSize, speed, direction]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg width="100%" height="100%" className="absolute inset-0">
        {grid.map((square) => (
          <rect
            key={square.id}
            x={square.x}
            y={square.y}
            width={squareSize}
            height={squareSize}
            fill="transparent"
            stroke={borderColor}
            strokeOpacity="0.1"
            className="transition-all duration-300 hover:fill-opacity-10"
            style={{
              animationDelay: `${square.delay}s`,
              '--hover-fill': hoverFillColor
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.fill = hoverFillColor;
              e.currentTarget.style.fillOpacity = '0.1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.fill = 'transparent';
              e.currentTarget.style.fillOpacity = '0';
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default Squares; 