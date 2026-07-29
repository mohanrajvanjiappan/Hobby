const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');
content = content.replace(
  "export interface QuizQuestion {\n  type?: string;\n  question: string;",
  "export interface QuizQuestion {\n  id?: string;\n  type?: string;\n  question: string;"
);
fs.writeFileSync('src/types.ts', content);
