const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

const oldForm = `<div className="space-y-4">
              <div className="space-y-2 text-left">
                <label className="text-sm font-semibold text-neutral-700">Player / Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="E.g., The Brainiacs"
                  className="w-full px-4 py-4 text-xl rounded-xl border-2 border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
                  autoFocus
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-semibold text-neutral-700">Player Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => setPlayerPhoto(event.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 bg-white"
                />
                {playerPhoto && (
                  <img src={playerPhoto} alt="Preview" className="w-20 h-20 object-cover rounded-full mt-2 mx-auto shadow-md" />
                )}
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-semibold text-neutral-700">Topic to Talk About (Optional)</label>
                <input
                  type="text"
                  value={participantTopic}
                  onChange={(e) => setParticipantTopic(e.target.value)}
                  placeholder="E.g., Your favorite hobby..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 bg-white"
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-semibold text-neutral-700">Player Details (Optional)</label>
                <textarea
                  value={playerDetails}
                  onChange={(e) => setPlayerDetails(e.target.value)}
                  placeholder="E.g., 10 years old, loves science..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 bg-white"
                  rows={3}
                />
              </div>
            </div>`;

const newForm = `
            <div className="space-y-4">
              <div className="space-y-2 text-left">
                <label className="text-sm font-semibold text-neutral-700">Number of Players</label>
                <select
                  value={numPlayers}
                  onChange={(e) => {
                    const count = parseInt(e.target.value);
                    setNumPlayers(count);
                    const newPlayers = [...players];
                    while (newPlayers.length < count) {
                      newPlayers.push({ id: (newPlayers.length + 1).toString(), name: '', photo: '', details: '', topic: '', score: 0 });
                    }
                    if (newPlayers.length > count) {
                      newPlayers.length = count;
                    }
                    setPlayers(newPlayers);
                  }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 bg-white"
                >
                  <option value={1}>1 Player / Team</option>
                  <option value={2}>2 Players</option>
                  <option value={3}>3 Players</option>
                </select>
              </div>

              <div className="max-h-[50vh] overflow-y-auto space-y-6 pr-2">
                {players.map((player, index) => (
                  <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                    <h3 className="font-bold text-slate-700">Player {index + 1}</h3>
                    
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-neutral-700">Name</label>
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => {
                          const newPlayers = [...players];
                          newPlayers[index].name = e.target.value;
                          setPlayers(newPlayers);
                          if (index === 0) setTeamName(e.target.value);
                        }}
                        placeholder={\`E.g., Player \${index + 1}\`}
                        className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      />
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-neutral-700">Photo (Optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const newPlayers = [...players];
                              newPlayers[index].photo = event.target?.result as string;
                              setPlayers(newPlayers);
                              if (index === 0) setPlayerPhoto(event.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-4 py-2 text-sm rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white"
                      />
                      {player.photo && (
                        <img src={player.photo} alt="Preview" className="w-16 h-16 object-cover rounded-full mt-2 shadow-sm" />
                      )}
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-neutral-700">Topic to Talk About (Optional)</label>
                      <input
                        type="text"
                        value={player.topic}
                        onChange={(e) => {
                          const newPlayers = [...players];
                          newPlayers[index].topic = e.target.value;
                          setPlayers(newPlayers);
                          if (index === 0) setParticipantTopic(e.target.value);
                        }}
                        placeholder="E.g., Your favorite hobby..."
                        className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white"
                      />
                    </div>
                    
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-neutral-700">Details (Optional)</label>
                      <textarea
                        value={player.details}
                        onChange={(e) => {
                          const newPlayers = [...players];
                          newPlayers[index].details = e.target.value;
                          setPlayers(newPlayers);
                          if (index === 0) setPlayerDetails(e.target.value);
                        }}
                        placeholder="E.g., 10 years old, loves science..."
                        className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>`;

content = content.replace(oldForm, newForm);

const oldFinalQuiz = `const finalQuiz = { ...pendingInteractiveQuiz, teamName: teamName || 'Player 1', playerPhoto, playerDetails, participantTopic };`;
const newFinalQuiz = `const finalQuiz = { 
                  ...pendingInteractiveQuiz, 
                  teamName: players[0]?.name || teamName || 'Player 1', 
                  playerPhoto: players[0]?.photo || playerPhoto, 
                  playerDetails: players[0]?.details || playerDetails, 
                  participantTopic: players[0]?.topic || participantTopic,
                  isMultiplayer: numPlayers > 1,
                  players: players.map((p, i) => ({ ...p, name: p.name || \`Player \${i + 1}\` }))
                };`;
content = content.replace(oldFinalQuiz, newFinalQuiz);

fs.writeFileSync('src/components/Setup.tsx', content);
