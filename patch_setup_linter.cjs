const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

content = content.replace(
  "const files = Array.from(e.target.files || []);",
  "const files = Array.from(e.target.files || []) as File[];"
);

fs.writeFileSync('src/components/Setup.tsx', content);
