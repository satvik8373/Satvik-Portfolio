import React, { useEffect } from 'react';
import { useGSAP, fadeIn, staggerFadeIn, hoverScale } from '../utils';

const GSAPDemo = () => {
  const { elementRef, fadeIn: hookFadeIn, addHoverScale } = useGSAP();

  useEffect(() => {
    // Example of using the hook
    hookFadeIn(1, 0.5);
    
    // Example of using utility functions
    const elements = document.querySelectorAll('.demo-item');
    staggerFadeIn(elements, 0.2, 0.8);
    
    // Add hover effects
    const hoverElements = document.querySelectorAll('.hover-demo');
    hoverElements.forEach(el => hoverScale(el, 1.1, 0.3));
  }, [hookFadeIn]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">GSAP Demo</h1>
      
      {/* Hook-based animation */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Hook-based Animation</h2>
        <div 
          ref={elementRef}
          className="bg-blue-500 text-white p-6 rounded-lg text-center text-xl"
        >
          This element uses the useGSAP hook!
        </div>
      </div>

      {/* Stagger animation demo */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Stagger Animation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="demo-item bg-green-500 text-white p-4 rounded-lg text-center">
            Item 1
          </div>
          <div className="demo-item bg-green-500 text-white p-4 rounded-lg text-center">
            Item 2
          </div>
          <div className="demo-item bg-green-500 text-white p-4 rounded-lg text-center">
            Item 3
          </div>
        </div>
      </div>

      {/* Hover effects demo */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Hover Effects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="hover-demo bg-purple-500 text-white p-6 rounded-lg text-center cursor-pointer">
            Hover me! (Scale)
          </div>
          <div className="hover-demo bg-orange-500 text-white p-6 rounded-lg text-center cursor-pointer">
            Hover me! (Scale)
          </div>
        </div>
      </div>

      {/* Utility functions demo */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Utility Functions</h2>
        <div className="space-y-4">
          <button 
            onClick={() => {
              const element = document.querySelector('.utility-demo');
              fadeIn(element, 0.8, 0);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Trigger Fade In
          </button>
          <div className="utility-demo bg-gray-300 p-6 rounded-lg text-center opacity-0">
            This element will fade in when you click the button above
          </div>
        </div>
      </div>

      {/* Animation controls demo */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Animation Controls</h2>
        <div className="bg-yellow-500 text-white p-6 rounded-lg text-center mb-4">
          <p>Use the buttons below to control this animation</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => {
              const element = document.querySelector('.control-demo');
              gsap.to(element, { 
                x: 100, 
                rotation: 360, 
                duration: 2,
                ease: "power2.out"
              });
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Play
          </button>
          <button 
            onClick={() => {
              const element = document.querySelector('.control-demo');
              gsap.to(element, { x: 0, rotation: 0, duration: 0.5 });
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Reset
          </button>
        </div>
        <div className="control-demo bg-yellow-500 text-white p-6 rounded-lg text-center mt-4">
          Control me!
        </div>
      </div>
    </div>
  );
};

export default GSAPDemo;
