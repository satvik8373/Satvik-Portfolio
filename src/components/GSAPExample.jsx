import React, { useEffect } from 'react';
import { useGSAP, fadeIn, staggerFadeIn } from '../utils';

const GSAPExample = () => {
  const { elementRef, fadeIn: hookFadeIn } = useGSAP();

  useEffect(() => {
    // Example 1: Using the hook
    hookFadeIn(1, 0.5);
    
    // Example 2: Using utility functions
    const cards = document.querySelectorAll('.skill-card');
    staggerFadeIn(cards, 0.2, 0.8);
  }, [hookFadeIn]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">GSAP Integration Example</h1>
      
      {/* Hook-based animation */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Hook-based Animation</h2>
        <div 
          ref={elementRef}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg text-center"
        >
          <h3 className="text-xl font-semibold mb-2">Welcome to GSAP!</h3>
          <p>This element animates using the useGSAP hook</p>
        </div>
      </div>

      {/* Stagger animation */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Stagger Animation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="skill-card bg-green-500 text-white p-4 rounded-lg text-center">
            <h4 className="font-semibold">React</h4>
            <p className="text-sm">Frontend Development</p>
          </div>
          <div className="skill-card bg-blue-500 text-white p-4 rounded-lg text-center">
            <h4 className="font-semibold">Node.js</h4>
            <p className="text-sm">Backend Development</p>
          </div>
          <div className="skill-card bg-purple-500 text-white p-4 rounded-lg text-center">
            <h4 className="font-semibold">MongoDB</h4>
            <p className="text-sm">Database</p>
          </div>
        </div>
      </div>

      {/* Direct GSAP usage */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Direct GSAP Usage</h2>
        <button 
          onClick={() => {
            const element = document.querySelector('.direct-gsap-demo');
            gsap.to(element, { 
              x: 100, 
              rotation: 360, 
              duration: 1,
              ease: "power2.out"
            });
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-4"
        >
          Animate with GSAP
        </button>
        <div className="direct-gsap-demo bg-yellow-500 text-black p-4 rounded-lg text-center">
          Click the button to animate me!
        </div>
      </div>
    </div>
  );
};

export default GSAPExample;
