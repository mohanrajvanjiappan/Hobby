const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

const target = `                        <span className={\`drop-shadow-[0_0_15px_rgba(0,0,0,0.3)] \$\{stage === 'memory-break-reveal' && item !== memoryTarget ? "opacity-20 grayscale" : "opacity-100"\}\`}>{item}</span>
                      )}
                    </motion.div>
                  ))}
                </div>`;

const replace = `                        <span className={\`drop-shadow-[0_0_15px_rgba(0,0,0,0.3)] \$\{stage === 'memory-break-reveal' && item !== memoryTarget ? "opacity-20 grayscale" : "opacity-100"\}\`}>{item}</span>
                      )}
                    </motion.div>
                  );
                  })}
                </div>`;

code = code.replace(target, replace);
fs.writeFileSync('src/components/Presentation.tsx', code);
