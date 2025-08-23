import React, { useState } from 'react';
import GooeyIntro from './GooeyIntro';

const GooeyIntroDemo = () => {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = () => {
    setIntroComplete(true);
    console.log('Gooey intro completed!');
  };

  const PortfolioContent = () => (
    <div id="portfolio" style={{ 
      padding: '4rem', 
      background: '#fff', 
      minHeight: '100vh',
      opacity: introComplete ? 1 : 0,
      transition: 'opacity 1s ease'
    }}>
      <header className="main-header">
        <h1>Welcome to Satvik's Portfolio</h1>
      </header>
      <section>
        <p>✨ Projects, skills, and contact details will appear here.</p>
        <p>🎉 The gooey intro has completed and normal scrolling is now enabled!</p>
      </section>
    </div>
  );

  return (
    <GooeyIntro onIntroComplete={handleIntroComplete}>
      <PortfolioContent />
    </GooeyIntro>
  );
};

export default GooeyIntroDemo;
