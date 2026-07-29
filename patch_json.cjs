const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

// Replace single file handling with multiple file handling
const target1 = `const [jsonItems, setJsonItems] = useState<any[]>([]);
  const [jsonFileName, setJsonFileName] = useState('');`;
const replace1 = `const [jsonItems, setJsonItems] = useState<any[]>([]);
  const [jsonFileNames, setJsonFileNames] = useState<string[]>([]);`;

content = content.replace(target1, replace1);

const target2 = `payload.customItems = jsonItems.map(item => ({ id: item.id.toString(), name: item.brand_name || item.name }));`;
const replace2 = `payload.customItems = jsonItems.map(item => ({ id: item.id.toString(), name: item.brand_name || item.name, category: item.category }));`;

content = content.replace(target2, replace2);

const target3 = `          const matched = jsonItems.find(c => c.id.toString() === q.id);
          if (matched) {
            q.imageUrl = matched.image_base64 || matched.base64 || matched.image_url || matched.imageUrl;
            q.imagePreviewUrl = q.imageUrl;
          }`;
const replace3 = `          const matched = jsonItems.find(c => c.id.toString() === q.id);
          if (matched) {
            q.imageUrl = matched.image_base64 || matched.base64 || matched.image_url || matched.imageUrl;
            q.imagePreviewUrl = q.imageUrl;
            q.category = matched.category;
          }`;

content = content.replace(target3, replace3);

const target4 = `<input 
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
                      
const replace4 = `<input 
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
                              items = items.map(item => ({ ...item, category: categoryName }));
                              allItems = [...allItems, ...items];
                            } catch (err) {
                              console.error("Invalid JSON format in " + file.name);
                            }
                          }
                          setJsonItems(allItems);
                        }}
                      />`;

content = content.replace(target4, replace4);

const target5 = `{jsonItems.length > 0 && (
                    <div className="text-sm text-emerald-600 font-bold bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                      Successfully loaded {jsonItems.length} items from {jsonFileName}.
                    </div>
                  )}`;
const replace5 = `{jsonItems.length > 0 && (
                    <div className="text-sm text-emerald-600 font-bold bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                      Successfully loaded {jsonItems.length} items from {jsonFileNames.length} file{jsonFileNames.length !== 1 ? 's' : ''}.
                    </div>
                  )}`;

content = content.replace(target5, replace5);

fs.writeFileSync('src/components/Setup.tsx', content);
console.log("Patched JSON upload!");
