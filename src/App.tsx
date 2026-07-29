import React, { useState } from 'react';
import Setup from './components/Setup';
import Presentation from './components/Presentation';
import { Quiz, ScreenType } from './types';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('setup');
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const handleQuizGenerated = (newQuiz: Quiz) => {
    setQuiz(newQuiz);
    setScreen('presentation');
  };

  const handleExit = () => {
    setScreen('setup');
    setQuiz(null);
  };

  return (
    <>
      {screen === 'setup' && <Setup onQuizGenerated={handleQuizGenerated} />}
      {screen === 'presentation' && quiz && <Presentation quiz={quiz} onExit={handleExit} />}
    </>
  );
}
