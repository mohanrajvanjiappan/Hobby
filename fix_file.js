const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

const regex = /return \(\s*<motion\.div\s*initial=\{\{ scale: 0\.8, opacity: 0, y: 50, rotateX: -15 \}\}[\s\S]*?\)\(\)\}\s*\{stage === 'badges'/;

const replacement = `return (
          <motion.div
            key={pId}
            animate={{
              scale: isCurrent ? 1.05 : 1,
              opacity: (isCurrent || stage !== 'question') ? 1 : 0.7
            }}
            className={\`relative rounded-3xl overflow-hidden transition-all duration-300 \${sizeClasses} bg-slate-900 border-4 shadow-xl \${isCurrent ? \`\${bColor} \${sColor} ring-4 \${rColor}\` : 'border-slate-700/50'}\`}
          >
            {isCamActive ? (
              <video
                ref={(el) => (videoRefs.current[pId] = el)}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <span className="text-3xl filter drop-shadow-md">{player.photo}</span>
                <span className="text-white/50 text-xs font-bold uppercase tracking-wider">{player.name}</span>
                <button
                   onClick={() => startCamera(pId)}
                   className="mt-2 text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-full transition-colors font-semibold"
                >
                  Enable Camera
                </button>
              </div>
            )}
            
            <div className={\`absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 to-transparent flex items-end \${isCurrent ? 'justify-between' : 'justify-center'}\`}>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base md:text-lg drop-shadow-md">{player.photo}</span>
                <span className="text-white font-bold text-xs sm:text-sm md:text-base drop-shadow-md truncate max-w-[100px] sm:max-w-[120px]">{player.name}</span>
              </div>
              {isCurrent && (
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              )}
            </div>
            {isCurrent && (
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/20">
                Playing
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
  
const Presentation: React.FC<PresentationProps> = ({ quiz, onComplete }) => {
  // Wait, I actually deleted EVERYTHING from PlayerVideoFrames up to video-badges!
`;
