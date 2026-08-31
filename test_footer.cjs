const fs = require('fs');
let code = fs.readFileSync('src/components/Presentation.tsx', 'utf8');
const oldFooter = `            )}
            </>
            )}
          </motion.div>`;
console.log(code.includes(oldFooter));
