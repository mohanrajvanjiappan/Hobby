const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');
code = code.replace("                  ))}\\n                </div>", "                  );})}\\n                </div>");
// Wait, the regex `\n` in string replace might not match.
fs.writeFileSync('src/components/Presentation.tsx', code.replace(/                  \)\)}\n                <\/div>/g, "                  );\n                  })}\n                </div>"));
