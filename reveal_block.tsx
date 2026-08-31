    if (stage === 'reveal') {
      audioSynth.stopBackgroundMusic();
      if (!(quiz.mode === 'interactive' && interactiveOptionClicked !== null)) {
        audioSynth.playCorrect();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#facc15', '#f43f5e', '#a855f7', '#34d399']
        });
      }
      
      let speechText = `The correct answer is ${question.correctAnswer}.`;
      if (currentType === 'detective') {
        speechText = `The fake fact is fact number ${question.fakeSentenceIndex! + 1}. ${question.insight}`;
      } else if (currentType === 'match-the-following') {
        speechText = `Here are the correct matches! ` + (question.pairs?.map(p => `${p.left} matches with ${p.right}`).join('. ') || '');
      } else if (quiz.type === 'combat-mode') {
        speechText = ``;
      } else if (currentType === 'word-search') {
        speechText = `The hidden words are ${question.wordsToFind?.join(', ')}.`;
      } else if (question.insight) {
        speechText = `The correct answer is ${question.correctAnswer}. ${question.insight}`;
      }

      if (isInteractiveTimeout && speechText) {
        speechText = `Time's up! ` + speechText;
      }
      
      let t: NodeJS.Timeout;
      const onSpeakEnd = () => {
        t = setTimeout(() => {
          audioSynth.playSwoosh();
          // Go to next question, or quote if it's the end
          const isInteractiveGrid = quiz.mode === 'interactive' && quiz.type !== 'combat-mode' && quiz.type !== 'rapid-fire' && (quiz.isMultiplayer && (quiz.players?.length || 1) > 1);
          let numAnswered = 0;
          let willComplete = false;
          
          if (isInteractiveGrid) {
            numAnswered = answeredQuestions.size + (answeredQuestions.has(currentQuestionIndex) ? 0 : 1);
            willComplete = numAnswered >= quiz.questions.length;
            setAnsweredQuestions(prev => {
              const next = new Set(prev);
              next.add(currentQuestionIndex);
              return next;
            });
            setCurrentPlayerIndex(p => (p + 1) % (quiz.players?.length || 1));
          } else {
            numAnswered = currentQuestionIndex + 1;
            willComplete = (currentType as string) === 'rapid-fire' ? false : (numAnswered >= quiz.questions.length);
            if (quiz.isMultiplayer && quiz.mode === 'interactive' && quiz.type !== 'rapid-fire') {
              setCurrentPlayerIndex(p => (p + 1) % (quiz.players?.length || 1));
            }
          }
          
          if (willComplete) {
            setStage('score');
          } else {
            const totalQ = quiz.questions.length || 1;
            const maxBadges = Math.min(4, Math.max(1, Math.ceil(totalQ / 5)));
            const badgeInterval = Math.max(5, Math.ceil(totalQ / maxBadges));

            if (quiz.showBadges !== false && quiz.type !== 'rapid-fire' && numAnswered > 0 && numAnswered % badgeInterval === 0 && numAnswered < totalQ) {
              setStage('video-badges');
            } else {
              if (quiz.enableMemoryBreak && !hasPlayedMemoryBreak && quiz.questions.length > 2 && numAnswered >= Math.floor(quiz.questions.length / 2)) {
                 setHasPlayedMemoryBreak(true);
                 const emojis = ['🍎','🚗','🐶','🚀','🎸','🏀','🍔','🚲','📚','⌚','🧸','🌻','🎈','📷','🧩','🍉','🛸','🐱','🎷','🏈'];
                 const shuffled = emojis.sort(() => 0.5 - Math.random()).slice(0, 10);
                 setMemoryItems(shuffled);
                 setMemoryTarget(shuffled[Math.floor(Math.random() * shuffled.length)]);
                 setStage('memory-break-intro');
              } else { if (isInteractiveGrid) {
                if (categories.length > 1) {
                  const categoryQuestions = quiz.questions.map((q, i) => ({q, i})).filter(x => x.q.category === selectedCategory);
                  if (categoryQuestions.length > 0 && categoryQuestions.every(x => answeredQuestions.has(x.i) || x.i === currentQuestionIndex)) {
                    setStage(quiz.questions.some(q => q.rapidFireSet && q.category === selectedCategory) ? 'rapid-fire-set-selection' : 'category-selection'); rapidFirePlayerIdxRef.current = null;
                  } else {
                    setStage('question-selection');
                  }
                } else {
                  setStage('question-selection');
                }
              } else {
                setCurrentQuestionIndex((prev) => prev + 1);
                if ((currentType as string) === 'rapid-fire') {
                    const nextQ = quiz.questions[currentQuestionIndex + 1];
                    if (!nextQ || (nextQ.rapidFireSet ? nextQ.rapidFireSet !== selectedRapidFireSet : nextQ.category !== selectedCategory)) {
                      setAnsweredQuestions(prevAns => {
                         const next = new Set(prevAns);
                         quiz.questions.forEach((q, i) => {
                             if (q.rapidFireSet ? q.rapidFireSet === selectedRapidFireSet : q.category === selectedCategory) next.add(i);
                         });
                         return next;
                      });
                      setStage('rapid-fire-score');
                      return;
                    }
                  }
                  setStage('question');
                }
              }
            }
          }
        }, (currentType as string) === 'rapid-fire' ? 200 : (question.imageUrl ? 5000 : 2000));
      };

      if (quiz.mode === 'interactive' && interactiveOptionClicked !== null) {
        onSpeakEnd();
      } else {
        if (speechText) {
          audioSynth.speak(speechText, onSpeakEnd);
        } else {
          onSpeakEnd();
        }
      }
      return () => {
        if (t) clearTimeout(t);
