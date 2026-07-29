const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');
content = content.replace(
  /const handleGenerate = async \(e: React.FormEvent\) => \{[\s\S]*?finally \{\s*setLoading\(false\);\s*\}\s*\};/,
`const handleGenerate = async (e: React.FormEvent, mode: 'video' | 'interactive' = 'video') => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    // Prime speech synthesis on user click
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
    }
    
    audioSynth.setVoicePreference(voicePreference);
    audioSynth.setMusicPreference(musicEnabled);
    
    if (cachedQuiz && quizType === 'identify-image') {
      const q = { ...cachedQuiz, mode };
      if (mode === 'interactive') {
        setPendingInteractiveQuiz(q);
      } else {
        onQuizGenerated(q);
      }
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, numQuestions: quizType === 'mega-quiz' ? 100 : numQuestions, difficulty, quizType }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }
      
      data.mode = mode;
      
      if (mode === 'interactive') {
        setPendingInteractiveQuiz(data);
      } else {
        onQuizGenerated(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };`
);
fs.writeFileSync('src/components/Setup.tsx', content);
