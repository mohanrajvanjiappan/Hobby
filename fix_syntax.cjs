const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

code = code.replace(/const getBlurStyle = \(\) => \{ \/\* duplicated \*\/ \};\s*\}/, '');

fs.writeFileSync('src/components/Presentation.tsx', code);
