const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const targetLabel = `<Upload className="w-4 h-4" /> {jsonFileName || 'Select JSON'}`;
const replaceLabel = `<Upload className="w-4 h-4" /> {jsonFileNames.length > 0 ? \`\${jsonFileNames.length} files selected\` : 'Select JSON Files'}`;
content = content.replace(targetLabel, replaceLabel);

const targetInput = `<input 
                        type="file" 
                        accept=".json"
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setJsonFileName(file.name);
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const arr = JSON.parse(event.target?.result as string);
                              if (Array.isArray(arr)) {
                                setJsonItems(arr);
                              } else if (arr && arr.questions && Array.isArray(arr.questions)) {
                                const mappedItems = arr.questions.map((q: any, idx: number) => ({
                                  id: q.id || (idx + 1).toString(),
                                  brand_name: q.correctAnswer,
                                  image_url: q.imageUrl,
                                  image_base64: q.imageUrl && q.imageUrl.startsWith('data:image') ? q.imageUrl : undefined
                                }));
                                setJsonItems(mappedItems);
                              } else {
                                alert("Invalid JSON format. Expected an array or a Quiz object with a 'questions' array.");
                              }
                            } catch (err) {
                              alert("Invalid JSON format");
                            }
                          };
                          reader.readAsText(file);
                        }}
                      />`;
                      
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
                                items = arr.questions.map((q: any, idx: number) => ({
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

// Since spaces might be slightly off, let's use regex or a more robust replacement strategy:
// Let's just find the exact lines
