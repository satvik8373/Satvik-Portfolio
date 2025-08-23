// src/AnimatedBackground.jsx
import React from 'react';
import Squares from './Squares';

const AnimatedBackground = () => {
  return (
    <>
      {/* Animated Grid */}
      <div className="fixed inset-0 -z-20">
        <Squares 
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="#fff"
          hoverFillColor="#222"
        />
      </div>

      {/* Blurred Background Blobs */}
      <div
        className="absolute top-40 -left-64 w-96 h-96 rounded-full blur-[100px] -z-10 theme-transition"
        style={{ backgroundColor: 'rgba(var(--color-accent-purple), 0.1)' }}
      />
      <div
        className="absolute top-[30%] -right-64 w-96 h-96 rounded-full blur-[100px] -z-10 theme-transition"
        style={{ backgroundColor: 'rgba(var(--color-accent-orange), 0.1)' }}
      />
      <div
        className="absolute bottom-40 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[100px] -z-10 theme-transition"
        style={{ backgroundColor: 'rgba(var(--color-accent-blue), 0.1)' }}
      />
    </>
  );
};

export default AnimatedBackground;
