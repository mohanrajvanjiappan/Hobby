const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

code = code.replace(
  /\} else \{\n\s*setTimeLeft\(nextQ\.timeLimit\);\n\s*\}/g,
  `} else {
                                // Do not reset time for rapid fire - it is per set
                              }`
);

fs.writeFileSync('src/components/Presentation.tsx', code);
