import confetti from 'canvas-confetti';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Quiz } from '../types';
import { audioSynth } from '../lib/audio';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Award, Medal, Gift, Crown, Star, Clock, Brain, Rocket, Sparkles, Lightbulb, Cat, Dumbbell, Bot, Computer, Dog, GraduationCap, Play, Pause, Camera, ThumbsUp, Bell, Youtube, Share2, Download, FileJson, Image as ImageIcon, Upload, RotateCcw } from 'lucide-react';
import quizLogo from '../assets/images/quiz_logo_1783447286811.jpg';
import MapQuestion from './MapQuestion';

interface PresentationProps {
  quiz: Quiz;
  onExit: () => void;
}

type Stage = 'intro' | 'player-intro' | 'multiplayer-intro' | 'rules' | 'warmup' | 'countdown' | 'category-selection' | 'rapid-fire-set-selection' | 'question-selection' | 'question' | 'reveal' | 'quote' | 'score' | 'rapid-fire-score' | 'badges' | 'talk' | 'celebrate' | 'outro' | 'video-badges' | 'insight' | 'memory-break-intro' | 'memory-break-memorize' | 'memory-break-question' | 'memory-break-reveal';

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

        const borderColors = ['border-emerald-400', 'border-rose-400', 'border-indigo-400', 'border-amber-400'];
        const ringColors = ['ring-emerald-400/40', 'ring-rose-400/40', 'ring-indigo-400/40', 'ring-amber-400/40'];
        const shadowColors = ['shadow-[0_0_30px_rgba(52,211,153,0.5)]', 'shadow-[0_0_30px_rgba(251,113,133,0.5)]', 'shadow-[0_0_30px_rgba(129,140,248,0.5)]', 'shadow-[0_0_30px_rgba(251,191,36,0.5)]'];
        const bColor = borderColors[idx % borderColors.length];
        const rColor = ringColors[idx % ringColors.length];
        const sColor = shadowColors[idx % shadowColors.length];

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

            {quiz.showBadges !== false && player.badges && player.badges.length > 0 && (
              <div className="flex items-center justify-between gap-1 px-2.5 py-1 bg-amber-400/20 backdrop-blur-md rounded-xl border border-amber-300/40 text-xs w-full overflow-hidden shadow-sm">
                <span className="text-[10px] font-extrabold text-amber-200 uppercase tracking-wider shrink-0">
                  Badges
                </span>
                <div className="flex items-center gap-1 overflow-hidden">
                  {player.badges.slice(-5).map((b: string, bIdx: number) => (
                    <span key={bIdx} className="text-xs drop-shadow animate-bounce">{b}</span>
                  ))}
                  {player.badges.length > 5 && (
                    <span className="text-[10px] font-black text-amber-300">+{player.badges.length - 5}</span>
                  )}
                </div>
              </div>
            )}

            {/* Video / Camera Rectangle with Minimal Elegant Border and Clean White Space */}
            <div
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 bg-white ${sizeClasses} ${
                isCurrent
                  ? `border-4 ${bColor} ring-4 ${rColor} ${sColor} scale-[1.01]`
                  : `border-4 ${bColor} shadow-lg ring-1 ring-black/5 opacity-70 hover:opacity-100`
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
  const [introducingPlayerIndex, setIntroducingPlayerIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [clueIndex, setClueIndex] = useState(0);
  const [celebratingIndex, setCelebratingIndex] = useState(0);
  const [shuffledRights, setShuffledRights] = useState<string[]>([]);
  const [jumbledOrder, setJumbledOrder] = useState<number[]>([]);
  const [imageError, setImageError] = useState(false);
  const [hasPlayedMemoryBreak, setHasPlayedMemoryBreak] = useState(false);
  const [memoryItems, setMemoryItems] = useState<string[]>([]);
  const [memoryTarget, setMemoryTarget] = useState<string>('');
  const [score, setScore] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playersState, setPlayersState] = useState<any[]>(quiz.players || []);
  const [earnedBadges, setEarnedBadges] = useState<{player: string, name: string, icon: string, description: string}[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [interactiveOptionClicked, setInteractiveOptionClicked] = useState<string | null>(null);
  const [usedFiftyFifty, setUsedFiftyFifty] = useState<Record<string, boolean>>({});
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [jumbledInput, setJumbledInput] = useState<string>("");
  const [uploadedImages, setUploadedImages] = useState<Record<number, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRapidFireSet, setSelectedRapidFireSet] = useState<string | null>(null);
  const categories = useMemo(() => Array.from(new Set(quiz.questions.map(q => q.category).filter(Boolean))) as string[], [quiz.questions]);
  const isMultipleFiles = useMemo(() => Boolean(
    quiz.isMultipleFilesLoaded ||
    categories.length > 1 ||
    quiz.topic === "Multiple JSON Files" ||
    (false)
  ), [quiz.isMultipleFilesLoaded, categories.length, quiz.topic, quiz.title]);

  const celebrationPlayers = useMemo(() => {
    if (!playersState || playersState.length === 0) {
      return [{ id: 'p1', name: quiz.teamName || 'Player 1', score: score || 0, photo: quiz.playerPhoto || '' }];
    }
    // Sort lowest score to highest score
    return [...playersState].sort((a, b) => (a.score || 0) - (b.score || 0));
  }, [playersState, quiz.teamName, quiz.playerPhoto, score]);

  const getCelebrationFrame = useCallback((rank: number, totalPlayers: number, playerName: string, scoreVal: number) => {
    if (totalPlayers === 1) {
      return {
        rank: 1,
        rankTitle: "🌟 Quiz Star Celebration!",
        badgeText: "🌟 Outstanding Performance!",
        badgeBg: "from-amber-400 via-yellow-500 to-amber-600",
        speech: `Let's celebrate ${playerName}! Fantastic job scoring ${scoreVal} points! You did an amazing job!`,
        crownIcon: "👑",
        awards: [
          { title: "Champion Cup", icon: Trophy, bg: "from-yellow-400 to-amber-600", desc: "Top Performance" },
          { title: "Master Medal", icon: Award, bg: "from-emerald-400 to-teal-600", desc: "Quiz Whiz" },
          { title: "Mystery Box", icon: Gift, bg: "from-purple-500 to-pink-600", desc: "Bonus Rewards" }
        ]
      };
    }

    if (rank === 1) {
      return {
        rank: 1,
        rankTitle: "👑 1st Place - Grand Champion!",
        badgeText: "🏆 Ultimate Winner & Gold Champion",
        badgeBg: "from-amber-300 via-yellow-400 to-amber-600",
        speech: `And in 1st place... taking the crown as our Grand Champion with ${scoreVal} points... Huge congratulations to ${playerName}! You ruled the quiz today!`,
        crownIcon: "👑 🥇",
        awards: [
          { title: "Golden Trophy", icon: Trophy, bg: "from-yellow-400 via-amber-500 to-yellow-600", desc: "1st Place Champion" },
          { title: "Crown of Victory", icon: Crown, bg: "from-amber-300 via-yellow-400 to-amber-500", desc: "Ultimate Ruler" },
          { title: "Gold Medal", icon: Medal, bg: "from-yellow-500 via-amber-600 to-yellow-700", desc: "Grand Master" }
        ]
      };
    }

    if (rank === 2) {
      return {
        rank: 2,
        rankTitle: "🥈 2nd Place - Silver Medalist!",
        badgeText: "⭐ Outstanding Runner-Up",
        badgeBg: "from-slate-200 via-slate-300 to-slate-500",
        speech: `In 2nd place with an impressive score of ${scoreVal} points... Give a big round of applause for ${playerName}! An outstanding performance!`,
        crownIcon: "🥈",
        awards: [
          { title: "Silver Cup", icon: Trophy, bg: "from-slate-300 via-slate-400 to-slate-600", desc: "2nd Place Excellence" },
          { title: "Silver Medal", icon: Medal, bg: "from-slate-200 via-slate-300 to-slate-500", desc: "Runner-Up Medal" },
          { title: "Star Performer", icon: Star, bg: "from-blue-400 via-indigo-500 to-purple-600", desc: "High Scorer" }
        ]
      };
    }

    if (rank === 3) {
      return {
        rank: 3,
        rankTitle: "🥉 3rd Place - Bronze Star!",
        badgeText: "🥉 Great Game & High Spirit",
        badgeBg: "from-amber-700 via-orange-800 to-amber-900",
        speech: `In 3rd place with a great score of ${scoreVal} points... Let's hear it for ${playerName}! Fantastic playing and super sportsmanship!`,
        crownIcon: "🥉",
        awards: [
          { title: "Bronze Shield", icon: Award, bg: "from-amber-700 via-orange-800 to-amber-900", desc: "3rd Place Honor" },
          { title: "Bronze Medal", icon: Medal, bg: "from-orange-600 via-amber-700 to-orange-800", desc: "Bronze Star" },
          { title: "Super Player", icon: Sparkles, bg: "from-teal-400 via-emerald-500 to-teal-700", desc: "Great Effort" }
        ]
      };
    }

    return {
      rank,
      rankTitle: `${rank}th Place - Great Effort!`,
      badgeText: `🌟 ${rank}th Place Participant`,
      badgeBg: "from-indigo-500 to-purple-600",
      speech: `In ${rank}th place with ${scoreVal} points... Let's give it up for ${playerName}! Fantastic effort today!`,
      crownIcon: "🏅",
      awards: [
        { title: "Participant Badge", icon: Award, bg: "from-indigo-400 to-purple-600", desc: "Awesome Playing" },
        { title: "Brain Booster", icon: Brain, bg: "from-purple-400 to-pink-600", desc: "Smart Effort" },
        { title: "Quiz Explorer", icon: Rocket, bg: "from-cyan-400 to-blue-600", desc: "Great Curiosity" }
      ]
    };
  }, []);

  const getActiveContextTopic = useCallback((qIndex?: number) => {
    const idx = qIndex !== undefined ? qIndex : currentQuestionIndex;
    const currentQCategory = quiz.questions[idx]?.category;
    if (selectedCategory && selectedCategory.trim()) return selectedCategory.trim();
    if (currentQCategory && currentQCategory.trim()) return currentQCategory.trim();
    if (quiz.topic && quiz.topic !== "Multiple JSON Files" && quiz.topic.trim()) return quiz.topic.trim();
    if (quiz.title && quiz.title.trim()) return quiz.title.trim();
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

    const titleOptionIndex = (safeBadgeIndex + (currentPlayerIndex || 0)) % titleOptions.length;
    const descOptionIndex = (safeBadgeIndex + (currentPlayerIndex || 0) + 1) % descOptions.length;

    return {
      title: titleOptions[titleOptionIndex],
      icon: meta.icon,
      description: descOptions[descOptionIndex],
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
  const rapidFireTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rapidFirePlayerIdxRef = useRef<number | null>(null);

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
  const currentType = question?.type || quiz.type;

  const isImageQuestion = Boolean(
    currentType === 'identify-image' || 
    currentType?.toLowerCase() === 'identify' ||
    question?.category?.toLowerCase().includes('identify') ||
    question?.category?.toLowerCase().includes('image') ||
    (!quiz.isMultipleFilesLoaded && (quiz.topic?.toLowerCase().startsWith('identify')))
  );

  const isImageIdentifyWithoutOptions = Boolean(
    isImageQuestion && (question && (!question.options || question.options.length === 0))
  );

  const isJumbledLetters = Boolean(
    currentType === 'jumbled-letters' || question?.type === 'jumbled-letters' ||
    (question && question.type !== 'Fill in the Blanks' && question.type !== 'Answer the Following' && question.type !== 'True or False' && currentType !== 'Fill in the Blanks' && currentType !== 'Answer the Following' && currentType !== 'True or False' && (question.correctAnswer || question.answer || question.word || question.correct_answer || question.brand_name) && (!question.options || question.options.length === 0) && !question.combatLeft && !question.grid && !question.pairs && !question.sentences && !isImageIdentifyWithoutOptions)
  );

  const jumbledLettersForQuestion = useMemo(() => {
    if (!question) return [];
    const rawAnswer = question.correctAnswer || question.answer || question.word || question.correct_answer || question.brand_name || '';
    const word = rawAnswer.replace(/\s/g, '').toUpperCase();
    if (!word) return [];

    const letterObjects = word.split('').map((char, i) => ({ char, id: i }));
    if (word.length <= 1) return letterObjects;

    // Check if custom jumbled word or string is provided
    const customJumbledString = (
      question.jumbledWord || 
      question.jumbled || 
      (question.question && question.question !== 'Unjumble the word!' ? question.question : '')
    ).replace(/\s/g, '').toUpperCase();
    const cleanCustom = customJumbledString.replace(/[^A-Z0-9]/g, '');

    if (cleanCustom.length === word.length && cleanCustom.split('').sort().join('') === word.split('').sort().join('')) {
      let available = [...letterObjects];
      return cleanCustom.split('').map(char => {
        const matchIndex = available.findIndex(l => l.char === char);
        if (matchIndex !== -1) {
          const match = available[matchIndex];
          available.splice(matchIndex, 1);
          return match;
        }
        return { char, id: Math.random() };
      });
    }

    // Guaranteed well-shuffled permutation
    let bestArr = [...letterObjects];
    let maxScrambledScore = -1;

    let seed = 0;
    for (let i = 0; i < word.length; i++) seed += word.charCodeAt(i) * (i + 1);
    seed += (currentQuestionIndex + 1) * 9973;

    const pseudoRandom = () => {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let attempt = 0; attempt < 80; attempt++) {
      const current = [...letterObjects];
      for (let i = current.length - 1; i > 0; i--) {
        const j = Math.floor(pseudoRandom() * (i + 1));
        [current[i], current[j]] = [current[j], current[i]];
      }

      const currentStr = current.map(c => c.char).join('');
      if (currentStr === word) continue;

      let score = 0;
      for (let j = 0; j < current.length - 1; j++) {
        const char1 = current[j].char;
        const char2 = current[j + 1].char;
        let isContinuous = false;
        for (let k = 0; k < word.length - 1; k++) {
          if (word[k] === char1 && word[k + 1] === char2) {
            isContinuous = true;
            break;
          }
        }
        if (!isContinuous) score++;
      }

      if (score > maxScrambledScore) {
        maxScrambledScore = score;
        bestArr = current;
      }
      if (score === current.length - 1) break;
    }

    if (bestArr.map(b => b.char).join('') === word && word.length > 1) {
      bestArr = [...letterObjects].reverse();
    }

    return bestArr;
  }, [currentQuestionIndex, question]);

  useEffect(() => {
    setImageError(false);
    setInteractiveOptionClicked(null);
    setEliminatedOptions([]);
    setJumbledInput("");
  }, [currentQuestionIndex]);

  
  useEffect(() => {
    // Ensure voices are loaded for female voice
    window.speechSynthesis.getVoices();
    
    if (stage === 'intro') {
      let timeouts: NodeJS.Timeout[] = [];
      
      // 1. Initial 2s silence
      const t1 = setTimeout(() => {
        // 2. Play intro music
        if (quiz.mode !== 'interactive') {
          audioSynth.playIntroMusic();
        }
        
        // wait for music to finish (approx 1.5s)
        const t2 = setTimeout(() => {
          // 3. Speak welcome note
          const names = playersState.map(p => p.name);
          const playerNames = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0] || 'the players';
          let introSpeech = `Welcome back to Quiz Time Brain Boosters. Today we are exploring ${getActiveContextTopic(0)}.`;
          if (isMultipleFiles) {
            const roundsSpeech = `Today's rounds are: ${categories.join(', ')}.`;
            if (quiz.mode === 'interactive') {
              introSpeech = `Welcome back to Quiz Time Brain Boosters. It's Challenge between ${playerNames}. ${roundsSpeech}`;
            } else {
              introSpeech = `Welcome back to Quiz Time Brain Boosters. ${roundsSpeech}`;
            }
          } else {
            if (quiz.mode === 'interactive') {
              if (quiz.isMultiplayer && (quiz.players?.length || 1) > 1) {
                introSpeech = `Welcome ${playerNames}!`;
              } else if (quiz.teamName) {
                introSpeech = `Welcome ${quiz.teamName}.`;
              } else {
                introSpeech = `Welcome back to Quiz Time Brain Boosters.`;
              }
            } else {
              if (quiz.isMultiplayer && (quiz.players?.length || 1) > 1) {
                introSpeech = `Welcome back to Quiz Time Brain Boosters. Today's battle is between ${playerNames}. The topic is ${getActiveContextTopic(0)}.`;
              } else if (quiz.type === 'combat-mode') {
                introSpeech = `Welcome back to Combat Mode! Today's topic is ${getActiveContextTopic(0)}. Pair up with a friend. Look at your side of the screen and answer before the time runs out!`;
              } else if (currentType === 'word-search') {
                introSpeech = `Welcome back to Word Search! Today's topic is ${getActiveContextTopic(0)}. Find the 5 hidden words in the grid. You have 30 seconds. Look left-to-right, and top-to-bottom only!`;
              }
            }
          }
          
          const goToNext = () => {
            const waitTime = 1500;
            const t3 = setTimeout(() => {
              if (quiz.mode !== 'interactive') audioSynth.playSwoosh();
              if (quiz.isMultiplayer || (playersState && playersState.length > 0)) {
                setIntroducingPlayerIndex(0);
                setStage('player-intro');
              } else if (quiz.mode === 'interactive') {
                setStage('warmup');
              } else {
                setStage('question');
              }
            }, waitTime);
            timeouts.push(t3);
          };

          audioSynth.speak(introSpeech, goToNext);
          
          // Safety fallback: if speech API is blocked or fails to fire onend
          const safetyWait = Math.max(8000, (introSpeech.length / 15) * 1000 + 3000);
          const tFallback = setTimeout(() => {
             // We only go to next if we haven't already left the intro stage
             goToNext();
          }, safetyWait);
          timeouts.push(tFallback);

        }, 1500);
        timeouts.push(t2);
        
      }, 2000);
      timeouts.push(t1);

      return () => {
        timeouts.forEach(clearTimeout);
        window.speechSynthesis.cancel();
      };
    }

    if (stage === 'player-intro') {
      let timeouts: NodeJS.Timeout[] = [];
      const currentPlayer = playersState[introducingPlayerIndex];

      if (!currentPlayer || introducingPlayerIndex >= playersState.length) {
        setStage('multiplayer-intro');
        return;
      }

      audioSynth.playSwoosh();
      audioSynth.playHTML5Badge();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#38bdf8', '#facc15', '#f43f5e', '#a855f7', '#34d399']
      });

      const num = introducingPlayerIndex + 1;
      const pName = currentPlayer.name || `Player ${num}`;
      const pTopic = currentPlayer.topic ? `, specializing in ${currentPlayer.topic}` : '';
      const pDetails = currentPlayer.details ? `. ${currentPlayer.details}` : '';
      const speech = `Introducing Challenger Number ${num}: ${pName}${pTopic}${pDetails}!`;

      const tStart = setTimeout(() => {
        audioSynth.speak(speech);
      }, 400);
      timeouts.push(tStart);

      return () => {
        timeouts.forEach(clearTimeout);
        window.speechSynthesis.cancel();
      };
    }
    
    if (stage === 'multiplayer-intro') {
      let timeouts: NodeJS.Timeout[] = [];

      audioSynth.playVictory();
      audioSynth.playSwoosh();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#facc15', '#ef4444', '#3b82f6', '#10b981']
      });

      const names = playersState.map(p => p.name || 'Player');
      const playerNames = names.length > 1 ? names.slice(0, -1).join(', ') + ' versus ' + names[names.length - 1] : names[0];
      const speech = `The battle is set! It's ${playerNames}! Let the battle begin!`;

      const goToNext = () => {
        const t2 = setTimeout(() => {
          audioSynth.playSwoosh();
          if (quiz.rules) {
            setStage('rules');
          } else if (quiz.mode !== 'interactive' || ((currentType as string) === 'rapid-fire' && (!quiz.isMultiplayer || quiz.mode !== 'interactive')) || quiz.type === 'combat-mode') {
            if ((currentType as string) === 'rapid-fire') {
              rapidFirePlayerIdxRef.current = null;
              setCurrentPlayerIndex(quiz.questions[0]?.playerIndex || 0);
            }
            setStage('question');
          } else if (categories.length > 1 || (currentType as string) === 'rapid-fire') {
            setStage(quiz.questions.some(q => q.rapidFireSet && q.category === selectedCategory) ? 'rapid-fire-set-selection' : 'category-selection'); rapidFirePlayerIdxRef.current = null;
          } else {
            setStage('question-selection');
          }
        }, 2000);
        timeouts.push(t2);
      };

      if (quiz.mode !== 'interactive') {
        const t1 = setTimeout(() => {
          audioSynth.speak(speech, goToNext);
          const fallbackWait = Math.max(5000, (speech.length / 15) * 1000 + 2000);
          timeouts.push(setTimeout(goToNext, fallbackWait));
        }, 400);
        timeouts.push(t1);
      } else {
        const t1 = setTimeout(() => {
          audioSynth.speak(speech);
        }, 400);
        timeouts.push(t1);
      }

      return () => {
        timeouts.forEach(clearTimeout);
        window.speechSynthesis.cancel();
      };
    }

    if (stage === 'rules' && quiz.mode !== 'interactive') {
      let timeouts: NodeJS.Timeout[] = [];
      const t1 = setTimeout(() => {
        const speech = "Here are the rules. " + (quiz.rules?.split('\n').join('. ') || '');
        
        const goToNext = () => {
          const t2 = setTimeout(() => {
            audioSynth.playSwoosh();
            if (quiz.mode !== 'interactive' || ((currentType as string) === 'rapid-fire' && (!quiz.isMultiplayer || quiz.mode !== 'interactive')) || quiz.type === 'combat-mode') {
              if ((currentType as string) === 'rapid-fire') {
                rapidFirePlayerIdxRef.current = null;
                setCurrentPlayerIndex(quiz.questions[0]?.playerIndex || 0);
              }
              setStage('question');
            } else if (categories.length > 1 || (currentType as string) === 'rapid-fire') {
              setStage(quiz.questions.some(q => q.rapidFireSet && q.category === selectedCategory) ? 'rapid-fire-set-selection' : 'category-selection'); rapidFirePlayerIdxRef.current = null;
            } else {
            setStage('question-selection');
          }
          }, 2000);
          timeouts.push(t2);
        };
        
        audioSynth.speak(speech, goToNext);
        const fallbackWait = Math.max(5000, (speech.length / 15) * 1000 + 2000);
        timeouts.push(setTimeout(goToNext, fallbackWait));
      }, 1000);
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

      if (currentType === 'text-presentation') {
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
                  else {
  if (quiz.mode === 'video') {
    if (!quiz.isOfflineMode && earnedBadges.length > 0) {
      setStage('badges');
    } else if (quiz.quotes && quiz.quotes.length > 0) {
      setStage('quote');
    } else {
      setStage('celebrate');
    }
  } else {
    setStage('score');
  }
};
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
                  else {
  if (quiz.mode === 'video') {
    if (!quiz.isOfflineMode && earnedBadges.length > 0) {
      setStage('badges');
    } else if (quiz.quotes && quiz.quotes.length > 0) {
      setStage('quote');
    } else {
      setStage('celebrate');
    }
  } else {
    setStage('score');
  }
};
                }
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else if ((currentType === '5-clues' || question.type === '5-clues') && !isJumbledLetters) {
        setClueIndex(0);
        audioSynth.speak(question.question || 'Can you guess from these clues?');
        if (question.clues?.[0]) {
          setTimeout(() => audioSynth.speak(question.clues![0]), 2000); // speak first clue after 2s
        }
        
        const tLimit = question.timeLimit || 25;
        setTimeLeft(tLimit);
        
        timerRef.current = setInterval(() => {
          if (isPausedRef.current) return;
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              setStage('reveal');
              return 0;
            }
            if (quiz.mode !== 'interactive' || prev <= 6) audioSynth.playTick();
            
            const interval = Math.floor(tLimit / 5);
            if (prev === tLimit - interval) { setClueIndex(1); if (question.clues?.[1]) audioSynth.speak(question.clues[1]); }
            if (prev === tLimit - 2*interval) { setClueIndex(2); if (question.clues?.[2]) audioSynth.speak(question.clues[2]); }
            if (prev === tLimit - 3*interval) { setClueIndex(3); if (question.clues?.[3]) audioSynth.speak(question.clues[3]); }
            if (prev === tLimit - 4*interval) { setClueIndex(4); if (question.clues?.[4]) audioSynth.speak(question.clues[4]); }
            
            return prev - 1;
          });
        }, 1000);
      } else if (isJumbledLetters) {
        setClueIndex(-1);
        audioSynth.speak('Unjumble these letters!');
        const tLimit = question.timeLimit || 25;
        setTimeLeft(tLimit);
        
        timerRef.current = setInterval(() => {
          if (isPausedRef.current) return;
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              setStage('reveal');
              return 0;
            }
            if (quiz.mode !== 'interactive' || prev <= 6) audioSynth.playTick();
            
            const interval = Math.floor(tLimit / 3);
            if (prev === tLimit - interval) { setClueIndex(0); if (question.clues?.[0]) audioSynth.speak(question.clues[0]); }
            if (prev === tLimit - 2*interval) { setClueIndex(1); if (question.clues?.[1]) audioSynth.speak(question.clues[1]); }
            
            return prev - 1;
          });
        }, 1000);
      } else if (currentType === 'detective') {
        audioSynth.speak(question.question || 'Find the fake fact!');
        setTimeLeft(question.timeLimit || 30); // More time to read sentences
        
        timerRef.current = setInterval(() => {
          if (isPausedRef.current) return;
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              setStage('reveal');
              return 0;
            }
            if (quiz.mode !== 'interactive' || prev <= 6) audioSynth.playTick();
            return prev - 1;
          });
        }, 1000);
      } else if (currentType === 'match-the-following') {
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

        setTimeLeft(question.timeLimit || 30); // Generous time for reading and matching

        timerRef.current = setInterval(() => {
          if (isPausedRef.current) return;
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              setStage('reveal');
              return 0;
            }
            if (quiz.mode !== 'interactive' || prev <= 6) audioSynth.playTick();
            return prev - 1;
          });
        }, 1000);
      } else if (currentType === 'word-search') {
        audioSynth.speak(`Find the 5 words! ${question.timeLimit || 30} seconds on the clock.`);
        setTimeLeft(question.timeLimit || 30);
        
        timerRef.current = setInterval(() => {
          if (isPausedRef.current) return;
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              setStage('reveal');
              return 0;
            }
            if (quiz.mode !== 'interactive' || prev <= 6) audioSynth.playTick();
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
      } else if ((currentType as string) === 'rapid-fire') {
        audioSynth.speak(question.question);
      } else {
        let textToSpeak = question.question;
        if (quiz.mode === 'video' && isImageQuestion && (!question.question || question.question.toLowerCase().includes('identify the image') || question.question.toLowerCase().includes('identify this image') || question.question.toLowerCase() === 'what is this?' || question.question.toLowerCase() === 'identify this')) {
          const topic = (quiz.topic || question.category || '').toLowerCase();
          const isAnimal = topic.includes('animal') || topic.includes('wildlife');
          const isFood = topic.includes('food') || topic.includes('fruit') || topic.includes('vegetable');
          const isPlace = topic.includes('place') || topic.includes('country') || topic.includes('landmark');
          
          const prompts = [
            "Can you identify what this is?",
            "Take a close look, what do you see?",
            "Do you know the name of this?",
            "What is shown in this picture?",
            "Can you guess what this image shows?",
            "Let's see if you recognize this one.",
            "What could this possibly be?",
            "Any ideas on what this is called?",
            "Have you seen this before? What is it?",
            "Time to guess! What's in the picture?"
          ];
          
          let themedPrompts = [...prompts];
          if (isAnimal) {
             themedPrompts = [
               "What animal is this?",
               "Can you name this creature?",
               "Do you know which animal this is?",
               "Which fascinating animal is shown here?",
               "Can you identify this wild friend?",
               "What species are we looking at?",
               "Take a guess, what animal is in the picture?",
               "Do you recognize this animal?",
               "What is the name of this beast?",
               "Can you tell me what animal this is?"
             ];
          } else if (isFood) {
             themedPrompts = [
               "What delicious food is this?",
               "Can you name this dish?",
               "Do you know what we're eating here?",
               "What tasty treat is in the picture?",
               "Can you identify this ingredient or food?",
               "What is this culinary delight?",
               "Take a guess, what food is shown?",
               "Do you recognize this dish?",
               "What are we cooking up here?",
               "Can you tell me what food this is?"
             ];
          } else if (isPlace) {
             themedPrompts = [
               "What famous place is this?",
               "Can you name this landmark?",
               "Do you know where this is?",
               "What location is shown in the picture?",
               "Can you identify this monument or place?",
               "What is this famous destination?",
               "Take a guess, where in the world is this?",
               "Do you recognize this beautiful spot?",
               "What country or city could this be?",
               "Can you tell me what landmark this is?"
             ];
          }
          
          textToSpeak = themedPrompts[currentQuestionIndex % themedPrompts.length];
        }
        audioSynth.speak(textToSpeak || 'Identify the image');
        if (quiz.type !== 'rapid-fire') {
          setTimeLeft(question.timeLimit);
        
          timerRef.current = setInterval(() => {
            if (isPausedRef.current) return;
            setTimeLeft((prev) => {
              if (prev <= 1) {
                if (timerRef.current) clearInterval(timerRef.current);
                if ((currentType as string) === 'rapid-fire') {
                  setAnsweredQuestions(prevAns => {
                     const next = new Set(prevAns);
                     quiz.questions.forEach((q, i) => {
                         if (q.rapidFireSet ? q.rapidFireSet === selectedRapidFireSet : q.category === selectedCategory) next.add(i);
                     });
                     return next;
                  });
                  setStage('rapid-fire-score');
                } else {
                  setStage('reveal');
                }
                return 0;
              }
              if (quiz.mode !== 'interactive' || prev <= 6) audioSynth.playTick();
              return prev - 1;
            });
          }, 1000);
        }
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
        if (quiz.mode === 'video') {
          speechText = `The correct answer is ${question.correctAnswer}.`;
        } else {
          speechText = `The correct answer is ${question.correctAnswer}. ${question.insight}`;
        }
      }

      if (isInteractiveTimeout && speechText) {
        speechText = `Time's up! ` + speechText;
      }
      
      let t: NodeJS.Timeout;
      const onSpeakEnd = () => {
        t = setTimeout(() => {
          audioSynth.playSwoosh();
          // Go to next question, or quote if it's the end
          if (question.insight && quiz.mode === 'video') {
            setStage('insight');
          } else {
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
            {
  if (quiz.mode === 'video') {
    if (!quiz.isOfflineMode && earnedBadges.length > 0) {
      setStage('badges');
    } else if (quiz.quotes && quiz.quotes.length > 0) {
      setStage('quote');
    } else {
      setStage('celebrate');
    }
  } else {
    setStage('score');
  }
};
          } else {
            const totalQ = quiz.questions.length || 1;
            const maxBadges = Math.min(4, Math.max(1, Math.ceil(totalQ / 5)));
            const badgeInterval = Math.max(5, Math.ceil(totalQ / maxBadges));

            if (quiz.showBadges !== false && quiz.type !== 'rapid-fire' && numAnswered > 0 && numAnswered % badgeInterval === 0 && numAnswered < totalQ) {
              setStage('video-badges');
            } else {
              if (quiz.enableMemoryBreak && !hasPlayedMemoryBreak && quiz.questions.length > 1 && numAnswered >= Math.floor(quiz.questions.length / 2)) {
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
        } // close else
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
        window.speechSynthesis.cancel();
      };
    }

    
    if (stage === 'insight') {
      audioSynth.stopBackgroundMusic();
      
      let t;
      const onSpeakEnd = () => {
        t = setTimeout(() => {
          audioSynth.playSwoosh();
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
            {
  if (quiz.mode === 'video') {
    if (!quiz.isOfflineMode && earnedBadges.length > 0) {
      setStage('badges');
    } else if (quiz.quotes && quiz.quotes.length > 0) {
      setStage('quote');
    } else {
      setStage('celebrate');
    }
  } else {
    setStage('score');
  }
};
          } else {
            const totalQ = quiz.questions.length || 1;
            const maxBadges = Math.min(4, Math.max(1, Math.ceil(totalQ / 5)));
            const badgeInterval = Math.max(5, Math.ceil(totalQ / maxBadges));
            if (quiz.showBadges !== false && quiz.type !== 'rapid-fire' && numAnswered > 0 && numAnswered % badgeInterval === 0 && numAnswered < totalQ) {
              setStage('video-badges');
            } else {
              if (quiz.enableMemoryBreak && !hasPlayedMemoryBreak && quiz.questions.length > 1 && numAnswered >= Math.floor(quiz.questions.length / 2)) { 
                 setHasPlayedMemoryBreak(true); 
                 const emojis = ['🍎','🚗','🐶','🚀','🎸','🏀','🍔','🚲','📚','⌚','🧸','🌻','🎈','📷','🧩','🍉','🛸','🐱','🎷','🏈']; 
                 const shuffled = emojis.sort(() => 0.5 - Math.random()).slice(0, 10); 
                 setMemoryItems(shuffled); 
                 setMemoryTarget(shuffled[Math.floor(Math.random() * shuffled.length)]); 
                 setStage('memory-break-intro');
              } else { 
                if (isInteractiveGrid) {
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
        }, 3000);
      };
      
      if (question.insight) {
        audioSynth.speak(`Did you know? ${question.insight}`, onSpeakEnd);
      } else {
        onSpeakEnd();
      }
      
      return () => {
        if (t) clearTimeout(t);
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
          setStage('celebrate');
        }, 2000);
      });
      
      return () => {
        if (t) clearTimeout(t);
        window.speechSynthesis.cancel();
      };
    }
    
    if (stage === 'memory-break-intro') {
      audioSynth.stopBackgroundMusic();
      let t: NodeJS.Timeout;
      audioSynth.speak("Time for a quick memory break! Pay close attention to these objects.", () => {
        t = setTimeout(() => {
          setStage('memory-break-memorize');
        }, 1500);
      });
      return () => { if (t) clearTimeout(t); };
    }

    if (stage === 'memory-break-memorize') {
      audioSynth.startBackgroundMusic();
      setTimeLeft(10);
      timerRef.current = setInterval(() => {
        if (isPausedRef.current) return;
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setStage('memory-break-question');
            return 0;
          }
          if (prev <= 3) audioSynth.playTick();
          return prev - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }

    if (stage === 'memory-break-question') {
      audioSynth.stopBackgroundMusic();
      let t: NodeJS.Timeout;
      audioSynth.speak(`Where was the ${memoryTarget}?`, () => {
         audioSynth.startBackgroundMusic();
         setTimeLeft(10);
         timerRef.current = setInterval(() => {
           if (isPausedRef.current) return;
           setTimeLeft((prev) => {
             if (prev <= 1) {
               if (timerRef.current) clearInterval(timerRef.current);
               setStage('memory-break-reveal');
               return 0;
             }
             if (prev <= 3) audioSynth.playTick();
             return prev - 1;
           });
         }, 1000);
      });
      return () => { if (timerRef.current) clearInterval(timerRef.current); if (t) clearTimeout(t); };
    }

    if (stage === 'memory-break-reveal') {
      audioSynth.stopBackgroundMusic();
      audioSynth.playCorrect();
      
      let t: NodeJS.Timeout;
      audioSynth.speak(`Here it is! Let's get back to the quiz.`, () => {
        t = setTimeout(() => {
          audioSynth.playSwoosh();
          const isInteractiveGrid = quiz.mode === 'interactive' && quiz.type !== 'combat-mode' && quiz.type !== 'rapid-fire' && (quiz.isMultiplayer && (quiz.players?.length || 1) > 1);
          if (isInteractiveGrid) {
            if (categories.length > 1) {
              const categoryQuestions = quiz.questions.map((q, i) => ({q, i})).filter(x => x.q.category === selectedCategory);
              if (categoryQuestions.length > 0 && categoryQuestions.every(x => answeredQuestions.has(x.i) || x.i === currentQuestionIndex)) {
                setStage(quiz.questions.some(q => q.rapidFireSet && q.category === selectedCategory) ? 'rapid-fire-set-selection' : 'category-selection');
                rapidFirePlayerIdxRef.current = null;
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
        }, 2000);
      });
      return () => { if (t) clearTimeout(t); };
    }

    if (stage === 'score') {
      audioSynth.playVictory();
      audioSynth.playHTML5Badge();
      
      const maxPossibleScore = quiz.questions.reduce((total, q) => {
        const qType = q.type || quiz.type;
        let inc = (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1);
        if (quiz.mode === 'interactive' && qType === '5-clues') {
          inc = 10;
        }
        return total + inc;
      }, 0);
      
      const isPerfectScore = (quiz.isMultiplayer || (playersState && playersState.length > 0))
        ? (playersState && playersState.length > 0 && Math.max(...playersState.map(p => p.score || 0)) === maxPossibleScore && maxPossibleScore > 0)
        : (score === maxPossibleScore && maxPossibleScore > 0);

      let interval: any;
      if (isPerfectScore) {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({
            ...defaults, particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#facc15', '#f87171', '#60a5fa', '#34d399', '#a78bfa']
          });
          confetti({
            ...defaults, particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#facc15', '#f87171', '#60a5fa', '#34d399', '#a78bfa']
          });
        }, 250);
      } else {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#facc15', '#f87171', '#60a5fa', '#34d399', '#a78bfa']
        });
      }

      let t: NodeJS.Timeout;
      
      
      const onSpeakEnd = () => {
        if (quiz.mode === 'video') {
          t = setTimeout(() => {
            if (!quiz.isOfflineMode && earnedBadges.length > 0) {
              setStage('badges');
            } else if (quiz.quotes && quiz.quotes.length > 0) {
              setStage('quote');
            } else {
              setStage('celebrate');
            }
          }, 4000); // Wait 4 seconds on the scoreboard before auto-advancing
        }
      };

      if (quiz.isMultiplayer || (playersState && playersState.length > 0)) {
        const sorted = [...playersState].sort((a, b) => b.score - a.score);
        const winner = sorted[0];
        audioSynth.speak(`Congratulations ${winner?.name || 'Player 1'}, you are the winner on the final scoreboard!`, onSpeakEnd);
      } else {
        audioSynth.speak(`Great job ${quiz.teamName || 'Player 1'}, you scored ${score} points! Check out your final score on the scoreboard!`, onSpeakEnd);
      }

      
      return () => {
        if (t) clearTimeout(t);
        if (interval) clearInterval(interval);
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
      const isInteractiveGrid = quiz.mode === 'interactive' && quiz.type !== 'combat-mode' && quiz.type !== 'rapid-fire' && (quiz.isMultiplayer && (quiz.players?.length || 1) > 1);
      const numAnswered = isInteractiveGrid 
        ? answeredQuestions.size 
        : currentQuestionIndex + 1;
        
      const currentBadge = getDynamicMilestoneBadge(numAnswered);
      
      const speechMsg = quiz.mode === 'interactive' 
        ? `Milestone reached! ${currentBadge.player} unlocked the ${currentBadge.title} badge for reaching ${numAnswered} questions in ${currentBadge.contextTopic}!` 
        : `Wow, ${currentBadge.player} reached ${numAnswered} questions! Here is the ${currentBadge.title} badge for your great effort! Keep it up!`;

      audioSynth.speak(speechMsg, () => {
        setTimeout(() => {
           if (quiz.mode === 'interactive' && quiz.type !== 'combat-mode' && quiz.type !== 'rapid-fire' && (quiz.isMultiplayer && (quiz.players?.length || 1) > 1)) {
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
                if (quiz.enableMemoryBreak && !hasPlayedMemoryBreak && quiz.questions.length > 1 && numAnswered >= Math.floor(quiz.questions.length / 2)) {
                   setHasPlayedMemoryBreak(true);
                   const emojis = ['🍎','🚗','🐶','🚀','🎸','🏀','🍔','🚲','📚','⌚','🧸','🌻','🎈','📷','🧩','🍉','🛸','🐱','🎷','🏈'];
                   const shuffled = emojis.sort(() => 0.5 - Math.random()).slice(0, 10);
                   setMemoryItems(shuffled);
                   setMemoryTarget(shuffled[Math.floor(Math.random() * shuffled.length)]);
                   setStage('memory-break-intro');
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
      const scorePerQuestion = (quiz.mode === 'interactive' && currentType === '5-clues') ? 10 : (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1);
      
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
          if (index === 0 && p.score > 0) {
            generatedBadges.push(getRandomBadge('perfect', p.name));
          } else if (p.score > 0) {
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
          setStage('celebrate');
        }, 120000);
      });
      return () => {
        if (t) clearTimeout(t);
        window.speechSynthesis.cancel();
      };
    }

    if (stage === 'celebrate') {
      let timeoutId: NodeJS.Timeout;
      
      const currentCelebrationPlayer = celebrationPlayers[celebratingIndex];
      if (quiz.mode !== 'interactive' || !currentCelebrationPlayer || celebratingIndex >= celebrationPlayers.length) {
        setStage('outro');
      } else {
        const N = celebrationPlayers.length;
        const currentRank = N - celebratingIndex;
        const frame = getCelebrationFrame(currentRank, N, currentCelebrationPlayer.name, currentCelebrationPlayer.score || 0);

        audioSynth.playVictory();
        audioSynth.playHTML5Badge();
        
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.5 },
          colors: ['#facc15', '#f87171', '#60a5fa', '#34d399', '#a78bfa']
        });

        // Speak position speech
        audioSynth.speak(frame.speech, () => {
          // Increase celebration duration higher with more animation for video display!
          timeoutId = setTimeout(() => {
            setCelebratingIndex(prev => prev + 1);
          }, 18000);
        });

        // Fallback wait if TTS speech doesn't trigger callback
        const fallbackWait = 28000;
        const fallbackTimer = setTimeout(() => {
          if (!timeoutId) {
            setCelebratingIndex(prev => prev + 1);
          }
        }, fallbackWait);

        return () => {
          if (timeoutId) clearTimeout(timeoutId);
          if (fallbackTimer) clearTimeout(fallbackTimer);
          window.speechSynthesis.cancel();
        };
      }
    }

    if (stage === 'outro') {
      if (quiz.mode === 'interactive') {
        audioSynth.speak("Thank you for playing!");
      } else {
        audioSynth.speak(outroMessage.speech);
      }
    }
  }, [stage, currentQuestionIndex, quiz, question, celebratingIndex, celebrationPlayers, getCelebrationFrame]);

  // Rapid Fire Global Timer
  useEffect(() => {
    if ((currentType as string) === 'rapid-fire' && stage === 'question') {
      const currentCategory = quiz.questions[currentQuestionIndex]?.rapidFireSet || quiz.questions[currentQuestionIndex]?.category || '';
      const isNewSet = rapidFirePlayerIdxRef.current !== currentCategory;

      if (isNewSet) {
        if (rapidFireTimerRef.current) {
          clearInterval(rapidFireTimerRef.current);
          rapidFireTimerRef.current = null;
        }
        
        // Use the question's timeLimit (populated from JSON) or fallback
        const limit = quiz.questions[currentQuestionIndex]?.timeLimit || quiz.timeLimit || 60;
        setTimeLeft(limit);
        rapidFirePlayerIdxRef.current = currentCategory;
        
        const timerId = setInterval(() => {
          if (isPausedRef.current) return;
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerId);
              if (rapidFireTimerRef.current === timerId) {
                rapidFireTimerRef.current = null;
              }
              
              audioSynth.playWrong();
              
              setAnsweredQuestions(prevAns => {
                  const next = new Set(prevAns);
                  quiz.questions.forEach((q, i) => {
                      if (q.rapidFireSet ? q.rapidFireSet === currentCategory : q.category === currentCategory) next.add(i);
                  });
                  return next;
              });
              
              setStage('rapid-fire-score');
              
              return 0;
            }
            if (prev <= 6) audioSynth.playTick();
            return prev - 1;
          });
        }, 1000);
        
        rapidFireTimerRef.current = timerId;
      }
    }
    if (stage === 'score' || stage === 'celebrate' || stage === 'category-selection') {
      if (rapidFireTimerRef.current) {
        clearInterval(rapidFireTimerRef.current);
        rapidFireTimerRef.current = null;
      }
    }
    return () => {
      // Cleanup happens when component unmounts
      // We don't want to clear on every stage change, so we only clear on unmount or when explicitly reaching score/celebrate
    };
  }, [stage, quiz.type, currentQuestionIndex, quiz.timeLimit, quiz.questions]);

  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleFiftyFifty = () => {
    if (!question || !question.options) return;
    
    const categoryKey = question.category || 'default';
    const fiftyKey = `${currentPlayerIndex}-${categoryKey}`;
    
    if (usedFiftyFifty[fiftyKey]) return;
    
    const incorrectIndices: number[] = [];
    question.options.forEach((opt, idx) => {
      if (opt !== question.correctAnswer) {
        incorrectIndices.push(idx);
      }
    });
    
    // Shuffle and pick half
    incorrectIndices.sort(() => Math.random() - 0.5);
    const toEliminate = incorrectIndices.slice(0, Math.max(1, incorrectIndices.length - 1));
    
    setEliminatedOptions(toEliminate);
    setUsedFiftyFifty(prev => ({ ...prev, [fiftyKey]: true }));
    audioSynth.playSwoosh();
  };

  const getAwardPoints = () => {
    if ((currentType as string) === 'rapid-fire') return 1;
    let inc = (quiz.mode === 'interactive' && quiz.isMultiplayer ? 10 : 1);
    if (quiz.mode === 'interactive' && currentType === '5-clues') {
      inc = 10;
      if (clueIndex === 2) inc = 9;
      else if (clueIndex === 3) inc = 8;
      else if (clueIndex >= 4) inc = 7;
    }
    return inc;
  };

  const isInteractiveTimeout = quiz.mode === 'interactive' && stage === 'reveal' && interactiveOptionClicked === null;

  const handleJumbledSubmit = () => {
    if (stage === 'reveal' || !jumbledInput.trim()) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const rawAnswer = question.correctAnswer || question.answer || question.word || question.correct_answer || question.brand_name || '';
    const isCorrect = jumbledInput.trim().toLowerCase() === rawAnswer.trim().toLowerCase();
    
    setInteractiveOptionClicked(isCorrect ? rawAnswer : jumbledInput);
    
    if (isCorrect) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#facc15', '#f43f5e', '#a855f7', '#34d399']
      });
      setScore(s => s + getAwardPoints());
      if (quiz.isMultiplayer || (quiz.players && quiz.players.length > 0)) {
        setPlayersState(prev => {
          const next = [...prev];
          if (next[currentPlayerIndex]) {
            const currentBadges = next[currentPlayerIndex].badges || [];
            const badgeIcons = ['🌟', '🏆', '🥇', '🧠', '⚡', '🎯', '👑', '💎'];
            const newBadge = badgeIcons[currentQuestionIndex % badgeIcons.length];
            next[currentPlayerIndex] = { 
              ...next[currentPlayerIndex], 
              score: (next[currentPlayerIndex].score || 0) + getAwardPoints(),
              badges: [...currentBadges, newBadge]
            };
          }
          return next;
        });
      }
      audioSynth.playCorrect();
      if (quiz.enableClapping !== false && Math.random() < 0.4) {
        setTimeout(() => audioSynth.playClap(), 300);
      }
    } else {
      audioSynth.playWrong();
    }
    window.speechSynthesis.cancel();
                            if ((currentType as string) === 'rapid-fire') {
                              setCurrentQuestionIndex((prev) => prev + 1);
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
                              } else {
                                setStage('question');
                              }
                            } else {
                              setStage('reveal');
                            }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages(prev => ({ ...prev, [currentQuestionIndex]: event.target!.result as string }));
          setImageError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getBlurStyle = () => {
    if (stage === 'reveal' || stage === 'quote' || stage === 'score' || stage === 'celebrate' || stage === 'badges' || stage === 'video-badges' || stage === 'outro') {
      return {};
    }
    
    const question = quiz.questions[currentQuestionIndex];
    const isBlurQuiz = quiz.type === 'blurred-image' || quiz.type === 'identify-image'; 
    const technique = question?.blurTechnique || (quiz.type === 'blurred-image' ? 'normal-blur' : null);
    
    if (!technique) return {};

    switch (technique) {
      case 'heavy-blur': return { filter: 'blur(35px)' };
      case 'normal-blur': return { filter: 'blur(20px)' };
      case 'light-blur': return { filter: 'blur(8px)' };
      case 'grayscale-blur': return { filter: 'blur(15px) grayscale(100%)' };
      case 'invert-blur': return { filter: 'blur(15px) invert(100%)' };
      case 'sepia-blur': return { filter: 'blur(15px) sepia(100%)' };
      case 'hue-rotate-blur': return { filter: 'blur(15px) hue-rotate(90deg)' };
      case 'high-contrast-blur': return { filter: 'blur(12px) contrast(200%) saturate(150%)' };
      case 'pixelated-blur': return { filter: 'url(#pixelate)' };
      case 'zoom-blur': return { filter: 'url(#zoom-blur)' };
      default: return { filter: 'blur(15px)' };
    }
  };

  return (
    <div className={`\${quiz.mode === 'interactive' ? 'presentation-interactive-cursor' : ''} fixed inset-0 w-full h-full flex flex-col items-center overflow-hidden font-sans bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-white selection:bg-white/30`}>

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="text-center p-12 max-w-7xl flex flex-col items-center justify-center h-full z-10 mx-auto w-full"
          >
            {quiz.mode === 'interactive' && quiz.isMultiplayer && (quiz.players?.length || 1) > 1 ? (
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12 w-full">
                {playersState.map((player, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, y: 50, opacity: 0, filter: "blur(10px)" }}
                    animate={{ scale: 1, y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ type: "spring", stiffness: 120, damping: 20, delay: idx * 0.2 }}
                    className="relative"
                  >
                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-8 border-white group relative">
                      {player.photo ? (
                        <img src={player.photo} alt={player.name} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-6xl md:text-8xl">
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-indigo-900 px-6 py-2 rounded-full font-black text-xl shadow-xl border-4 border-indigo-100"
                    >
                      {player.name}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)", y: 50 }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, duration: 1 }}
                className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-8 border-white mb-12 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src={(quiz.mode === 'interactive' && quiz.playerPhoto) ? quiz.playerPhoto : quizLogo} alt="Quiz Time Brain Boosters" className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700" />
              </motion.div>
            )}

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-5xl md:text-7xl font-black mb-8 tracking-tight drop-shadow-2xl text-white"
            >
              {quiz.mode === 'interactive' && isMultipleFiles
                ? `It's Challenge between ${playersState.map(p => p.name).join(' and ')}`
                : (quiz.mode === 'interactive' && quiz.isMultiplayer && (quiz.players?.length || 1) > 1
                  ? `Welcome ${playersState.map(p => p.name).join(', ')}!`
                  : (quiz.isMultiplayer && (quiz.players?.length || 1) > 1
                    ? `Battle: ${playersState.map(p => p.name).join(' vs ')}`
                    : (quiz.mode === 'interactive' 
                      ? `Welcome ${quiz.teamName}!` 
                      : (quiz.type === 'combat-mode' ? 'Welcome back to Combat Mode!' : 'Welcome back to Quiz Time Brain Boosters'))))}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-3xl md:text-4xl opacity-100 font-bold text-cyan-100 drop-shadow-lg max-w-3xl leading-snug"
            >
              {isMultipleFiles
                ? `Today's rounds: ${categories.join(', ')}`
                : (quiz.mode === 'interactive'
                  ? (quiz.playerDetails ? quiz.playerDetails : '')
                  : (quiz.isMultiplayer && (quiz.players?.length || 1) > 1
                    ? `Today's topic: ${getActiveContextTopic(0)}`
                    : (quiz.type === 'combat-mode' 
                      ? `Today we are exploring: ${getActiveContextTopic(0)}. Pair up with a friend! Look at your side of the screen and answer before the time runs out!` 
                      : `Today we are exploring: ${getActiveContextTopic(0)}`)))}
            </motion.p>
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
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  onClick={() => {
                    audioSynth.playSwoosh();
                    if (quiz.mode !== 'interactive' || ((currentType as string) === 'rapid-fire' && (!quiz.isMultiplayer || quiz.mode !== 'interactive')) || quiz.type === 'combat-mode') {
                      setCurrentQuestionIndex(0);
                      if ((currentType as string) === 'rapid-fire') {
                        rapidFirePlayerIdxRef.current = null;
                        setCurrentPlayerIndex(quiz.questions[0]?.playerIndex || 0);
                      }
                      setStage('question');
                    } else if (quiz.isMultiplayer && (quiz.players?.length || 1) > 1) {
                      if (categories.length > 1 || (currentType as string) === 'rapid-fire') {
                        setStage(quiz.questions.some(q => q.rapidFireSet && q.category === selectedCategory) ? 'rapid-fire-set-selection' : 'category-selection'); rapidFirePlayerIdxRef.current = null;
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

        
        {stage === 'player-intro' && (() => {
          const player = playersState[introducingPlayerIndex] || { name: `Player ${introducingPlayerIndex + 1}` };
          const totalPlayers = playersState.length || 1;
          const playerNum = introducingPlayerIndex + 1;

          return (
            <motion.div
              key={`player-intro-${introducingPlayerIndex}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-center p-8 max-w-5xl flex flex-col items-center justify-center h-full z-10 w-full mx-auto relative"
            >
              {/* Skip Button */}
              <button
                onClick={() => {
                  audioSynth.playSwoosh();
                  window.speechSynthesis.cancel();
                  setStage('multiplayer-intro');
                }}
                className="absolute top-6 right-6 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white/90 hover:text-white rounded-full text-sm font-bold border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer z-30"
              >
                <span>Battle</span>
                <Play className="w-4 h-4 fill-current" />
              </button>

              {/* Progress Pills */}
              <div className="flex items-center gap-2 mb-6 z-10">
                {playersState.map((_, pIdx) => (
                  <div
                    key={pIdx}
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      pIdx === introducingPlayerIndex
                        ? 'w-10 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                        : pIdx < introducingPlayerIndex
                        ? 'w-4 bg-emerald-400'
                        : 'w-4 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm md:text-base rounded-full uppercase tracking-widest shadow-xl mb-8 flex items-center gap-2 border-2 border-white/50 z-10"
              >
                <Sparkles className="w-5 h-5 text-slate-950 fill-current animate-spin-slow" />
                <span>Challenger Spotlight #{playerNum} of {totalPlayers}</span>
              </motion.div>

              {/* Spotlight Player Card */}
              <motion.div
                initial={{ scale: 0.6, rotateY: 90, opacity: 0 }}
                animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.2 }}
                className="relative bg-slate-900/85 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] border-4 border-amber-400/60 shadow-[0_30px_90px_rgba(245,158,11,0.4)] flex flex-col items-center max-w-xl w-full z-10 overflow-hidden"
              >
                {/* Background Halo Glow */}
                <div className="absolute -top-12 inset-x-0 h-28 bg-amber-400/25 blur-3xl rounded-full pointer-events-none" />

                <div className="relative mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                    className="absolute -inset-4 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 opacity-80 blur-md pointer-events-none"
                  />
                  <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10 bg-slate-800">
                    {player.photo ? (
                      <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center font-black text-6xl text-white">
                        {player.name ? player.name.charAt(0).toUpperCase() : 'P'}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 p-2.5 rounded-full shadow-lg z-20 border-2 border-white">
                    <Crown className="w-6 h-6 fill-current" />
                  </div>
                </div>

                <h3 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg mb-2">
                  {player.name || `Player ${playerNum}`}
                </h3>

                {player.topic && (
                  <div className="mt-2 px-5 py-1.5 bg-indigo-500/30 border border-indigo-400/40 rounded-full text-indigo-200 font-bold text-lg md:text-xl flex items-center gap-2">
                    <span>Specialty:</span>
                    <span className="text-white font-extrabold">{player.topic}</span>
                  </div>
                )}

                {player.details && (
                  <p className="mt-4 text-base md:text-xl text-amber-100/90 italic text-center max-w-md leading-snug">
                    "{player.details}"
                  </p>
                )}
              </motion.div>

              {/* Action Button */}
              <motion.button
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                onClick={() => {
                  audioSynth.playSwoosh();
                  window.speechSynthesis.cancel();
                  if (introducingPlayerIndex + 1 < playersState.length) {
                    setIntroducingPlayerIndex(prev => prev + 1);
                  } else {
                    setStage('multiplayer-intro');
                  }
                }}
                className="mt-8 md:mt-10 px-10 py-5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-2xl shadow-[0_10px_40px_rgba(251,191,36,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-2 border-white z-20 cursor-pointer"
              >
                <span>{introducingPlayerIndex + 1 < playersState.length ? 'Next Challenger' : 'Battle'}</span>
                <Play className="w-7 h-7 fill-current" />
              </motion.button>
            </motion.div>
          );
        })()}

        {stage === 'multiplayer-intro' && (
          <motion.div
            key="multiplayer-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="text-center p-6 md:p-12 max-w-7xl flex flex-col items-center justify-center h-full z-10 w-full mx-auto relative overflow-hidden"
          >
            {/* Background Floating Battle Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`star-battle-${i}`}
                  initial={{ 
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                    y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100,
                    rotate: 0,
                    scale: Math.random() * 0.8 + 0.5 
                  }}
                  animate={{ 
                    y: -100,
                    rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                    x: (Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)) 
                  }}
                  transition={{ 
                    duration: 4 + Math.random() * 6, 
                    repeat: Infinity,
                    delay: Math.random() * 3 
                  }}
                  className="absolute text-4xl"
                >
                  {i % 2 === 0 ? '⚔️' : (i % 3 === 0 ? '⭐' : '🔥')}
                </motion.div>
              ))}
            </div>

            {/* Battle Screen Header */}
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="z-10 flex flex-col items-center mb-6 md:mb-8"
            >
              <div className="px-6 py-2 bg-gradient-to-r from-red-500 via-amber-500 to-orange-500 text-white font-black text-sm md:text-lg rounded-full uppercase tracking-widest shadow-2xl mb-3 border-2 border-white/40">
                ⚔️ Ultimate Quiz Showdown ⚔️
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] tracking-tight">
                THE CHALLENGERS
              </h2>
            </motion.div>

            {/* Player Cards Clash Layout */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full max-w-5xl z-10 my-4">
              {playersState.map((player, idx) => {
                const themes = [
                  { bg: 'from-blue-900/85 to-indigo-950/95', border: 'border-cyan-400/60', shadow: 'shadow-[0_20px_60px_rgba(34,211,238,0.35)]', badge: 'bg-cyan-500', fallbackBg: 'bg-cyan-600' },
                  { bg: 'from-rose-900/85 to-purple-950/95', border: 'border-rose-400/60', shadow: 'shadow-[0_20px_60px_rgba(244,63,94,0.35)]', badge: 'bg-rose-500', fallbackBg: 'bg-rose-600' },
                  { bg: 'from-emerald-900/85 to-teal-950/95', border: 'border-emerald-400/60', shadow: 'shadow-[0_20px_60px_rgba(52,211,153,0.35)]', badge: 'bg-emerald-500', fallbackBg: 'bg-emerald-600' },
                  { bg: 'from-amber-900/85 to-orange-950/95', border: 'border-amber-400/60', shadow: 'shadow-[0_20px_60px_rgba(251,191,36,0.35)]', badge: 'bg-amber-500', fallbackBg: 'bg-amber-600' },
                  { bg: 'from-fuchsia-900/85 to-pink-950/95', border: 'border-fuchsia-400/60', shadow: 'shadow-[0_20px_60px_rgba(232,121,249,0.35)]', badge: 'bg-fuchsia-500', fallbackBg: 'bg-fuchsia-600' },
                ];
                const theme = themes[idx % themes.length];
                let initialX = 0;
                if (idx === 0) initialX = -250;
                else if (idx === 1) initialX = 250;
                else if (idx === 2) initialX = -250; // just alternate or 0
                else initialX = 250;

                return (
                  <React.Fragment key={player.id || idx}>
                    {idx > 0 && (
                      <motion.div
                        initial={{ scale: 0, rotate: -360, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 12 }}
                        className="relative z-20 my-2 md:my-0"
                      >
                        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-amber-400 via-red-500 to-orange-600 border-4 border-white shadow-[0_0_50px_rgba(245,158,11,0.9)] flex items-center justify-center text-3xl md:text-5xl font-black text-white italic tracking-wider animate-pulse">
                          VS
                        </div>
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ x: initialX, opacity: 0, scale: 0.8 }}
                      animate={{ x: 0, opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 * idx + 0.2, type: "spring", stiffness: 100, damping: 14 }}
                      className={`flex flex-col items-center p-8 md:p-10 rounded-[3rem] backdrop-blur-xl border-4 shadow-2xl w-full max-w-sm relative group overflow-hidden bg-gradient-to-b ${theme.bg} ${theme.border} ${theme.shadow}`}
                    >
                      {/* Corner Badge */}
                      <div className={`absolute top-4 ${idx % 2 === 0 ? 'left-4' : 'right-4'} px-4 py-1 rounded-full text-xs md:text-sm font-black text-white uppercase tracking-wider ${theme.badge}`}>
                        Player {idx + 1}
                      </div>
                      {/* Photo / Avatar */}
                      <div className="relative my-4">
                        {player.photo ? (
                          <img
                            src={player.photo}
                            alt={player.name}
                            className="w-32 h-32 md:w-44 md:h-44 object-cover rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)] border-4 border-white"
                          />
                        ) : (
                          <div className={`w-32 h-32 md:w-44 md:h-44 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)] border-4 border-white flex items-center justify-center text-6xl font-black text-white ${theme.fallbackBg}`}>
                            {player.name ? player.name.charAt(0).toUpperCase() : 'P'}
                          </div>
                        )}
                      </div>
                      <h3 className="text-3xl md:text-5xl font-black text-white drop-shadow-md text-center mb-1">
                        {player.name}
                      </h3>
                      {player.topic && (
                        <p className="text-base md:text-lg text-amber-300 font-bold mt-1">
                          Topic: {player.topic}
                        </p>
                      )}
                      {player.details && (
                        <p className="text-sm md:text-base text-white/80 italic text-center mt-2 leading-snug max-w-xs">
                          "{player.details}"
                        </p>
                      )}
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Let the Battle Begin Button */}
            <motion.button
              initial={{ scale: 0, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 150, damping: 15 }}
              onClick={() => {
                audioSynth.playSwoosh();
                window.speechSynthesis.cancel();
                if (quiz.rules) {
                  setStage('rules');
                } else if (quiz.mode !== 'interactive' || ((currentType as string) === 'rapid-fire' && (!quiz.isMultiplayer || quiz.mode !== 'interactive')) || quiz.type === 'combat-mode') {
                  if ((currentType as string) === 'rapid-fire') {
                    rapidFirePlayerIdxRef.current = null;
                    setCurrentPlayerIndex(quiz.questions[0]?.playerIndex || 0);
                  }
                  setStage('question');
                } else if (categories.length > 1 || (currentType as string) === 'rapid-fire') {
                  setStage(quiz.questions.some(q => q.rapidFireSet && q.category === selectedCategory) ? 'rapid-fire-set-selection' : 'category-selection'); rapidFirePlayerIdxRef.current = null;
                } else {
            setStage('question-selection');
          }
              }}
              className="mt-8 md:mt-12 px-10 py-5 md:px-14 md:py-6 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 font-black text-2xl md:text-4xl shadow-[0_0_60px_rgba(250,204,21,0.8)] hover:scale-105 active:scale-95 transition-transform flex items-center gap-4 z-10 border-4 border-white cursor-pointer"
            >
              <Play className="w-8 h-8 md:w-10 md:h-10 fill-current" />
              Let the Battle Begin!
            </motion.button>
          </motion.div>
        )}

        {stage === 'rules' && (
          <motion.div
            key="rules"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="p-8 max-w-5xl flex flex-col items-center justify-center h-full z-10 w-full mx-auto"
          >
            <motion.h2 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl md:text-7xl font-black mb-12 tracking-tight drop-shadow-2xl text-white text-center"
            >
              Rules of the Quiz
            </motion.h2>
            <div className="bg-white/10 p-8 md:p-12 rounded-[3rem] backdrop-blur-md border border-white/20 shadow-2xl w-full text-center flex flex-col gap-6">
              {quiz.rules?.split('\n').filter(r => r.trim()).map((rule, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.6 + 0.5, type: "spring", stiffness: 100 }}
                  className="text-2xl md:text-4xl text-white font-bold drop-shadow-md leading-relaxed"
                >
                  <span className="text-yellow-400 mr-3">✦</span>
                  {rule}
                </motion.div>
              ))}
            </div>
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: (quiz.rules?.split('\n').filter(r => r.trim()).length || 0) * 0.4 + 1.0, type: "spring", stiffness: 150 }}
              onClick={() => {
                audioSynth.playSwoosh();
                if (quiz.mode !== 'interactive' || ((currentType as string) === 'rapid-fire' && (!quiz.isMultiplayer || quiz.mode !== 'interactive')) || quiz.type === 'combat-mode') {
                  if ((currentType as string) === 'rapid-fire') {
                    rapidFirePlayerIdxRef.current = null;
                    setCurrentPlayerIndex(quiz.questions[0]?.playerIndex || 0);
                  }
                  setStage('question');
                } else if (categories.length > 1 || (currentType as string) === 'rapid-fire') {
                  setStage(quiz.questions.some(q => q.rapidFireSet && q.category === selectedCategory) ? 'rapid-fire-set-selection' : 'category-selection'); rapidFirePlayerIdxRef.current = null;
                } else {
            setStage('question-selection');
          }
              }}
              className="mt-12 px-12 py-6 rounded-full bg-yellow-400 text-yellow-900 font-black text-3xl shadow-[0_0_50px_rgba(250,204,21,0.6)] hover:scale-105 transition-transform flex items-center gap-4 z-10"
            >
              <Play className="w-10 h-10 fill-current" />
              Start
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
              {quiz.isMultiplayer 
                ? `${playersState[currentPlayerIndex]?.name}, choose a ${((currentType as string) === 'rapid-fire' || quiz.type === 'rapid-fire') ? 'set' : 'category'}!` 
                : `Choose a ${((currentType as string) === 'rapid-fire' || quiz.type === 'rapid-fire') ? 'Set' : 'Category'}!`}
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
                      const isRapidFireCategory = catQuestions[0].q.type === 'rapid-fire';
                      if (isRapidFireCategory) {
                        const hasSets = catQuestions.some(q => q.q.rapidFireSet);
                        if (hasSets) {
                          setStage('rapid-fire-set-selection');
                        } else {
                          const firstCatQ = catQuestions[0].idx;
                          setCurrentQuestionIndex(firstCatQ);
                          setTimeLeft(catQuestions[0].q.timeLimit);
                          setStage('question');
                        }
                      } else {
                        setStage('question-selection');
                      }
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
                {
  if (quiz.mode === 'video') {
    if (!quiz.isOfflineMode && earnedBadges.length > 0) {
      setStage('badges');
    } else if (quiz.quotes && quiz.quotes.length > 0) {
      setStage('quote');
    } else {
      setStage('celebrate');
    }
  } else {
    setStage('score');
  }
};
              }}
              className="mt-16 px-8 py-4 bg-rose-500 text-white font-bold text-xl rounded-full shadow-lg hover:bg-rose-600 transition-colors"
            >
              End Quiz
            </button>
          </motion.div>
        )}
        
        {stage === 'rapid-fire-set-selection' && (
          <motion.div
            key="rapid-fire-set-selection"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center h-full p-8 z-10 w-full"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-12 text-white drop-shadow-2xl">
              {quiz.isMultiplayer ? `${playersState[currentPlayerIndex]?.name}, choose a Set!` : 'Choose a Set!'}
            </h2>
            <div className="flex flex-wrap justify-center gap-6 max-w-6xl w-full mx-auto">
              {Array.from(new Set(quiz.questions.filter(q => q.category === selectedCategory && q.rapidFireSet).map(q => q.rapidFireSet))).map((setKey, i) => {
                const setQuestions = quiz.questions.map((q, idx) => ({ q, idx })).filter(x => x.q.category === selectedCategory && x.q.rapidFireSet === setKey);
                const allAnswered = setQuestions.every(x => answeredQuestions.has(x.idx));
                const answeredCount = setQuestions.filter(x => answeredQuestions.has(x.idx)).length;
                return (
                  <button
                    key={setKey}
                    disabled={allAnswered}
                    onClick={() => {
                      audioSynth.playSwoosh();
                      setSelectedRapidFireSet(setKey as string);
                      const firstCatQ = setQuestions[0].idx;
                      setCurrentQuestionIndex(firstCatQ);
                      setTimeLeft(setQuestions[0].q.timeLimit);
                      setStage('question');
                    }}
                    className={`px-8 py-6 rounded-3xl text-3xl font-black transition-all flex flex-col items-center gap-2 shadow-xl ${
                      allAnswered
                        ? 'bg-slate-500/40 text-slate-300/40 cursor-not-allowed border-4 border-slate-400/30 shadow-inner'
                        : 'bg-white text-indigo-700 hover:scale-105 active:translate-y-2'
                    }`}
                  >
                    <span>{setKey as string}</span>
                    <span className={`text-lg font-bold ${allAnswered ? 'text-slate-400/50' : 'text-indigo-400'}`}>
                      {answeredCount} / {setQuestions.length} Answered
                    </span>
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => {
                audioSynth.playSwoosh();
                if (categories.length > 1) {
                  setStage('category-selection');
                } else {
                  {
  if (quiz.mode === 'video') {
    if (!quiz.isOfflineMode && earnedBadges.length > 0) {
      setStage('badges');
    } else if (quiz.quotes && quiz.quotes.length > 0) {
      setStage('quote');
    } else {
      setStage('celebrate');
    }
  } else {
    setStage('score');
  }
};
                }
              }}
              className="mt-16 px-8 py-4 bg-slate-500 text-white font-bold text-xl rounded-full shadow-lg hover:bg-slate-600 transition-colors"
            >
              Back
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
                      setStage(quiz.questions.some(q => q.rapidFireSet && q.category === selectedCategory) ? 'rapid-fire-set-selection' : 'category-selection'); rapidFirePlayerIdxRef.current = null;
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
                    setStage(quiz.questions.some(q => q.rapidFireSet && q.category === selectedCategory) ? 'rapid-fire-set-selection' : 'category-selection'); rapidFirePlayerIdxRef.current = null;
                  }}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl rounded-full shadow-lg transition-all hover:scale-105 active:translate-y-1 border border-white/20"
                >
                  Change Category 🔄
                </button>
              )}
              <button
                onClick={() => {
                  audioSynth.playSwoosh();
                  {
  if (quiz.mode === 'video') {
    if (!quiz.isOfflineMode && earnedBadges.length > 0) {
      setStage('badges');
    } else if (quiz.quotes && quiz.quotes.length > 0) {
      setStage('quote');
    } else {
      setStage('celebrate');
    }
  } else {
    setStage('score');
  }
};
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
            initial={{ opacity: 0, x: 100, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
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

            {stage === 'reveal' && quiz.mode !== 'interactive' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] pointer-events-none overflow-hidden"
              >
                {Array.from({ length: 25 }).map((_, i) => {
                  const isBalloon = i % 2 === 0;
                  const icon = isBalloon ? '🎈' : (i % 3 === 0 ? '🌟' : '⭐');
                  const left = `${Math.random() * 100}%`;
                  const delay = Math.random() * 0.3;
                  const duration = 2 + Math.random() * 2;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: '100vh', x: 0 }}
                      animate={{ 
                        opacity: [0, 1, 1, 0], 
                        y: '-20vh', 
                        x: (Math.random() - 0.5) * 200,
                        rotate: Math.random() * 360 
                      }}
                      transition={{ duration, delay, ease: "easeOut" }}
                      className="absolute text-5xl md:text-7xl drop-shadow-lg"
                      style={{ left }}
                    >
                      {icon}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {stage === 'reveal' && quiz.mode === 'interactive' && quiz.showBadges !== false && (() => {
              const rawAnswer = (question?.correctAnswer || question?.answer || question?.word || question?.correct_answer || question?.brand_name || '').toString().trim();
              const clicked = (interactiveOptionClicked || '').toString().trim();
              
              if (!clicked) return null;
              
              let isCorrect = false;
              if (question?.type === 'detective' || currentType === 'detective') {
                const fakeSentence = (question.sentences && question.fakeSentenceIndex !== undefined ? question.sentences[question.fakeSentenceIndex] : '').toString().trim();
                isCorrect = clicked.toLowerCase() === fakeSentence.toLowerCase() || (rawAnswer !== '' && clicked.toLowerCase() === rawAnswer.toLowerCase());
              } else if (question?.type === 'match-the-following' || currentType === 'match-the-following' || question?.type === 'word-search' || currentType === 'word-search') {
                isCorrect = true;
              } else {
                isCorrect = rawAnswer === '' ? true : (clicked.toLowerCase() === rawAnswer.toLowerCase());
              }

              if (!isCorrect) return null;

              const activePlayer = playersState[currentPlayerIndex] || { name: quiz.teamName || 'Player 1' };
              const playerPhoto = activePlayer.photo;
              const playerName = activePlayer.name || 'Player';
              const pointsGained = getAwardPoints();
              const activeTopic = question?.category || quiz.topic || 'Quiz';

              const badgeIcons = ['🌟', '🏆', '🥇', '🧠', '⚡', '🎯', '👑', '💎'];
              const icon = badgeIcons[currentQuestionIndex % badgeIcons.length];

              const badgeTitles = [
                `${activeTopic} Master!`,
                `Trivia Whiz!`,
                `Sharp Shooter!`,
                `Brainiac!`,
                `Quick Thinker!`,
                `Spot On!`,
                `Super Star!`,
                `Knowledge Champion!`
              ];
              const badgeTitle = badgeTitles[currentQuestionIndex % badgeTitles.length];

              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-hidden"
                >
                  {/* Floating Balloons and Stars */}
                  {Array.from({ length: 20 }).map((_, i) => {
                    const isBalloon = i % 2 === 0;
                    const icon = isBalloon ? '🎈' : (i % 3 === 0 ? '🌟' : '⭐');
                    const left = `${Math.random() * 100}%`;
                    const delay = Math.random() * 0.5;
                    const duration = 2 + Math.random() * 2;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: '100vh', x: 0 }}
                        animate={{ 
                          opacity: [0, 1, 1, 0], 
                          y: '-20vh', 
                          x: (Math.random() - 0.5) * 200,
                          rotate: Math.random() * 360 
                        }}
                        transition={{ duration, delay, ease: "easeOut" }}
                        className="absolute text-5xl md:text-7xl drop-shadow-lg"
                        style={{ left }}
                      >
                        {icon}
                      </motion.div>
                    );
                  })}

                  <motion.div
                    initial={{ scale: 0.4, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 p-8 sm:p-10 rounded-[3rem] shadow-[0_25px_80px_rgba(245,158,11,0.7)] border-8 border-white flex flex-col items-center text-center gap-4 animate-bounce max-w-lg w-full relative z-10"
                  >
                    {playerPhoto ? (
                      <div className="relative -mt-14">
                        <img src={playerPhoto} alt={playerName} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl" />
                        <span className="absolute -bottom-2 -right-2 text-4xl">{icon}</span>
                      </div>
                    ) : (
                      <div className="text-8xl drop-shadow-2xl -mt-12 animate-pulse">{icon}</div>
                    )}
                    
                    <div className="bg-white text-orange-600 px-6 py-2 rounded-full font-black text-2xl sm:text-3xl uppercase tracking-widest shadow-inner border-2 border-orange-200">
                      🏆 {badgeTitle}
                    </div>

                    <div className="text-white font-extrabold text-3xl sm:text-4xl drop-shadow-md">
                      {playerName} Earned a Badge!
                    </div>

                    <div className="bg-black/25 text-yellow-100 font-black text-xl sm:text-2xl px-6 py-2 rounded-full border border-white/30 flex items-center gap-2">
                      <span>+{pointsGained} Points</span>
                      <span className="text-white/60">|</span>
                      <span className="text-white">{activeTopic}</span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
          <motion.div
            key={`q-container-inner-${currentQuestionIndex}`}
            className={`${quiz.mode === 'interactive' ? 'w-[calc(100%-16rem)] sm:w-[calc(100%-18rem)] md:w-[calc(100%-22rem)] lg:w-[calc(100%-25rem)] ml-2 sm:ml-4 md:ml-8 mr-auto justify-center' : 'w-[90vw] mx-auto'} max-w-[1800px] h-full flex flex-col z-10 ${currentType === '5-clues' || currentType === 'detective' || currentType === 'find-in-map' ? 'p-4 md:p-6' : 'p-8 md:p-12'}`}
          >
            {/* Top Bar */}
            {/* Milestone Progress Bar */}
            {quiz.showBadges !== false && (() => {
              const totalQ = quiz.questions.length || 1;
              const maxBadges = Math.min(4, Math.max(1, Math.ceil(totalQ / 5)));
              const badgeInterval = Math.max(5, Math.ceil(totalQ / maxBadges));
              
              const isInteractiveGrid = quiz.mode === 'interactive' && quiz.type !== 'combat-mode' && quiz.type !== 'rapid-fire' && (quiz.isMultiplayer && (quiz.players?.length || 1) > 1);
              const numAnswered = isInteractiveGrid ? answeredQuestions.size : currentQuestionIndex;
              const earnedCount = Math.min(maxBadges, Math.floor(numAnswered / badgeInterval));

              return (
                <div className="w-full mb-6 mt-2">
                  <div className="flex justify-between text-white/90 font-bold mb-2 text-sm uppercase tracking-wider">
                    <span>Milestone Progress</span>
                    <span>{earnedCount} of {maxBadges} Badges</span>
                  </div>
                  <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden relative shadow-inner">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-300 to-yellow-500"
                      initial={{ width: `${(Math.max(0, numAnswered) / totalQ) * 100}%` }}
                      animate={{ width: `${((numAnswered + (stage === 'reveal' && (!isInteractiveGrid || !answeredQuestions.has(currentQuestionIndex)) ? 1 : 0)) / totalQ) * 100}%` }}
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
            <div className={`w-full flex ${quiz.mode === 'interactive' ? 'justify-start gap-4 md:gap-6 flex-wrap' : 'justify-between'} items-center ${currentType === '5-clues' || currentType === 'detective' || currentType === 'find-in-map' ? 'mb-4 md:mb-6' : 'mb-10'}`}>
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
              {quiz.mode === 'interactive' && question.options && question.options.length > 2 && (stage === 'question' || stage === 'reveal') && (
                <button
                  onClick={handleFiftyFifty}
                  disabled={stage === 'reveal' || usedFiftyFifty[`${currentPlayerIndex}-${question.category || 'default'}`]}
                  className={`px-6 py-3 rounded-full font-black text-xl uppercase tracking-widest flex items-center gap-2 border-4 transition-all shadow-2xl ${usedFiftyFifty[`${currentPlayerIndex}-${question.category || 'default'}`] ? 'bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 text-white border-amber-600 active:scale-95'}`}
                  title={usedFiftyFifty[`${currentPlayerIndex}-${question.category || 'default'}`] ? "50/50 already used in this category" : "Use 50/50 Lifeline"}
                >
                  <Lightbulb className="w-6 h-6" /> 50/50
                </button>
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
              <div className="flex-1 w-full flex flex-col md:flex-row gap-8 md:gap-12 overflow-hidden mb-6 z-10 relative px-4 py-8">
                {/* VS Badge */}
                <motion.div 
                   initial={{ scale: 0, opacity: 0, rotate: -180 }}
                   animate={{ scale: 1, opacity: 1, rotate: 0 }}
                   transition={{ duration: 0.8, type: 'spring', bounce: 0.6, delay: 0.5 }}
                   className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center border-[8px] md:border-[12px] border-white shadow-[0_0_60px_rgba(239,68,68,0.8)] text-white font-black italic text-4xl md:text-6xl"
                >
                   VS
                </motion.div>

                {/* Left Player */}
                <motion.div 
                   initial={{ x: -100, opacity: 0, rotateY: -10 }}
                   animate={{ x: 0, opacity: 1, rotateY: 0 }}
                   transition={{ duration: 0.6, type: 'spring' }}
                   className="flex-1 flex flex-col bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.3)] border-b-[16px] border-indigo-400 p-8 md:p-12 relative overflow-visible"
                >
                  <div className="absolute -top-16 -left-16 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
                  <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-transparent to-indigo-500/30" />
                  
                  <h3 className="text-indigo-600 font-black tracking-widest uppercase mb-4 text-2xl relative z-10 flex items-center gap-3 bg-indigo-50 inline-block px-6 py-2 rounded-full self-start shadow-inner border-2 border-indigo-100">
                    <Sparkles className="w-6 h-6" /> Player 1
                  </h3>
                  <h2 className="font-extrabold text-slate-800 text-3xl md:text-5xl lg:text-6xl leading-tight mb-8 drop-shadow-sm flex-1 relative z-10">
                    {question.combatLeft?.question}
                  </h2>
                  <div className="flex flex-col gap-4 w-full mt-auto relative z-10">
                    {question.combatLeft?.options?.map((option, i) => {
                      const isCorrect = option === question.combatLeft?.correctAnswer;
                      const isReveal = stage === 'reveal';
                      let cardClass = "bg-slate-100 text-slate-800 border-[6px] border-slate-200 hover:border-indigo-300";
                      if (isReveal) {
                        if (isCorrect) cardClass = "bg-gradient-to-r from-emerald-400 to-emerald-500 text-white border-[6px] border-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-[1.03]";
                        else cardClass = "bg-slate-50 text-slate-300 border-[6px] border-transparent opacity-50";
                      }
                      return (
                        <motion.div key={`l-${i}`} className={`px-6 py-4 rounded-3xl text-xl md:text-2xl font-bold flex items-center gap-5 transition-all duration-500 ${cardClass}`}>
                          <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-black text-xl shadow-inner ${isReveal && isCorrect ? 'bg-white text-emerald-600' : 'bg-white text-slate-400'}`}>
                            {['A','B','C','D'][i]}
                          </div>
                          <span className="leading-tight">{option}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
                
                {/* Right Player */}
                <motion.div 
                   initial={{ x: 100, opacity: 0, rotateY: 10 }}
                   animate={{ x: 0, opacity: 1, rotateY: 0 }}
                   transition={{ duration: 0.6, type: 'spring' }}
                   className="flex-1 flex flex-col bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.3)] border-b-[16px] border-rose-400 p-8 md:p-12 relative overflow-visible"
                >
                  <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-rose-500/20 blur-3xl rounded-full pointer-events-none" />
                  <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-l from-transparent to-rose-500/30" />
                  
                  <h3 className="text-rose-600 font-black tracking-widest uppercase mb-4 text-2xl relative z-10 flex items-center gap-3 bg-rose-50 inline-block px-6 py-2 rounded-full self-start shadow-inner border-2 border-rose-100">
                    <Rocket className="w-6 h-6" /> Player 2
                  </h3>
                  <h2 className="font-extrabold text-slate-800 text-3xl md:text-5xl lg:text-6xl leading-tight mb-8 drop-shadow-sm flex-1 relative z-10">
                    {question.combatRight?.question}
                  </h2>
                  <div className="flex flex-col gap-4 w-full mt-auto relative z-10">
                    {question.combatRight?.options?.map((option, i) => {
                      const isCorrect = option === question.combatRight?.correctAnswer;
                      const isReveal = stage === 'reveal';
                      let cardClass = "bg-slate-100 text-slate-800 border-[6px] border-slate-200 hover:border-rose-300";
                      if (isReveal) {
                        if (isCorrect) cardClass = "bg-gradient-to-r from-emerald-400 to-emerald-500 text-white border-[6px] border-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-[1.03]";
                        else cardClass = "bg-slate-50 text-slate-300 border-[6px] border-transparent opacity-50";
                      }
                      return (
                        <motion.div key={`r-${i}`} className={`px-6 py-4 rounded-3xl text-xl md:text-2xl font-bold flex items-center gap-5 transition-all duration-500 ${cardClass}`}>
                          <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-black text-xl shadow-inner ${isReveal && isCorrect ? 'bg-white text-emerald-600' : 'bg-white text-slate-400'}`}>
                            {['A','B','C','D'][i]}
                          </div>
                          <span className="leading-tight">{option}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            ) : (
              <>
                <div className={`bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col ${quiz.mode === 'interactive' ? 'items-start text-left justify-center' : 'items-center justify-center'} border-b-[12px] border-slate-200 z-10 relative pt-16 md:pt-20 ${currentType === '5-clues' || currentType === 'detective' || currentType === 'match-the-following' || currentType === 'word-search' ? 'px-6 pb-6 md:px-8 md:pb-8 mb-6 gap-6 shrink-0' : currentType === 'find-in-map' ? `px-6 pb-6 md:px-8 md:pb-8 mb-6 ${quiz.mode === 'interactive' ? 'shrink-0' : 'flex-1'} gap-6` : `px-8 pb-8 md:px-12 md:pb-12 mb-8 ${quiz.mode === 'interactive' ? 'shrink-0' : 'flex-1'} gap-8`}`}>
                  


              <div className={`flex flex-col md:flex-row items-center ${quiz.mode === 'interactive' ? 'justify-start text-left' : 'justify-center'} w-full ${currentType === '5-clues' || currentType === 'detective' || currentType === 'find-in-map' || currentType === 'match-the-following' || currentType === 'word-search' ? 'gap-8' : 'gap-12'}`}>
                {((question.imageUrl && !imageError) || uploadedImages[currentQuestionIndex] || (quiz.mode === 'interactive' && isImageQuestion)) && currentType !== 'find-in-map' && (isImageQuestion || currentType === 'multiple-choice' || stage === 'reveal' || (quiz.mode === 'interactive' && (interactiveOptionClicked !== null || answeredQuestions.has(currentQuestionIndex)))) && (
                  <div className={
                    isImageQuestion
                      ? "w-full max-w-5xl h-[50vh] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-100 mx-0 relative group flex-1"
                      : `shrink-0 rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-100 relative group ${currentType === '5-clues' || currentType === 'detective' || currentType === 'match-the-following' || currentType === 'word-search' ? 'w-40 h-40 md:w-48 md:h-48' : 'w-48 h-48 md:w-72 md:h-72'}`
                  }>
                    {uploadedImages[currentQuestionIndex] || (question.imageUrl && !imageError) ? (
                      <img 
                        src={uploadedImages[currentQuestionIndex] || question.imageUrl} 
                        alt="Identify this" 
                        className="w-full h-full object-contain bg-slate-50 transition-all duration-1000 ease-in-out" 
                        style={getBlurStyle()} 
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        onError={(e) => { if (question.imagePreviewUrl && e.currentTarget.src !== question.imagePreviewUrl) { e.currentTarget.src = question.imagePreviewUrl; } else { setImageError(true); } }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                        <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                        <span className="text-sm font-semibold">No Image</span>
                      </div>
                    )}

                  </div>
                )}
                {(quiz.isOfflineMode || !isImageQuestion) && (
                  <h2 className={`font-extrabold text-slate-800 ${quiz.mode === 'interactive' ? 'text-left' : 'text-center'} leading-tight drop-shadow-sm flex-1 ${currentType === '5-clues' || currentType === 'detective' || currentType === 'find-in-map' || isJumbledLetters || currentType === 'match-the-following' || currentType === 'word-search' ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-5xl md:text-6xl lg:text-7xl'}`}>
                    {question.question || 'Unjumble the word!'}
                  </h2>
                )}
              </div>
              
              {isJumbledLetters && (
                <div className={`flex flex-col ${quiz.mode === 'interactive' ? 'items-start text-left' : 'items-center'} gap-8 w-full mt-2`}>
                  <div className={`flex flex-wrap gap-3 sm:gap-4 md:gap-6 ${quiz.mode === 'interactive' ? 'justify-start' : 'justify-center'} w-full relative z-10`}>
                    {(() => {
                      const rawAnswer = question.correctAnswer || question.answer || question.word || question.correct_answer || question.brand_name || '';
                      const word = rawAnswer.replace(/\s/g, '').toUpperCase();
                      const letterObjects = word.split('').map((char, i) => ({ char, id: i }));
                      const displayLetters = stage === 'reveal' ? letterObjects : jumbledLettersForQuestion;

                      return displayLetters.map((item, i) => (
                        <motion.div 
                          key={`${item.id}-${i}`}
                          layout
                          initial={{ scale: 0, rotateY: 180, opacity: 0 }}
                          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                          transition={{ delay: stage === 'reveal' ? i * 0.05 : i * 0.08, type: 'spring', stiffness: 200, damping: 15 }}
                          whileHover={{ scale: 1.05, y: -10, rotateZ: (Math.random() - 0.5) * 10 }}
                          className={`w-16 h-22 sm:w-20 sm:h-28 md:w-28 md:h-36 lg:w-32 lg:h-40 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black border-b-[12px] md:border-b-[16px] uppercase z-10 transition-colors duration-500 ${stage === 'reveal' ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-emerald-800 shadow-[0_0_50px_rgba(16,185,129,0.8)]' : 'bg-gradient-to-b from-white to-slate-100 text-indigo-700 border-indigo-300 backdrop-blur-md'}`}
                        >
                          <span className="drop-shadow-md relative z-10">{item.char}</span>
                          <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 hover:opacity-100 transition-opacity" />
                        </motion.div>
                      ));
                    })()}
                  </div>
                </div>
              )}
              
              {currentType === 'find-in-map' && (
                <div className="w-full flex-1 min-h-[300px] max-h-[60vh] shrink-0 mt-4 rounded-3xl overflow-hidden relative">
                  <MapQuestion question={question} timeLeft={timeLeft} />
                </div>
              )}
              
              {currentType === '5-clues' && question.options && (
                <div className="grid grid-cols-2 gap-4 md:gap-6 mt-4 w-full max-w-6xl">
                  {question.options.map((option, i) => {
                    const isCorrect = option === question.correctAnswer;
                    const isReveal = stage === 'reveal';
                    const isEliminated = eliminatedOptions.includes(i);
                    let optClass = "bg-slate-100 text-slate-700 border-2 border-slate-200";
                    if (isEliminated && !isReveal) {
                      optClass = "bg-slate-100 text-slate-400 border-2 border-slate-200 opacity-40 pointer-events-none";
                    } else if (quiz.mode === 'interactive' && !isReveal) {
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
                          if (isEliminated) return;
                          if (quiz.mode === 'interactive' && !isReveal) {
                            if (timerRef.current) clearInterval(timerRef.current);
                            setInteractiveOptionClicked(option);
                            if (isCorrect) {
                              confetti({
                                particleCount: 120,
                                spread: 90,
                                origin: { y: 0.6 },
                                colors: ['#38bdf8', '#facc15', '#f43f5e', '#a855f7', '#34d399']
                              });
                              setScore(s => {
                                const inc = (getAwardPoints());
                                const nextScore = s + inc;
                                const threshold = Math.ceil(quiz.questions.length / 2) * inc;
                                if (s < threshold && nextScore >= threshold) {
                                  confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
                                }
                                return nextScore;
                              });
                              if (quiz.isMultiplayer || (quiz.players && quiz.players.length > 0)) {
                                setPlayersState(prev => {
                                  const next = [...prev];
                                  if (next[currentPlayerIndex]) {
                                    const currentBadges = next[currentPlayerIndex].badges || [];
                                    const badgeIcons = ['🌟', '🏆', '🥇', '🧠', '⚡', '🎯', '👑', '💎'];
                                    const newBadge = badgeIcons[currentQuestionIndex % badgeIcons.length];
                                    next[currentPlayerIndex] = { 
                                      ...next[currentPlayerIndex], 
                                      score: (next[currentPlayerIndex].score || 0) + (getAwardPoints()),
                                      badges: [...currentBadges, newBadge]
                                    };
                                  }
                                  return next;
                                });
                              }
                              audioSynth.playCorrect();
                              if (quiz.mode === 'interactive' && quiz.enableClapping !== false && Math.random() < 0.4) {
                                setTimeout(() => audioSynth.playClap(), 300);
                              }
                            } else {
                              audioSynth.playWrong();
                            }
                            window.speechSynthesis.cancel();
                            if ((currentType as string) === 'rapid-fire') {
                              setCurrentQuestionIndex((prev) => prev + 1);
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
                              } else {
                                setStage('question');
                              }
                            } else {
                              setStage('reveal');
                            }
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
            {currentType === 'detective' && (
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
                            confetti({
                              particleCount: 120,
                              spread: 90,
                              origin: { y: 0.6 },
                              colors: ['#38bdf8', '#facc15', '#f43f5e', '#a855f7', '#34d399']
                            });
                            setScore(s => {
                              const inc = (getAwardPoints());
                              const nextScore = s + inc;
                              const threshold = Math.ceil(quiz.questions.length / 2) * inc;
                              if (s < threshold && nextScore >= threshold) {
                                confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
                              }
                              return nextScore;
                            });
                              if (quiz.isMultiplayer || (quiz.players && quiz.players.length > 0)) {
                                setPlayersState(prev => {
                                  const next = [...prev];
                                  if (next[currentPlayerIndex]) {
                                    const currentBadges = next[currentPlayerIndex].badges || [];
                                    const badgeIcons = ['🌟', '🏆', '🥇', '🧠', '⚡', '🎯', '👑', '💎'];
                                    const newBadge = badgeIcons[currentQuestionIndex % badgeIcons.length];
                                    next[currentPlayerIndex] = { 
                                      ...next[currentPlayerIndex], 
                                      score: (next[currentPlayerIndex].score || 0) + (getAwardPoints()),
                                      badges: [...currentBadges, newBadge]
                                    };
                                  }
                                  return next;
                                });
                              }
                            audioSynth.playCorrect();
                            if (quiz.mode === 'interactive' && quiz.enableClapping !== false && Math.random() < 0.4) {
                              setTimeout(() => audioSynth.playClap(), 300);
                            }
                          } else {
                            audioSynth.playWrong();
                          }
                          window.speechSynthesis.cancel();
                            if ((currentType as string) === 'rapid-fire') {
                              setCurrentQuestionIndex((prev) => prev + 1);
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
                              } else {
                                setStage('question');
                              }
                            } else {
                              setStage('reveal');
                            }
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
                {stage === 'reveal' && quiz.mode !== 'video' && question.insight && (
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
            
            {(currentType === '5-clues' || question.type === '5-clues') && !isJumbledLetters && (
              <div className="flex-1 w-full shrink-0 mb-6 flex flex-col gap-3 md:gap-4 relative px-4 z-10">
                {question.clues?.map((clue, i) => {
                  const isVisible = i <= clueIndex || stage === 'reveal';
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -100, rotateY: -20, scale: 0.8 }}
                      animate={isVisible ? { opacity: 1, x: 0, rotateY: 0, scale: 1 } : { opacity: 0, x: -100, rotateY: -20, scale: 0.8 }}
                      transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
                      className={`px-6 py-4 md:px-8 md:py-6 rounded-3xl text-xl md:text-3xl font-bold shadow-[0_15px_40px_rgba(0,0,0,0.15)] flex items-center gap-6 transform transition-all ${isVisible ? 'bg-white/95 backdrop-blur-xl text-slate-800 border-l-[12px] border-indigo-500' : 'hidden'}`}
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-2xl md:text-3xl shadow-[0_0_20px_rgba(99,102,241,0.5)] border-4 border-indigo-200">
                        {i + 1}
                      </div>
                      <span className="leading-snug tracking-tight relative z-10">{clue}</span>
                      
                      {/* Decorative background element for clue card */}
                      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-indigo-50/50 to-transparent rounded-r-3xl pointer-events-none" />
                    </motion.div>
                  );
                })}
                {stage === 'reveal' && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', bounce: 0.5, delay: 0.5 }}
                    className="mt-6 px-8 py-6 rounded-[2rem] bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-b-[12px] border-emerald-800 shadow-[0_20px_50px_rgba(16,185,129,0.5)] text-3xl md:text-5xl font-black text-center relative overflow-hidden"
                  >
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 blur-3xl rounded-full" />
                    <span className="relative z-10">Answer: {question.correctAnswer}</span>
                  </motion.div>
                )}
              </div>
            )}
            
            {(isJumbledLetters || isImageIdentifyWithoutOptions) && (
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
                {quiz.mode === 'interactive' && stage !== 'reveal' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex flex-col md:flex-row gap-4 items-stretch justify-center w-full max-w-3xl mx-auto"
                  >
                    <input
                      type="text"
                      value={jumbledInput}
                      onChange={(e) => setJumbledInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleJumbledSubmit();
                        }
                      }}
                      className="flex-1 px-8 py-5 rounded-full text-3xl md:text-4xl font-bold text-center text-slate-800 border-4 border-indigo-200 focus:border-indigo-500 focus:outline-none shadow-inner"
                      placeholder="Type answer here..."
                      autoFocus
                    />
                    <button
                      onClick={handleJumbledSubmit}
                      className="px-10 py-5 rounded-full bg-emerald-500 text-white font-black text-3xl md:text-4xl shadow-[0_10px_0_rgba(16,185,129,1)] hover:translate-y-2 hover:shadow-none transition-all"
                    >
                      SUBMIT
                    </button>
                  </motion.div>
                )}
                {stage === 'reveal' && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`mt-2 px-6 py-4 rounded-3xl text-white border-b-8 shadow-[0_0_50px_rgba(16,185,129,0.8)] text-3xl md:text-4xl font-black text-center uppercase tracking-widest ${
                      quiz.mode === 'interactive' && interactiveOptionClicked && interactiveOptionClicked.toLowerCase() !== question.correctAnswer.toLowerCase()
                        ? 'bg-rose-500 border-rose-700 shadow-[0_0_50px_rgba(244,63,94,0.8)]'
                        : 'bg-emerald-500 border-emerald-700'
                    }`}
                  >
                    {(() => {
                      const rawAnswer = question.correctAnswer || question.answer || question.word || question.correct_answer || question.brand_name || '';
                      const isWrong = quiz.mode === 'interactive' && interactiveOptionClicked && interactiveOptionClicked.toLowerCase() !== rawAnswer.toLowerCase();
                      if (isWrong) {
                        return (
                          <>
                            <span className="line-through opacity-70 text-2xl mr-4">{interactiveOptionClicked}</span>
                            <span>Correct: {rawAnswer}</span>
                          </>
                        );
                      }
                      return `Answer: ${rawAnswer}`;
                    })()}
                  </motion.div>
                )}
              </div>
            )}

            {currentType === 'match-the-following' && question.pairs && (
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

            {currentType === 'word-search' && question.grid && (
              <div className="w-full flex-1 flex flex-col items-center justify-center mt-2 mb-6 relative z-10">
                <div className="relative p-6 md:p-8 bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border-b-[16px] border-indigo-400 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/10 pointer-events-none" />
                  
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-indigo-300 rounded-tl-[2.5rem] opacity-50 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-indigo-300 rounded-br-[2.5rem] opacity-50 pointer-events-none" />

                  <div className="grid grid-cols-10 gap-2 md:gap-3 relative z-10">
                    {question.grid.map((row, r) => (
                      row.map((cell, c) => {
                        let isHighlighted = false;
                        let highlightIndex = 0;
                        if (stage === 'reveal' && question.wordLocations) {
                          const wordLocIndex = question.wordLocations.findIndex(w => w.cells.some(cellPos => cellPos.r === r && cellPos.c === c));
                          if (wordLocIndex !== -1) {
                            isHighlighted = true;
                            highlightIndex = wordLocIndex;
                          }
                        }

                        // Colors for different words
                        const highlightColors = [
                          'from-emerald-400 to-emerald-600 border-emerald-700 shadow-emerald-500/50',
                          'from-rose-400 to-rose-600 border-rose-700 shadow-rose-500/50',
                          'from-amber-400 to-amber-600 border-amber-700 shadow-amber-500/50',
                          'from-cyan-400 to-cyan-600 border-cyan-700 shadow-cyan-500/50',
                          'from-fuchsia-400 to-fuchsia-600 border-fuchsia-700 shadow-fuchsia-500/50',
                        ];
                        const colorClass = isHighlighted ? highlightColors[highlightIndex % highlightColors.length] : 'from-slate-50 to-white border-slate-200 text-slate-700';

                        return (
                          <motion.div 
                            key={`${r}-${c}`} 
                            initial={{ scale: 0, opacity: 0, rotateX: -90 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            transition={{ delay: (r * 10 + c) * 0.015, type: 'spring', stiffness: 200, damping: 12 }}
                            whileHover={!isHighlighted ? { scale: 1.1, zIndex: 20, rotateZ: (Math.random() - 0.5) * 10, y: -4 } : {}}
                            className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-[4rem] lg:h-[4rem] flex items-center justify-center rounded-2xl text-2xl sm:text-3xl md:text-4xl lg:text-[2.2rem] font-black transition-all duration-500 border-b-[6px] md:border-b-[8px] bg-gradient-to-b ${isHighlighted ? `text-white scale-110 z-10 shadow-[0_10px_25px_var(--tw-shadow-color)] ${colorClass}` : `${colorClass} shadow-md`}`}
                          >
                             <span className={isHighlighted ? "drop-shadow-md" : ""}>{cell}</span>
                          </motion.div>
                        );
                      })
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {stage === 'reveal' && question.wordsToFind && (
                    <motion.div 
                      initial={{ opacity: 0, y: 40, scale: 0.9 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }} 
                      transition={{ delay: 0.8, type: 'spring', bounce: 0.5 }}
                      className="mt-8 flex flex-wrap gap-4 justify-center max-w-4xl"
                    >
                      {question.wordsToFind.map((word, i) => {
                        const highlightColors = [
                          'text-emerald-700 bg-emerald-100 border-emerald-300',
                          'text-rose-700 bg-rose-100 border-rose-300',
                          'text-amber-700 bg-amber-100 border-amber-300',
                          'text-cyan-700 bg-cyan-100 border-cyan-300',
                          'text-fuchsia-700 bg-fuchsia-100 border-fuchsia-300',
                        ];
                        const colorClass = highlightColors[i % highlightColors.length];
                        return (
                          <motion.div 
                            key={word} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + i * 0.15 }}
                            className={`px-6 py-3 font-black text-2xl md:text-3xl rounded-2xl shadow-lg border-b-[6px] uppercase tracking-widest flex items-center gap-3 ${colorClass}`}
                          >
                            <Sparkles className="w-6 h-6 opacity-80" />
                            {word}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {(currentType === 'text-presentation' || question.type === 'text-presentation') && !isJumbledLetters && (
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

            {currentType === 'a-to-z' && (
              <div className="w-full flex flex-col items-center justify-center relative z-10 my-4 md:my-8">
                {(() => {
                  const match = question.question.match(/letter\s+([A-Z])/i);
                  const letter = match ? match[1].toUpperCase() : (question.question.trim().slice(-1).toUpperCase());
                  
                  return (
                    <div className="flex flex-col items-center relative w-full max-w-5xl mx-auto">
                      <motion.div 
                        initial={{ scale: 0, rotateY: -180, opacity: 0 }}
                        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                        transition={{ type: 'spring', bounce: 0.6, duration: 1.5 }}
                        whileHover={{ scale: 1.05, rotateZ: (Math.random() - 0.5) * 5 }}
                        className="w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_20px_50px_rgba(245,158,11,0.4)] border-[10px] md:border-[16px] border-white/80 flex items-center justify-center mb-8 relative z-20 overflow-hidden"
                      >
                         <motion.div 
                           className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
                           animate={{ x: ['-200%', '200%'] }}
                           transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                         />
                         <span className="text-[6rem] md:text-[10rem] font-black text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] leading-none">{letter}</span>
                      </motion.div>

                      <AnimatePresence>
                        {stage === 'reveal' && (
                          <motion.div
                            initial={{ scale: 0.8, y: -40, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
                            className="w-full px-8 py-8 md:px-12 md:py-10 bg-white/95 backdrop-blur-xl border-b-[12px] border-emerald-500 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] text-center relative z-10"
                          >
                             <h3 className="text-xl md:text-2xl text-emerald-600 font-black uppercase tracking-widest mb-4 flex items-center justify-center gap-3">
                               <Award className="w-8 h-8" /> Correct Answer
                             </h3>
                             <p className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-800 tracking-tight leading-tight mb-2">{question.correctAnswer}</p>
                             {question.insight && (
                               <div className="mt-8 px-6 py-5 md:px-8 md:py-6 bg-emerald-50 rounded-[2rem] border-4 border-emerald-100 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
                                 <div className="w-14 h-14 shrink-0 bg-emerald-100 rounded-full flex items-center justify-center shadow-inner">
                                   <Lightbulb className="w-8 h-8 text-emerald-500" />
                                 </div>
                                 <p className="text-lg md:text-2xl text-slate-700 font-bold leading-relaxed">{question.insight}</p>
                               </div>
                             )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })()}
              </div>
            )}

            {!isJumbledLetters && currentType !== 'a-to-z' && currentType !== 'text-presentation' && currentType !== '5-clues' && currentType !== 'detective' && currentType !== 'jumbled-letters' && currentType !== 'match-the-following' && currentType !== 'word-search' && (
              <div className={`flex flex-col w-full ${quiz.mode === 'interactive' ? 'items-start text-left' : 'items-center'}`}>
                <div className={`grid grid-cols-1 ${quiz.mode === 'interactive' ? 'lg:grid-cols-2' : 'md:grid-cols-2'} gap-6 w-full shrink-0 mb-6`}>
                  {( (question.type === 'True or False' || (question as any).category === 'True or False') && (!question.options || question.options.length === 0) ? ['True', 'False'] : question.options )?.map((option, i) => {
                    const isCorrect = option === question.correctAnswer;
                    const isReveal = stage === 'reveal';
                    const isEliminated = eliminatedOptions.includes(i);
                    
                    let cardClass = "bg-white text-slate-800 border-b-8 border-slate-300";
                    if (isEliminated && !isReveal) {
                      cardClass = "bg-slate-100 text-slate-400 border-b-8 border-slate-200 opacity-40 pointer-events-none";
                    } else if (quiz.mode === 'interactive' && !isReveal) {
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
                          if (isEliminated) return;
                          if (quiz.mode === 'interactive' && !isReveal) {
                            if (timerRef.current) clearInterval(timerRef.current);
                            setInteractiveOptionClicked(option);
                            if (isCorrect) {
                              confetti({
                                particleCount: 120,
                                spread: 90,
                                origin: { y: 0.6 },
                                colors: ['#38bdf8', '#facc15', '#f43f5e', '#a855f7', '#34d399']
                              });
                              setScore(s => s + (getAwardPoints()));
                              if (quiz.isMultiplayer || (quiz.players && quiz.players.length > 0)) {
                                setPlayersState(prev => {
                                  const next = [...prev];
                                  if (next[currentPlayerIndex]) {
                                    const currentBadges = next[currentPlayerIndex].badges || [];
                                    const badgeIcons = ['🌟', '🏆', '🥇', '🧠', '⚡', '🎯', '👑', '💎'];
                                    const newBadge = badgeIcons[currentQuestionIndex % badgeIcons.length];
                                    next[currentPlayerIndex] = { 
                                      ...next[currentPlayerIndex], 
                                      score: (next[currentPlayerIndex].score || 0) + (getAwardPoints()),
                                      badges: [...currentBadges, newBadge]
                                    };
                                  }
                                  return next;
                                });
                              }
                              audioSynth.playCorrect();
                              if (quiz.mode === 'interactive' && quiz.enableClapping !== false && Math.random() < 0.4) {
                                setTimeout(() => audioSynth.playClap(), 300);
                              }
                            } else {
                              audioSynth.playWrong();
                            }
                            window.speechSynthesis.cancel();
                            if ((currentType as string) === 'rapid-fire') {
                              setCurrentQuestionIndex((prev) => prev + 1);
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
                              } else {
                                setStage('question');
                              }
                            } else {
                              setStage('reveal');
                            }
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
                          +{getAwardPoints()} {playersState[currentPlayerIndex]?.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })()}
                
                {stage === 'reveal' && (!question.options || question.options.length === 0) && question.type !== 'True or False' && (question as any).category !== 'True or False' && !isJumbledLetters && (question.correctAnswer || question.answer) && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-6 w-full max-w-4xl mx-auto px-8 py-6 rounded-3xl bg-emerald-500 text-white border-b-8 border-emerald-700 shadow-[0_0_50px_rgba(16,185,129,0.8)] text-3xl md:text-5xl font-black text-center mb-6"
                  >
                    Answer: {question.correctAnswer || question.answer}
                  </motion.div>
                )}

                {stage === 'reveal' && question.insight && quiz.mode !== 'video' && (
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

        {stage === 'insight' && question.insight && (
          <motion.div
            key={`insight-${currentQuestionIndex}`}
            className="relative flex flex-col items-center justify-center p-8 md:p-12 text-center z-10 w-full h-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <div className="bg-emerald-900/40 backdrop-blur-md rounded-3xl p-10 md:p-16 shadow-[0_0_50px_rgba(52,211,153,0.3)] border-4 border-emerald-400 max-w-5xl w-full">
              <Lightbulb className="w-24 h-24 text-yellow-300 mx-auto mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(253,224,71,0.8)]" />
              <h2 className="text-4xl md:text-5xl font-black text-yellow-300 leading-tight mb-8 uppercase tracking-widest drop-shadow-md">Did you know?</h2>
              <p className="text-3xl md:text-5xl font-bold text-white leading-snug drop-shadow-lg">
                {question.insight}
              </p>
            </div>
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
        {stage === 'rapid-fire-score' && (
          <motion.div
            key="rapid-fire-score"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center h-full p-8 z-10 w-full"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border-2 border-white/20 text-center max-w-4xl mx-auto w-full relative overflow-hidden">
               <div className="absolute -inset-6 bg-amber-400/20 blur-2xl rounded-full animate-pulse z-0" />
               <div className="relative z-10 flex flex-col items-center">
                 <h1 className="text-4xl md:text-6xl font-black text-amber-300 drop-shadow-md mb-6 uppercase tracking-widest flex items-center justify-center gap-4">
                   <Star className="w-10 h-10 animate-spin-slow" />
                   Rapid Fire Complete!
                   <Star className="w-10 h-10 animate-spin-slow" />
                 </h1>
                 
                 <div className="flex flex-col items-center justify-center mb-12">
                   <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-sm mb-6">
                      {quiz.isMultiplayer ? `${playersState[currentPlayerIndex]?.name}'s Total Score` : 'Your Total Score'}
                   </h2>
                   <div className="text-8xl md:text-9xl font-black text-emerald-400 drop-shadow-[0_0_40px_rgba(52,211,153,0.8)] scale-110">
                      {quiz.isMultiplayer ? playersState[currentPlayerIndex]?.score : score} <span className="text-4xl md:text-5xl text-white">pts</span>
                   </div>
                 </div>
                 
                 <button
                    onClick={() => {
                        audioSynth.playSwoosh();
                        if (quiz.isMultiplayer) {
                          setCurrentPlayerIndex(p => (p + 1) % (quiz.players?.length || 1));
                          setStage(quiz.questions.some(q => q.rapidFireSet && q.category === selectedCategory) ? 'rapid-fire-set-selection' : 'category-selection'); 
                          rapidFirePlayerIdxRef.current = null;
                        } else {
                          const cats = new Set(quiz.questions.map(q => q.category).filter(Boolean));
                          setStage(quiz.questions.some(q => q.rapidFireSet && q.category === selectedCategory) ? 'rapid-fire-set-selection' : (cats.size > 1 ? 'category-selection' : 'score'));
                        }
                    }}
                    className="px-12 py-6 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 text-white font-black text-2xl md:text-4xl rounded-full shadow-[0_0_50px_rgba(16,185,129,0.8)] hover:scale-105 active:scale-95 transition-all border-4 border-white cursor-pointer flex items-center justify-center gap-4"
                 >
                   Continue <Play className="w-8 h-8 fill-current" />
                 </button>
               </div>
            </div>
          </motion.div>
        )}
                {stage.startsWith('memory-break') && (
          <motion.div
            key="memory-break"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col items-center justify-center p-8 z-10"
          >
            {stage === 'memory-break-intro' && (
              <div className="text-center">
                <div className="text-9xl mb-8 animate-bounce drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">🧠</div>
                <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg mb-6 tracking-wider">Memory Break!</h1>
                <p className="text-2xl md:text-4xl font-bold text-indigo-200">Get ready to memorize the objects...</p>
              </div>
            )}
            
            {(stage === 'memory-break-memorize' || stage === 'memory-break-question' || stage === 'memory-break-reveal') && (
              <div className="w-full max-w-6xl flex flex-col items-center">
                {stage === 'memory-break-question' && (
                  <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg mb-8">
                    Where was the <span className="text-yellow-300 text-6xl md:text-8xl inline-block mx-2 drop-shadow-[0_0_15px_rgba(253,224,71,0.8)] animate-pulse">{memoryTarget}</span> ?
                  </h2>
                )}
                {stage === 'memory-break-memorize' && (
                  <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-8 uppercase tracking-widest">
                    Memorize these objects!
                  </h2>
                )}
                {stage === 'memory-break-reveal' && (
                  <h2 className="text-4xl md:text-6xl font-black text-emerald-400 drop-shadow-lg mb-8 uppercase tracking-widest">
                    There it is!
                  </h2>
                )}
                
                
                <div className="grid gap-4 md:gap-8 justify-center items-center content-center w-full flex-1 min-h-0 py-4" style={{ gridTemplateColumns: `repeat(${Math.ceil(memoryItems.length / 2)}, minmax(0, auto))` }}>
                  {memoryItems.map((item, idx) => {
                    const count = memoryItems.length;
                    const sizeClass = count <= 6 ? 'w-36 h-36 md:w-56 md:h-56 text-[6rem] md:text-[8rem]' : count <= 10 ? 'w-32 h-32 md:w-48 md:h-48 text-[5rem] md:text-[7rem]' : count <= 15 ? 'w-28 h-28 md:w-40 md:h-40 text-[4rem] md:text-[6rem]' : 'w-24 h-24 md:w-32 md:h-32 text-[3.5rem] md:text-[5rem]';
                    return (
                    <motion.div
                      key={idx}
                      className={`bg-white/10 backdrop-blur-md border-4 border-white/20 rounded-3xl flex items-center justify-center shadow-2xl relative cursor-pointer ${sizeClass}`}
                      animate={
                        stage === 'memory-break-reveal' && item === memoryTarget 
                        ? { scale: [1, 1.1, 1], borderColor: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.4)' } 
                        : {}
                      }
                      transition={{ repeat: stage === 'memory-break-reveal' && item === memoryTarget ? Infinity : 0, duration: 1 }}
                      onClick={() => {
                        if (stage === 'memory-break-question') {
                          // Allow interactive click to reveal
                          if (item === memoryTarget) {
                            setStage('memory-break-reveal');
                          }
                        }
                      }}
                    >
                      {stage === 'memory-break-question' ? (
                        <span className="text-white/50 text-5xl md:text-7xl font-black drop-shadow-md">?</span>
                      ) : (
                        <span className={`drop-shadow-[0_0_15px_rgba(0,0,0,0.3)] ${stage === 'memory-break-reveal' && item !== memoryTarget ? "opacity-20 grayscale" : "opacity-100"}`}>{item}</span>
                      )}
                    </motion.div>
                  );
                  })}
                </div>
                
                {stage !== 'memory-break-reveal' && (
                  <div className="mt-12 w-full max-w-2xl">
                    <div className="h-8 bg-white/20 rounded-full overflow-hidden p-1.5 backdrop-blur-sm border-4 border-white/30 shadow-inner">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)]"
                        initial={{ width: '100%' }}
                        animate={{ width: `${(timeLeft / 10) * 100}%` }}
                        transition={{ duration: 1, ease: 'linear' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
        
        {stage === 'score' && (
          <motion.div
            key="score"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-6 md:p-12 max-w-7xl flex flex-col items-center justify-center h-full z-10 mx-auto w-full relative overflow-hidden"
          >
            {/* Floating stars/sparkles background particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={`score-particle-${i}`}
                  initial={{ 
                    x: (i * 120) % 1200 - 600, 
                    y: 800,
                    opacity: 0.2 + (i % 5) * 0.15,
                    scale: 0.6 + (i % 4) * 0.2
                  }}
                  animate={{ 
                    y: -100, 
                    rotate: 360 
                  }}
                  transition={{ 
                    duration: 5 + (i % 5) * 2, 
                    repeat: Infinity,
                    delay: (i % 4) * 0.8
                  }}
                  className="absolute text-3xl"
                  style={{ left: '50%' }}
                >
                  {i % 3 === 0 ? '🏆' : i % 2 === 0 ? '⭐' : '🎉'}
                </motion.div>
              ))}
            </div>

            {/* Header Section */}
            <div className="relative flex flex-col items-center justify-center mb-6 z-10">
              <div className="relative mb-3 flex justify-center items-center">
                <div className="absolute -inset-6 bg-amber-400/30 blur-2xl rounded-full animate-pulse" />
                <Trophy className="w-28 h-28 md:w-36 md:h-36 text-yellow-300 drop-shadow-[0_0_50px_rgba(250,204,21,0.9)] relative z-10" />
                <Star className="w-10 h-10 text-yellow-100 absolute -top-4 -right-8 animate-spin-slow z-10" />
                <Sparkles className="w-8 h-8 text-yellow-100 absolute top-4 -left-8 animate-ping z-10" />
              </div>

              <div className="px-6 py-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-sm md:text-base rounded-full uppercase tracking-widest shadow-xl border-2 border-white/60 mb-2">
                🏆 FINAL SCOREBOARD 🏆
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] tracking-tight">
                {(quiz.isMultiplayer || (playersState && playersState.length > 1)) ? 'Final Leaderboard Standings!' : 'Quiz Completed!'}
              </h1>
            </div>

            {/* Multiplayer / Players Leaderboard */}
            {(quiz.isMultiplayer || (playersState && playersState.length > 1)) ? (
              <div className="flex flex-col gap-4 w-full max-w-4xl z-10 my-2">
                {[...playersState].sort((a, b) => b.score - a.score).map((player, idx) => {
                  const isWinner = idx === 0;
                  return (
                    <motion.div 
                      key={player.id || idx}
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.15, type: 'spring', stiffness: 120 }}
                      className={`flex items-center justify-between p-5 md:p-6 rounded-3xl backdrop-blur-xl border-4 transition-all ${
                        isWinner 
                          ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-[0_0_50px_rgba(250,204,21,0.8)] scale-105 border-white z-20' 
                          : idx === 1
                          ? 'bg-slate-800/90 text-white border-slate-300/60 shadow-xl'
                          : idx === 2
                          ? 'bg-amber-950/80 text-amber-100 border-amber-600/50 shadow-xl'
                          : 'bg-slate-900/80 text-white border-white/20 shadow-lg'
                      }`}
                    >
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-3xl font-black shadow-inner border-2 ${
                          isWinner ? 'bg-slate-950 text-amber-400 border-white' : 'bg-white/20 text-white border-white/40'
                        }`}>
                          {idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </div>

                        <div className="relative">
                          {player.photo ? (
                            <img src={player.photo} alt={player.name} className="w-14 h-14 md:w-18 md:h-18 rounded-full border-2 border-white object-cover shadow-md" />
                          ) : (
                            <div className={`w-14 h-14 md:w-18 md:h-18 rounded-full border-2 border-white flex items-center justify-center text-2xl font-black ${isWinner ? 'bg-amber-600 text-white' : 'bg-indigo-600 text-white'}`}>
                              {player.name ? player.name.charAt(0).toUpperCase() : 'P'}
                            </div>
                          )}
                        </div>

                        <div className="text-left">
                          <h2 className="text-2xl md:text-4xl font-extrabold drop-shadow-sm">{player.name}</h2>
                          {player.topic && (
                            <p className={`text-xs md:text-sm font-bold ${isWinner ? 'text-slate-900' : 'text-amber-200'}`}>
                              Specialty: {player.topic}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isWinner && <Crown className="w-8 h-8 md:w-10 md:h-10 text-slate-950 fill-current animate-bounce" />}
                        <div className={`px-5 py-2 rounded-2xl font-black text-3xl md:text-5xl shadow-md ${
                          isWinner ? 'bg-slate-950 text-amber-300 border-2 border-white/50' : 'bg-white/15 text-white border border-white/30'
                        }`}>
                          {player.score || 0} <span className="text-sm md:text-xl font-bold opacity-80">pts</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* Single Player Score View */
              <div className="flex flex-col items-center w-full max-w-3xl z-10 my-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                  className="bg-slate-900/85 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] border-4 border-amber-400/60 shadow-[0_20px_70px_rgba(245,158,11,0.35)] w-full flex flex-col items-center relative overflow-hidden"
                >
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-2 drop-shadow-md">
                    {quiz.teamName || 'Player 1'}
                  </h2>

                  {/* Score Display */}
                  {quiz.mode === 'video' ? (
                    <div className="flex flex-col items-center my-6">
                      <div className="text-6xl md:text-8xl font-black text-amber-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] leading-none my-4">
                        Quiz Completed!
                      </div>
                      <span className="text-lg md:text-2xl font-bold text-cyan-200 mt-2 bg-white/10 px-6 py-1.5 rounded-full border border-white/20">
                        {quiz.questions.length} Questions
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-6 md:gap-10 my-6">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.25, 1],
                          rotate: [-15, 15, -15]
                        }}
                        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                        className="text-5xl md:text-8xl drop-shadow-xl"
                      >
                        👏
                      </motion.div>

                      <div className="flex flex-col items-center">
                        <span className="text-2xl md:text-3xl font-extrabold text-amber-300 uppercase tracking-wider mb-1">
                          Total Score
                        </span>
                        <div className="text-7xl md:text-9xl font-black text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] leading-none">
                          {score}
                        </div>
                        <span className="text-lg md:text-2xl font-bold text-cyan-200 mt-2 bg-white/10 px-6 py-1.5 rounded-full border border-white/20">
                          {quiz.questions.length} Questions Answered
                        </span>
                      </div>

                      <motion.div
                        animate={{ 
                          scale: [1, 1.25, 1],
                          rotate: [15, -15, 15]
                        }}
                        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                        className="text-5xl md:text-8xl drop-shadow-xl"
                        style={{ transform: "scaleX(-1)" }}
                      >
                        👏
                      </motion.div>
                    </div>
                  )}

                  {/* Quick Breakdown Cards */}
                  <div className={`grid ${quiz.mode === 'video' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3'} gap-4 w-full mt-4`}>
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/20 flex flex-col items-center">
                      <span className="text-xs md:text-sm font-bold text-amber-200 uppercase">Questions</span>
                      <span className="text-2xl md:text-4xl font-black text-white">{quiz.questions.length}</span>
                    </div>
                    {quiz.mode !== 'video' && (
                      <div className="bg-white/10 p-4 rounded-2xl border border-white/20 flex flex-col items-center">
                        <span className="text-xs md:text-sm font-bold text-emerald-300 uppercase">Total Score</span>
                        <span className="text-2xl md:text-4xl font-black text-white">{score} pts</span>
                      </div>
                    )}
                    <div className={`${quiz.mode === 'video' ? '' : 'col-span-2 md:col-span-1'} bg-white/10 p-4 rounded-2xl border border-white/20 flex flex-col items-center`}>
                      <span className="text-xs md:text-sm font-bold text-cyan-300 uppercase">Performance</span>
                      <span className="text-xl md:text-2xl font-black text-amber-300">
                        {quiz.mode === 'video' ? '🌟 Awesome!' : (score > 0 ? '🌟 Great Job' : '💪 Good Effort')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Action Buttons: Play Again, See Badges, Export */}
            {quiz.mode !== 'video' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6 z-20"
            >
              {/* PLAY AGAIN BUTTON */}
              <button
                onClick={onExit}
                className="px-10 py-5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-2xl shadow-[0_10px_30px_rgba(251,191,36,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-2 border-white cursor-pointer"
              >
                <RotateCcw className="w-7 h-7 stroke-[2.5]" />
                <span>Play Again</span>
              </button>

              {/* SEE BADGES / CELEBRATION BUTTON */}
              <button
                onClick={() => {
                  audioSynth.playSwoosh();
                  if (earnedBadges.length > 0) {
                    setStage('badges');
                  } else if (quiz.quotes && quiz.quotes.length > 0 && quiz.mode !== 'interactive') {
                    setStage('quote');
                  } else {
                    setStage('celebrate');
                  }
                }}
                className="px-8 py-5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xl backdrop-blur-md border-2 border-white/40 shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
              >
                <Award className="w-6 h-6 text-yellow-300" />
                <span>See Badges & Awards</span>
              </button>

              {/* EXPORT RESULTS BUTTON */}
              <button
                onClick={handleExportResults}
                title="Export Results (JSON)"
                aria-label="Export Results (JSON)"
                className="p-5 bg-white/15 hover:bg-white/25 text-white rounded-full shadow-xl border-2 border-white/40 transition-all hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
              >
                <Download className="w-7 h-7 text-yellow-300 drop-shadow" />
              </button>
            </motion.div>
            )}
          </motion.div>
        )}

        
        {stage === 'video-badges' && (() => {
          const isInteractiveGrid = quiz.mode === 'interactive' && quiz.type !== 'combat-mode' && quiz.type !== 'rapid-fire' && (quiz.isMultiplayer && (quiz.players?.length || 1) > 1);
          const numAnswered = isInteractiveGrid 
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
                initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: -15 }}
                animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
                className={`relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-[3rem] p-12 flex flex-col items-center text-center shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-4 ${currentBadge.color} w-full max-w-lg`}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                />
                <motion.div 
                  animate={{ y: [0, -15, 0], rotate: [-3, 3, -3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-8xl md:text-[10rem] mb-10 filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.2)] relative z-10"
                >
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-400/20 blur-3xl rounded-full mix-blend-multiply" />
                   <span className="relative block">{currentBadge.icon}</span>
                </motion.div>
                <h3 className={`text-4xl md:text-5xl font-black ${currentBadge.text} mb-4 relative z-10 tracking-tight leading-tight`}>{currentBadge.title}</h3>
                <p className="text-xl md:text-2xl text-slate-500 font-bold relative z-10 leading-snug">{currentBadge.description}</p>
                <div className="mt-8 py-3 px-8 bg-slate-900 rounded-full font-bold text-amber-300 tracking-wider text-sm uppercase shadow-lg border border-slate-700 relative z-10">
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
             
             <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 w-full max-w-7xl relative z-10 px-4">
               {earnedBadges.map((badge, idx) => {
                  return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ delay: idx * 0.2, type: 'spring', bounce: 0.5, duration: 1 }}
                    className="relative group bg-white/95 backdrop-blur-xl rounded-[3rem] p-8 md:p-10 flex flex-col items-center text-center shadow-[0_20px_60px_rgba(0,0,0,0.2)] border-[6px] border-white/50 w-72 md:w-80 overflow-hidden"
                  >
                    {/* Animated Shine Effect */}
                    <motion.div 
                      className="absolute inset-0 -translate-x-[150%] skew-x-[-30deg] bg-gradient-to-r from-transparent via-white/70 to-transparent z-0 group-hover:translate-x-[150%]"
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    
                    <motion.div 
                      animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
                      transition={{ duration: 3 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                      className="text-8xl md:text-9xl mb-8 filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.2)] z-10 relative"
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-amber-400/20 blur-3xl rounded-full mix-blend-multiply" />
                      <span className="relative block transform transition-transform group-hover:scale-110 duration-500">{badge.icon}</span>
                    </motion.div>

                    <div className="z-10 bg-slate-900 text-amber-300 font-bold uppercase tracking-[0.15em] text-xs px-5 py-2 rounded-full mb-5 shadow-md border border-slate-700/50">
                      {badge.player}
                    </div>

                    <h3 className="z-10 text-3xl font-black text-slate-800 mb-4 tracking-tight leading-tight">{badge.name}</h3>
                    
                    <p className="z-10 text-sm md:text-base text-slate-500 font-semibold px-2 leading-relaxed">{badge.description}</p>
                  </motion.div>
               )})}
             </div>
             
             <div className="mt-16 flex flex-wrap justify-center gap-6">
               <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: earnedBadges.length * 0.4 + 1 }}
                  onClick={() => {
                    if (quiz.participantTopic && quiz.participantTopic.trim()) {
                      setStage('talk');
                    } else if (quiz.quotes && quiz.quotes.length > 0 && quiz.mode !== 'interactive') {
                      setStage('quote');
                    } else {
                      setStage('celebrate');
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
                  onClick={() => setStage('celebrate')}
                  className="mt-8 px-6 py-3 bg-white/20 text-white rounded-full font-bold text-lg hover:bg-white/30 transition-all border border-white/50"
                >
                  Skip Timer
                </button>
            </div>
          </motion.div>
        )}

        {stage === 'celebrate' && quiz.mode === 'interactive' && (
          <motion.div
            key="celebrate"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="text-center p-4 md:p-8 max-w-7xl flex flex-col items-center justify-center h-full z-10 mx-auto w-full relative overflow-hidden"
          >
            {celebrationPlayers[celebratingIndex] && (() => {
              const currentP = celebrationPlayers[celebratingIndex];
              const N = celebrationPlayers.length;
              const currentRank = N - celebratingIndex;
              const frame = getCelebrationFrame(currentRank, N, currentP.name, currentP.score || 0);

              return (
                <>
                  {/* Top Score Order Progress Bar (Lowest to Highest) */}
                  {N > 1 && (
                    <motion.div 
                      initial={{ y: -30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="flex items-center justify-center gap-2 sm:gap-4 mb-4 z-30 w-full max-w-4xl px-2 flex-wrap"
                    >
                      <span className="text-xs uppercase tracking-widest font-black text-amber-300/90 mr-1 bg-black/40 px-3 py-1 rounded-full border border-amber-300/30">
                        Celebration Order (Lowest ➔ Highest):
                      </span>
                      {celebrationPlayers.map((p, idx) => {
                        const r = N - idx;
                        const isCurrent = idx === celebratingIndex;
                        return (
                          <div
                            key={p.id || idx}
                            className={`px-3.5 py-1.5 rounded-2xl border flex items-center gap-2 text-xs md:text-sm font-black transition-all ${
                              isCurrent 
                                ? 'bg-amber-400 text-slate-950 border-white shadow-[0_0_30px_rgba(250,204,21,0.9)] scale-110 z-10 ring-2 ring-amber-300' 
                                : idx < celebratingIndex
                                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 opacity-70'
                                : 'bg-black/50 text-white/70 border-white/20'
                            }`}
                          >
                            <span>{r === 1 ? '👑 1st' : r === 2 ? '🥈 2nd' : r === 3 ? '🥉 3rd' : `${r}th`}</span>
                            <span className="truncate max-w-[100px]">{p.name}</span>
                            <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[11px] font-extrabold">{p.score || 0} pts</span>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}

                  {/* Main Celebrated Player Spotlight */}
                  <motion.div 
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="mb-6 z-20 flex flex-col items-center relative"
                  >
                    {/* Rank Badge Header Pill */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.6, delay: 0.2 }}
                      className={`px-8 py-2.5 rounded-full text-xl md:text-3xl font-black text-white bg-gradient-to-r ${frame.badgeBg} shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-2 border-white/80 uppercase tracking-wider mb-6 flex items-center gap-3`}
                    >
                      <Sparkles className="w-6 h-6 animate-spin-slow text-yellow-200" />
                      <span>{frame.rankTitle}</span>
                      <Sparkles className="w-6 h-6 animate-spin-slow text-yellow-200" />
                    </motion.div>

                    {/* Avatar with Crown/Rank Overlay */}
                    <div className="relative mb-6">
                      {/* Spinning Radial Light Rays in Background */}
                      <div className="absolute -inset-8 bg-gradient-to-r from-amber-400/20 via-yellow-300/30 to-amber-500/20 rounded-full blur-2xl animate-spin-slow pointer-events-none" />

                      {currentP.photo ? (
                        <motion.img 
                          src={currentP.photo} 
                          alt={currentP.name}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", bounce: 0.5, duration: 1, delay: 0.3 }}
                          className={`w-44 h-44 md:w-56 md:h-56 rounded-full object-cover border-8 border-white shadow-[0_0_60px_rgba(255,255,255,0.9)] relative z-10`}
                        />
                      ) : (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", bounce: 0.5, duration: 1, delay: 0.3 }}
                          className={`w-44 h-44 md:w-56 md:h-56 rounded-full bg-gradient-to-tr ${frame.badgeBg} text-white flex items-center justify-center font-black text-6xl md:text-8xl border-8 border-white shadow-[0_0_60px_rgba(255,255,255,0.9)] relative z-10`}
                        >
                          {currentP.name.charAt(0).toUpperCase()}
                        </motion.div>
                      )}

                      {/* Floating Crown / Medal Icon on Top Right of Avatar */}
                      <motion.div
                        animate={{ y: [0, -8, 0], rotate: [-5, 5, -5] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                        className="absolute -top-4 -right-4 text-5xl md:text-6xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] z-20"
                      >
                        {frame.crownIcon}
                      </motion.div>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-wide drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                      {currentP.name}
                    </h2>
                    
                    <motion.div 
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                      className="text-2xl md:text-3xl font-black bg-black/50 text-amber-300 px-8 py-2 rounded-full border-2 border-amber-300/40 shadow-2xl flex items-center gap-3 mt-1"
                    >
                      <Star className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-pulse" />
                      <span>Score: {currentP.score || 0} Points</span>
                      <Star className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-pulse" />
                    </motion.div>
                  </motion.div>

                  {/* Position-Specific Animated Prizes & Awards Section */}
                  <div className="flex flex-wrap justify-center gap-6 md:gap-12 items-center my-4 z-20">
                    {frame.awards.map((award, aIdx) => {
                      const IconComp = award.icon;
                      return (
                        <motion.div
                          key={aIdx}
                          initial={{ scale: 0, y: 30 }}
                          animate={{ scale: 1, y: 0 }}
                          transition={{ type: 'spring', delay: 0.4 + aIdx * 0.15 }}
                          whileHover={{ scale: 1.08 }}
                          className="flex flex-col items-center gap-3 group"
                        >
                          <motion.div
                            animate={
                              aIdx === 0 
                                ? { rotate: [0, 8, -8, 0], scale: [1, 1.15, 1] }
                                : aIdx === 1
                                ? { y: [0, -15, 0], scale: [1, 1.1, 1] }
                                : { rotate: [0, -12, 12, 0], scale: [1, 1.12, 1] }
                            }
                            transition={{ repeat: Infinity, duration: 2.2 + aIdx * 0.4, delay: aIdx * 0.3 }}
                            className={`w-28 h-28 md:w-36 md:h-36 bg-gradient-to-tr ${award.bg} rounded-3xl flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.4)] border-4 border-white/60 relative overflow-hidden`}
                          >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <IconComp className="w-14 h-14 md:w-20 md:h-20 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]" />
                          </motion.div>
                          <span className="text-base md:text-xl font-black text-white uppercase tracking-wider bg-black/60 px-5 py-1.5 rounded-full border border-white/30 shadow-lg">
                            {award.title}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Next / Complete Celebration Control */}
                  <div className="mt-4 z-30 flex flex-col items-center gap-2">
                    <button
                      onClick={() => {
                        const nextIdx = celebratingIndex + 1;
                        if (nextIdx >= celebrationPlayers.length) {
                          setStage('outro');
                        } else {
                          setCelebratingIndex(nextIdx);
                        }
                      }}
                      className="px-10 py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-yellow-300 rounded-full font-black text-xl shadow-[0_10px_30px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-2 border-white cursor-pointer"
                    >
                      <span>
                        {celebratingIndex < celebrationPlayers.length - 1
                          ? `Next: ${N - (celebratingIndex + 1) === 1 ? '👑 1st Place Champion' : N - (celebratingIndex + 1) === 2 ? '🥈 2nd Place' : '🥉 3rd Place'}`
                          : 'Finish Celebration ➔ Outro'}
                      </span>
                      <Play className="w-5 h-5 fill-current" />
                    </button>
                    <span className="text-xs text-white/70 font-semibold bg-black/30 px-3 py-1 rounded-full">
                      Player {celebratingIndex + 1} of {N} • Extended Celebration for Video Display
                    </span>
                  </div>

                  {/* Confetti & Floating Star Particles */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                    {Array.from({ length: 35 }).map((_, i) => (
                      <motion.div
                        key={`confetti-${celebratingIndex}-${i}`}
                        initial={{ y: -100, x: (Math.random() - 0.5) * 1600, opacity: 0, rotate: 0 }}
                        animate={{ 
                          y: 1100, 
                          x: (Math.random() - 0.5) * 1600,
                          opacity: [0, 1, 1, 0],
                          rotate: 360
                        }}
                        transition={{ 
                          duration: 3.5 + Math.random() * 4.5, 
                          repeat: Infinity,
                          delay: Math.random() * 2.5 
                        }}
                        className="absolute top-0 text-yellow-300"
                        style={{ left: '50%' }}
                      >
                        <Star className={`w-8 h-8 md:w-12 md:h-12 ${i % 3 === 0 ? 'fill-yellow-300 text-yellow-300' : i % 3 === 1 ? 'fill-amber-400 text-amber-400' : 'fill-pink-400 text-pink-400'}`} />
                      </motion.div>
                    ))}
                  </div>
                </>
              );
            })()}
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

