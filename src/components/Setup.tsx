import React, { useState, useRef, useEffect } from 'react';
import { FileText , Gamepad2, MonitorPlay, FileUp } from 'lucide-react';
import { Quiz } from '../types';
import { Settings, Play, Loader2, Sparkles, BookOpen, Clock, Mic, Music, Download, Upload, Image as ImageIcon, CheckCircle2, Trash2, Plus, Palette, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { audioSynth } from '../lib/audio';
import { generateWordSearchGrid } from '../lib/wordSearch';

interface SetupProps {
  onQuizGenerated: (quiz: Quiz) => void;
}

interface UploadedFileItem {
  id: string;
  fileName: string;
  fileType: 'json' | 'image';
  title?: string;
  topic?: string;
  type?: string;
  timeLimit?: number;
  questions: any[];
  quotes?: any[];
}

export default function Setup({ onQuizGenerated }: SetupProps) {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('easy');
  const [quizType, setQuizType] = useState('multiple-choice');
  const [voicePreference, setVoicePreference] = useState<'male' | 'female' | 'none'>('female');
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  
    const renderInsightImagesSummary = (quiz: Quiz, setQuiz: (q: Quiz) => void) => {
    if (!enableInsightImages || !quiz || !quiz.questions || quiz.questions.length === 0) return null;
    const questionsWithImages = quiz.questions.filter(q => q.insightImageUrl);
    
    
    const handleRefreshImage = async (e: React.MouseEvent, qIdx: number, q: any) => {
      e.stopPropagation();
      try {
        // Set a loading state somehow, or just optimistically wait
        const queryToSearch = q.insightImageSearchQuery || `${quiz.topic ? quiz.topic + ' ' : ''}${q.correctAnswer || q.answer || ''}`.trim();
        const offset = q._imgOffset || 1;
        const res = await fetch('/api/refresh-insight-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: queryToSearch, offset })
        });
        const data = await res.json();
        if (data.image) {
          const updatedQuiz = { ...quiz };
          updatedQuiz.questions[qIdx].insightImageUrl = data.image;
          updatedQuiz.questions[qIdx]._imgOffset = data.nextOffset;
          setQuiz(updatedQuiz);
        } else {
           alert("No more images found for this question.");
        }
      } catch (err) {
        console.error("Failed to refresh image:", err);
      }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, qIdx: number) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const updatedQuiz = { ...quiz };
          updatedQuiz.questions[qIdx].insightImageUrl = event.target.result as string;
          setQuiz(updatedQuiz);
        }
      };
      reader.readAsDataURL(file);
    };

    if (questionsWithImages.length === 0) return (
      <div className="text-sm text-slate-500 mt-2 bg-slate-100 p-3 rounded-xl text-left border border-slate-200 shadow-sm">
        <div className="font-bold text-slate-600 mb-1 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Insight Images Summary</div>
        No insight images were found or fetched for this quiz.
      </div>
    );
    
    return (
      <div className="text-sm text-slate-600 mt-2 bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl text-left shadow-sm">
        <div className="font-bold text-emerald-700 mb-2 flex items-center gap-2 border-b border-emerald-200/50 pb-2">
          <ImageIcon className="w-4 h-4" /> 
          Insight Images Available ({questionsWithImages.length}/{quiz.questions.length})
        </div>
        <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar space-y-1.5">
          {quiz.questions.map((q, idx) => (
             <div key={idx} className={`flex items-start gap-2 ${q.insightImageUrl ? "text-emerald-700" : "text-slate-400 opacity-70"}`}>
               <span className="font-bold min-w-[24px]">Q{idx + 1}:</span>
               <span className="truncate flex-1">{q.question || q.correctAnswer || 'Question'}</span>
               <div className="flex shrink-0 items-center gap-1">
                 {q.insightImageUrl ? (
                   <label className="cursor-pointer group relative block shrink-0" title="Click to upload image">
                     <img src={q.insightImageUrl} className="w-10 h-10 object-cover rounded shadow-sm border border-emerald-200 group-hover:opacity-70 transition-opacity" alt="Preview" />
                     <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, idx)} />
                   </label>
                 ) : (
                   <label className="cursor-pointer block shrink-0" title="Click to upload image">
                     <div className="w-10 h-10 border border-dashed border-slate-300 rounded flex items-center justify-center hover:bg-slate-100 transition-colors">
                       <ImageIcon className="w-4 h-4 opacity-50" />
                     </div>
                     <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, idx)} />
                   </label>
                 )}
                 <button 
                   type="button" 
                   onClick={(e) => handleRefreshImage(e, idx, q)} 
                   className="w-10 h-10 bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 rounded flex items-center justify-center transition-colors border border-slate-200 shadow-sm"
                   title="Fetch another image from web"
                 >
                   <RefreshCw className="w-4 h-4" />
                 </button>
               </div>
             </div>
          ))}
        </div>
      </div>
    );
  };
  const enrichQuizInsightsAndStart = async (quizToEnrich: Quiz, mode: 'video' | 'interactive') => {
    setLoading(true);
    try {
      const res = await fetch('/api/enrich-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: quizToEnrich.questions, enableInsightImages, topic: quizToEnrich.topic || quizToEnrich.title })
      });
      const data = await res.json();
      if (data && data.questions) {
        quizToEnrich.questions = data.questions;
      }
    } catch(e) {
      console.error("Failed to enrich insights", e);
    } finally {
      setLoading(false);
      const finalQuiz = { ...quizToEnrich, mode, showBadges, enableMemoryBreak, themeMemoryBreak, memoryBreakImageCount, enableInsightImages, dynamicColors: enableDynamicColors, rules: rules || undefined };
      if (mode === 'interactive') {
        setPendingInteractiveQuiz(finalQuiz);
      } else {
        onQuizGenerated(finalQuiz);
      }
    }
  };

  const [error, setError] = useState('');
  const [cachedQuiz, setCachedQuiz] = useState<Quiz | null>(null);
  const [caching, setCaching] = useState(false);
  const [cacheSuccess, setCacheSuccess] = useState(false);
  const [cacheMessage, setCacheMessage] = useState("");
  const [loadedOfflineQuiz, setLoadedOfflineQuiz] = useState<Quiz | null>(null);
  const [uploadedFileList, setUploadedFileList] = useState<UploadedFileItem[]>([]);
  const [pendingInteractiveQuiz, setPendingInteractiveQuiz] = useState<Quiz | null>(null);
  const [teamName, setTeamName] = useState('');
  const [numPlayers, setNumPlayers] = useState(1);
  const [players, setPlayers] = useState<any[]>([{ id: '1', name: '', photo: '', details: '', topic: '', score: 0 }]);
  const [identifyMode, setIdentifyMode] = useState<'auto' | 'custom' | 'json'>('auto');
  const [identifyMultiChoice, setIdentifyMultiChoice] = useState(true);
  const [jsonItems, setJsonItems] = useState<any[]>([]);
  const [jsonFileNames, setJsonFileNames] = useState<string[]>([]);
  const [customImages, setCustomImages] = useState<{ id: string; file: File; base64: string; name: string }[]>([]);
  const [playerPhoto, setPlayerPhoto] = useState<string>('');
  const [playerDetails, setPlayerDetails] = useState('');
  const [participantTopic, setParticipantTopic] = useState('');
  const [rules, setRules] = useState('');
  const [frameSize, setFrameSize] = useState<'small' | 'medium' | 'large'>('large');
  const [showFrames, setShowFrames] = useState<boolean>(true);
  const [showBadges, setShowBadges] = useState<boolean>(true);
  const [enableClapping, setEnableClapping] = useState<boolean>(true);
  const [enableMemoryBreak, setEnableMemoryBreak] = useState<boolean>(true);
  const [themeMemoryBreak, setThemeMemoryBreak] = useState<boolean>(false);
  const [memoryBreakImageCount, setMemoryBreakImageCount] = useState<number>(10);
  const [enableDynamicColors, setEnableDynamicColors] = useState<boolean>(false);
  const [enableInsightImages, setEnableInsightImages] = useState<boolean>(true);
  const [setupMode, setSetupMode] = useState<'quiz' | 'presentation' | 'offline'>('quiz');
  const [presentationContent, setPresentationContent] = useState('');
  const [presentationDuration, setPresentationDuration] = useState(5);
  const [previewQuizData, setPreviewQuizData] = useState<{quiz: Quiz, mode: 'video'|'interactive'}|null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCachedQuiz(null);
    setCacheSuccess(false);
  }, [topic, quizType, difficulty, numQuestions]);

  const handleCacheImages = async () => {
    if (identifyMode === 'auto' && !topic.trim()) return;
    if (identifyMode === 'json' && jsonItems.length === 0) return;
    
    setCaching(true);
    setError('');
    setCacheMessage('');
    
    try {
      // Simulate minimum delay so the user sees the loading state
      const minDelay = new Promise(resolve => setTimeout(resolve, 800));
      
      if (identifyMode === 'auto') {
        const fetchPromise = fetch('/api/generate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, numQuestions, difficulty, quizType, includeImages: true }),
        });
        
        const [response] = await Promise.all([fetchPromise, minDelay]);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch images');
        }
        
        setCachedQuiz(data);
        setCacheSuccess(true);
      } else if (identifyMode === 'json') {
        const fetchPromise = fetch('/api/cache-json-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: jsonItems }),
        });
        
        const [response] = await Promise.all([fetchPromise, minDelay]);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Failed to cache JSON images');
        
        setJsonItems(data.items);
        const cachedCount = data.items.filter((i: any) => i.image_base64 || i.base64).length;
        setCacheMessage(`Successfully cached ${cachedCount} of ${data.items.length} images.`);
        setCacheSuccess(true);
      }
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
    const isCustomOrJson = ((quizType === 'identify-image' || quizType === 'blurred-image') || quizType === 'multiple-choice') && (identifyMode === 'custom' || identifyMode === 'json');
    if (!isCustomOrJson && !topic.trim()) return;
    
    // Prime speech synthesis on user click
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
    }
    
    audioSynth.setVoicePreference(voicePreference);
    audioSynth.setMusicPreference(musicEnabled);
    
    if (cachedQuiz && ((quizType === 'identify-image' || quizType === 'blurred-image') || quizType === 'multiple-choice')) {
      const q = { ...cachedQuiz, mode, showBadges, enableClapping, enableMemoryBreak, themeMemoryBreak, memoryBreakImageCount, enableInsightImages, dynamicColors: enableDynamicColors };
      if (mode === 'interactive') {
        setPendingInteractiveQuiz(q);
      } else {
        setLoadedOfflineQuiz(q);
      }
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const payload: any = { topic, numQuestions: quizType === 'mega-quiz' ? 100 : (quizType === 'a-to-z' ? 26 : numQuestions), difficulty, quizType, identifyMultiChoice, includeImages: identifyMode === 'auto' || identifyMode === 'json', themeMemoryBreak };
      if (((quizType === 'identify-image' || quizType === 'blurred-image') || quizType === 'multiple-choice') && identifyMode === 'custom') {
        payload.customItems = customImages.map(img => ({ id: img.id, name: img.name }));
      } else if (((quizType === 'identify-image' || quizType === 'blurred-image') || quizType === 'multiple-choice') && identifyMode === 'json') {
        payload.customItems = jsonItems.map(item => ({ id: item.id.toString(), name: item.brand_name || item.name, category: item.category }));
      }
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, enableInsightImages }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }
      
      data.mode = mode;
      data.showBadges = showBadges;
      data.enableClapping = enableClapping;
      data.enableMemoryBreak = enableMemoryBreak;
      data.themeMemoryBreak = themeMemoryBreak;
      data.memoryBreakImageCount = memoryBreakImageCount;
      data.dynamicColors = enableDynamicColors;
      data.enableInsightImages = enableInsightImages;
      data.rules = rules || undefined;
      data.type = quizType;
      
      if (((quizType === 'identify-image' || quizType === 'blurred-image') || quizType === 'multiple-choice') && identifyMode === 'custom') {
        data.questions = data.questions.map((q: any) => {
          const matched = customImages.find(c => c.id === q.id);
          if (matched) {
            q.imageUrl = matched.base64;
            q.imagePreviewUrl = matched.base64;
          }
          return q;
        });
      } else if (((quizType === 'identify-image' || quizType === 'blurred-image') || quizType === 'multiple-choice') && identifyMode === 'json') {
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
        setLoadedOfflineQuiz(data);
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
    } else if (quizType === 'blurred-image') {
      title = "Offline Blurred Image Quiz";
      finalType = "blurred-image";
      dlName = "blurred-image";
      questions = [
        {
          question: "Can you identify this blurred brand?",
          imageUrl: "https://www.carlogos.org/car-logos/tesla-logo.png",
          options: ["Tesla", "Toyota", "Ford", "Honda"],
          correctAnswer: "Tesla",
          blurTechnique: "heavy-blur",
          timeLimit: 15
        },
        {
          question: "Identify this pixelated character",
          imageUrl: "https://upload.wikimedia.org/wikipedia/en/a/a9/MarioPortrait.png",
          options: ["Mario", "Luigi", "Sonic", "Link"],
          correctAnswer: "Mario",
          blurTechnique: "pixelated-blur",
          timeLimit: 15
        },
        {
          question: "Guess the landmark (Inverted!)",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/800px-Tour_Eiffel_Wikimedia_Commons.jpg",
          options: ["Eiffel Tower", "Big Ben", "Statue of Liberty", "Colosseum"],
          correctAnswer: "Eiffel Tower",
          blurTechnique: "invert-blur",
          timeLimit: 15
        },
        {
          question: "What is this zoomed object?",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg",
          options: ["Cat", "Dog", "Rabbit", "Fox"],
          correctAnswer: "Cat",
          blurTechnique: "zoom-blur",
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
    } else if (quizType === 'rapid-fire') {
      title = "Offline Rapid Fire";
      finalType = "rapid-fire";
      dlName = "rapid-fire";
      questions = [
        {
          question: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          correctAnswer: "4"
        },
        {
          question: "What is the capital of France?",
          options: ["London", "Paris", "Berlin", "Rome"],
          correctAnswer: "Paris"
        },
        {
          question: "Which planet is known as the Red Planet?",
          options: ["Earth", "Mars", "Jupiter", "Saturn"],
          correctAnswer: "Mars"
        }
      ];
    } else if (quizType === 'a-to-z') {
      title = "Offline A to Z";
      finalType = "a-to-z";
      dlName = "a-to-z";
      questions = [
        {
          question: "Name a [topic] starting with the letter A",
          correctAnswer: "Example answer for A",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter B",
          correctAnswer: "Example answer for B",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter C",
          correctAnswer: "Example answer for C",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter D",
          correctAnswer: "Example answer for D",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter E",
          correctAnswer: "Example answer for E",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter F",
          correctAnswer: "Example answer for F",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter G",
          correctAnswer: "Example answer for G",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter H",
          correctAnswer: "Example answer for H",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter I",
          correctAnswer: "Example answer for I",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter J",
          correctAnswer: "Example answer for J",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter K",
          correctAnswer: "Example answer for K",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter L",
          correctAnswer: "Example answer for L",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter M",
          correctAnswer: "Example answer for M",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter N",
          correctAnswer: "Example answer for N",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter O",
          correctAnswer: "Example answer for O",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter P",
          correctAnswer: "Example answer for P",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter Q",
          correctAnswer: "Example answer for Q",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter R",
          correctAnswer: "Example answer for R",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter S",
          correctAnswer: "Example answer for S",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter T",
          correctAnswer: "Example answer for T",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter U",
          correctAnswer: "Example answer for U",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter V",
          correctAnswer: "Example answer for V",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter W",
          correctAnswer: "Example answer for W",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter X",
          correctAnswer: "Example answer for X",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter Y",
          correctAnswer: "Example answer for Y",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        },
        {
          question: "Name a [topic] starting with the letter Z",
          correctAnswer: "Example answer for Z",
          insight: "Fascinating fact about the answer.",
          timeLimit: 15
        }
      ];
    } else if (quizType === 'find-in-map') {
      title = "Offline Find in Map";
      finalType = "find-in-map";
      dlName = "find-in-map";
      questions = [
        {
          question: "Which city is highlighted on the map?",
          nominatimQuery: "Paris, France",
          parentRegionQuery: "France",
          options: ["London", "Paris", "Berlin", "Madrid"],
          correctAnswer: "Paris",
          timeLimit: 15
        },
        {
          question: "Identify the country shown below.",
          nominatimQuery: "Japan",
          parentRegionQuery: "Asia",
          options: ["China", "South Korea", "Japan", "Thailand"],
          correctAnswer: "Japan",
          timeLimit: 15
        }
      ];
    } else if (quizType === 'mega-quiz') {
      title = "Offline Mega Quiz";
      finalType = "mega-quiz";
      dlName = "mega-quiz";
      questions = [
        {
          type: "multiple-choice",
          category: "General Knowledge",
          question: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          correctAnswer: "4",
          timeLimit: 15
        },
        {
          type: "identify-image",
          category: "Brands",
          question: "Identify this brand",
          imageUrl: "",
          options: ["Tesla", "Toyota", "Ford", "Honda"],
          correctAnswer: "Tesla",
          timeLimit: 15
        },
        {
          type: "jumbled-letters",
          category: "Vocabulary",
          question: "Unjumble the word",
          word: "REACT",
          correctAnswer: "REACT",
          timeLimit: 15
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
      ...(finalType === 'rapid-fire' ? { timeLimit: 60 } : {}),
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

  const parseFile = async (file: File): Promise<UploadedFileItem | null> => {
    const fileId = Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    if (file.type.startsWith('image/')) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
      const name = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      return {
        id: fileId,
        fileName: file.name,
        fileType: 'image',
        questions: [{
          question: "Identify this",
          correctAnswer: name,
          answer: name,
          type: "identify-image",
          category: "Identify the Image",
          imageUrl: base64,
          imagePreviewUrl: base64,
          options: []
        }]
      };
    } else if (file.name.endsWith('.json') || file.type.includes('json')) {
      try {
        const text = await file.text();
        const fallbackCategory = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        let json;
        try {
          json = JSON.parse(text);
        } catch (parseError) {
          console.warn("Error parsing JSON, attempting AI fix:", parseError);
          const res = await fetch('/api/fix-json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
          });
          if (!res.ok) throw new Error("Failed to fix JSON via AI");
          json = await res.json();
        }

        let parsedQuestions: any[] = [];
        let parsedQuotes: any[] = [];
        let title = '';
        let topic = '';
        let type = '';

        const fileCategory = (json && !Array.isArray(json) && json.title)
          ? json.title
          : ((json && !Array.isArray(json) && json.topic) ? json.topic : fallbackCategory);

        if (Array.isArray(json)) {
          parsedQuestions = json.map((item: any) => ({
            ...item,
            correctAnswer: item.correctAnswer || item.answer || item.word || item.correct_answer || item.brand_name || '',
            type: item.type || 'multiple-choice',
            category: item.category || fileCategory
          }));
        } else if (json && json.questions && Array.isArray(json.questions)) {
          title = json.title || '';
          topic = json.topic || '';
          type = json.type || '';
          if (json.quotes && Array.isArray(json.quotes)) {
            parsedQuotes = json.quotes;
          }
          parsedQuestions = json.questions.map((q: any) => ({
            ...q,
            correctAnswer: q.correctAnswer || q.answer || q.word || q.correct_answer || q.brand_name || '',
            type: q.type || json.type || 'multiple-choice',
            category: q.category || fileCategory
          }));
        } else {
          return null;
        }

        
        parsedQuestions = parsedQuestions.map(q => {
          if (q.wordsToFind && (!q.grid || !q.wordLocations)) {
            const { grid, wordLocations, wordsToFind } = generateWordSearchGrid(q.wordsToFind);
            return { ...q, grid, wordLocations, wordsToFind };
          }
          return q;
        });
        
        try {
          const res = await fetch('/api/enrich-insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questions: parsedQuestions, enableInsightImages, topic: topic || title || file.name })
          });
          const enriched = await res.json();
          if (enriched && enriched.questions) {
            parsedQuestions = enriched.questions;
          }
        } catch (e) {
          console.error('Failed to enrich insights', e);
        }

        return {

          id: fileId,
          fileName: file.name,
          fileType: 'json',
          title,
          topic,
          type,
          questions: parsedQuestions,
          quotes: parsedQuotes,
          timeLimit: json.timeLimit
        };
      } catch (err) {
        console.error("Error parsing JSON file:", file.name, err);
        return null;
      }
    }
    return null;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const newItems: UploadedFileItem[] = [];
      let invalidCount = 0;

      for (const file of files) {
        const item = await parseFile(file);
        if (item && item.questions.length > 0) {
          newItems.push(item);
        } else {
          invalidCount++;
        }
      }

      if (newItems.length > 0) {
        setUploadedFileList(prev => [...prev, ...newItems]);
        setError('');
      }

      if (invalidCount > 0 && newItems.length === 0) {
        setError("Invalid file format. Expected JSON files with quiz questions or image files.");
      }
    } catch (err) {
      setError("Error parsing JSON/Image file(s). Please ensure valid formatting.");
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const combineUploadedFiles = (fileList: UploadedFileItem[]) => {
    const jsonItems = fileList.filter(item => item.fileType === 'json');
    const imageItems = fileList.filter(item => item.fileType === 'image');

    const matchedImageIds = new Set<string>();

    const norm = (s?: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    const jsonItemsCloned = jsonItems.map(item => ({
      ...item,
      questions: item.questions.map(q => ({ ...q }))
    }));

    for (const imgItem of imageItems) {
      const rawFileName = imgItem.fileName.replace(/\.[^/.]+$/, "");

      const match = rawFileName.match(/^(.*?)[_\s-]*q?(?:uestion)?[_\s-]*0*(\d+)$/i);
      let imgPrefix = rawFileName;
      let serialNum: number | null = null;
      if (match) {
        imgPrefix = match[1];
        serialNum = parseInt(match[2], 10);
      }

      const normPrefix = norm(imgPrefix);
      const normRawName = norm(rawFileName);

      if (!normPrefix && !normRawName) continue;

      let targetJsonItem: (typeof jsonItemsCloned)[0] | null = null;

      for (const jItem of jsonItemsCloned) {
        const normTopic = norm(jItem.topic);
        const normTitle = norm(jItem.title);
        const normFile = norm(jItem.fileName.replace(/\.[^/.]+$/, ""));

        const isMatch = 
          (normTopic && normPrefix === normTopic) ||
          (normTitle && normPrefix === normTitle) ||
          (normFile && normPrefix === normFile) ||
          (normTopic && (normTopic.startsWith(normPrefix) || normPrefix.startsWith(normTopic)) && normPrefix.length >= 3) ||
          (normTitle && (normTitle.startsWith(normPrefix) || normPrefix.startsWith(normTitle)) && normPrefix.length >= 3) ||
          (normTopic && normRawName.startsWith(normTopic)) ||
          (normTitle && normRawName.startsWith(normTitle));

        if (isMatch) {
          targetJsonItem = jItem;
          break;
        }
      }

      if (targetJsonItem && targetJsonItem.questions.length > 0) {
        const questions = targetJsonItem.questions;
        let targetQ: any = null;

        if (serialNum !== null) {
          targetQ = questions.find((q: any) => 
            q.id == serialNum || 
            q.number == serialNum || 
            q.questionNumber == serialNum || 
            q.serialNumber == serialNum ||
            q.qIndex == serialNum
          );

          if (!targetQ && serialNum >= 1 && serialNum <= questions.length) {
            targetQ = questions[serialNum - 1];
          }
        }

        if (!targetQ) {
          targetQ = questions.find((q: any) => !q.imageUrl);
        }

        if (targetQ && imgItem.questions[0]?.imageUrl) {
          const imgData = imgItem.questions[0].imageUrl;
          targetQ.imageUrl = imgData;
          targetQ.imagePreviewUrl = imgData;
          if (!targetQ.type || targetQ.type === 'multiple-choice') {
            if (!targetQ.options || targetQ.options.length === 0) {
              targetQ.type = 'identify-image';
            }
          }
          matchedImageIds.add(imgItem.id);
        }
      }
    }

    let combinedQuestions: any[] = [];
    let combinedQuotes: any[] = [];
    let firstTitle = '';
    let firstTopic = '';
    let firstType = '';

    let playerIdxCounter = 0;

    // First pass to determine firstType, firstTitle, firstTopic
    for (const item of [...jsonItemsCloned, ...imageItems]) {
      if (!firstTitle && item.title) firstTitle = item.title;
      if (!firstTopic && item.topic) firstTopic = item.topic;
      if (!firstType && item.type) firstType = item.type;
    }
    
    const actualQuizType = quizType !== 'multiple-choice' ? quizType : (firstType || 'multiple-choice');
    const assumedType = actualQuizType;

    for (const item of jsonItemsCloned) {
      const itemType = item.type || assumedType;
      const questionsWithPlayerIdx = item.questions.map(q => ({
        ...q,
        type: q.type || itemType,
        playerIndex: undefined,
        category: itemType === 'rapid-fire' ? 'Rapid Fire' : (q.category || item.title || item.topic),
        rapidFireSet: itemType === 'rapid-fire' ? `Set ${playerIdxCounter + 1} - ${item.title || item.topic || 'Rapid Fire'}` : undefined,
        timeLimit: itemType === 'rapid-fire' ? ((item as any).timeLimit || q.timeLimit || 60) : q.timeLimit
      }));
      combinedQuestions.push(...questionsWithPlayerIdx);
      if (itemType === 'rapid-fire') {
        playerIdxCounter++;
      }
      if (item.quotes && item.quotes.length > 0) {
        combinedQuotes.push(...item.quotes);
      }
    }

    for (const item of imageItems) {
      if (!matchedImageIds.has(item.id)) {
        combinedQuestions.push(...item.questions);
      }
    }

    return {
      combinedQuestions,
      combinedQuotes,
      firstTitle,
      firstTopic,
      firstType,
      matchedCount: matchedImageIds.size
    };
  };

  const handleStartUploadedFiles = (mode: 'select' | 'video' | 'interactive' = 'select') => {
    if (uploadedFileList.length === 0) {
      setError("Please select at least one JSON or image file.");
      return;
    }

    const {
      combinedQuestions,
      combinedQuotes,
      firstTitle,
      firstTopic,
      firstType
    } = combineUploadedFiles(uploadedFileList);

    if (combinedQuestions.length === 0) {
      setError("No valid questions found in uploaded files.");
      return;
    }

    // Prime speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
    }
    audioSynth.setVoicePreference(voicePreference);
    audioSynth.setMusicPreference(musicEnabled);

    const combinedQuiz: Quiz = {
      title: firstTitle || (uploadedFileList.length === 1 ? uploadedFileList[0].fileName.replace(/\.[^/.]+$/, "") : "Combined Quiz"),
      topic: firstTopic || (uploadedFileList.length === 1 ? uploadedFileList[0].fileName.replace(/\.[^/.]+$/, "") : "Uploaded Files"),
      type: (quizType !== 'multiple-choice' ? quizType : (firstType || 'multiple-choice')) as any,
      theme: {
        primaryColor: "#4f46e5",
        secondaryColor: "#818cf8",
        textColor: "#ffffff"
      },
      questions: combinedQuestions,
      quotes: combinedQuotes.length > 0 ? combinedQuotes : undefined,
      isOfflineMode: true,
      isMultipleFilesLoaded: uploadedFileList.length > 1,
    };

    if (mode === 'video') {
      setLoadedOfflineQuiz({ ...combinedQuiz, mode: 'video', showBadges, enableMemoryBreak, themeMemoryBreak, memoryBreakImageCount, enableInsightImages, dynamicColors: enableDynamicColors, rules: rules || undefined });
    } else if (mode === 'interactive') {
      setPendingInteractiveQuiz({ ...combinedQuiz, mode: 'interactive', showBadges, enableMemoryBreak, themeMemoryBreak, memoryBreakImageCount, enableInsightImages, dynamicColors: enableDynamicColors, rules: rules || undefined });
    } else {
      setLoadedOfflineQuiz(combinedQuiz);
    }
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
        body: JSON.stringify({ content: presentationContent, duration: presentationDuration, enableInsightImages }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate presentation');
      }
      
      data.showBadges = showBadges;
      if (mode === 'interactive') { setPendingInteractiveQuiz({ ...data, mode, showBadges }); } else { setLoadedOfflineQuiz({ ...data, mode, showBadges }); }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating.');
    } finally {
      setLoading(false);
    }
  };

  const isCustomMode = ((quizType === 'identify-image' || quizType === 'blurred-image') || quizType === 'multiple-choice' || quizType === 'a-to-z') && identifyMode === 'custom';
  const isJsonMode = ((quizType === 'identify-image' || quizType === 'blurred-image') || quizType === 'multiple-choice' || quizType === 'a-to-z') && identifyMode === 'json';
  const isAutoMode = ((quizType === 'identify-image' || quizType === 'blurred-image') || quizType === 'multiple-choice' || quizType === 'a-to-z') && identifyMode === 'auto';
  const needsTopic = !(isCustomMode || isJsonMode);
  const hasMissingTopic = needsTopic && !topic.trim();
  const hasMissingCustomImages = isCustomMode && (customImages.length === 0 || customImages.some(img => !img.name.trim()));
  const hasMissingJsonItems = isJsonMode && jsonItems.length === 0;
  
  // Only require cache success for identify-image. For multiple choice, includeImages flag takes care of it server-side.
  const hasMissingCache = isAutoMode && (quizType === 'identify-image' || quizType === 'blurred-image') && !cacheSuccess;

  const isGenerateDisabled = loading || hasMissingTopic || hasMissingCustomImages || hasMissingJsonItems || hasMissingCache;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row p-4 md:p-8 lg:p-12 gap-8 font-sans items-start justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100/60 ring-1 ring-slate-900/5"
      >
        <div className="lg:w-2/5 xl:w-1/3 bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 p-10 lg:p-12 text-white flex flex-col relative overflow-hidden shrink-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex-1">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[1.5rem] bg-white/10 mb-8 backdrop-blur-md shadow-inner shadow-white/20 border border-white/20">
              <Sparkles className="w-10 h-10 text-white drop-shadow-md" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Content<br/>Studio</h1>
            <p className="text-indigo-100 text-lg leading-relaxed mb-12 font-medium opacity-90">Design beautiful, interactive YouTube quizzes and presentations with AI.</p>
            
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setSetupMode('quiz')}
                className={`flex items-center gap-4 px-6 py-4 text-left font-bold rounded-2xl transition-all duration-300 border-2 ${setupMode === 'quiz' ? 'bg-white text-indigo-600 border-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] scale-[1.02]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'}`}
              >
                <div className={`p-2 rounded-xl ${setupMode === 'quiz' ? 'bg-indigo-100' : 'bg-white/10'}`}><Gamepad2 className="w-6 h-6" /></div>
                <div className="flex flex-col"><span className="text-sm opacity-80 uppercase tracking-widest text-[10px]">Create</span><span className="text-lg">Quiz Maker</span></div>
              </button>
              <button
                type="button"
                onClick={() => setSetupMode('presentation')}
                className={`flex items-center gap-4 px-6 py-4 text-left font-bold rounded-2xl transition-all duration-300 border-2 ${setupMode === 'presentation' ? 'bg-white text-indigo-600 border-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] scale-[1.02]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'}`}
              >
                <div className={`p-2 rounded-xl ${setupMode === 'presentation' ? 'bg-indigo-100' : 'bg-white/10'}`}><MonitorPlay className="w-6 h-6" /></div>
                <div className="flex flex-col"><span className="text-sm opacity-80 uppercase tracking-widest text-[10px]">Create</span><span className="text-lg">Presentation</span></div>
              </button>
              <button
                type="button"
                onClick={() => setSetupMode('offline')}
                className={`flex items-center gap-4 px-6 py-4 text-left font-bold rounded-2xl transition-all duration-300 border-2 ${setupMode === 'offline' ? 'bg-white text-indigo-600 border-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] scale-[1.02]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'}`}
              >
                <div className={`p-2 rounded-xl ${setupMode === 'offline' ? 'bg-indigo-100' : 'bg-white/10'}`}><FileUp className="w-6 h-6" /></div>
                <div className="flex flex-col"><span className="text-sm opacity-80 uppercase tracking-widest text-[10px]">Import</span><span className="text-lg">Offline Custom</span></div>
              </button>
            </div>
          </div>
          
          <div className="relative z-10 mt-12 pt-8 border-t border-white/20 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-sm font-medium text-indigo-100">System Ready</span>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-[85vh] overflow-y-auto custom-scrollbar relative bg-white">
        
        
        {setupMode === 'offline' && !pendingInteractiveQuiz && !loadedOfflineQuiz ? (
          <form className="p-8 space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <FileUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Offline Quiz</h2>
                <p className="text-slate-500 font-medium text-sm">Upload JSON to create custom quizzes</p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-4 bg-indigo-50/50 p-6 rounded-2xl border-2 border-indigo-100">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-indigo-900 uppercase tracking-wider">JSON Files</label>
                <button type="button" onClick={() => { if (fileInputRef.current) fileInputRef.current.click(); }} className="text-indigo-600 font-bold text-sm bg-white px-4 py-2 rounded-xl hover:bg-indigo-50 border-2 border-indigo-100 shadow-sm transition-all flex items-center gap-2">
                  <Upload className="w-4 h-4"/> Upload Files
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                multiple
                className="hidden"
              />
              
              {uploadedFileList.length > 0 ? (
                <div className="space-y-3 mt-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {uploadedFileList.map((file, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border-2 border-emerald-100 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600"><FileText className="w-5 h-5"/></div>
                        <div>
                          <div className="font-bold text-slate-700 text-sm truncate max-w-[200px]">{file.fileName}</div>
                          <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                            {file.questions.length} questions
                          </div>
                        </div>
                      </div>
                      <button type="button" onClick={() => setUploadedFileList(prev => prev.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm font-medium text-slate-500 text-center py-10 bg-white rounded-xl border-2 border-dashed border-indigo-200">
                  <FileUp className="w-8 h-8 mx-auto mb-3 text-indigo-300" />
                  No JSON files uploaded yet.<br/>Click "Upload Files" to select custom quiz files.
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleStartUploadedFiles('select')}
                disabled={uploadedFileList.length === 0}
                className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-6 h-6" />
                Start Offline Quiz
              </button>
            </div>
          </form>
        ) : setupMode === 'presentation' && !pendingInteractiveQuiz && !loadedOfflineQuiz ? (
          <form className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
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
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={presentationDuration}
                onChange={(e) => setPresentationDuration(parseInt(e.target.value) || 1)}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50 text-slate-800 text-lg font-medium cursor-pointer"
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
                    Generating AI Quiz...
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
                    Generating AI Quiz...
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
            <h2 className="text-2xl font-bold text-slate-800">Quiz Ready!</h2>
            <p className="text-slate-600">"{loadedOfflineQuiz.title || loadedOfflineQuiz.topic}" is ready to play.</p>
            {renderInsightImagesSummary(loadedOfflineQuiz, (q) => setLoadedOfflineQuiz(q))}
            
            <div className="space-y-2 text-left mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Rules (Optional)
              </label>
              <textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                placeholder="Enter the rules of the quiz here. Each line will be a bullet point."
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white min-h-[120px]"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                type="button"
                onClick={() => enrichQuizInsightsAndStart(loadedOfflineQuiz, 'video')}
                className="flex-1 py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Play className="w-6 h-6 fill-current" />
                Video Mode
              </button>
              <button
                type="button"
                onClick={() => {
                  setPendingInteractiveQuiz({ ...loadedOfflineQuiz, mode: 'interactive', showBadges, enableMemoryBreak, themeMemoryBreak, memoryBreakImageCount, enableInsightImages, dynamicColors: enableDynamicColors, rules: rules || undefined });
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
            {renderInsightImagesSummary(pendingInteractiveQuiz, (q) => setPendingInteractiveQuiz(q))}
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 py-1 text-left bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
                <input
                  type="checkbox"
                  id="showFrames"
                  checked={showFrames}
                  onChange={(e) => setShowFrames(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-indigo-300 cursor-pointer"
                />
                <label htmlFor="showFrames" className="text-sm font-semibold text-neutral-800 cursor-pointer select-none">
                  Show Video Camera Frames
                </label>
              </div>

              {showFrames && (
                <div className="space-y-2 text-left">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Participant Video Frame Size</label>
                  <select
                    value={frameSize}
                    onChange={(e) => setFrameSize(e.target.value as 'small' | 'medium' | 'large')}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-indigo-200 hover:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all bg-indigo-50/30 text-indigo-900 text-lg font-bold cursor-pointer"
                  >
                    <option value="small">Small Frame</option>
                    <option value="medium">Medium Frame (1.25x)</option>
                    <option value="large">Large Frame (1.5x)</option>
                  </select>
                </div>
              )}

              <div className="space-y-2 text-left">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Number of Players</label>
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
                  className="w-full px-5 py-4 rounded-2xl border-2 border-indigo-200 hover:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all bg-indigo-50/30 text-indigo-900 text-lg font-bold cursor-pointer"
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
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Name</label>
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
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Photo (Optional)</label>
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
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Topic to Talk About (Optional)</label>
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
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Details (Optional)</label>
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
                  rules: pendingInteractiveQuiz.rules || undefined,
                  frameSize: frameSize,
                  showFrames: showFrames,
                  showBadges: showBadges,
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
        <form onSubmit={(e) => handleGenerate(e, 'video')} className="p-8 lg:p-12 space-y-8 max-w-4xl mx-auto w-full">
  
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}
          
          {needsTopic && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              What is the topic?
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Dinosaurs, Space, Animals"
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 bg-slate-50/50 text-slate-800 text-lg font-medium"
              required={needsTopic}
            />
          </div>
  )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Quiz Type
            </label>
            <select
              value={quizType}
              onChange={(e) => {
                const val = e.target.value;
                setQuizType(val);
              }}
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50 text-slate-800 text-lg font-medium cursor-pointer"
            >
              <option value="multiple-choice">Standard (Multiple Choice)</option>
              <option value="identify-image">Identify the Image</option>
              <option value="blurred-image">Guess the Blurred Image</option>
              <option value="5-clues">Guess in 5 Clues</option>
              <option value="detective">Be a Detective</option>
              <option value="find-in-map">Find in Map</option>
              <option value="jumbled-letters">Jumbled Letters</option>
              <option value="match-the-following">Match the Following</option>
              <option value="combat-mode">Combat Mode (2 Players)</option>
              <option value="word-search">Word Search</option>
              <option value="mega-quiz">Mega Quiz (100 Questions Mix)</option>
              <option value="rapid-fire">Rapid Fire</option>
              <option value="a-to-z">A to Z Challenge</option>
            </select>
          </div>


          {((quizType === 'identify-image' || quizType === 'blurred-image') || quizType === 'multiple-choice' || quizType === 'a-to-z') && (
            <div className="space-y-4 bg-indigo-50/50 p-6 rounded-2xl border-2 border-indigo-100">
              <label className="text-sm font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-500" />
                Image Source
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIdentifyMode('auto')} className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${identifyMode === 'auto' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-indigo-600 border-2 border-indigo-100 hover:border-indigo-300'}`}>AI Generate</button>
                <button type="button" onClick={() => setIdentifyMode('custom')} className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${identifyMode === 'custom' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-indigo-600 border-2 border-indigo-100 hover:border-indigo-300'}`}>Upload Images</button>
                <button type="button" onClick={() => setIdentifyMode('json')} className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${identifyMode === 'json' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-indigo-600 border-2 border-indigo-100 hover:border-indigo-300'}`}>Upload JSON</button>
              </div>

              {identifyMode === 'auto' && (quizType === 'identify-image' || quizType === 'blurred-image') && (
                <div className="space-y-4 mt-4">
                  <button type="button" onClick={handleCacheImages} disabled={caching || !topic.trim()} className="w-full py-3 rounded-xl bg-indigo-100 text-indigo-700 font-bold hover:bg-indigo-200 transition-all flex items-center justify-center gap-2">
                    {caching ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating & Caching Images...</> : <><Sparkles className="w-5 h-5" /> Pre-generate Images</>}
                  </button>
                  {cacheSuccess && <div className="text-sm text-emerald-600 font-medium text-center bg-emerald-50 p-2 rounded-lg">{cacheMessage || "Images successfully cached! Ready to play."}</div>}
                  {error && caching && <div className="text-sm text-red-600 font-medium text-center">{error}</div>}
                </div>
              )}

              {identifyMode === 'custom' && (
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Upload Images</label>
                    <button type="button" onClick={() => {
                       const input = document.createElement('input');
                       input.type = 'file'; input.multiple = true; input.accept = 'image/*';
                       input.onchange = async (e) => {
                         const files = Array.from((e.target as HTMLInputElement).files || []);
                         for (const file of files) {
                           const base64 = await new Promise<string>(resolve => { const r = new FileReader(); r.onload = (e) => resolve(e.target?.result as string); r.readAsDataURL(file); });
                           setCustomImages(prev => [...prev, { id: Math.random().toString(), file, base64, name: file.name.replace(/\.[^/.]+$/, "") }]);
                         }
                       };
                       input.click();
                    }} className="text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">Browse Files</button>
                  </div>
                  {customImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {customImages.map((img, idx) => (
                         <div key={img.id} className="bg-white p-2 rounded-xl border-2 border-slate-100 flex flex-col gap-2">
                           <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
                             <img src={img.base64} alt="preview" className="w-full h-full object-cover" />
                             <button type="button" onClick={() => setCustomImages(prev => prev.filter(c => c.id !== img.id))} className="absolute top-1 right-1 bg-white/80 p-1 rounded-md text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                           </div>
                           <input type="text" value={img.name} onChange={e => {
                             const n = [...customImages];
                             n[idx].name = e.target.value;
                             setCustomImages(n);
                           }} className="w-full px-2 py-1 text-sm border-2 border-slate-100 rounded-md focus:border-indigo-400 focus:outline-none" placeholder="Enter answer..." />
                         </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 text-center py-6 bg-white rounded-xl border-2 border-dashed border-slate-200">No images uploaded yet.</div>
                  )}
                </div>
              )}

              {identifyMode === 'json' && (
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">JSON File</label>
                    <div className="flex gap-2">
                       <button type="button" onClick={downloadJsonTemplate} className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 flex items-center gap-1"><Download className="w-4 h-4"/> Template</button>
                       <button type="button" onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file'; input.accept = '.json';
                          input.onchange = async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (!file) return;
                            const text = await file.text();
                            try {
                              const json = JSON.parse(text);
                              const items = Array.isArray(json) ? json : (json.items || json.questions || []);
                              setJsonItems(items);
                              setJsonFileNames([file.name]);
                            } catch(err) {
                              setError("Invalid JSON format");
                            }
                          };
                          input.click();
                       }} className="text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 flex items-center gap-1"><Upload className="w-4 h-4"/> Upload</button>
                    </div>
                  </div>
                  {jsonFileNames.length > 0 ? (
                    <div className="bg-white p-4 rounded-xl border-2 border-emerald-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600"><FileText className="w-5 h-5"/></div>
                        <div>
                          <div className="font-bold text-slate-700 text-sm">{jsonFileNames[0]}</div>
                          <div className="text-xs text-slate-500">{jsonItems.length} items loaded</div>
                        </div>
                      </div>
                      <button type="button" onClick={handleCacheImages} disabled={caching || cacheSuccess} className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-100">
                        {cacheSuccess ? "Images Cached" : caching ? "Caching..." : "Cache Images"}
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 text-center py-6 bg-white rounded-xl border-2 border-dashed border-slate-200">No JSON file loaded yet.</div>
                  )}
                </div>
              )}
            </div>
          )}


          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Mic className="w-4 h-4 text-indigo-500" />
                Voice
              </label>
              <select
                value={voicePreference}
                onChange={(e) => setVoicePreference(e.target.value as any)}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50 text-slate-800 text-lg font-medium cursor-pointer"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="none">No Voice</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Music className="w-4 h-4 text-indigo-500" />
                Music & SFX
              </label>
              <select
                value={musicEnabled ? 'yes' : 'no'}
                onChange={(e) => setMusicEnabled(e.target.value === 'yes')}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50 text-slate-800 text-lg font-medium cursor-pointer"
              >
                <option value="yes">Enabled</option>
                <option value="no">Disabled</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-500" />
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50 text-slate-800 text-lg font-medium cursor-pointer"
              >
                <option value="easy">Easy (Ages 4-7)</option>
                <option value="medium">Medium (Ages 8-11)</option>
                <option value="hard">Hard (Ages 12-15)</option>
                <option value="very hard">Very Hard (Ages 16+)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                Questions
              </label>
              <select
                value={quizType === 'mega-quiz' ? 100 : (quizType === 'a-to-z' ? 26 : numQuestions)}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                disabled={quizType === 'mega-quiz' || quizType === 'a-to-z'}
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

          {/* Milestone Badges Toggle */}
          <div 
            onClick={() => setShowBadges(!showBadges)}
            className="p-3.5 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 border-2 border-amber-200/80 rounded-xl flex items-center justify-between cursor-pointer hover:border-amber-300 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-amber-500/20">
                ��
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  Milestone Badges
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300/50">
                    All Modes
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-600">
                  Show milestone badges during quiz
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={showBadges}
              onChange={(e) => setShowBadges(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500 cursor-pointer accent-amber-600"
            />
          </div>

          
          {/* Insight Images Toggle */}
          <div 
            onClick={() => setEnableInsightImages(!enableInsightImages)}
            className="p-3.5 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border-2 border-emerald-200/80 rounded-xl flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-all shadow-sm mt-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-500/20">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-700">Insight Images</span>
                <div className="text-xs font-semibold text-emerald-600/90 leading-tight mt-0.5">
                  Show images for "Did you know?" facts
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableInsightImages}
              onChange={(e) => setEnableInsightImages(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500 cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Memory Break Toggle */}
          <div 
            onClick={() => setEnableMemoryBreak(!enableMemoryBreak)}
            className="p-3.5 bg-gradient-to-r from-purple-50/80 to-fuchsia-50/80 border-2 border-purple-200/80 rounded-xl flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-purple-500/20">
                🧩
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  Memory Break
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-200/80 text-purple-900 border border-purple-300/50">
                    Midway
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-600">
                  Play a memory game halfway through
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableMemoryBreak}
              onChange={(e) => setEnableMemoryBreak(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 text-purple-600 border-purple-300 rounded focus:ring-purple-500 cursor-pointer accent-purple-600"
            />
          </div>
          {enableMemoryBreak && (
            <div className="ml-8 space-y-3">
             <div 
               onClick={() => setThemeMemoryBreak(!themeMemoryBreak)}
               className="p-3.5 bg-gradient-to-r from-purple-50/40 to-fuchsia-50/40 border-2 border-purple-200/50 rounded-xl flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all shadow-sm"
             >
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-purple-400 text-white flex items-center justify-center font-black text-lg shadow-md shadow-purple-400/20">
                   🎨
                 </div>
                 <div className="text-left">
                   <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                     Theme Related Objects
                   </div>
                   <div className="text-xs text-slate-500/80 font-medium">Uses AI to generate objects matching the quiz topic</div>
                 </div>
               </div>
               <input
                 type="checkbox"
                 checked={themeMemoryBreak}
                 onChange={(e) => setThemeMemoryBreak(e.target.checked)}
                 onClick={(e) => e.stopPropagation()}
                 className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500 cursor-pointer accent-purple-600"
               />
             </div>
             
             <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col gap-3 shadow-sm">
                 <div className="flex items-center justify-between">
                   <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                     <span className="text-lg">🔢</span> Number of Images
                   </label>
                   <span className="text-sm font-black text-purple-600 bg-purple-100 px-3 py-1 rounded-full shadow-inner">{memoryBreakImageCount}</span>
                 </div>
                 <input
                   type="range"
                   min="5"
                   max="20"
                   value={memoryBreakImageCount}
                   onChange={(e) => setMemoryBreakImageCount(parseInt(e.target.value))}
                   className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                 />
                 <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                   <span>5</span>
                   <span>10</span>
                   <span>15</span>
                   <span>20</span>
                 </div>
             </div>
            </div>
          )}

          {/* Dynamic Colors Toggle */}
          <div 
            onClick={() => setEnableDynamicColors(!enableDynamicColors)}
            className="p-3.5 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-2 border-blue-200/80 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all shadow-sm mt-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  Dynamic Colors
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-900 border border-blue-300/50">
                    Video Mode
                  </span>
                </div>
                <div className="text-xs font-semibold text-blue-600/90 leading-tight mt-0.5">
                  Multi-colored backgrounds in video quiz
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableDynamicColors}
              onChange={(e) => setEnableDynamicColors(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 text-blue-600 border-blue-300 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-6 border-t-2 border-slate-100">
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="flex-1 py-5 rounded-2xl bg-indigo-600 text-white font-black text-xl hover:bg-indigo-700 hover:scale-[1.02] hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(79,70,229,0.3)] active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating AI Quiz...
                </>
              ) : (
                <>
                  <Play className="w-7 h-7 fill-current" />
                  Start Video Quiz
                </>
              )}
            </button>
            <button
              type="button"
              onClick={(e) => handleGenerate(e as any, 'interactive')}
              disabled={loading || !topic.trim()}
              className="flex-1 py-5 rounded-2xl bg-fuchsia-600 text-white font-black text-xl hover:bg-fuchsia-700 hover:scale-[1.02] hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(192,38,211,0.3)] active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating AI Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="w-7 h-7 fill-current" />
                  Interactive Mode
                </>
              )}
            </button>
          </div>
        </form>
        )}
      </div>
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
