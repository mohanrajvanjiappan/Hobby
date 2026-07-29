import confetti from 'canvas-confetti';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Quiz } from '../types';
import { audioSynth } from '../lib/audio';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Clock, Brain, Rocket, Sparkles, Lightbulb, Cat, Dumbbell, Bot, Computer, Dog, GraduationCap, Play, Pause, Camera, ThumbsUp, Bell, Youtube, Share2, Download, FileJson } from 'lucide-react';
import quizLogo from '../assets/images/quiz_logo_1783447286811.jpg';
import MapQuestion from './MapQuestion';

interface PresentationProps {
  quiz: Quiz;
  onExit: () => void;
}

type Stage = 'intro' | 'multiplayer-intro' | 'warmup' | 'countdown' | 'category-selection' | 'question-selection' | 'question' | 'reveal' | 'quote' | 'score' | 'badges' | 'talk' | 'outro' | 'video-badges';

const OUTRO_MESSAGES = [
  {
    title: "Great Job!",
    subtitle: "How many did you score?",
    footer: "Let us know in the comments! Thanks for participating!",
    speech: "Great job! How many questions did you get right? Let us know in the comments below! Thank you for participating, you did amazing! Don't forget to like and subscribe!"
  },
  {
    title: "Awesome Work!",
    subtitle: "Did you beat the clock?",
    footer: "Share your score below! See you next time!",
    speech: "Awesome work! Did you beat the clock? Share your score below! Thank you for watching, we hope to see you next time. Don't forget to like and subscribe!"
  },
  {
    title: "Fantastic!",
    subtitle: "Are you a trivia master?",
    footer: "Drop your results in the comments! Stay curious!",
    speech: "Fantastic! Are you a trivia master? Drop your results in the comments! Thank you so much for playing, stay curious! Please like and subscribe!"
  },
  {
    title: "Well Done!",
    subtitle: "That was a brain workout!",
    footer: "Comment your score! Thanks for playing!",
    speech: "Well done! That was a real brain workout! Please comment your score! Thank you for playing, we appreciate it. Be sure to like and subscribe!"
  },
  {
    title: "You Rock!",
    subtitle: "Hope you learned something new!",
    footer: "Tell us how you did! Catch you in the next one!",
    speech: "You rock! We hope you learned something new today. Tell us how you did in the comments! Thank you for tuning in, catch you in the next one! Like and subscribe!"
  }
];

const feelingEmojis: Record<string, string> = {
  'Curious': '🤔',
  'Scared': '😨',
  'Excited': '🤩',
  'Happy': '😊',
  'Bored': '🥱',
  'Nervous': '😬',
  'Silly': '🤪',
  'Sleepy': '😴',
  'Confused': '😕',
  'Energetic': '⚡',
  'Proud': '🦚',
  'Calm': '🧘',
  'Hungry': '🍔',
  'Ready to Win': '🏆',
  'Super Smart': '🧠'
};

interface ParticipantVideoFramesProps {
  quiz: Quiz;
  playersState: any[];
  currentPlayerIndex: number;
}

const ParticipantVideoFrames: React.FC<ParticipantVideoFramesProps> = ({
  quiz,
  playersState,
  currentPlayerIndex,
}) => {
  const [activeCameras, setActiveCameras] = useState<{ [id: string]: boolean }>({});
  const [streams, setStreams] = useState<{ [id: string]: MediaStream }>({});
  const videoRefs = useRef<{ [id: string]: HTMLVideoElement | null }>({});

  const players = useMemo(() => {
    if (playersState && playersState.length > 0) {
      return playersState.slice(0, 3);
    }
    return [
      {
        id: 'p1',
        name: quiz.teamName || 'Player 1',
        photo: quiz.playerPhoto || '',
        score: 0,
      },
    ];
  }, [playersState, quiz.teamName, quiz.playerPhoto]);

  const toggleCamera = async (id: string) => {
    if (activeCameras[id]) {
      if (streams[id]) {
        streams[id].getTracks().forEach((track) => track.stop());
      }
      setStreams((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setActiveCameras((prev) => ({ ...prev, [id]: false }));
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setStreams((prev) => ({ ...prev, [id]: stream }));
        setActiveCameras((prev) => ({ ...prev, [id]: true }));
      } catch (err) {
        console.warn('Unable to access camera', err);
      }
    }
  };

  useEffect(() => {
    Object.keys(streams).forEach((id) => {
      if (videoRefs.current[id] && streams[id]) {
        videoRefs.current[id]!.srcObject = streams[id];
      }
    });
  }, [streams]);

  useEffect(() => {
    return () => {
      (Object.values(streams) as MediaStream[]).forEach((stream) => {
        stream?.getTracks().forEach((track) => track.stop());
      });
    };
  }, []);

  if (quiz.showFrames === false) {
    return null;
  }

  const size = quiz.frameSize || 'medium';

  // Current large size mapped to small; medium = 1.25x; large = 1.5x
  const sizeClasses = {
    small: 'w-52 sm:w-56 md:w-64 h-28 sm:h-32 md:h-40',
    medium: 'w-64 sm:w-72 md:w-80 h-36 sm:h-40 md:h-50',
    large: 'w-80 sm:w-84 md:w-96 h-44 sm:h-48 md:h-60',
  }[size];

  return (
    <div className="absolute right-3 md:right-6 top-6 bottom-6 flex flex-col justify-start items-end gap-3 md:gap-4 z-40 pointer-events-auto">
      {players.map((player, idx) => {
        const isCurrent = idx === currentPlayerIndex;
        const pId = player.id || `p-${idx}`;
        const isCamActive = !!activeCameras[pId];

        return (
          <motion.div
            key={pId}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="flex flex-col items-end gap-1.5"
          >
            {/* Outside Border Info Bar (Player Name, Turn, Score, Camera) */}
            <div className="flex items-center justify-between gap-2 px-2.5 py-1 bg-slate-900/95 backdrop-blur-md rounded-xl border border-white/20 text-white shadow-lg w-full">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-extrabold text-white text-xs md:text-sm truncate max-w-[100px]">
                  {player.name || `Player ${idx + 1}`}
                </span>
                {isCurrent && (
                  <span className="px-1.5 py-0.5 text-[9px] md:text-[10px] font-black bg-emerald-500 text-white rounded-md uppercase tracking-wider animate-pulse shadow">
                    Turn
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleCamera(pId)}
                  title={isCamActive ? 'Turn Off Camera' : 'Turn On Camera'}
                  className={`p-1 rounded-full text-xs transition-colors backdrop-blur-md ${
                    isCamActive
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'bg-white/20 text-white/90 hover:text-white hover:bg-white/30'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <div className="bg-amber-400 text-amber-950 font-black text-xs px-2 py-0.5 rounded-full shadow-md">
                  {player.score || 0} pts
                </div>
              </div>
            </div>

            {/* Video / Camera Rectangle with Minimal Elegant Border and Clean White Space */}
            <div
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 bg-white ${sizeClasses} ${
                isCurrent
                  ? 'border-4 border-emerald-400 ring-4 ring-emerald-400/40 shadow-[0_0_30px_rgba(52,211,153,0.5)] scale-[1.01]'
                  : 'border-2 border-slate-200/90 shadow-lg ring-1 ring-black/5 hover:border-slate-300'
              }`}
            >
              {isCamActive ? (
                <video
                  ref={(el) => (videoRefs.current[pId] = el)}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : player.photo ? (
                <img
                  src={player.photo}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Cleaner white space for video, no letters or text inside */
                <div className="w-full h-full bg-white" />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default function Presentation({ quiz, onExit }: PresentationProps) {
  const [stage, setStage] = useState<Stage>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [clueIndex, setClueIndex] = useState(0);
  const [shuffledRights, setShuffledRights] = useState<string[]>([]);
  const [jumbledOrder, setJumbledOrder] = useState<number[]>([]);
  const [imageError, setImageError] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playersState, setPlayersState] = useState<any[]>(quiz.players || []);
  const [earnedBadges, setEarnedBadges] = useState<{player: string, name: string, icon: string, description: string}[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [interactiveOptionClicked, setInteractiveOptionClicked] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = useMemo(() => Array.from(new Set(quiz.questions.map(q => q.category).filter(Boolean))) as string[], [quiz.questions]);
  const isMultipleFiles = useMemo(() => Boolean(
    quiz.isMultipleFilesLoaded ||
    categories.length > 1 ||
    quiz.topic === "Multiple JSON Files" ||
    (quiz.title && quiz.title.includes("Files Loaded"))
  ), [quiz.isMultipleFilesLoaded, categories.length, quiz.topic, quiz.title]);

  const getActiveContextTopic = useCallback((qIndex?: number) => {
    const idx = qIndex !== undefined ? qIndex : currentQuestionIndex;
    const currentQCategory = quiz.questions[idx]?.category;
    if (selectedCategory && selectedCategory.trim()) return selectedCategory.trim();
    if (currentQCategory && currentQCategory.trim()) return currentQCategory.trim();
    if (quiz.topic && quiz.topic !== "Multiple JSON Files" && quiz.topic.trim()) return quiz.topic.trim();
    if (quiz.title && !quiz.title.includes("Files Loaded") && quiz.title.trim()) return quiz.title.trim();
    return "Quiz Challenge";
  }, [currentQuestionIndex, quiz.questions, selectedCategory, quiz.topic, quiz.title]);

  const getDynamicMilestoneBadge = useCallback((numAnswered: number) => {
    const totalQ = quiz.questions.length || 1;
    const maxBadges = Math.min(4, Math.max(1, Math.ceil(totalQ / 5)));
    const badgeInterval = Math.max(5, Math.ceil(totalQ / maxBadges));
    const badgeIndex = Math.min(maxBadges - 1, Math.max(0, Math.floor(numAnswered / badgeInterval) - 1));
    const safeBadgeIndex = Math.min(Math.max(0, badgeIndex), 4);

    const contextTopic = getActiveContextTopic(Math.max(0, numAnswered - 1));
    const activePlayer = playersState[currentPlayerIndex]?.name || quiz.teamName || 'Player';

    const tierMeta = [
      { prefix: "Bronze", icon: "🥉", color: "border-amber-700", text: "text-amber-800" },
      { prefix: "Silver", icon: "🥈", color: "border-slate-300", text: "text-slate-500" },
      { prefix: "Gold", icon: "🥇", color: "border-yellow-400", text: "text-yellow-600" },
      { prefix: "Diamond", icon: "💎", color: "border-cyan-300", text: "text-cyan-500" },
      { prefix: "Legendary", icon: "👑", color: "border-fuchsia-400", text: "text-fuchsia-600" }
    ];

    const meta = tierMeta[safeBadgeIndex];

    const titleOptions = [
      `${meta.prefix} ${contextTopic} Explorer`,
      `${meta.prefix} ${contextTopic} Whiz`,
      `${meta.prefix} ${contextTopic} Mastermind`,
      `${meta.prefix} ${contextTopic} Champion`,
      `${meta.prefix} ${contextTopic} Legend`
    ];

    const descOptions = [
      `${activePlayer} mastered ${numAnswered} questions in ${contextTopic}!`,
      `${activePlayer} showed brilliant knowledge in ${contextTopic}!`,
      `Incredible streak by ${activePlayer} in ${contextTopic}!`,
      `Solid performance by ${activePlayer} tackling ${contextTopic}!`,
      `${activePlayer} is dominating the ${contextTopic} section!`
    ];

    const variantSeed = (numAnswered * 7 + (currentPlayerIndex || 0) * 3 + contextTopic.length) % titleOptions.length;

    return {
      title: titleOptions[variantSeed],
      icon: meta.icon,
      description: descOptions[variantSeed],
      color: meta.color,
      text: meta.text,
      player: activePlayer,
      contextTopic,
      numAnswered
    };
  }, [quiz.questions.length, getActiveContextTopic, playersState, currentPlayerIndex, quiz.teamName]);
  const [warmupFeeling, setWarmupFeeling] = useState<string | null>(null);
  const [warmupOptions] = useState<string[]>(() => {
    const feelings = ['Curious', 'Scared', 'Excited', 'Happy', 'Bored', 'Nervous', 'Silly', 'Sleepy', 'Confused', 'Energetic', 'Proud', 'Calm', 'Hungry', 'Ready to Win', 'Super Smart'];
    return [...feelings].sort(() => 0.5 - Math.random()).slice(0, 4);
  });
  const [countdownNumber, setCountdownNumber] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseButton, setShowPauseButton] = useState(false);

  const isPausedRef = useRef(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const handleExportResults = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      quiz: {
        title: quiz.title || quiz.topic,
        topic: quiz.topic,
        type: quiz.type,
        mode: quiz.mode || 'video',
        isMultiplayer: quiz.isMultiplayer,
        totalQuestions: quiz.questions?.length || 0,
      },
      participants: playersState.map(p => ({
        id: p.id,
        name: p.name,
        score: p.score ?? 0,
        topic: p.topic || '',
        details: p.details || ''
      })),
      singlePlayerScore: quiz.isMultiplayer ? undefined : score,
      earnedBadges: earnedBadges,
      questions: quiz.questions
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    const sanitizedTitle = (quiz.title || quiz.topic || 'quiz').toLowerCase().replace(/[^a-z0-9]/g, '_');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `quiz-results-${sanitizedTitle}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const mouseTimerRef = useRef<NodeJS.Timeout | null>(null);
  let clueIndexRef = clueIndex;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (quiz.mode === 'interactive' && e.code === 'Space') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
    };
    
    const handleMouseMove = () => {
      if (quiz.mode === 'interactive') {
        setShowPauseButton(true);
        if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
        mouseTimerRef.current = setTimeout(() => {
          setShowPauseButton(false);
        }, 3000);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [quiz.mode]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const outroMessage = useMemo(() => {
    if (quiz.type === 'text-presentation') {
      return {
        title: "Thank You",
        subtitle: "Hope you enjoyed the presentation!",
        footer: "",
        speech: "Thank you for watching!"
      };
    }
    return OUTRO_MESSAGES[Math.floor(Math.random() * OUTRO_MESSAGES.length)];
  }, [quiz.type]);

  const question = quiz.questions[currentQuestionIndex];

  useEffect(() => {
    setImageError(false);
    setInteractiveOptionClicked(null);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (quiz.type === 'jumbled-letters' && question) {
      const word = question.correctAnswer.replace(/\s/g, '').toUpperCase();
      const arr = word.split('').map((char, i) => ({ char, id: i }));
      let bestOrder = arr.map(a => a.id).sort(() => Math.random() - 0.5);
      let bestScore = -1;
      
      for (let i = 0; i < 100; i++) {
        const current = [...arr].sort(() => Math.random() - 0.5);
        let score = 0;
        for (let j = 0; j < current.length - 1; j++) {
          const char1 = current[j].char;
          const char2 = current[j+1].char;
          let isContinuous = false;
          for (let k = 0; k < word.length - 1; k++) {
            if (word[k] === char1 && word[k+1] === char2) {
              isContinuous = true;
              break;
            }
          }
          if (!isContinuous) score++;
        }
        if (score > bestScore) {
          bestScore = score;
          bestOrder = current.map(c => c.id);
        }
        if (score === current.length - 1) break;
      }
      setJumbledOrder(bestOrder);
    }
  }, [currentQuestionIndex, quiz.type, question]);

  
  useEffect(() => {
    // Ensure voices are loaded for female voice
    window.speechSynthesis.getVoices();
    
    if (stage === 'intro') {
      let timeouts: NodeJS.Timeout[] = [];
      
      // 1. Initial 2s silence
      const t1 = setTimeout(() => {
        // 2. Play intro music
        audioSynth.playIntroMusic();
        
        // wait for music to finish (approx 1.5s)
        const t2 = setTimeout(() => {
          // 3. Speak welcome note
          const playerNames = playersState.map(p => p.name).join(' and ') || 'the players';

          let introSpeech = `Welcome back to Quiz Time Brain Boosters. Today we are exploring ${quiz.title || quiz.topic}.`;
          if (quiz.mode === 'interactive' && isMultipleFiles) {
            introSpeech = `Welcome back to Quiz Time Brain Boosters. It's Challenge between ${playerNames}.`;
          } else if (quiz.isMultiplayer && (quiz.players?.length || 1) > 1) {
            introSpeech = `Welcome back to Quiz Time Brain Boosters. Today's battle is between ${playerNames}. The topic is ${quiz.title || quiz.topic}.`;
          } else if (quiz.teamName && quiz.mode === 'interactive') {
            introSpeech = `Welcome back to Quiz Time Brain Boosters, ${quiz.teamName}. Today we are exploring ${quiz.title || quiz.topic}.`;
          }

          if (quiz.type === 'combat-mode') {
            introSpeech = `Welcome back to Combat Mode! Today's topic is ${quiz.title || quiz.topic}. Pair up with a friend. Look at your side of the screen and answer before the time runs out!`;
          } else if (quiz.type === 'word-search') {
            introSpeech = `Welcome back to Word Search! Today's topic is ${quiz.title || quiz.topic}. Find the 5 hidden words in the grid. You have 30 seconds. Look left-to-right, and top-to-bottom only!`;
          }
          
          audioSynth.speak(introSpeech, () => {
            // 4. Wait 2 seconds after speech finishes
            const t3 = setTimeout(() => {
              audioSynth.playSwoosh();
              if (quiz.isMultiplayer) {
                setStage('multiplayer-intro');
              } else if (quiz.mode === 'interactive') {
                setStage('warmup');
              } else {
                setStage('question');
              }
            }, 2000);
            timeouts.push(t3);
          });
        }, 1500);
        timeouts.push(t2);
        
      }, 2000);
      timeouts.push(t1);

      return () => {
        timeouts.forEach(clearTimeout);
        window.speechSynthesis.cancel();
      };
    }

    if (stage === 'countdown') {
      let current = 5;
      setCountdownNumber(current);
      audioSynth.playTick();
      const interval = setInterval(() => {
        if (isPausedRef.current) return;
        current--;
        if (current > 0) {
          setCountdownNumber(current);
          audioSynth.playTick();
        } else {
          clearInterval(interval);
          audioSynth.playSwoosh();
          setStage('question');
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    
    if (stage === 'question') {
      // Ensure we stop any previous bgm just in case
      audioSynth.stopBackgroundMusic();

      if (quiz.type === 'text-presentation') {
        setClueIndex(-1);
        audioSynth.speak(question.insight || question.question);
        setTimeLeft(question.timeLimit || 15);
        
        // Show clues progressively based on time
        if (question.clues && question.clues.length > 0) {
          const intervalTime = Math.floor((question.timeLimit || 15) / (question.clues.length + 1));
          
          timerRef.current = setInterval(() => {
            if (isPausedRef.current) return;
            setTimeLeft((prev) => {
              if (prev <= 1) {
                if (timerRef.current) clearInterval(timerRef.current);
                if (currentQuestionIndex < quiz.questions.length - 1) {
                  setCurrentQuestionIndex((p) => p + 1);
                  setStage('question');
                } else {
                  if (quiz.mode === 'interactive' && quiz.participantTopic) setStage('talk');
                  else setStage('outro');
                }
                return 0;
              }
              const elapsed = (question.timeLimit || 15) - prev;
              const currentClue = Math.floor(elapsed / intervalTime) - 1;
              if (currentClue >= 0 && currentClue !== clueIndexRef) {
                setClueIndex(currentClue);
                clueIndexRef = currentClue;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          timerRef.current = setInterval(() => {
            if (isPausedRef.current) return;
            setTimeLeft((prev) => {
              if (prev <= 1) {
                if (timerRef.current) clearInterval(timerRef.current);
                if (currentQuestionIndex < quiz.questions.length - 1) {
                  setCurrentQuestionIndex((p) => p + 1);
                  setStage('question');
                } else {
                  if (quiz.mode === 'interactive' && quiz.participantTopic) setStage('talk');
                  else setStage('outro');
                }
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else if (quiz.type === '5-clues') {
        setClueIndex(0);
        audioSynth.speak(question.question || 'Can you guess from these clues?');
        if (question.clues?.[0]) {
          setTimeout(() => audioSynth.speak(question.clues![0]), 2000); // speak first clue after 2s
        }
        
        setTimeLeft(25);
        
        timerRef.current = setInterval(() => {
          if (isPausedRef.current) return;
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              setStage('reveal');
              return 0;
            }
            if (quiz.type !== 'text-presentation' && (quiz.mode !== 'interactive' || prev <= 6)) audioSynth.playTick();
            
            // At 20s left (5s elapsed) -> clue 1
            if (prev === 21) { setClueIndex(1); if (question.clues?.[1]) audioSynth.speak(question.clues[1]); }
            // At 15s left -> clue 2
            if (prev === 16) { setClueIndex(2); if (question.clues?.[2]) audioSynth.speak(question.clues[2]); }
            // At 10s left -> clue 3
            if (prev === 11) { setClueIndex(3); if (question.clues?.[3]) audioSynth.speak(question.clues[3]); }
            // At 5s left -> clue 4
            if (prev === 6) { setClueIndex(4); if (question.clues?.[4]) audioSynth.speak(question.clues[4]); }
            
            return prev - 1;
          });
        }, 1000);
      } else if (quiz.type === 'jumbled-letters') {
        setClueIndex(-1);
        audioSynth.speak('Unjumble these letters!');
        setTimeLeft(25);
        
        timerRef.current = setInterval(() => {
          if (isPausedRef.current) return;
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              setStage('reveal');
              return 0;
            }
            if (quiz.type !== 'text-presentation' && (quiz.mode !== 'interactive' || prev <= 6)) audioSynth.playTick();
            
            // First clue after 10 seconds (15s left)
            if (prev === 16) { setClueIndex(0); if (question.clues?.[0]) audioSynth.speak(question.clues[0]); }
            // Second clue after another 5 seconds (10s left)
            if (prev === 11) { setClueIndex(1); if (question.clues?.[1]) audioSynth.speak(question.clues[1]); }
            
            return prev - 1;
          });
        }, 1000);
      } else if (quiz.type === 'detective') {
        audioSynth.speak(question.question || 'Find the fake fact!');
        setTimeLeft(30); // More time to read sentences
        
        timerRef.current = setInterval(() => {
          if (isPausedRef.current) return;
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              setStage('reveal');
              return 0;
            }
            if (quiz.type !== 'text-presentation' && (quiz.mode !== 'interactive' || prev <= 6)) audioSynth.playTick();
            return prev - 1;
          });
        }, 1000);
      } else if (quiz.type === 'match-the-following') {
        audioSynth.speak(question.question || 'Match the following!');
        
        if (question.pairs) {
          const rights = question.pairs.map(p => p.right);
          // Shuffle rights
          for (let i = rights.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rights[i], rights[j]] = [rights[j], rights[i]];
          }
          setShuffledRights(rights);
        }

        setTimeLeft(30); // Generous time for reading and matching

        timerRef.current = setInterval(() => {
          if (isPausedRef.current) return;
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              setStage('reveal');
              return 0;
            }
            if (quiz.type !== 'text-presentation' && (quiz.mode !== 'interactive' || prev <= 6)) audioSynth.playTick();
            return prev - 1;
          });
        }, 1000);
      } else if (quiz.type === 'word-search') {
        audioSynth.speak('Find the 5 words! 30 seconds on the clock.');
        setTimeLeft(30);
        
        timerRef.current = setInterval(() => {
          if (isPausedRef.current) return;
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              setStage('reveal');
              return 0;
            }
            if (quiz.type !== 'text-presentation' && (quiz.mode !== 'interactive' || prev <= 6)) audioSynth.playTick();
            return prev - 1;
          });
        }, 1000);
      } else if (quiz.type === 'combat-mode') {
        audioSynth.startCombatMusic();
        setTimeLeft(question.timeLimit);
        
        timerRef.current = setInterval(() => {
          if (isPausedRef.current) return;
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              setStage('reveal');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        audioSynth.speak(question.question);
        setTimeLeft(question.timeLimit);
        
        timerRef.current = setInterval(() => {
          if (isPausedRef.current) return;
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              setStage('reveal');
              return 0;
            }
            if (quiz.type !== 'text-presentation' && (quiz.mode !== 'interactive' || prev <= 6)) audioSynth.playTick();
            return prev - 1;
          });
        }, 1000);
      }
      
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        audioSynth.stopBackgroundMusic();
      };
    }
    
    if (stage === 'reveal') {
      audioSynth.stopBackgroundMusic();
      if (!(quiz.mode === 'interactive' && interactiveOptionClicked !== null)) {
        audioSynth.playCorrect();
      }
      
      let speechText = `The correct answer is ${question.correctAnswer}.`;
      if (quiz.type === 'detective') {
        speechText = `The fake fact is fact number ${question.fakeSentenceIndex! + 1}. ${question.insight}`;
      } else if (quiz.type === 'match-the-following') {
        speechText = `Here are the correct matches! ` + (question.pairs?.map(p => `${p.left} matches with ${p.right}`).join('. ') || '');
      } else if (quiz.type === 'combat-mode') {
        speechText = ``;
      } else if (quiz.type === 'word-search') {
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
          const isInteractiveGrid = quiz.mode === 'interactive' && quiz.type !== 'combat-mode' && (quiz.isMultiplayer && (quiz.players?.length || 1) > 1);
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
            willComplete = numAnswered >= quiz.questions.length;
            if (quiz.isMultiplayer && quiz.mode === 'interactive') {
              setCurrentPlayerIndex(p => (p + 1) % (quiz.players?.length || 1));
            }
          }
          
          if (willComplete) {
            if (quiz.mode === 'interactive') {
              setStage('score');
            } else if (quiz.quotes && quiz.quotes.length > 0) {
              setStage('quote');
            } else {
              setStage('outro');
            }
          } else {
            const totalQ = quiz.questions.length || 1;
            const maxBadges = Math.min(4, Math.max(1, Math.ceil(totalQ / 5)));
            const badgeInterval = Math.max(5, Math.ceil(totalQ / maxBadges));

            if (quiz.showBadges !== false && numAnswered > 0 && numAnswered % badgeInterval === 0 && numAnswered < totalQ) {
              setStage('video-badges');
            } else {
              if (isInteractiveGrid) {
                if (categories.length > 1) {
                  const categoryQuestions = quiz.questions.map((q, i) => ({q, i})).filter(x => x.q.category === selectedCategory);
                  if (categoryQuestions.length > 0 && categoryQuestions.every(x => answeredQuestions.has(x.i) || x.i === currentQuestionIndex)) {
                    setStage('category-selection');
                  } else {
                    setStage('question-selection');
                  }
                } else {
                  setStage('question-selection');
                }
              } else {
                setCurrentQuestionIndex((prev) => prev + 1);
                setStage('question');
              }
            }
          }
        }, 2000);
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
        window.speechSynthesis.cancel();
      };
    }

    if (stage === 'quote') {
      const quote = quiz.quotes[0];
      const isUnknown = !quote.author || quote.author.toLowerCase() === 'unknown';
      const authorText = isUnknown ? '' : ` by ${quote.author}`;
      
      let t: NodeJS.Timeout;
      
      audioSynth.speak(`Quote for the day. ${quote.text}${authorText}`, () => {
        t = setTimeout(() => {
          audioSynth.playSwoosh();
          setStage('outro');
        }, 2000);
      });
      
      return () => {
        if (t) clearTimeout(t);
        window.speechSynthesis.cancel();
      };
    }
    
    if (stage === 'score') {
      audioSynth.playVictory();
      audioSynth.playHTML5Badge();;
      
      const fireConfetti = () => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#facc15', '#f87171', '#60a5fa', '#34d399', '#a78bfa']
        });
      };
      
      fireConfetti();
      let confettiTimer = setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 120,
          origin: { y: 0.5 },
          colors: ['#facc15', '#f87171', '#60a5fa', '#34d399', '#a78bfa']
        });
      }, 700);

      let t: NodeJS.Timeout;
      
      if (quiz.isMultiplayer) {
        const sorted = [...playersState].sort((a, b) => b.score - a.score);
        const winner = sorted[0];
        audioSynth.speak(`Congratulations ${winner?.name}, you are the winner!`, () => {});
      } else {
        audioSynth.speak(`Great job ${quiz.teamName || 'Player 1'}, you scored ${score} out of ${quiz.questions.length}!`, () => {
          t = setTimeout(() => {
            setStage('badges');
          }, 3000);
        });
      }
      
      return () => {
        if (t) clearTimeout(t);
        if (confettiTimer) clearTimeout(confettiTimer);
        window.speechSynthesis.cancel();
      };
    }

    if (stage === 'video-badges') {
      audioSynth.playHTML5Badge();
      audioSynth.playSwoosh();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      const numAnswered = (quiz.mode === 'interactive' && quiz.type !== 'combat-mode') 
        ? answeredQuestions.size 
        : currentQuestionIndex + 1;
        
      const currentBadge = getDynamicMilestoneBadge(numAnswered);
      
      const speechMsg = quiz.mode === 'interactive' 
        ? `Milestone reached! ${currentBadge.player} unlocked the ${currentBadge.title} badge for reaching ${numAnswered} questions in ${currentBadge.contextTopic}!` 
        : `Wow, ${currentBadge.player} reached ${numAnswered} questions! Here is the ${currentBadge.title} badge for your great effort! Keep it up!`;

      audioSynth.speak(speechMsg, () => {
        setTimeout(() => {
           if (quiz.mode === 'interactive' && quiz.type !== 'combat-mode' && (quiz.isMultiplayer && (quiz.players?.length || 1) > 1)) {
             if (categories.length > 1) {
               const categoryQuestions = quiz.questions.map((q, i) => ({q, i})).filter(x => x.q.category === selectedCategory);
               if (categoryQuestions.length > 0 && categoryQuestions.every(x => answeredQuestions.has(x.i) || x.i === currentQuestionIndex)) {
                 setStage('category-selection');
               } else {
                 setStage('question-selection');
               }
             } else {
               setStage('question-selection');
             }
           } else {
             setCurrentQuestionIndex((prev) => prev + 1);
             setStage('question');
           }
        }, 3000);
      });
      return () => window.speechSynthesis.cancel();
    }

    if (stage === 'badges') {
      audioSynth.playHTML5Badge();
      audioSynth.playSwoosh();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
      audioSynth.speak('Here are the badges you earned!');
      const generatedBadges = [];
      
      const activeContextTopic = getActiveContextTopic();
      const scorePerQuestion = quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1;
      
      const usedBadges = new Set();
      
      const getRandomBadge = (tier: string, playerName: string) => {
        const perfectOptions = [
          { name: `Perfect ${activeContextTopic} Master`, icon: '🏆', description: `Answered every question correctly in ${activeContextTopic}!` },
          { name: 'Flawless Victory', icon: '🌟', description: `Didn't miss a single question in ${activeContextTopic}!` },
          { name: `${activeContextTopic} Titan`, icon: '⚡', description: `Unstoppable expertise in ${activeContextTopic}!` },
          { name: `${activeContextTopic} Conqueror`, icon: '👑', description: `Ruled the ${activeContextTopic} section flawlessly!` },
          { name: 'Absolute Genius', icon: '🤯', description: 'Mind-blowing overall performance!' }
        ];
        const whizOptions = [
          { name: `${activeContextTopic} Whiz`, icon: '🧠', description: `Showed great knowledge of ${activeContextTopic}!` },
          { name: `${activeContextTopic} Specialist`, icon: '⭐', description: `Mastered tricky questions in ${activeContextTopic}!` },
          { name: `${activeContextTopic} Brainiac`, icon: '💡', description: `Bright and accurate in ${activeContextTopic}!` },
          { name: `${activeContextTopic} Ninja`, icon: '🥷', description: `Swiftly solved ${activeContextTopic} questions!` },
          { name: `${activeContextTopic} Wizard`, icon: '🧙', description: `Magical answering skills in ${activeContextTopic}!` },
          { name: `${activeContextTopic} Ace`, icon: '🎯', description: `Hit the target consistently in ${activeContextTopic}!` }
        ];
        const learnerOptions = [
          { name: `${activeContextTopic} Explorer`, icon: '🗺️', description: `Explored key facts in ${activeContextTopic}!` },
          { name: `${activeContextTopic} Seeker`, icon: '🔍', description: `Discovered cool facts in ${activeContextTopic}!` },
          { name: 'Fast Learner', icon: '🌱', description: `Gained valuable new insights today!` },
          { name: 'Persistent Player', icon: '🐢', description: `Showed determination through every round!` }
        ];
        
        let pool = learnerOptions;
        if (tier === 'perfect') pool = perfectOptions;
        if (tier === 'whiz') pool = whizOptions;
        
        let available = pool.filter(b => !usedBadges.has(b.name));
        if (available.length === 0) available = pool; // Fallback if we somehow use all of them
        
        const chosen = available[Math.floor(Math.random() * available.length)];
        usedBadges.add(chosen.name);
        return { player: playerName, ...chosen };
      };

      if (quiz.isMultiplayer) {
        const sorted = [...playersState].sort((a,b) => b.score - a.score);
        sorted.forEach((p, index) => {
          if (p.score === quiz.questions.length * scorePerQuestion && quiz.questions.length > 0) {
            generatedBadges.push(getRandomBadge('perfect', p.name));
          } else if (p.score >= (quiz.questions.length / 2) * scorePerQuestion && quiz.questions.length > 0) {
            generatedBadges.push(getRandomBadge('whiz', p.name));
          } else {
            generatedBadges.push(getRandomBadge('learner', p.name));
          }
        });
        
        if (sorted[0] && sorted[0].score > 0) {
           const winnerOptions = [
            { name: 'Quiz Master', icon: '👑', description: 'Achieved the highest score!' },
            { name: 'Grand Champion', icon: '🏆', description: 'Outscored everyone else!' },
            { name: 'Supreme Victor', icon: '⭐', description: 'The undisputed winner!' },
            { name: 'Top Dog', icon: '🥇', description: 'Finished in first place!' },
            { name: 'Quiz Legend', icon: '🌟', description: 'A legendary performance!' }
          ];
          generatedBadges.unshift({ player: sorted[0].name, ...winnerOptions[Math.floor(Math.random() * winnerOptions.length)] });
        }
      } else {
        const pName = quiz.teamName || 'Player 1';
        if (score === quiz.questions.length * scorePerQuestion && quiz.questions.length > 0) {
          generatedBadges.push(getRandomBadge('perfect', pName));
        } else if (score >= (quiz.questions.length / 2) * scorePerQuestion && quiz.questions.length > 0) {
          generatedBadges.push(getRandomBadge('whiz', pName));
        } else {
          generatedBadges.push(getRandomBadge('learner', pName));
        }
        const fastOptions = [
          { name: 'Fast Thinker', icon: '⚡', description: 'Answered questions with speed!' },
          { name: 'Speed Demon', icon: '🏎️', description: 'Incredibly quick responses!' },
          { name: 'Lightning Fast', icon: '🌩️', description: 'Blink and you miss it!' },
          { name: 'Quick Wits', icon: '🧠', description: 'Sharp and speedy!' },
          { name: 'Rapid Fire', icon: '🔥', description: 'Blazing fast answers!' }
        ];
        generatedBadges.push({ player: pName, ...fastOptions[Math.floor(Math.random() * fastOptions.length)] });
      }
      
      setEarnedBadges(generatedBadges);
    }

    if (stage === 'talk') {
      let t: NodeJS.Timeout;
      audioSynth.speak(`Now, let's hear from ${quiz.teamName || 'Player 1'} about ${quiz.participantTopic}`, () => {
        // Wait 120 seconds, then outro
        t = setTimeout(() => {
          setStage('outro');
        }, 120000);
      });
      return () => {
        if (t) clearTimeout(t);
        window.speechSynthesis.cancel();
      };
    }

    if (stage === 'outro') {
      if (quiz.mode === 'interactive') {
        audioSynth.speak("Thank you for playing!");
      } else {
        audioSynth.speak(outroMessage.speech);
      }
    }
  }, [stage, currentQuestionIndex, quiz, question]);

  const optionLetters = ['A', 'B', 'C', 'D'];
  const isInteractiveTimeout = quiz.mode === 'interactive' && stage === 'reveal' && interactiveOptionClicked === null;

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center overflow-hidden font-sans bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-white selection:bg-white/30">

      {/* Background Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <Star className="absolute top-12 left-[3%] w-12 h-12 text-white animate-pulse" />
        <Rocket className="absolute top-[15%] right-[4%] w-16 h-16 text-white opacity-60 transform rotate-45 animate-bounce" />
        <Bot className="absolute top-[40%] left-[2%] w-14 h-14 text-white opacity-70 animate-pulse" />
        <Computer className="absolute top-[35%] right-[2%] w-14 h-14 text-white opacity-60" />
        <Brain className="absolute bottom-[40%] left-[3%] w-16 h-16 text-white opacity-50 transform rotate-12" />
        <GraduationCap className="absolute top-[60%] right-[3%] w-16 h-16 text-white opacity-70" />
        <Dog className="absolute bottom-[20%] left-[4%] w-14 h-14 text-white opacity-60 transform -rotate-12" />
        <Star className="absolute bottom-[25%] right-[5%] w-10 h-10 text-white animate-pulse" />
        <Sparkles className="absolute bottom-[10%] left-[10%] w-14 h-14 text-white opacity-80" />
        <Cat className="absolute bottom-[10%] right-[8%] w-16 h-16 text-white opacity-60" />
        <Dumbbell className="absolute top-[10%] right-[15%] w-12 h-12 text-white opacity-50 transform -rotate-12" />
      </div>

      <button 
        onClick={onExit}
        className="absolute top-0 left-0 w-16 h-16 opacity-0 z-50 cursor-default"
        title="Hidden Exit Button"
      />
      
      {quiz.mode === 'interactive' && showPauseButton && (
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="fixed bottom-3 right-3 z-[60] bg-black/40 hover:bg-black/70 backdrop-blur-md p-1.5 rounded-full border border-white/20 text-white opacity-0 hover:opacity-100 transition-all duration-300 shadow-md"
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
        </button>
      )}

      {isPaused && (
        <div className="absolute inset-0 z-[55] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-white text-6xl font-black uppercase tracking-widest drop-shadow-2xl flex items-center gap-4">
            <Pause className="w-16 h-16 fill-current" /> Paused
          </div>
        </div>
      )}

      {/* Watermark Logo bottom right corner for Video mode quiz windows */}
      {quiz.mode !== 'interactive' && (
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none flex items-center justify-center p-1 bg-black/30 backdrop-blur-md rounded-full border border-white/20 shadow-xl opacity-80">
          <img
            src={quizLogo}
            alt="Watermark Logo"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shadow border border-white/90"
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-center p-12 max-w-5xl flex flex-col items-center justify-center h-full z-10 mx-auto"
          >
            <motion.div 
              animate={{ y: [0, -20, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.6)] border-8 border-white mb-12"
            >
              <img src={(quiz.mode === 'interactive' && quiz.playerPhoto) ? quiz.playerPhoto : quizLogo} alt="Quiz Time Brain Boosters" className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight drop-shadow-2xl text-white">
              {quiz.mode === 'interactive' && isMultipleFiles
                ? `It's Challenge between ${playersState.map(p => p.name).join(' and ')}`
                : (quiz.isMultiplayer && (quiz.players?.length || 1) > 1
                  ? `Battle: ${playersState.map(p => p.name).join(' vs ')}`
                  : (quiz.mode === 'interactive' 
                    ? `Welcome ${quiz.teamName}!` 
                    : (quiz.type === 'combat-mode' ? 'Welcome back to Combat Mode!' : 'Welcome back to Quiz Time Brain Boosters')))}
            </h1>
            <p className="text-3xl md:text-4xl opacity-100 font-bold text-cyan-100 drop-shadow-lg max-w-3xl leading-snug">
              {quiz.mode === 'interactive' && isMultipleFiles
                ? `It's Challenge between ${playersState.map(p => p.name).join(' and ')}`
                : (quiz.isMultiplayer && (quiz.players?.length || 1) > 1
                  ? `Today's topic: ${quiz.title || quiz.topic}`
                  : (quiz.mode === 'interactive' && quiz.playerDetails 
                    ? quiz.playerDetails 
                    : (quiz.type === 'combat-mode' ? `Today we are exploring: ${quiz.title || quiz.topic}. Pair up with a friend! Look at your side of the screen and answer before the time runs out!` : `Today we are exploring: ${quiz.title || quiz.topic}`)))}
            </p>
          </motion.div>
        )}

        {stage === 'warmup' && (
          <motion.div
            key="warmup"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="text-center p-12 max-w-4xl flex flex-col items-center justify-center h-full z-10 w-full mx-auto relative"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tight drop-shadow-2xl text-white">
              How are you feeling today?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 w-full max-w-3xl">
              {warmupOptions.map((feeling) => (
                <button
                  key={feeling}
                  onClick={() => setWarmupFeeling(feeling)}
                  className={`py-6 rounded-2xl text-2xl font-bold transition-all ${
                    warmupFeeling === feeling
                      ? 'bg-fuchsia-500 text-white shadow-[0_0_30px_rgba(217,70,239,0.5)] scale-110'
                      : 'bg-white/10 text-white hover:bg-white/20 border-2 border-white/20'
                  }`}
                >
                  {feeling}
                </button>
              ))}
            </div>
            
            <AnimatePresence>
              {warmupFeeling && (
                <motion.div
                  key="feeling-emoji"
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100]"
                >
                  <motion.div 
                    animate={{ y: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="text-[12rem] filter drop-shadow-[0_0_50px_rgba(255,255,255,0.8)]"
                  >
                    {feelingEmojis[warmupFeeling] || '😀'}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {warmupFeeling && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => {
                    audioSynth.playSwoosh();
                    if (quiz.isMultiplayer && (quiz.players?.length || 1) > 1) {
                      if (categories.length > 1) {
                        setStage('category-selection');
                      } else {
                        setStage('question-selection');
                      }
                    } else {
                      setCurrentQuestionIndex(0);
                      setStage('question');
                    }
                  }}
                  className="px-12 py-6 rounded-full bg-white text-indigo-900 font-black text-3xl shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-transform flex items-center gap-4 mt-8"
                >
                  <Play className="w-10 h-10 fill-current" />
                  Let's Get Started!
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        
        {stage === 'multiplayer-intro' && (
          <motion.div
            key="multiplayer-intro"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="text-center p-8 max-w-7xl flex flex-col items-center justify-center h-full z-10 w-full mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tight drop-shadow-2xl text-white">
              {quiz.mode === 'interactive' && isMultipleFiles
                ? `It's Challenge between ${playersState.map(p => p.name).join(' and ')}`
                : "The Challengers"}
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full">
              {playersState.map((player, idx) => (
                <React.Fragment key={player.id || idx}>
                  {idx > 0 && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 * idx, type: "spring" }}
                      className="text-6xl md:text-8xl font-black text-yellow-300 italic drop-shadow-[0_0_30px_rgba(253,224,71,0.8)]"
                    >
                      VS
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 * idx }}
                    className="flex flex-col items-center bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl w-full max-w-sm"
                  >
                    {player.photo ? (
                      <img src={player.photo} alt={player.name} className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full shadow-[0_0_40px_rgba(255,255,255,0.4)] border-4 border-white mb-6" />
                    ) : (
                      <div className="w-32 h-32 md:w-48 md:h-48 bg-indigo-500 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.4)] border-4 border-white mb-6 flex items-center justify-center text-6xl font-black text-white">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h3 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2">{player.name}</h3>
                    {(!isMultipleFiles || quiz.mode !== 'interactive') && player.topic && <p className="text-xl text-indigo-200 font-semibold mb-2">Topic: {player.topic}</p>}
                    {player.details && <p className="text-lg text-white/80 italic text-center leading-tight">"{player.details}"</p>}
                  </motion.div>
                </React.Fragment>
              ))}
            </div>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              onClick={() => {
                audioSynth.playSwoosh();
                if (categories.length > 1) {
                  setStage('category-selection');
                } else {
                  setStage('question-selection');
                }
              }}
              className="mt-16 px-12 py-6 rounded-full bg-yellow-400 text-yellow-900 font-black text-3xl shadow-[0_0_50px_rgba(250,204,21,0.6)] hover:scale-105 transition-transform flex items-center gap-4"
            >
              <Play className="w-10 h-10 fill-current" />
              Let the Battle Begin!
            </motion.button>
          </motion.div>
        )}

                {stage === 'category-selection' && (
          <motion.div
            key="category-selection"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center h-full p-8 z-10 w-full"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-12 text-white drop-shadow-2xl">
              {quiz.isMultiplayer ? `${playersState[currentPlayerIndex]?.name}, choose a category!` : 'Choose a Category!'}
            </h2>
            <div className="flex flex-wrap justify-center gap-6 max-w-6xl w-full mx-auto">
              {categories.map((cat, i) => {
                const catQuestions = quiz.questions.map((q, idx) => ({ q, idx })).filter(x => x.q.category === cat);
                const allAnswered = catQuestions.every(x => answeredQuestions.has(x.idx));
                const answeredCount = catQuestions.filter(x => answeredQuestions.has(x.idx)).length;
                return (
                  <button
                    key={cat}
                    disabled={allAnswered}
                    onClick={() => {
                      audioSynth.playSwoosh();
                      setSelectedCategory(cat);
                      setStage('question-selection');
                    }}
                    className={`px-8 py-6 rounded-3xl text-3xl font-black transition-all flex flex-col items-center gap-2 shadow-xl ${
                      allAnswered
                        ? 'bg-slate-500/40 text-slate-300/40 cursor-not-allowed border-4 border-slate-400/30 shadow-inner'
                        : 'bg-white text-indigo-700 hover:scale-105 active:translate-y-2'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-lg font-bold ${allAnswered ? 'text-slate-400/50' : 'text-indigo-400'}`}>
                      {answeredCount} / {catQuestions.length} Answered
                    </span>
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => {
                audioSynth.playSwoosh();
                setStage('score');
              }}
              className="mt-16 px-8 py-4 bg-rose-500 text-white font-bold text-xl rounded-full shadow-lg hover:bg-rose-600 transition-colors"
            >
              End Quiz
            </button>
          </motion.div>
        )}
        
        {stage === 'question-selection' && (
          <motion.div
            key="question-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-8 flex flex-col items-center justify-start h-full z-10 w-full mx-auto relative"
          >
            {quiz.mode === 'interactive' && (
              <ParticipantVideoFrames
                quiz={quiz}
                playersState={playersState}
                currentPlayerIndex={currentPlayerIndex}
              />
            )}
            {/* Scoreboard */}
            <div className="flex justify-center gap-8 md:gap-16 w-full mb-12">
              {playersState.map((player, idx) => (
                <div key={player.id || idx} className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-500 ${idx === currentPlayerIndex ? 'bg-white/20 shadow-[0_0_30px_rgba(255,255,255,0.3)] scale-110 border-2 border-white' : 'opacity-70'}`}>
                  <h4 className="text-2xl font-bold text-white mb-2">{player.name}</h4>
                  <div className="text-5xl font-black text-yellow-300 drop-shadow-md">{player.score}</div>
                  {idx === currentPlayerIndex && (
                    <motion.div 
                      animate={{ y: [0, -10, 0] }} 
                      transition={{ repeat: Infinity }}
                      className="mt-4 text-white font-bold"
                    >
                      👇 Your Turn!
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center mb-12">
              <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl text-center">
                {quiz.isMultiplayer ? `${playersState[currentPlayerIndex]?.name}, select a question!` : 'Select a question!'}
              </h2>
              {categories.length > 1 && selectedCategory && (
                <div className="mt-4 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white font-bold text-2xl flex items-center gap-3 shadow-lg">
                  <span className="opacity-80">Category:</span> {selectedCategory}
                  <button
                    onClick={() => {
                      audioSynth.playSwoosh();
                      setStage('category-selection');
                    }}
                    className="ml-2 px-4 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-full shadow transition-all hover:scale-105 active:translate-y-0.5 border border-white/30"
                  >
                    Change Category 🔄
                  </button>
                </div>
              )}
            </div>

            {/* Grid of numbers */}
            <div className="grid grid-cols-4 md:grid-cols-5 gap-6 max-w-4xl w-full mx-auto">
              {quiz.questions.map((q, idx) => {
                if (categories.length > 1 && selectedCategory && q.category !== selectedCategory) return null;
                const isAnswered = answeredQuestions.has(idx);
                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => {
                      audioSynth.playSwoosh();
                      setCurrentQuestionIndex(idx);
                      if (quiz.isMultiplayer && quiz.mode === 'interactive') {
                        setStage('question');
                      } else {
                        setStage('countdown');
                      }
                    }}
                    className={`aspect-square rounded-3xl flex items-center justify-center text-4xl md:text-6xl font-black transition-all ${isAnswered ? 'bg-slate-500/40 text-slate-300/40 cursor-not-allowed border-4 border-slate-400/30 shadow-inner' : 'bg-white text-indigo-600 shadow-[0_10px_0_rgba(0,0,0,0.2)] hover:scale-105 active:translate-y-2 active:shadow-none'}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-auto mb-8 flex flex-wrap items-center justify-center gap-4">
              {categories.length > 1 && (
                <button
                  onClick={() => {
                    audioSynth.playSwoosh();
                    setStage('category-selection');
                  }}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl rounded-full shadow-lg transition-all hover:scale-105 active:translate-y-1 border border-white/20"
                >
                  Change Category 🔄
                </button>
              )}
              <button
                onClick={() => {
                  audioSynth.playSwoosh();
                  setStage('score');
                }}
                className="px-8 py-4 bg-rose-500 text-white font-bold text-xl rounded-full shadow-lg hover:bg-rose-600 transition-all hover:scale-105 active:translate-y-1"
              >
                End Quiz
              </button>
            </div>
          </motion.div>
        )}

{stage === 'countdown' && (
          <motion.div
            key="countdown"
            className="text-center p-12 flex flex-col items-center justify-center h-full z-10 w-full mx-auto"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={countdownNumber}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[15rem] font-black text-white drop-shadow-2xl"
              >
                {countdownNumber}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {(stage === 'question' || stage === 'reveal') && (
          <motion.div
            key={`q-container-${currentQuestionIndex}`}
            className="relative"
            style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {quiz.mode === 'interactive' && (
              <ParticipantVideoFrames
                quiz={quiz}
                playersState={playersState}
                currentPlayerIndex={currentPlayerIndex}
              />
            )}
            {isInteractiveTimeout && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: -50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none"
              >
                <div className="bg-red-600 text-white font-black text-6xl md:text-8xl px-12 py-6 rounded-full shadow-[0_20px_50px_rgba(220,38,38,0.6)] border-8 border-red-400 rotate-[-10deg] whitespace-nowrap">
                  TIME'S UP!
                </div>
              </motion.div>
            )}
          <motion.div
            key={`q-container-inner-${currentQuestionIndex}`}
            className={`${quiz.mode === 'interactive' ? 'w-[calc(100%-16rem)] sm:w-[calc(100%-18rem)] md:w-[calc(100%-22rem)] lg:w-[calc(100%-25rem)] ml-2 sm:ml-4 md:ml-8 mr-auto justify-center' : 'w-[90vw] mx-auto'} max-w-[1800px] h-full flex flex-col z-10 ${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'find-in-map' ? 'p-4 md:p-6' : 'p-8 md:p-12'}`}
          >
            {/* Top Bar */}
            {/* Milestone Progress Bar */}
            {quiz.showBadges !== false && (() => {
              const totalQ = quiz.questions.length || 1;
              const maxBadges = Math.min(4, Math.max(1, Math.ceil(totalQ / 5)));
              const badgeInterval = Math.max(5, Math.ceil(totalQ / maxBadges));
              const earnedCount = Math.min(maxBadges, Math.floor(currentQuestionIndex / badgeInterval));

              return (
                <div className="w-full mb-6 mt-2">
                  <div className="flex justify-between text-white/90 font-bold mb-2 text-sm uppercase tracking-wider">
                    <span>Milestone Progress</span>
                    <span>{earnedCount} of {maxBadges} Badges</span>
                  </div>
                  <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden relative shadow-inner">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-300 to-yellow-500"
                      initial={{ width: `${(Math.max(0, currentQuestionIndex) / totalQ) * 100}%` }}
                      animate={{ width: `${((currentQuestionIndex + (stage === 'reveal' ? 1 : 0)) / totalQ) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                    {/* Milestone markers */}
                    {Array.from({ length: maxBadges }).map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute top-0 w-1 h-full bg-white/40 shadow-sm" 
                        style={{ left: `${Math.min(100, ((i + 1) * badgeInterval / totalQ) * 100)}%` }} 
                      />
                    ))}
                  </div>
                </div>
              );
            })()}
            
            {/* Top Bar */}
            <div className={`w-full flex ${quiz.mode === 'interactive' ? 'justify-start gap-4 md:gap-6 flex-wrap' : 'justify-between'} items-center ${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'find-in-map' ? 'mb-4 md:mb-6' : 'mb-10'}`}>
              <div className="bg-white px-8 py-3 rounded-full shadow-2xl border-4 border-slate-100">
                <span className="text-2xl font-black text-rose-500 tracking-wider uppercase">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
              </div>
              
              {quiz.isMultiplayer && quiz.mode === 'interactive' && quiz.type !== 'combat-mode' && (
                <div className="bg-fuchsia-600 text-white px-8 py-3 rounded-full shadow-2xl font-black text-2xl tracking-widest uppercase flex items-center gap-3 border-4 border-fuchsia-400">
                  <span className="animate-pulse">👉 {playersState[currentPlayerIndex]?.name}'s Turn</span>
                </div>
              )}
              <div className="bg-indigo-700 text-white px-8 py-3 rounded-full shadow-2xl font-black text-2xl tracking-widest uppercase flex items-center gap-3 border-4 border-indigo-400">
                <Star className="w-6 h-6 text-yellow-300 fill-current" />
                <span>
                  {quiz.mode === 'interactive' && isMultipleFiles
                    ? `It's Challenge between ${playersState.map(p => p.name).join(' and ')}`
                    : (quiz.mode === 'interactive' && quiz.teamName ? `${quiz.teamName} | ${quiz.title}` : quiz.title)}
                </span>
                <Star className="w-6 h-6 text-yellow-300 fill-current" />
              </div>

              <div className="flex items-center gap-3 bg-white px-8 py-3 rounded-full shadow-2xl border-4 border-slate-100 text-slate-800">
                <Clock className="w-8 h-8 text-rose-500 animate-pulse" />
                <span className="text-3xl font-black tabular-nums">{timeLeft}s</span>
              </div>
            </div>

            {/* Question Card */}
            {quiz.type === 'combat-mode' ? (
              <div className="flex-1 w-full flex gap-4 md:gap-8 overflow-hidden mb-6 z-10">
                {/* Left Player */}
                <div className="flex-1 flex flex-col bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-b-[12px] border-slate-200 p-6 md:p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full -mr-16 -mt-16" />
                  <h3 className="text-slate-500 font-black tracking-widest uppercase mb-4 text-xl relative z-10">Player 1</h3>
                  <h2 className="font-extrabold text-slate-800 text-3xl md:text-4xl lg:text-5xl leading-tight mb-8 drop-shadow-sm flex-1 relative z-10">
                    {question.combatLeft?.question}
                  </h2>
                  <div className="flex flex-col gap-4 w-full mt-auto relative z-10">
                    {question.combatLeft?.options?.map((option, i) => {
                      const isCorrect = option === question.combatLeft?.correctAnswer;
                      const isReveal = stage === 'reveal';
                      let cardClass = "bg-slate-100 text-slate-800 border-2 border-slate-200";
                      if (isReveal) {
                        if (isCorrect) cardClass = "bg-emerald-500 text-white border-2 border-emerald-600 shadow-xl scale-[1.02]";
                        else cardClass = "bg-slate-50 text-slate-400 border-2 border-transparent opacity-60";
                      }
                      return (
                        <motion.div key={`l-${i}`} className={`px-6 py-4 rounded-2xl text-xl md:text-2xl font-bold flex items-center gap-4 transition-all duration-500 ${cardClass}`}>
                          <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-black text-lg ${isReveal && isCorrect ? 'bg-white text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                            {optionLetters[i]}
                          </div>
                          <span className="leading-tight">{option}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Player */}
                <div className="flex-1 flex flex-col bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-b-[12px] border-slate-200 p-6 md:p-10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-slate-100 rounded-full -ml-16 -mt-16" />
                  <h3 className="text-slate-500 font-black tracking-widest uppercase mb-4 text-xl text-right relative z-10">Player 2</h3>
                  <h2 className="font-extrabold text-slate-800 text-3xl md:text-4xl lg:text-5xl leading-tight mb-8 drop-shadow-sm flex-1 text-right relative z-10">
                    {question.combatRight?.question}
                  </h2>
                  <div className="flex flex-col gap-4 w-full mt-auto relative z-10">
                    {question.combatRight?.options?.map((option, i) => {
                      const isCorrect = option === question.combatRight?.correctAnswer;
                      const isReveal = stage === 'reveal';
                      let cardClass = "bg-slate-100 text-slate-800 border-2 border-slate-200";
                      if (isReveal) {
                        if (isCorrect) cardClass = "bg-emerald-500 text-white border-2 border-emerald-600 shadow-xl scale-[1.02]";
                        else cardClass = "bg-slate-50 text-slate-400 border-2 border-transparent opacity-60";
                      }
                      return (
                        <motion.div key={`r-${i}`} className={`px-6 py-4 rounded-2xl text-xl md:text-2xl font-bold flex items-center gap-4 transition-all duration-500 ${cardClass}`}>
                          <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-black text-lg ${isReveal && isCorrect ? 'bg-white text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                            {optionLetters[i]}
                          </div>
                          <span className="leading-tight">{option}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className={`bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col ${quiz.mode === 'interactive' ? 'items-start text-left justify-center' : 'items-center justify-center'} border-b-[12px] border-slate-200 z-10 relative pt-16 md:pt-20 ${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'match-the-following' || quiz.type === 'word-search' ? 'px-6 pb-6 md:px-8 md:pb-8 mb-6 gap-6 shrink-0' : quiz.type === 'find-in-map' ? `px-6 pb-6 md:px-8 md:pb-8 mb-6 ${quiz.mode === 'interactive' ? 'shrink-0' : 'flex-1'} gap-6` : `px-8 pb-8 md:px-12 md:pb-12 mb-8 ${quiz.mode === 'interactive' ? 'shrink-0' : 'flex-1'} gap-8`}`}>
                  


              <div className={`flex flex-col md:flex-row items-center ${quiz.mode === 'interactive' ? 'justify-start text-left' : 'justify-center'} w-full ${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'find-in-map' || quiz.type === 'match-the-following' || quiz.type === 'word-search' ? 'gap-8' : 'gap-12'}`}>
                {question.imageUrl && !imageError && quiz.type !== 'find-in-map' && (
                  <div className={
                    (question.type?.toLowerCase() === 'identify' || quiz.type?.toLowerCase() === 'identify' || quiz.type === 'identify-image' || quiz.topic?.toLowerCase().startsWith('identify'))
                      ? "w-full max-w-4xl h-[40vh] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-100 mx-0"
                      : `shrink-0 rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-100 ${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'match-the-following' || quiz.type === 'word-search' ? 'w-40 h-40 md:w-48 md:h-48' : 'w-48 h-48 md:w-72 md:h-72'}`
                  }>
                    <img 
                      src={question.imageUrl} 
                      alt="Identify this" 
                      className="w-full h-full object-contain bg-slate-50" 
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      onError={(e) => { if (question.imagePreviewUrl && e.currentTarget.src !== question.imagePreviewUrl) { e.currentTarget.src = question.imagePreviewUrl; } else { setImageError(true); } }}
                    />
                  </div>
                )}
                {(quiz.isOfflineMode || !(question.type?.toLowerCase() === 'identify' || quiz.type?.toLowerCase() === 'identify' || quiz.type === 'identify-image' || quiz.topic?.toLowerCase().startsWith('identify'))) && (
                  <h2 className={`font-extrabold text-slate-800 ${quiz.mode === 'interactive' ? 'text-left' : 'text-center'} leading-tight drop-shadow-sm flex-1 ${quiz.type === '5-clues' || quiz.type === 'detective' || quiz.type === 'find-in-map' || quiz.type === 'jumbled-letters' || quiz.type === 'match-the-following' || quiz.type === 'word-search' ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-5xl md:text-6xl lg:text-7xl'}`}>
                    {quiz.type === 'jumbled-letters' ? 'Unjumble the word!' : question.question}
                  </h2>
                )}
              </div>
              
              {quiz.type === 'jumbled-letters' && (
                <div className={`flex flex-col ${quiz.mode === 'interactive' ? 'items-start text-left' : 'items-center'} gap-8 w-full mt-2`}>
                  <div className={`flex flex-wrap gap-3 md:gap-4 ${quiz.mode === 'interactive' ? 'justify-start' : 'justify-center'}`}>
                    {(() => {
                      const word = question.correctAnswer.replace(/\s/g, '').toUpperCase();
                      const letterObjects = word.split('').map((char, i) => ({ char, id: i }));
                      let displayLetters = [];
                      if (stage === 'reveal' || jumbledOrder.length === 0) {
                        displayLetters = letterObjects;
                      } else {
                        displayLetters = jumbledOrder.map(id => letterObjects.find(l => l.id === id)!).filter(Boolean);
                      }
                      return displayLetters.map((item, i) => (
                        <motion.div 
                          key={item.id}
                          layout
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: stage === 'reveal' ? 0 : i * 0.1, type: 'spring' }}
                          className={`w-32 h-40 md:w-40 md:h-48 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] flex items-center justify-center text-7xl md:text-[6rem] font-black border-b-[16px] uppercase z-10 ${stage === 'reveal' ? 'bg-emerald-500 text-white border-emerald-700 shadow-[0_0_40px_rgba(16,185,129,0.5)]' : 'bg-slate-100 text-indigo-600 border-indigo-200'}`}
                        >
                          {item.char}
                        </motion.div>
                      ));
                    })()}
                  </div>
                </div>
              )}
              
              {quiz.type === 'find-in-map' && (
                <div className="w-full flex-1 min-h-[300px] max-h-[60vh] shrink-0 mt-4 rounded-3xl overflow-hidden relative">
                  <MapQuestion question={question} timeLeft={timeLeft} />
                </div>
              )}
              
              {quiz.type === '5-clues' && question.options && (
                <div className="grid grid-cols-2 gap-4 md:gap-6 mt-4 w-full max-w-6xl">
                  {question.options.map((option, i) => {
                    const isCorrect = option === question.correctAnswer;
                    const isReveal = stage === 'reveal';
                    let optClass = "bg-slate-100 text-slate-700 border-2 border-slate-200";
                    if (quiz.mode === 'interactive' && !isReveal) {
                      optClass += " cursor-pointer hover:bg-white active:scale-95";
                    } else if (isReveal) {
                      if (quiz.mode === 'interactive' && interactiveOptionClicked) {
                        if (option === interactiveOptionClicked) {
                          if (isCorrect) {
                            optClass = "bg-emerald-500 text-white border-2 border-emerald-600 shadow-[0_0_50px_rgba(16,185,129,0.8)] scale-[1.02]";
                          } else {
                            optClass = "bg-rose-500 text-white border-2 border-rose-600 shadow-[0_0_50px_rgba(244,63,94,0.8)] scale-[1.02]";
                          }
                        } else if (isCorrect) {
                          optClass = "bg-emerald-500 text-white border-2 border-emerald-600 shadow-lg scale-[1.02]";
                        } else {
                          optClass = "bg-slate-100 text-slate-400 border-2 border-slate-200 opacity-50";
                        }
                      } else {
                        if (isCorrect) optClass = "bg-emerald-500 text-white border-2 border-emerald-600 shadow-lg scale-[1.02]";
                        else optClass = "bg-slate-100 text-slate-400 border-2 border-slate-200 opacity-50";
                      }
                    }
                    return (
                      <div key={i} 
                        onClick={() => {
                          if (quiz.mode === 'interactive' && !isReveal) {
                            if (timerRef.current) clearInterval(timerRef.current);
                            setInteractiveOptionClicked(option);
                            if (isCorrect) {
                              setScore(s => {
                                const inc = (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1);
                                const nextScore = s + inc;
                                const threshold = Math.ceil(quiz.questions.length / 2) * inc;
                                if (s < threshold && nextScore >= threshold) {
                                  confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
                                }
                                return nextScore;
                              });
                              if (quiz.isMultiplayer) {
                                setPlayersState(prev => {
                                  const next = [...prev];
                                  if (next[currentPlayerIndex]) {
                                    next[currentPlayerIndex] = { ...next[currentPlayerIndex], score: next[currentPlayerIndex].score + (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1) };
                                  }
                                  return next;
                                });
                              }
                              audioSynth.playCorrect();
                            } else {
                              audioSynth.playWrong();
                            }
                            window.speechSynthesis.cancel();
                            setStage('reveal');
                          }
                        }}
                        className={`px-6 py-5 rounded-2xl text-2xl md:text-3xl font-bold flex items-center gap-4 transition-all duration-500 ${optClass}`}>
                        <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full flex items-center justify-center font-black text-xl md:text-2xl shadow-inner ${isReveal && isCorrect ? 'bg-white text-emerald-600' : 'bg-white text-slate-500'}`}>
                          {optionLetters[i]}
                        </div>
                        <span className="leading-tight truncate" title={option}>{option}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Options or Clues Grid */}
            {quiz.type === 'detective' && (
              <div className="flex-1 w-full shrink-0 mb-6 flex flex-col gap-2 md:gap-3">
                {question.sentences?.map((sentence, i) => {
                  const isFake = i === question.fakeSentenceIndex;
                  const isReveal = stage === 'reveal';
                  
                  let itemClass = "bg-white text-slate-800 border-l-8 border-indigo-500 shadow-lg";
                  let numClass = "bg-indigo-100 text-indigo-600";
                  
                  if (quiz.mode === 'interactive' && !isReveal) {
                    itemClass += " cursor-pointer hover:bg-slate-50 active:scale-95";
                  } else if (isReveal) {
                    if (quiz.mode === 'interactive' && interactiveOptionClicked) {
                      const wasClicked = interactiveOptionClicked === sentence;
                      if (wasClicked) {
                        if (isFake) {
                          itemClass = "bg-emerald-500 text-white border-l-8 border-emerald-700 shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-[1.02]";
                          numClass = "bg-white text-emerald-600";
                        } else {
                          itemClass = "bg-rose-500 text-white border-l-8 border-rose-700 shadow-[0_0_30px_rgba(244,63,94,0.6)] scale-[1.02]";
                          numClass = "bg-white text-rose-600";
                        }
                      } else if (isFake) {
                        itemClass = "bg-emerald-500 text-white border-l-8 border-emerald-700 shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-[1.02]";
                        numClass = "bg-white text-emerald-600";
                      } else {
                        itemClass = "bg-white text-slate-400 border-l-8 border-slate-200 opacity-50";
                        numClass = "bg-slate-100 text-slate-400";
                      }
                    } else {
                      if (isFake) {
                        itemClass = "bg-rose-500 text-white border-l-8 border-rose-700 shadow-[0_0_30px_rgba(244,63,94,0.6)] scale-[1.02]";
                        numClass = "bg-white text-rose-600";
                      } else {
                        itemClass = "bg-white text-slate-400 border-l-8 border-slate-200 opacity-50";
                        numClass = "bg-slate-100 text-slate-400";
                      }
                    }
                  }
                  
                  return (
                    <motion.div
                      key={i}
                      onClick={() => {
                        if (quiz.mode === 'interactive' && !isReveal) {
                          if (timerRef.current) clearInterval(timerRef.current);
                          setInteractiveOptionClicked(sentence);
                          if (isFake) {
                            setScore(s => {
                              const inc = (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1);
                              const nextScore = s + inc;
                              const threshold = Math.ceil(quiz.questions.length / 2) * inc;
                              if (s < threshold && nextScore >= threshold) {
                                confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
                              }
                              return nextScore;
                            });
                              if (quiz.isMultiplayer) {
                                setPlayersState(prev => {
                                  const next = [...prev];
                                  if (next[currentPlayerIndex]) {
                                    next[currentPlayerIndex] = { ...next[currentPlayerIndex], score: next[currentPlayerIndex].score + (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1) };
                                  }
                                  return next;
                                });
                              }
                            audioSynth.playCorrect();
                          } else {
                            audioSynth.playWrong();
                          }
                          window.speechSynthesis.cancel();
                          setStage('reveal');
                        }
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={`px-4 py-3 md:px-6 md:py-4 rounded-2xl text-xl md:text-2xl font-bold flex items-center gap-4 transform transition-all ${itemClass}`}
                    >
                      <div className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full flex items-center justify-center font-black text-xl md:text-2xl shadow-inner ${numClass}`}>
                        {i + 1}
                      </div>
                      <span className="leading-tight">{sentence}</span>
                    </motion.div>
                  );
                })}
                {stage === 'reveal' && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-2 px-6 py-4 rounded-3xl bg-indigo-600 text-white border-b-8 border-indigo-800 shadow-[0_0_50px_rgba(79,70,229,0.8)] text-2xl md:text-3xl font-bold text-center"
                  >
                    <span className="block text-xl opacity-80 uppercase tracking-wider mb-2 font-black">Insight</span>
                    {question.insight}
                  </motion.div>
                )}
              </div>
            )}
            
            {quiz.type === '5-clues' && (
              <div className="flex-1 w-full shrink-0 mb-6 flex flex-col gap-2 md:gap-3">
                {question.clues?.map((clue, i) => {
                  const isVisible = i <= clueIndex || stage === 'reveal';
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5 }}
                      className={`px-4 py-3 md:px-6 md:py-4 rounded-2xl text-xl md:text-2xl lg:text-3xl font-bold shadow-lg flex items-center gap-4 transform transition-all ${isVisible ? 'bg-white text-slate-800 border-l-8 border-indigo-500' : 'hidden'}`}
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xl md:text-2xl shadow-inner">
                        {i + 1}
                      </div>
                      <span className="leading-tight">{clue}</span>
                    </motion.div>
                  );
                })}
                {stage === 'reveal' && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-2 px-6 py-4 rounded-3xl bg-emerald-500 text-white border-b-8 border-emerald-700 shadow-[0_0_50px_rgba(16,185,129,0.8)] text-3xl md:text-4xl font-black text-center"
                  >
                    Answer: {question.correctAnswer}
                  </motion.div>
                )}
              </div>
            )}
            
            {quiz.type === 'jumbled-letters' && (
              <div className="flex-1 w-full shrink-0 mb-6 flex flex-col gap-2 md:gap-3">
                {question.clues?.map((clue, i) => {
                  const isVisible = i <= clueIndex || stage === 'reveal';
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5 }}
                      className={`px-6 py-5 md:px-8 md:py-6 rounded-3xl text-3xl md:text-4xl lg:text-5xl font-bold shadow-lg flex items-center gap-6 transform transition-all ${isVisible ? 'bg-white text-slate-800 border-l-[12px] border-indigo-500' : 'hidden'}`}
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-3xl md:text-4xl shadow-inner">
                        {i + 1}
                      </div>
                      <span className="leading-tight">{clue}</span>
                    </motion.div>
                  );
                })}
                {stage === 'reveal' && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-2 px-6 py-4 rounded-3xl bg-emerald-500 text-white border-b-8 border-emerald-700 shadow-[0_0_50px_rgba(16,185,129,0.8)] text-3xl md:text-4xl font-black text-center uppercase tracking-widest"
                  >
                    Answer: {question.correctAnswer}
                  </motion.div>
                )}
              </div>
            )}

            {quiz.type === 'match-the-following' && question.pairs && (
              <div className="w-full flex-1 mb-6 flex gap-4 md:gap-8 justify-center items-stretch mt-4">
                <div className="flex flex-col gap-3 md:gap-4 w-1/2">
                  {question.pairs.map((pair, i) => (
                    <motion.div key={`left-${i}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="px-6 py-6 md:px-8 md:py-8 bg-indigo-100 border-4 border-indigo-200 rounded-3xl text-3xl md:text-5xl lg:text-6xl font-bold text-indigo-900 shadow-md flex items-center justify-center min-h-[120px] md:min-h-[150px] text-center leading-tight">
                      {pair.left}
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-col gap-3 md:gap-4 w-1/2">
                  {(stage === 'reveal' ? question.pairs.map(p => p.right) : shuffledRights).map((right, i) => (
                    <motion.div layout key={`right-${right}`} layoutId={`right-${right}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: stage === 'reveal' ? i * 0.4 : i * 0.1, type: 'spring', bounce: 0.4, duration: 0.8 }} className={`px-6 py-6 md:px-8 md:py-8 ${stage === 'reveal' ? 'bg-emerald-500 border-emerald-700 text-white border-b-[12px] shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-slate-100 border-slate-200 text-slate-800 border-b-[12px]'} rounded-3xl text-3xl md:text-5xl lg:text-6xl font-bold flex items-center justify-center min-h-[120px] md:min-h-[150px] text-center leading-tight`}>
                      {right}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {quiz.type === 'word-search' && question.grid && (
              <div className="w-full flex-1 flex flex-col items-center justify-center mt-4 mb-6">
                <div className="grid grid-cols-10 gap-1 md:gap-2 bg-indigo-100 p-3 md:p-5 rounded-3xl shadow-inner border-8 border-indigo-200">
                  {question.grid.map((row, r) => (
                    row.map((cell, c) => {
                      let isHighlighted = false;
                      if (stage === 'reveal' && question.wordLocations) {
                        const wordLoc = question.wordLocations.find(w => w.cells.some(cellPos => cellPos.r === r && cellPos.c === c));
                        if (wordLoc) isHighlighted = true;
                      }

                      return (
                        <div key={`${r}-${c}`} className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-[4rem] lg:h-[4rem] flex items-center justify-center rounded-xl md:rounded-2xl text-2xl sm:text-3xl md:text-4xl lg:text-[2.2rem] font-black transition-all duration-500 border-b-[6px] ${isHighlighted ? 'bg-emerald-400 text-white border-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.8)] z-10 scale-110' : 'bg-white text-slate-700 border-slate-200'}`}>
                           {cell}
                        </div>
                      );
                    })
                  ))}
                </div>
                {stage === 'reveal' && question.wordsToFind && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex flex-wrap gap-4 justify-center max-w-4xl">
                    {question.wordsToFind.map((word, i) => (
                      <div key={word} className="px-6 py-3 bg-white text-emerald-600 font-black text-2xl md:text-3xl rounded-full shadow-lg border-4 border-emerald-100 uppercase tracking-widest">
                        {word}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            )}

            {quiz.type === 'text-presentation' && (
              <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto mt-4 mb-4">
                {question.clues?.map((clue, idx) => (
                  <AnimatePresence key={idx}>
                    {idx <= clueIndex && (
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-indigo-50 rounded-2xl p-6 text-left shadow-md border-l-8 border-indigo-500"
                      >
                        <p className="text-3xl md:text-4xl font-bold text-indigo-900 drop-shadow-sm">
                          {clue}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            )}

            {quiz.type !== 'text-presentation' && quiz.type !== '5-clues' && quiz.type !== 'detective' && quiz.type !== 'jumbled-letters' && quiz.type !== 'match-the-following' && quiz.type !== 'word-search' && (
              <div className={`flex flex-col w-full ${quiz.mode === 'interactive' ? 'items-start text-left' : 'items-center'}`}>
                <div className={`grid grid-cols-1 ${quiz.mode === 'interactive' ? 'lg:grid-cols-2' : 'md:grid-cols-2'} gap-6 w-full shrink-0 mb-6`}>
                  {question.options?.map((option, i) => {
                    const isCorrect = option === question.correctAnswer;
                    const isReveal = stage === 'reveal';
                    
                    let cardClass = "bg-white text-slate-800 border-b-8 border-slate-300";
                    if (quiz.mode === 'interactive' && !isReveal) {
                      cardClass += " cursor-pointer hover:bg-slate-50 active:scale-95";
                    } else if (isReveal) {
                      if (quiz.mode === 'interactive' && interactiveOptionClicked) {
                        if (option === interactiveOptionClicked) {
                          if (isCorrect) {
                            cardClass = "bg-emerald-500 text-white border-b-8 border-emerald-700 shadow-[0_0_50px_rgba(16,185,129,0.8)]";
                          } else {
                            cardClass = "bg-rose-500 text-white border-b-8 border-rose-700 shadow-[0_0_50px_rgba(244,63,94,0.8)]";
                          }
                        } else if (isCorrect) {
                           cardClass = "bg-emerald-500 text-white border-b-8 border-emerald-700 shadow-[0_0_50px_rgba(16,185,129,0.8)]";
                        } else {
                           cardClass = "bg-white text-slate-400 border-b-8 border-slate-200 opacity-60";
                        }
                      } else {
                        if (isCorrect) {
                          cardClass = "bg-emerald-500 text-white border-b-8 border-emerald-700 shadow-[0_0_50px_rgba(16,185,129,0.8)]";
                        } else {
                          cardClass = "bg-white text-slate-400 border-b-8 border-slate-200 opacity-60";
                        }
                      }
                    }

                    return (
                      <motion.div
                        key={i}
                        onClick={() => {
                          if (quiz.mode === 'interactive' && !isReveal) {
                            if (timerRef.current) clearInterval(timerRef.current);
                            setInteractiveOptionClicked(option);
                            if (isCorrect) {
                              setScore(s => s + (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1));
                              if (quiz.isMultiplayer) {
                                setPlayersState(prev => {
                                  const next = [...prev];
                                  if (next[currentPlayerIndex]) {
                                    next[currentPlayerIndex] = { ...next[currentPlayerIndex], score: next[currentPlayerIndex].score + (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1) };
                                  }
                                  return next;
                                });
                              }
                              audioSynth.playCorrect();
                            } else {
                              audioSynth.playWrong();
                            }
                            window.speechSynthesis.cancel();
                            setStage('reveal');
                          }
                        }}
                        animate={isReveal && isCorrect ? { scale: [1, 1.05, 1] } : {}}
                        transition={isReveal && isCorrect ? { repeat: Infinity, duration: 1.5 } : {}}
                        className={`px-8 py-6 rounded-3xl text-3xl md:text-4xl lg:text-5xl font-black shadow-2xl flex items-center gap-8 transform transition-all ${cardClass}`}
                      >
                        <div className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full flex items-center justify-center font-black text-3xl md:text-4xl shadow-inner ${isReveal && isCorrect ? 'bg-white text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          {optionLetters[i]}
                        </div>
                        <span className="leading-tight">{option}</span>
                      </motion.div>
                    );
                  })}
                </div>
                
                {stage === 'reveal' && quiz.mode === 'interactive' && quiz.isMultiplayer && (() => {
                  let isInteractiveCorrect = false;
                  if ((quiz.type as string) === 'detective') {
                    isInteractiveCorrect = interactiveOptionClicked === (question.sentences && question.fakeSentenceIndex !== undefined ? question.sentences[question.fakeSentenceIndex] : undefined);
                  } else {
                    isInteractiveCorrect = interactiveOptionClicked === question.correctAnswer;
                  }
                  
                  if (!isInteractiveCorrect) return null;
                  
                  return (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] pointer-events-none flex flex-col items-center"
                    >
                      <div className="bg-gradient-to-br from-amber-300 to-orange-500 p-8 rounded-full shadow-[0_0_100px_rgba(245,158,11,0.8)] border-8 border-white flex flex-col items-center gap-4 animate-bounce">
                        <span className="text-6xl text-white drop-shadow-lg">🌟</span>
                        <span className="bg-white text-orange-600 px-6 py-2 rounded-full font-black text-2xl uppercase tracking-widest shadow-inner whitespace-nowrap">
                          {quiz.topic} Master!
                        </span>
                        <span className="text-white font-bold text-2xl drop-shadow-md bg-black/20 px-4 py-1 rounded-full">
                          +{quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1} {playersState[currentPlayerIndex]?.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })()}
                
                {stage === 'reveal' && question.insight && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-emerald-50 border-4 border-emerald-200 rounded-3xl p-6 md:p-8 flex items-center gap-6 shadow-xl mb-6"
                  >
                    <div className="bg-emerald-200 text-emerald-700 rounded-full p-4">
                      <Lightbulb className="w-8 h-8 md:w-10 md:h-10 fill-current" />
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-emerald-900 leading-snug">
                      {question.insight}
                    </p>
                  </motion.div>
                )}
              </div>
            )}
            </>
            )}
          </motion.div>
          </motion.div>
        )}

        {stage === 'quote' && quiz.quotes?.[0] && (
          <motion.div
            key={`quote`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="w-full max-w-5xl p-8 flex flex-col items-center justify-center h-full z-10"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 md:p-16 shadow-2xl border-2 border-white/20 text-center relative">
              <h1 className="text-3xl md:text-5xl font-black text-yellow-300 mb-8 drop-shadow-md uppercase tracking-wider">Quote for the day</h1>
              <span className="absolute -top-10 -left-6 text-9xl text-yellow-300 opacity-50 font-serif">"</span>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight drop-shadow-lg text-white">
                {quiz.quotes[0].text}
              </h2>
              {quiz.quotes[0].author && quiz.quotes[0].author.toLowerCase() !== 'unknown' && (
                <p className="text-2xl md:text-4xl font-bold text-yellow-300 drop-shadow-md">
                  - {quiz.quotes[0].author}
                </p>
              )}
              <span className="absolute -bottom-16 -right-6 text-9xl text-yellow-300 opacity-50 font-serif">"</span>
            </div>
          </motion.div>
        )}

        {stage === 'score' && quiz.mode === 'interactive' && (
          <motion.div
            key="score"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-12 max-w-7xl flex flex-col items-center justify-center h-full z-10 mx-auto w-full"
          >
            <div className="relative flex justify-center items-center mb-8">
              <Trophy className="w-32 h-32 md:w-40 md:h-40 text-yellow-300 drop-shadow-[0_0_50px_rgba(250,204,21,0.8)]" />
              <Star className="w-12 h-12 text-yellow-100 absolute -top-4 -right-8 animate-spin-slow" />
              <Sparkles className="w-10 h-10 text-yellow-100 absolute top-4 -left-8 animate-ping" />
            </div>

            {quiz.isMultiplayer ? (
              <div className="flex flex-col gap-6 w-full max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-8">
                  Final Scores!
                </h1>
                {[...playersState].sort((a, b) => a.score - b.score).map((player, idx) => (
                  <motion.div 
                    key={player.id}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.5, type: 'spring' }}
                    className={`flex items-center justify-between p-6 rounded-3xl ${idx === (quiz.players?.length || 1) - 1 ? 'bg-yellow-400 text-yellow-900 shadow-[0_0_40px_rgba(250,204,21,0.6)] scale-105 border-4 border-white z-10' : 'bg-white/20 text-white backdrop-blur-sm border-2 border-white/30'}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl font-black ${idx === (quiz.players?.length || 1) - 1 ? 'bg-white text-yellow-500' : 'bg-white/30 text-white'}`}>
                        {(quiz.players?.length || 1) - idx}
                      </div>
                      {player.photo && <img src={player.photo} className="w-16 h-16 rounded-full border-2 border-white object-cover" />}
                      <h2 className="text-3xl md:text-5xl font-bold">{player.name}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                      {idx === (quiz.players?.length || 1) - 1 && <span className="text-5xl">👑</span>}
                      <span className="text-5xl md:text-6xl font-black">{player.score}</span>
                    </div>
                  </motion.div>
                ))}
                
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (quiz.players?.length || 1) * 0.5 + 1 }}
                    onClick={() => setStage('badges')}
                    className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-xl md:text-2xl shadow-xl hover:bg-indigo-50 transition-all"
                  >
                    See Badges
                  </motion.button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl">
                  {quiz.teamName || 'Player 1'}
                </h1>
                <div className="flex items-center justify-center gap-8 mt-4">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [-15, 15, -15],
                      x: [0, 20, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 0.4, ease: "easeInOut" }}
                    className="text-[6rem] md:text-[10rem] drop-shadow-xl origin-right"
                  >
                    👏
                  </motion.div>
                  <p className="text-[10rem] md:text-[16rem] font-bold text-cyan-100 drop-shadow-lg leading-none">
                    {score} <span className="text-[5rem] md:text-[8rem] text-cyan-200">/ {quiz.questions.length}</span>
                  </p>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [15, -15, 15],
                      x: [0, -20, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 0.4, ease: "easeInOut" }}
                    className="text-[6rem] md:text-[10rem] drop-shadow-xl origin-left"
                    style={{ transform: "scaleX(-1)" }}
                  >
                    👏
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-10 flex flex-wrap justify-center gap-4"
                >
                  <button
                    onClick={() => setStage('badges')}
                    className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-xl md:text-2xl shadow-xl hover:bg-indigo-50 transition-all"
                  >
                    See Badges
                  </button>
                </motion.div>
              </>
            )}
          </motion.div>
        )}

        
        {stage === 'video-badges' && (() => {
          const numAnswered = (quiz.mode === 'interactive' && quiz.type !== 'combat-mode')
            ? answeredQuestions.size 
            : currentQuestionIndex + 1;
            
          const currentBadge = getDynamicMilestoneBadge(numAnswered);
          
          return (
          <motion.div
            key="video-badges"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-12 max-w-7xl flex flex-col items-center justify-center h-full z-10 mx-auto w-full"
          >
             <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-12">
               {quiz.mode === 'interactive' ? `${currentBadge.player}'s Milestone!` : 'Audience Milestone!'}
             </h1>
             <motion.div
                initial={{ scale: 0, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className={`bg-white rounded-3xl p-12 flex flex-col items-center text-center shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-b-[16px] ${currentBadge.color} w-full max-w-md`}
              >
                <div className="text-8xl md:text-9xl mb-8 filter drop-shadow-lg animate-bounce">{currentBadge.icon}</div>
                <h3 className={`text-3xl md:text-5xl font-black ${currentBadge.text} mb-4`}>{currentBadge.title}</h3>
                <p className="text-xl md:text-2xl text-slate-600 font-bold">{currentBadge.description}</p>
                <div className="mt-6 py-2 px-6 bg-slate-100 rounded-full font-bold text-slate-500">
                  {numAnswered} Questions Completed in {currentBadge.contextTopic}!
                </div>
              </motion.div>
          </motion.div>
        );
        })()}

        {stage === 'badges' && (
          <motion.div
            key="badges"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-12 max-w-7xl flex flex-col items-center justify-center h-full z-10 mx-auto w-full"
          >
             <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-12">
               Earned Badges!
             </h1>
             <div className="flex flex-wrap items-center justify-center gap-8 w-full max-w-5xl">
               {earnedBadges.map((badge, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.4, type: 'spring', bounce: 0.5 }}
                    className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-b-[12px] border-slate-200 w-64 md:w-80"
                  >
                    <div className="text-7xl md:text-8xl mb-6 filter drop-shadow-md">{badge.icon}</div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">{badge.name}</h3>
                    <p className="text-lg text-slate-500 font-bold mb-4">{badge.player}</p>
                    <p className="text-sm md:text-base text-slate-600 font-medium">{badge.description}</p>
                  </motion.div>
               ))}
             </div>
             
             <div className="mt-16 flex flex-wrap justify-center gap-6">
               <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: earnedBadges.length * 0.4 + 1 }}
                  onClick={() => {
                    if (quiz.participantTopic && quiz.participantTopic.trim()) {
                      setStage('talk');
                    } else {
                      setStage('outro');
                    }
                  }}
                  className="px-10 py-5 bg-yellow-400 text-yellow-900 rounded-full font-black text-2xl shadow-[0_10px_0_rgba(202,138,4,1)] hover:translate-y-2 hover:shadow-none transition-all"
                >
                  Continue
               </motion.button>
             </div>
          </motion.div>
        )}

        {stage === 'talk' && quiz.mode === 'interactive' && (
          <motion.div
            key="talk"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-12 max-w-5xl flex flex-col items-center justify-center h-full z-10 mx-auto w-full"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 shadow-2xl border-2 border-white/20 w-full relative">
              <Star className="absolute -top-8 -left-8 w-16 h-16 text-yellow-300 animate-spin-slow" />
              <Star className="absolute -bottom-8 -right-8 w-16 h-16 text-yellow-300 animate-spin-slow" />
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-widest drop-shadow-lg">
                Participant Talk Time!
              </h2>
              <div className="bg-white text-indigo-900 rounded-2xl p-8 shadow-inner mb-8 border-4 border-indigo-200">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 opacity-80 uppercase tracking-widest">{quiz.teamName || 'Player 1'}</h3>
                <p className="text-4xl md:text-6xl font-black leading-tight drop-shadow-sm">
                  "{quiz.participantTopic}"
                </p>
              </div>
              <p className="text-xl md:text-2xl font-bold text-white opacity-80 flex items-center justify-center gap-3">
                <Clock className="w-8 h-8 animate-pulse" /> You have 2 minutes to talk!
              </p>
              <button
                  onClick={() => setStage('outro')}
                  className="mt-8 px-6 py-3 bg-white/20 text-white rounded-full font-bold text-lg hover:bg-white/30 transition-all border border-white/50"
                >
                  Skip Timer
                </button>
            </div>
          </motion.div>
        )}

        {stage === 'outro' && (
          <motion.div
            key="outro"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-6 md:p-12 max-w-6xl flex flex-col items-center justify-center h-full z-10 mx-auto w-full"
          >
            {quiz.mode === 'interactive' ? (
              <div className="flex flex-col items-center justify-center w-full max-w-5xl">
                <div className="relative mb-6 flex justify-center items-center">
                  <Star className="w-28 h-28 md:w-36 md:h-36 text-yellow-300 drop-shadow-[0_0_50px_rgba(250,204,21,0.8)] animate-pulse" />
                </div>
                <h1 className="text-4xl md:text-7xl font-black mb-3 text-white drop-shadow-2xl uppercase tracking-tight">
                  Thank you for participating!
                </h1>
                <p className="text-2xl md:text-3xl font-extrabold text-cyan-200 drop-shadow-md mb-8">
                  Great job, {quiz.teamName || 'Player 1'}!
                </p>

                {/* Animated Call-to-Action Cards for LIKE, SUBSCRIBE & SHARE */}
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 w-full mb-8">
                  
                  {/* LIKE CARD */}
                  <motion.div
                    initial={{ scale: 0.8, y: 30, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="bg-white/15 backdrop-blur-md border-2 border-white/30 rounded-3xl p-6 md:p-8 flex flex-col items-center shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:bg-white/25 transition-all min-w-[220px] md:min-w-[260px]"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.25, 1],
                        rotate: [0, -12, 12, 0]
                      }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                      className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl flex items-center justify-center text-white shadow-xl mb-4 border-3 border-white/40"
                    >
                      <ThumbsUp className="w-12 h-12 md:w-16 md:h-16 fill-white text-blue-600 drop-shadow-md" />
                    </motion.div>
                    <span className="text-3xl md:text-4xl font-black text-white tracking-wide uppercase drop-shadow">LIKE</span>
                    <span className="text-sm md:text-base font-bold text-cyan-200 mt-1">Hit the Thumb!</span>
                  </motion.div>

                  {/* SUBSCRIBE CARD (PROMINENT YOUTUBE RED & LARGE) */}
                  <motion.div
                    initial={{ scale: 0.8, y: 30, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                    className="bg-gradient-to-b from-red-600 via-rose-600 to-red-700 border-4 border-white/60 rounded-3xl p-7 md:p-9 flex flex-col items-center shadow-[0_25px_60px_rgba(225,29,72,0.7)] hover:scale-105 transition-all relative overflow-hidden min-w-[260px] md:min-w-[320px]"
                  >
                    {/* Animated Light Shimmer */}
                    <motion.div 
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "linear", repeatDelay: 0.8 }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 pointer-events-none"
                    />

                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        animate={{ rotate: [-25, 25, -20, 20, 0], scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.3 }}
                        className="bg-white text-red-600 rounded-full p-3 shadow-lg"
                      >
                        <Bell className="w-9 h-9 md:w-12 md:h-12 fill-current" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.8 }}
                        className="bg-white text-red-600 rounded-2xl p-3 shadow-lg flex items-center justify-center"
                      >
                        <Youtube className="w-10 h-10 md:w-14 md:h-14 fill-current" />
                      </motion.div>
                    </div>

                    <span className="text-3xl md:text-5xl font-black text-white tracking-wider uppercase drop-shadow-lg">SUBSCRIBE</span>
                    <span className="text-sm md:text-base font-black text-white bg-black/30 px-4 py-1.5 rounded-full mt-3 border border-white/30 shadow-inner">
                      🔔 Turn on Notifications!
                    </span>
                  </motion.div>

                  {/* SHARE CARD */}
                  <motion.div
                    initial={{ scale: 0.8, y: 30, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                    className="bg-white/15 backdrop-blur-md border-2 border-white/30 rounded-3xl p-6 md:p-8 flex flex-col items-center shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:bg-white/25 transition-all min-w-[220px] md:min-w-[260px]"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-3xl flex items-center justify-center text-white shadow-xl mb-4 border-3 border-white/40"
                    >
                      <Share2 className="w-12 h-12 md:w-16 md:h-16 text-white drop-shadow-md" />
                    </motion.div>
                    <span className="text-3xl md:text-4xl font-black text-white tracking-wide uppercase drop-shadow">SHARE</span>
                    <span className="text-sm md:text-base font-bold text-pink-200 mt-1">Share with Friends!</span>
                  </motion.div>

                </div>

                <div className="mt-6 flex items-center justify-center gap-6">
                  <button
                    onClick={onExit}
                    className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-xl md:text-2xl shadow-xl hover:bg-indigo-50 transition-all active:scale-95"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={handleExportResults}
                    title="Export Results (JSON)"
                    aria-label="Export Results (JSON)"
                    className="p-4 bg-white/20 hover:bg-white/30 text-white rounded-full shadow-xl border-2 border-white/40 transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                  >
                    <Download className="w-7 h-7 md:w-8 md:h-8 text-yellow-300 drop-shadow" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full max-w-5xl">
                {/* Logo & Trophy */}
                <div className="flex items-center justify-center gap-6 mb-6">
                  <motion.div 
                    animate={{ y: [0, -10, 0], scale: [1, 1.03, 1] }} 
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.7)] border-6 border-white relative group"
                  >
                    <img src={quizLogo} alt="Quiz Time Brain Boosters" className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700" />
                  </motion.div>
                  <div className="relative flex justify-center items-center">
                    <Trophy className="w-24 h-24 md:w-32 md:h-32 text-yellow-300 drop-shadow-[0_0_50px_rgba(250,204,21,0.8)]" />
                    <Star className="w-10 h-10 text-yellow-100 absolute -top-3 -right-6 animate-spin-slow" />
                    <Sparkles className="w-8 h-8 text-yellow-100 absolute top-3 -left-6 animate-ping" />
                  </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-black mb-3 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] uppercase tracking-tight">
                  {outroMessage.title}
                </h1>
                <p className="text-2xl md:text-4xl font-extrabold opacity-100 text-cyan-200 drop-shadow-md mb-8">
                  {outroMessage.subtitle}
                </p>

                {/* Animated Call-to-Action Cards for LIKE, SUBSCRIBE & SHARE */}
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 w-full mb-8">
                  
                  {/* LIKE CARD */}
                  <motion.div
                    initial={{ scale: 0.8, y: 30, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="bg-white/15 backdrop-blur-md border-2 border-white/30 rounded-3xl p-6 md:p-8 flex flex-col items-center shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:bg-white/25 transition-all min-w-[220px] md:min-w-[260px]"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.25, 1],
                        rotate: [0, -12, 12, 0]
                      }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                      className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl flex items-center justify-center text-white shadow-xl mb-4 border-3 border-white/40"
                    >
                      <ThumbsUp className="w-12 h-12 md:w-16 md:h-16 fill-white text-blue-600 drop-shadow-md" />
                    </motion.div>
                    <span className="text-3xl md:text-4xl font-black text-white tracking-wide uppercase drop-shadow">LIKE</span>
                    <span className="text-sm md:text-base font-bold text-cyan-200 mt-1">Hit the Thumb!</span>
                  </motion.div>

                  {/* SUBSCRIBE CARD (PROMINENT YOUTUBE RED & LARGE) */}
                  <motion.div
                    initial={{ scale: 0.8, y: 30, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                    className="bg-gradient-to-b from-red-600 via-rose-600 to-red-700 border-4 border-white/60 rounded-3xl p-7 md:p-9 flex flex-col items-center shadow-[0_25px_60px_rgba(225,29,72,0.7)] hover:scale-105 transition-all relative overflow-hidden min-w-[260px] md:min-w-[320px]"
                  >
                    {/* Animated Light Shimmer */}
                    <motion.div 
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "linear", repeatDelay: 0.8 }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 pointer-events-none"
                    />

                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        animate={{ rotate: [-25, 25, -20, 20, 0], scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.3 }}
                        className="bg-white text-red-600 rounded-full p-3 shadow-lg"
                      >
                        <Bell className="w-9 h-9 md:w-12 md:h-12 fill-current" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.8 }}
                        className="bg-white text-red-600 rounded-2xl p-3 shadow-lg flex items-center justify-center"
                      >
                        <Youtube className="w-10 h-10 md:w-14 md:h-14 fill-current" />
                      </motion.div>
                    </div>

                    <span className="text-3xl md:text-5xl font-black text-white tracking-wider uppercase drop-shadow-lg">SUBSCRIBE</span>
                    <span className="text-sm md:text-base font-black text-white bg-black/30 px-4 py-1.5 rounded-full mt-3 border border-white/30 shadow-inner">
                      🔔 Turn on Notifications!
                    </span>
                  </motion.div>

                  {/* SHARE CARD */}
                  <motion.div
                    initial={{ scale: 0.8, y: 30, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                    className="bg-white/15 backdrop-blur-md border-2 border-white/30 rounded-3xl p-6 md:p-8 flex flex-col items-center shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:bg-white/25 transition-all min-w-[220px] md:min-w-[260px]"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-3xl flex items-center justify-center text-white shadow-xl mb-4 border-3 border-white/40"
                    >
                      <Share2 className="w-12 h-12 md:w-16 md:h-16 text-white drop-shadow-md" />
                    </motion.div>
                    <span className="text-3xl md:text-4xl font-black text-white tracking-wide uppercase drop-shadow">SHARE</span>
                    <span className="text-sm md:text-base font-bold text-pink-200 mt-1">Share with Friends!</span>
                  </motion.div>

                </div>

                <p className="text-2xl md:text-3xl font-bold opacity-90 text-white drop-shadow mb-8">
                  {outroMessage.footer}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={onExit}
                    className="px-8 py-4 bg-white text-indigo-700 rounded-full font-bold text-lg md:text-xl shadow-lg hover:bg-indigo-50 transition-all active:scale-95"
                  >
                    Exit Session
                  </button>
                  <button
                    onClick={handleExportResults}
                    title="Export Results (JSON)"
                    aria-label="Export Results (JSON)"
                    className="p-4 bg-white/20 hover:bg-white/30 text-white rounded-full shadow-lg border-2 border-white/40 transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                  >
                    <Download className="w-7 h-7 text-yellow-300 drop-shadow" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

