const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');
code = code.replace(/                  \);\n                  \}\)}\n                <\/div>/g, "                  ))}\n                </div>");
fs.writeFileSync('src/components/Presentation.tsx', code);
