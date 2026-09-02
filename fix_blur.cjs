const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

code = code.replace(/const getBlurStyle = \(\) => \{ \/\* duplicated \*\/ \};\s*(return \(\s*<div)\n\s*<svg width="0" height="0" className="hidden absolute">[\s\S]*?<\/svg>/, `$1>
    <svg width="0" height="0" className="hidden absolute">
      <defs>
        <filter id="pixelate" x="0" y="0">
          <feFlood x="2" y="2" height="2" width="2"/>
          <feComposite width="15" height="15"/>
          <feTile result="a"/>
          <feComposite in="SourceGraphic" in2="a" operator="in"/>
          <feMorphology operator="dilate" radius="7"/>
        </filter>
        <filter id="zoom-blur">
          <feGaussianBlur stdDeviation="8" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.8"/>
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>`);

const regex = /(export default function Presentation\(\{ quiz, onExit \}: PresentationProps\) \{)([\s\S]*?)(return \()/;

const newCode = `$1$2
  const getBlurStyle = () => {
    if (stage === 'reveal' || stage === 'quote' || stage === 'score' || stage === 'celebrate' || stage === 'badges' || stage === 'video-badges' || stage === 'outro') {
      return {};
    }
    
    // Only apply blur if it's an image question, or specifically blurred-image
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
      default: return { filter: 'blur(15px)' }; // default fallback
    }
  };

  $3`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/components/Presentation.tsx', code);
