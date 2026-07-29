const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const str1 = `disabled={loading || !topic.trim() || (quizType === 'identify-image' && identifyMode === 'auto' && !cacheSuccess) || (quizType === 'identify-image' && identifyMode === 'custom' && (customImages.length === 0 || customImages.some(img => !img.name.trim()))) || (quizType === 'identify-image' && identifyMode === 'json' && jsonItems.length === 0)}`;

const replace1 = `disabled={loading || (!(quizType === 'identify-image' && (identifyMode === 'custom' || identifyMode === 'json')) && !topic.trim()) || (quizType === 'identify-image' && identifyMode === 'auto' && !cacheSuccess) || (quizType === 'identify-image' && identifyMode === 'custom' && (customImages.length === 0 || customImages.some(img => !img.name.trim()))) || (quizType === 'identify-image' && identifyMode === 'json' && jsonItems.length === 0)}`;

content = content.replace(str1, replace1);
content = content.replace(str1, replace1);

const warnTarget = `{(!topic.trim() || (quizType === 'identify-image' && identifyMode === 'custom' && (customImages.length === 0 || customImages.some(img => !img.name.trim())))) && (
            <div className="text-sm text-red-500 font-medium text-center">
              {!topic.trim() ? "Please enter a topic to enable quiz generation." : "Please add images and ensure all images have a name."}
            </div>
          )}`;
          
const warnReplace = `{((!(quizType === 'identify-image' && (identifyMode === 'custom' || identifyMode === 'json')) && !topic.trim()) || (quizType === 'identify-image' && identifyMode === 'custom' && (customImages.length === 0 || customImages.some(img => !img.name.trim())))) && (
            <div className="text-sm text-red-500 font-medium text-center">
              {!(quizType === 'identify-image' && (identifyMode === 'custom' || identifyMode === 'json')) && !topic.trim() ? "Please enter a topic to enable quiz generation." : "Please add images and ensure all images have a name."}
            </div>
          )}`;
          
content = content.replace(warnTarget, warnReplace);
fs.writeFileSync('src/components/Setup.tsx', content);
console.log("Patched setup topic logic");
