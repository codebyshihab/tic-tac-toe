import React from 'react';
import './DifficultySelector.css';

const DifficultySelector = ({ difficulty, onDifficultyChange }) => {
  const difficultyLevels = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  return (
    <div className="difficulty-selector">
      <label htmlFor="difficulty">Bot Difficulty:</label>
      <div className="select-wrapper">
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          className="difficulty-select"
        >
          {difficultyLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DifficultySelector; 