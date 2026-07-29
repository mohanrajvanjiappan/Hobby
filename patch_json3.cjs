const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const targetLabel = `<Upload className="w-4 h-4" /> {jsonFileName || 'Select JSON'}`;
const replaceLabel = `<Upload className="w-4 h-4" /> {jsonFileNames.length > 0 ? \`\${jsonFileNames.length} files selected\` : 'Select JSON Files'}`;
content = content.replace(targetLabel, replaceLabel);

const inputRegex = /<input\s+type="file"\s+accept="\.json"\s+className="hidden"\s+onChange=\{\(e\) => \{[\s\S]*?reader\.readAsText\(file\);\s*\}\}\s*\/>/;

const replaceInput = `<input 
                        type="file" 
                        accept=".json"
                        multiple
                        className="hidden" 
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length === 0) return;
                          
                          const names = files.map(f => f.name);
                          setJsonFileNames(names);
                          
                          let allItems = [];
                          for (const file of files) {
                            const categoryName = file.name.replace(/\\.[^/.]+$/, "").replace(/[_-]/g, " ");
                            const text = await file.text();
                            try {
                              const arr = JSON.parse(text);
                              let items = [];
                              if (Array.isArray(arr)) {
                                items = arr;
                              } else if (arr && arr.questions && Array.isArray(arr.questions)) {
                                items = arr.questions.map((q, idx) => ({
                                  id: q.id || (idx + 1).toString(),
                                  brand_name: q.correctAnswer,
                                  image_url: q.imageUrl,
                                  image_base64: q.imageUrl && q.imageUrl.startsWith('data:image') ? q.imageUrl : undefined
                                }));
                              }
                              items = items.map((item) => ({ ...item, category: categoryName }));
                              allItems = [...allItems, ...items];
                            } catch (err) {
                              console.error("Invalid JSON format in " + file.name);
                            }
                          }
                          setJsonItems(allItems);
                        }}
                      />`;
                      
content = content.replace(inputRegex, replaceInput);

fs.writeFileSync('src/components/Setup.tsx', content);
console.log("Patched JSON input successfully!");
