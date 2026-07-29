const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const strRevertTarget = `          {(!topic.trim() || (quizType === 'identify-image' && identifyMode === 'custom' && (customImages.length === 0 || customImages.some(img => !img.name.trim())))) && (
            <div className="text-sm text-red-500 font-medium text-center">
              {!topic.trim() ? "Please enter a topic to enable quiz generation." : "Please add images and ensure all images have a name."}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">`;
          
const strRevertReplace = `<div className="flex flex-col sm:flex-row gap-4 mt-4">`;

content = content.replace(strRevertTarget, strRevertReplace);

const lines = content.split('\n');
const secondIndex = lines.findIndex((line, i) => i > 570 && line.includes('<div className="flex flex-col sm:flex-row gap-4 mt-4">'));

if (secondIndex !== -1) {
  lines.splice(secondIndex, 0, `          {(!topic.trim() || (quizType === 'identify-image' && identifyMode === 'custom' && (customImages.length === 0 || customImages.some(img => !img.name.trim())))) && (
            <div className="text-sm text-red-500 font-medium text-center">
              {!topic.trim() ? "Please enter a topic to enable quiz generation." : "Please add images and ensure all images have a name."}
            </div>
          )}`);
}

content = lines.join('\n');
fs.writeFileSync('src/components/Setup.tsx', content);
console.log("Patched warning text properly!");
