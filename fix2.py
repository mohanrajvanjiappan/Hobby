import re

with open('src/components/Presentation.tsx', 'r') as f:
    content = f.read()

# Revert the currentType != 'text-presentation' inside specific blocks where it's redundant.
content = content.replace("if (currentType !== 'text-presentation' && (quiz.mode !== 'interactive' || prev <= 6)) audioSynth.playTick();", 
                          "if (quiz.mode !== 'interactive' || prev <= 6) audioSynth.playTick();")

with open('src/components/Presentation.tsx', 'w') as f:
    f.write(content)
