const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf-8');

code = code.replace(
  /return \(\n\s*<motion.div\n\s*key=\{i\}/g,
  `return (
                      <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={isReveal && isCorrect ? { scale: [1, 1.05, 1], opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                        key={i}`
);

// We should also strip the old animate and transition since they are now handled above.
// Actually, let's just do a specific replacement.
