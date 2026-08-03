import re

with open('src/components/Presentation.tsx', 'r') as f:
    content = f.read()

# We only want to replace in the render section, which is around the end.
# Actually, since currentType is defined at the top of the component, 
# replacing it everywhere inside the component body is fine if currentType is in scope.
# But currentType is defined at line 424.
# So we can replace it safely from line 430 onwards.

lines = content.split('\n')

for i in range(430, len(lines)):
    line = lines[i]
    if 'combat-mode' not in line:
        line = re.sub(r'quiz\.type ===', 'currentType ===', line)
        line = re.sub(r'quiz\.type !==', 'currentType !==', line)
        lines[i] = line

with open('src/components/Presentation.tsx', 'w') as f:
    f.write('\n'.join(lines))
