import React, { useState } from 'react';
import DifficultySelector from './DifficultySelector';

function Game() {
  const [difficulty, setDifficulty] = useState('medium');

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    console.log('Difficulty changed to:', newDifficulty);
  };

  return (
    <div className="game">
      <DifficultySelector 
        difficulty={difficulty} 
        onDifficultyChange={handleDifficultyChange} 
      />
      <div className="current-difficulty">
        Current difficulty: {difficulty}
      </div>
      {/* Rest of your game component */}
    </div>
  );
}

export default Game; 