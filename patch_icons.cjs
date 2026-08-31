const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

// Find the import line for lucide-react and replace it
code = code.replace(
  /} from 'lucide-react';/,
  ', Gamepad2, MonitorPlay } from \'lucide-react\';'
);

fs.writeFileSync('src/components/Setup.tsx', code);
console.log("Done");
