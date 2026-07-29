import React, { useState, useRef, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { Quiz } from '../types';
import { Settings, Play, Loader2, Sparkles, BookOpen, Clock, Mic, Music, Download, Upload, Image as ImageIcon, CheckCircle2, Trash2, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { audioSynth } from '../lib/audio';
import { generateWordSearchGrid } from '../lib/wordSearch';

interface SetupProps {
  onQuizGenerated: (quiz: Quiz) => void;
}

export default function Setup({ onQuizGenerated }: SetupProps) {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('easy');
  const [quizType, setQuizType] = useState('multiple-choice');
  const [voicePreference, setVoicePreference] = useState<'male' | 'female' | 'none'>('female');
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cachedQuiz, setCachedQuiz] = useState<Quiz | null>(null);
  const [caching, setCaching] = useState(false);
  const [cacheSuccess, setCacheSuccess] = useState(false);
  const [loadedOfflineQuiz, setLoadedOfflineQuiz] = useState<Quiz | null>(null);
  const [pendingInteractiveQuiz, setPendingInteractiveQuiz] = useState<Quiz | null>(null);
  const [teamName, setTeamName] = useState('');
  const [numPlayers, setNumPlayers] = useState(1);
  const [players, setPlayers] = useState<any[]>([{ id: '1', name: '', photo: '', details: '', topic: '', score: 0 }]);
  const [identifyMode, setIdentifyMode] = useState<'auto' | 'custom' | 'json'>('auto');
  const [jsonItems, setJsonItems] = useState<any[]>([]);
  const [jsonFileNames, setJsonFileNames] = useState<string[]>([]);
  const [customImages, setCustomImages] = useState<{ id: string; file: File; base64: string; name: string }[]>([]);
  const [playerPhoto, setPlayerPhoto] = useState<string>('');
  const [playerDetails, setPlayerDetails] = useState('');
  const [participantTopic, setParticipantTopic] = useState('');
  const [setupMode, setSetupMode] = useState<'quiz' | 'presentation'>('quiz');
  const [presentationContent, setPresentationContent] = useState('');
  const [presentationDuration, setPresentationDuration] = useState(5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCachedQuiz(null);
    setCacheSuccess(false);
  }, [topic, quizType, difficulty, numQuestions]);

  const handleCacheImages = async () => {
    if (!topic.trim()) return;
    setCaching(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, numQuestions, difficulty, quizType }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch images');
      }
      
      setCachedQuiz(data);
      setCacheSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching images.');
    } finally {
      setCaching(false);
    }
  };

  const downloadJsonTemplate = () => {
    const template = [
  {
    "id": 1,
    "brand_name": "Tesla",
    "image_file_name": "tesla-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/tesla-logo.png"
  },
  {
    "id": 2,
    "brand_name": "Toyota",
    "image_file_name": "toyota-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/toyota-logo.png"
  },
  {
    "id": 3,
    "brand_name": "Ford",
    "image_file_name": "ford-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/ford-logo.png"
  },
  {
    "id": 4,
    "brand_name": "Honda",
    "image_file_name": "honda-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/honda-logo.png"
  },
  {
    "id": 5,
    "brand_name": "BMW",
    "image_file_name": "bmw-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/bmw-logo.png"
  },
  {
    "id": 6,
    "brand_name": "Subaru",
    "image_file_name": "subaru-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/subaru-logo.png"
  },
  {
    "id": 7,
    "brand_name": "Hyundai",
    "image_file_name": "hyundai-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/hyundai-logo.png"
  },
  {
    "id": 8,
    "brand_name": "Audi",
    "image_file_name": "audi-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/audi-logo.png"
  },
  {
    "id": 9,
    "brand_name": "Jeep",
    "image_file_name": "jeep-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/jeep-logo.png"
  },
  {
    "id": 10,
    "brand_name": "Porsche",
    "image_file_name": "porsche-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/porsche-logo.png"
  },
  {
    "id": 11,
    "brand_name": "Dodge",
    "image_file_name": "dodge-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/dodge-logo.png"
  },
  {
    "id": 12,
    "brand_name": "Ferrari",
    "image_file_name": "ferrari-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/ferrari-logo.png"
  },
  {
    "id": 13,
    "brand_name": "Jaguar",
    "image_file_name": "jaguar-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/jaguar-logo.png"
  },
  {
    "id": 14,
    "brand_name": "Lamborghini",
    "image_file_name": "lamborghini-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/lamborghini-logo.png"
  },
  {
    "id": 15,
    "brand_name": "Maserati",
    "image_file_name": "maserati-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/maserati-logo.png"
  },
  {
    "id": 16,
    "brand_name": "Bentley",
    "image_file_name": "bentley-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/bentley-logo.png"
  },
  {
    "id": 17,
    "brand_name": "Chrysler",
    "image_file_name": "chrysler-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/chrysler-logo.png"
  },
  {
    "id": 18,
    "brand_name": "Chevrolet Corvette",
    "image_file_name": "chevrolet-corvette-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/chevrolet-corvette-logo.png"
  },
  {
    "id": 19,
    "brand_name": "Cadillac",
    "image_file_name": "cadillac-logo.png",
    "image_url": "https://www.carlogos.org/car-logos/cadillac-logo.png"
  }
];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(template, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "identify-template.json");
    dlAnchorElem.click();
  };

  const handleGenerate = async (e: React.FormEvent, mode: 'video' | 'interactive' = 'video') => {
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
      const payload: any = { topic, numQuestions: quizType === 'mega-quiz' ? 100 : numQuestions, difficulty, quizType };
      if (quizType === 'identify-image' && identifyMode === 'custom') {
        payload.customItems = customImages.map(img => ({ id: img.id, name: img.name }));
      } else if (quizType === 'identify-image' && identifyMode === 'json') {
        payload.customItems = jsonItems.map(item => ({ id: item.id.toString(), name: item.brand_name || item.name, category: item.category }));
      }
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }
      
      data.mode = mode;
      
      if (quizType === 'identify-image' && identifyMode === 'custom') {
        data.questions = data.questions.map((q: any) => {
          const matched = customImages.find(c => c.id === q.id);
          if (matched) {
            q.imageUrl = matched.base64;
            q.imagePreviewUrl = matched.base64;
          }
          return q;
        });
      } else if (quizType === 'identify-image' && identifyMode === 'json') {
        data.questions = data.questions.map((q: any) => {
          const matched = jsonItems.find(c => c.id.toString() === q.id);
          if (matched) {
            q.imageUrl = matched.image_base64 || matched.base64 || matched.image_url || matched.imageUrl;
            q.imagePreviewUrl = q.imageUrl;
            q.category = matched.category;
          }
          return q;
        });
      }

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
  };

  const downloadTemplate = () => {
    let questions: any[] = [];
    let title = "Offline Custom Quiz";
    let finalType = "multiple-choice";
    let dlName = "multiple-choice";

    if (quizType === '5-clues') {
      title = "Offline Guess in 5 Clues";
      finalType = "5-clues";
      dlName = "5-clues";
      questions = [
        {
          question: "Who am I?",
          clues: [
            "I have four legs.",
            "I am known as man's best friend.",
            "I love to play fetch.",
            "I bark when I am happy.",
            "I wag my tail."
          ],
          options: ["Cat", "Dog", "Horse", "Elephant"],
          correctAnswer: "Dog",
          timeLimit: 15
        }
      ];
    } else if (quizType === 'detective') {
      title = "Offline Be a Detective Quiz";
      finalType = "detective";
      dlName = "detective";
      questions = [
        {
          question: "Which of these facts about the Solar System is false?",
          sentences: [
            "Jupiter is the largest planet.",
            "Mars is known as the Red Planet.",
            "Earth has one moon.",
            "Saturn has rings.",
            "The Sun is a planet."
          ],
          fakeSentenceIndex: 4,
          insight: "The Sun is a star, not a planet.",
          timeLimit: 30
        }
      ];
    } else if (quizType === 'jumbled-letters') {
      title = "Offline Jumbled Letters";
      finalType = "jumbled-letters";
      dlName = "jumbled-letters";
      questions = [
        {
          question: "Which fruit is red and sweet?",
          clues: [
            "It grows on trees.",
            "It can be red, green, or yellow."
          ],
          correctAnswer: "Apple",
          timeLimit: 25
        }
      ];
    } else if (quizType === 'combat-mode') {
      title = "Offline Combat Mode";
      finalType = "combat-mode";
      dlName = "combat-mode";
      questions = [
        {
          question: "Round 1",
          combatLeft: {
            question: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            correctAnswer: "4"
          },
          combatRight: {
            question: "What is 3 + 3?",
            options: ["5", "6", "7", "8"],
            correctAnswer: "6"
          },
          correctAnswer: "Answers revealed",
          timeLimit: 15
        }
      ];
    } else if (quizType === 'identify-image') {
      title = "Offline Identify Image Quiz";
      finalType = "identify-image";
      dlName = "identify-image";
      questions = [
        {
          question: "Identify this brand",
          imageUrl: "https://www.carlogos.org/car-logos/tesla-logo.png",
          options: ["Tesla", "Toyota", "Ford", "Honda"],
          correctAnswer: "Tesla",
          timeLimit: 10
        }
      ];
    } else {
      questions = [
        {
          question: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          correctAnswer: "4",
          insight: "Simple addition.",
          timeLimit: 10
        }
      ];
    }

    const template = {
      title,
      topic: "Custom Topic",
      type: finalType,
      theme: {
        primaryColor: "#4f46e5",
        secondaryColor: "#818cf8",
        textColor: "#ffffff"
      },
      questions,
      quotes: [
        {
          text: "Knowledge is power.",
          author: "Francis Bacon"
        }
      ]
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-template-${dlName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string) as Quiz;
        json.isOfflineMode = true;
        if (json.questions && Array.isArray(json.questions)) {
          
          if (json.type === 'word-search') {
            json.questions = json.questions.map(q => {
              if (q.wordsToFind && (!q.grid || !q.wordLocations)) {
                const { grid, wordLocations, wordsToFind } = generateWordSearchGrid(q.wordsToFind);
                return { ...q, grid, wordLocations, wordsToFind };
              }
              return q;
            });
          }

          // Prime speech synthesis
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('');
            utterance.volume = 0;
            window.speechSynthesis.speak(utterance);
          }
          audioSynth.setVoicePreference(voicePreference);
    audioSynth.setMusicPreference(musicEnabled);
          setLoadedOfflineQuiz(json);
        } else {
          setError("Invalid JSON format. Must contain 'questions' array.");
        }
      } catch (err) {
        setError("Error parsing JSON file. Please ensure it's valid JSON.");
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  
  const handleGeneratePresentation = async (e: React.FormEvent, mode: 'video' | 'interactive' = 'video') => {
    e.preventDefault();
    if (!presentationContent.trim()) return;
    
    // Prime speech synthesis on user click
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
    }
    
    audioSynth.setVoicePreference(voicePreference);
    audioSynth.setMusicPreference(musicEnabled);

    

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: presentationContent, duration: presentationDuration }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate presentation');
      }
      
      if (mode === 'interactive') { setPendingInteractiveQuiz({ ...data, mode }); } else { onQuizGenerated({ ...data, mode }); }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating.');
    } finally {
      setLoading(false);
    }
  };
return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100"
      >
        <div className="bg-indigo-600 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4 backdrop-blur-sm">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Generator</h1>
          <p className="text-indigo-100 text-sm">Generate engaging YouTube-ready quizzes and presentations</p>
          
          <div className="flex bg-indigo-700/50 rounded-lg p-1 mt-6">
            <button
              type="button"
              onClick={() => setSetupMode('quiz')}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${setupMode === 'quiz' ? 'bg-white shadow-sm text-indigo-600' : 'text-indigo-100 hover:text-white'}`}
            >
              Quiz Maker
            </button>
            <button
              type="button"
              onClick={() => setSetupMode('presentation')}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${setupMode === 'presentation' ? 'bg-white shadow-sm text-indigo-600' : 'text-indigo-100 hover:text-white'}`}
            >
              Presentation
            </button>
          </div>
        </div>
        
        {setupMode === 'presentation' && !pendingInteractiveQuiz && !loadedOfflineQuiz ? (
          <form className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                Text Content (Max 5000 chars)
              </label>
              <textarea
                value={presentationContent}
                onChange={(e) => setPresentationContent(e.target.value.substring(0, 5000))}
                placeholder="Paste your text content here to generate a presentation..."
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-neutral-400 h-40 resize-none"
                required
              />
              <div className="text-xs text-right text-neutral-400">{presentationContent.length}/5000</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={presentationDuration}
                onChange={(e) => setPresentationDuration(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                type="button"
                onClick={(e) => handleGeneratePresentation(e as any, 'video')}
                disabled={loading || !presentationContent.trim()}
                className="flex-1 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current" />
                    Video Mode
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={(e) => handleGeneratePresentation(e as any, 'interactive')}
                disabled={loading || !presentationContent.trim()}
                className="flex-1 py-4 rounded-xl bg-fuchsia-600 text-white font-bold text-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 fill-current" />
                    Interactive
                  </>
                )}
              </button>
            </div>
          </form>
        ) : loadedOfflineQuiz ? (
          <div className="p-8 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4 text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Offline Quiz Loaded!</h2>
            <p className="text-slate-600">"{loadedOfflineQuiz.title || loadedOfflineQuiz.topic}" is ready to play.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                type="button"
                onClick={() => onQuizGenerated({ ...loadedOfflineQuiz, mode: 'video' })}
                className="flex-1 py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Play className="w-6 h-6 fill-current" />
                Video Mode
              </button>
              <button
                type="button"
                onClick={() => {
                  setPendingInteractiveQuiz({ ...loadedOfflineQuiz, mode: 'interactive' });
                  setLoadedOfflineQuiz(null);
                }}
                className="flex-1 py-4 rounded-xl bg-fuchsia-600 text-white font-bold text-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-600/20"
              >
                <Sparkles className="w-6 h-6 fill-current" />
                Interactive Mode
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => setLoadedOfflineQuiz(null)}
              className="w-full py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all mt-4"
            >
              Cancel
            </button>
          </div>
        ) : pendingInteractiveQuiz ? (
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 text-center">Interactive Setup</h2>
            
            <div className="space-y-4">
              <div className="space-y-2 text-left">
                <label className="text-sm font-semibold text-neutral-700">Number of Players</label>
                <select
                  value={numPlayers}
                  onChange={(e) => {
                    const count = parseInt(e.target.value);
                    setNumPlayers(count);
                    const newPlayers = [...players];
                    while (newPlayers.length < count) {
                      newPlayers.push({ id: (newPlayers.length + 1).toString(), name: '', photo: '', details: '', topic: '', score: 0 });
                    }
                    if (newPlayers.length > count) {
                      newPlayers.length = count;
                    }
                    setPlayers(newPlayers);
                  }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 bg-white"
                >
                  <option value={1}>1 Player / Team</option>
                  <option value={2}>2 Players</option>
                  <option value={3}>3 Players</option>
                </select>
              </div>

              <div className="max-h-[50vh] overflow-y-auto space-y-6 pr-2">
                {players.map((player, index) => (
                  <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                    <h3 className="font-bold text-slate-700">Player {index + 1}</h3>
                    
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-neutral-700">Name</label>
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => {
                          const newPlayers = [...players];
                          newPlayers[index].name = e.target.value;
                          setPlayers(newPlayers);
                          if (index === 0) setTeamName(e.target.value);
                        }}
                        placeholder={`E.g., Player ${index + 1}`}
                        className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      />
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-neutral-700">Photo (Optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const newPlayers = [...players];
                              newPlayers[index].photo = event.target?.result as string;
                              setPlayers(newPlayers);
                              if (index === 0) setPlayerPhoto(event.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-4 py-2 text-sm rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white"
                      />
                      {player.photo && (
                        <img src={player.photo} alt="Preview" className="w-16 h-16 object-cover rounded-full mt-2 shadow-sm" />
                      )}
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-neutral-700">Topic to Talk About (Optional)</label>
                      <input
                        type="text"
                        value={player.topic}
                        onChange={(e) => {
                          const newPlayers = [...players];
                          newPlayers[index].topic = e.target.value;
                          setPlayers(newPlayers);
                          if (index === 0) setParticipantTopic(e.target.value);
                        }}
                        placeholder="E.g., Your favorite hobby..."
                        className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white"
                      />
                    </div>
                    
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-neutral-700">Details (Optional)</label>
                      <textarea
                        value={player.details}
                        onChange={(e) => {
                          const newPlayers = [...players];
                          newPlayers[index].details = e.target.value;
                          setPlayers(newPlayers);
                          if (index === 0) setPlayerDetails(e.target.value);
                        }}
                        placeholder="E.g., 10 years old, loves science..."
                        className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => {
                const finalQuiz = { 
                  ...pendingInteractiveQuiz, 
                  teamName: players[0]?.name || teamName || 'Player 1', 
                  playerPhoto: players[0]?.photo || playerPhoto, 
                  playerDetails: players[0]?.details || playerDetails, 
                  participantTopic: players[0]?.topic || participantTopic,
                  isMultiplayer: numPlayers > 1,
                  players: players.map((p, i) => ({ ...p, name: p.name || `Player ${i + 1}` }))
                };
                audioSynth.setVoicePreference('none');
                onQuizGenerated(finalQuiz);
              }}
              className="w-full py-4 rounded-xl bg-fuchsia-600 text-white font-bold text-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/30 transition-all flex items-center justify-center gap-2 mt-8 shadow-lg shadow-fuchsia-600/20"
            >
              <Play className="w-6 h-6 fill-current" />
              Start Interactive Quiz!
            </button>
            
            <button
              type="button"
              onClick={() => setPendingInteractiveQuiz(null)}
              className="w-full py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all mt-4"
            >
              Cancel
            </button>
          </div>
        ) : (
        <form onSubmit={(e) => handleGenerate(e, 'video')} className="p-8 space-y-6">
  
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              What is the topic?
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Dinosaurs, Space, Animals"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-neutral-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Quiz Type
            </label>
            <select
              value={quizType}
              onChange={(e) => {
                const val = e.target.value;
                setQuizType(val);
              }}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="multiple-choice">Standard (Multiple Choice)</option>
              <option value="identify-image">Identify the Image</option>
              <option value="5-clues">Guess in 5 Clues</option>
              <option value="detective">Be a Detective</option>
              <option value="find-in-map">Find in Map</option>
              <option value="jumbled-letters">Jumbled Letters</option>
              <option value="match-the-following">Match the Following</option>
              <option value="combat-mode">Combat Mode (2 Players)</option>
              <option value="word-search">Word Search</option>
              <option value="mega-quiz">Mega Quiz (100 Questions Mix)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <Mic className="w-4 h-4 text-indigo-500" />
                Voice
              </label>
              <select
                value={voicePreference}
                onChange={(e) => setVoicePreference(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="none">No Voice</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <Music className="w-4 h-4 text-indigo-500" />
                Music & SFX
              </label>
              <select
                value={musicEnabled ? 'yes' : 'no'}
                onChange={(e) => setMusicEnabled(e.target.value === 'yes')}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="yes">Enabled</option>
                <option value="no">Disabled</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-500" />
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="easy">Easy (Ages 4-7)</option>
                <option value="medium">Medium (Ages 8-11)</option>
                <option value="hard">Hard (Ages 12-15)</option>
                <option value="very hard">Very Hard (Ages 16+)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                Questions
              </label>
              <select
                value={quizType === 'mega-quiz' ? 100 : numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                disabled={quizType === 'mega-quiz'}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:opacity-50"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={20}>20 Questions</option>
                <option value={25}>25 Questions</option>
                <option value={50}>50 Questions</option>
                <option value={75}>75 Questions</option>
                <option value={100}>100 Questions</option>
              </select>
            </div>
          </div>
          
          {quizType === 'identify-image' && (
            <div className="mt-4 p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-4">
              <div className="flex gap-2 p-1 bg-neutral-200/50 rounded-lg">
                <button
                  type="button"
                  onClick={() => setIdentifyMode('auto')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${identifyMode === 'auto' ? 'bg-white shadow-sm text-indigo-600' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                  AI Auto-Fetch
                </button>
                <button
                  type="button"
                  onClick={() => setIdentifyMode('custom')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${identifyMode === 'custom' ? 'bg-white shadow-sm text-indigo-600' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                  Custom Upload
                </button>
              </div>

              {identifyMode === 'auto' && (
                <button
                  type="button"
                  onClick={handleCacheImages}
                  disabled={caching || !topic.trim()}
                  className="w-full py-4 rounded-xl bg-slate-800 text-white font-bold text-lg hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-slate-800/20"
                >
                  {caching ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Fetching Images...
                    </>
                  ) : cacheSuccess ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                      Images Cached!
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6" />
                      Pre-fetch & Cache Images
                    </>
                  )}
                </button>
              )}

              {identifyMode === 'json' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-600">Upload JSON File</span>
                    <label className="cursor-pointer bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                      <Upload className="w-4 h-4" /> {jsonFileNames.length > 0 ? `${jsonFileNames.length} files selected` : 'Select JSON Files'}
                      <input 
                        type="file" 
                        accept=".json"
                        multiple
                        className="hidden" 
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length === 0) return;
                          
                          const names = files.map(f => f.name);
                          setJsonFileNames(names);
                          
                          let allItems = [];
                          for (const file of files) {
                            const categoryName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
                            const text = await file.text();
                            try {
                              const arr = JSON.parse(text);
                              let items = [];
                              if (Array.isArray(arr)) {
                                items = arr;
                              } else if (arr && arr.questions && Array.isArray(arr.questions)) {
                                items = arr.questions.map((q, idx) => ({
                                  id: q.id || (idx + 1).toString(),
                                  brand_name: q.correctAnswer,
                                  image_url: q.imageUrl,
                                  image_base64: q.imageUrl && q.imageUrl.startsWith('data:image') ? q.imageUrl : undefined
                                }));
                              }
                              items = items.map((item) => ({ ...item, category: categoryName }));
                              allItems = [...allItems, ...items];
                            } catch (err) {
                              console.error("Invalid JSON format in " + file.name);
                            }
                          }
                          setJsonItems(allItems);
                        }}
                      />
                    </label>
                  </div>
                  {jsonItems.length > 0 && (
                    <div className="text-sm text-emerald-600 font-bold bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                      Successfully loaded {jsonItems.length} items from {jsonFileNames.length} file{jsonFileNames.length !== 1 ? 's' : ''}.
                    </div>
                  )}
                  <button type="button" onClick={downloadJsonTemplate} className="text-sm text-indigo-600 font-bold hover:underline">
                    Download JSON Template
                  </button>
                </div>
              )}
              {identifyMode === 'custom' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-600">Upload up to 25 Images</span>
                    <label className="cursor-pointer bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Add Images
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        className="hidden" 
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []) as File[];
                          const remaining = 25 - customImages.length;
                          const toAdd = files.slice(0, remaining);
                          toAdd.forEach(file => {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setCustomImages(prev => [...prev, {
                                id: Math.random().toString(36).substring(2, 11),
                                file,
                                base64: event.target?.result as string,
                                name: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ")
                              }]);
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                      />
                    </label>
                  </div>
                  
                  {customImages.length > 0 && (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {customImages.map((img, idx) => (
                        <div key={img.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-neutral-200 shadow-sm">
                          <img src={img.base64} alt="preview" className="w-12 h-12 object-cover rounded-md" />
                          <input 
                            type="text" 
                            placeholder="Correct Answer (e.g. Apple Logo)" 
                            value={img.name}
                            onChange={(e) => {
                              setCustomImages(prev => {
                                const next = [...prev];
                                next[idx].name = e.target.value;
                                return next;
                              });
                            }}
                            className="flex-1 px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setCustomImages(prev => prev.filter((_, i) => i !== idx))}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          
          {((!(quizType === 'identify-image' && (identifyMode === 'custom' || identifyMode === 'json')) && !topic.trim()) || (quizType === 'identify-image' && identifyMode === 'custom' && (customImages.length === 0 || customImages.some(img => !img.name.trim())))) && (
            <div className="text-sm text-red-500 font-medium text-center">
              {!(quizType === 'identify-image' && (identifyMode === 'custom' || identifyMode === 'json')) && !topic.trim() ? "Please enter a topic to enable quiz generation." : "Please add images and ensure all images have a name."}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              type="button"
              onClick={(e) => handleGenerate(e as any, 'video')}
              disabled={loading || (!(quizType === 'identify-image' && (identifyMode === 'custom' || identifyMode === 'json')) && !topic.trim()) || (quizType === 'identify-image' && identifyMode === 'auto' && !cacheSuccess) || (quizType === 'identify-image' && identifyMode === 'custom' && (customImages.length === 0 || customImages.some(img => !img.name.trim()))) || (quizType === 'identify-image' && identifyMode === 'json' && jsonItems.length === 0)}
              className="flex-1 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-current" />
                  Video Quiz
                </>
              )}
            </button>
            <button
              type="button"
              onClick={(e) => handleGenerate(e as any, 'interactive')}
              disabled={loading || (!(quizType === 'identify-image' && (identifyMode === 'custom' || identifyMode === 'json')) && !topic.trim()) || (quizType === 'identify-image' && identifyMode === 'auto' && !cacheSuccess) || (quizType === 'identify-image' && identifyMode === 'custom' && (customImages.length === 0 || customImages.some(img => !img.name.trim()))) || (quizType === 'identify-image' && identifyMode === 'json' && jsonItems.length === 0)}
              className="flex-1 py-4 rounded-xl bg-fuchsia-600 text-white font-bold text-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 fill-current" />
                  Interactive Mode
                </>
              )}
            </button>
          </div>
  

          <div className="pt-6 border-t border-neutral-100 flex flex-col gap-3">
            <p className="text-sm font-semibold text-neutral-500 text-center mb-1">OR USE OFFLINE MODE</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={downloadTemplate}
                className="flex-1 py-3 px-4 rounded-xl bg-white border-2 border-indigo-100 text-indigo-600 font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Template
              </button>
              
              <label className="flex-1 py-3 px-4 rounded-xl bg-white border-2 border-indigo-100 text-indigo-600 font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-5 h-5" />
                Upload JSON
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
        </form>
        )}
      </motion.div>
      
      {/* Hidden container to preload cached images */}
      {cacheSuccess && cachedQuiz && (
        <div className="hidden">
          {cachedQuiz.questions.map((q, i) => q.imageUrl ? (
            <img key={i} src={q.imageUrl} alt="" onError={(e) => { if (q.imagePreviewUrl && e.currentTarget.src !== q.imagePreviewUrl) e.currentTarget.src = q.imagePreviewUrl; }} />
          ) : null)}
        </div>
      )}
    </div>
  );
}
