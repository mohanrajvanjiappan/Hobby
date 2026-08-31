import fs from 'fs';
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const target1 = `  const isCustomMode = (quizType === 'identify-image' || quizType === 'multiple-choice') && identifyMode === 'custom';
  const isJsonMode = (quizType === 'identify-image' || quizType === 'multiple-choice') && identifyMode === 'json';
  const isAutoMode = (quizType === 'identify-image' || quizType === 'multiple-choice') && identifyMode === 'auto';`;

const replace1 = `  const isCustomMode = (quizType === 'identify-image' || quizType === 'multiple-choice' || quizType === 'a-to-z') && identifyMode === 'custom';
  const isJsonMode = (quizType === 'identify-image' || quizType === 'multiple-choice' || quizType === 'a-to-z') && identifyMode === 'json';
  const isAutoMode = (quizType === 'identify-image' || quizType === 'multiple-choice' || quizType === 'a-to-z') && identifyMode === 'auto';`;

code = code.replace(target1, replace1);

const target2 = `{(quizType === 'identify-image' || quizType === 'multiple-choice') && (
            <div className="mt-4 p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-4">`;

const replace2 = `{(quizType === 'identify-image' || quizType === 'multiple-choice' || quizType === 'a-to-z') && (
            <div className="mt-4 p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-4">`;

code = code.replace(target2, replace2);

fs.writeFileSync('src/components/Setup.tsx', code);
console.log("Patched Setup modes");
