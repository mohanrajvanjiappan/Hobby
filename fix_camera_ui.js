import fs from 'fs';
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

code = code.replace(
  /<video\s*ref=\{\(el\) => \(videoRefs\.current\[pId\] = el\)\}\s*autoPlay\s*playsInline\s*muted\s*className=\{\`w-full h-full object-cover rounded-\[2rem\] transform transition-all duration-300 \$\{isCamActive \? 'opacity-100 scale-100' : 'opacity-0 scale-90'\}\`\}\s*\/>/g,
  `<video
                  ref={(el) => (videoRefs.current[pId] = el)}
                  autoPlay
                  playsInline
                  muted
                  className={\`w-full h-full object-cover rounded-[2rem] transform transition-all duration-300 \${isCamActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}\`}
                />
                {isCamActive && !streams[pId] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800 rounded-[2rem] text-slate-400">
                    Camera Panel
                  </div>
                )}`
);

fs.writeFileSync('src/components/Presentation.tsx', code);
console.log("Fixed camera UI");
