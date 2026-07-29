const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const targetStr = `<div className="flex flex-col sm:flex-row gap-4 mt-4">`;
const replaceStr = `          {(!topic.trim() || (quizType === 'identify-image' && identifyMode === 'custom' && (customImages.length === 0 || customImages.some(img => !img.name.trim())))) && (
            <div className="text-sm text-red-500 font-medium text-center">
              {!topic.trim() ? "Please enter a topic to enable quiz generation." : "Please add images and ensure all images have a name."}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">`;

content = content.replace(targetStr, replaceStr);

fs.writeFileSync('src/components/Setup.tsx', content);
console.log("Patched warning text!");
