const fs = require('fs');
let content = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const oldState = `  const [interactiveOptionClicked, setInteractiveOptionClicked] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);`;

const newState = `  const [interactiveOptionClicked, setInteractiveOptionClicked] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseButton, setShowPauseButton] = useState(false);

  const isPausedRef = useRef(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const mouseTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const timerRef = useRef<NodeJS.Timeout | null>(null);`;

content = content.replace(oldState, newState);

// Add pause condition to the timer callback. The timer runs inside Presentation.tsx
content = content.replace(/timerRef\.current = setInterval\(\(\) => \{/g, "timerRef.current = setInterval(() => {\n          if (isPausedRef.current) return;");

// Add pause UI inside return
const oldReturn = `      <button 
        onClick={onExit}
        className="absolute top-0 left-0 w-16 h-16 opacity-0 z-50 cursor-default"
        title="Hidden Exit Button"
      />`;

const newReturn = `      <button 
        onClick={onExit}
        className="absolute top-0 left-0 w-16 h-16 opacity-0 z-50 cursor-default"
        title="Hidden Exit Button"
      />
      
      {quiz.mode === 'interactive' && showPauseButton && (
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="absolute top-6 right-6 z-[60] bg-white/20 backdrop-blur-md p-4 rounded-full shadow-lg border border-white/30 text-white hover:bg-white/30 transition-all"
        >
          {isPaused ? <Play className="w-8 h-8 fill-current" /> : <Pause className="w-8 h-8 fill-current" />}
        </button>
      )}

      {isPaused && (
        <div className="absolute inset-0 z-[55] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-white text-6xl font-black uppercase tracking-widest drop-shadow-2xl flex items-center gap-4">
            <Pause className="w-16 h-16 fill-current" /> Paused
          </div>
        </div>
      )}`;

content = content.replace(oldReturn, newReturn);

fs.writeFileSync('src/components/Presentation.tsx', content);
