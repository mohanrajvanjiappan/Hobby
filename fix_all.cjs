const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

// Fix 3808
code = code.replace(
  `                        <span className="relative z-10 leading-tight truncate" title={option}>{option}</span>
                      </motion.div>
                    ))}
                </div>`,
  `                        <span className="relative z-10 leading-tight truncate" title={option}>{option}</span>
                      </motion.div>
                    );
                  })}
                </div>`
);

// Fix 4244
code = code.replace(
  `                        <span className="relative z-10 leading-tight">{option}</span>
                      </motion.div>
                    ))}
                </div>`,
  `                        <span className="relative z-10 leading-tight">{option}</span>
                      </motion.div>
                    );
                  })}
                </div>`
);

fs.writeFileSync('src/components/Presentation.tsx', code);
