import fs from 'fs';
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');

// There are two places where we did the replacement.
// We can just find the blocks and wrap them back.
// Or we can just insert an extra `{` where `else if (isInteractiveGrid)` starts and a matching `}` at the end.
// Actually, it's easier to just find:
// `              } else if (isInteractiveGrid) {`
// and replace with:
// `              } else { if (isInteractiveGrid) {`
// But wait, what about the closing brace? The extra closing brace is already there! By adding `{` we consume it.
// Let's do that!

const regex = /              \} else if \(isInteractiveGrid\) \{/g;
const newCode = `              } else { if (isInteractiveGrid) {`;

code = code.replace(regex, newCode);

fs.writeFileSync('src/components/Presentation.tsx', code);
