const fs = require('fs');
let content = fs.readFileSync('src/components/Setup.tsx', 'utf8');

// Add state variables
content = content.replace(
  "const [teamName, setTeamName] = useState('');",
  "const [teamName, setTeamName] = useState('');\n  const [playerPhoto, setPlayerPhoto] = useState<string>('');\n  const [playerDetails, setPlayerDetails] = useState('');"
);

// Modify interactive form
const oldInteractiveForm = `        ) : pendingInteractiveQuiz ? (
          <div className="p-8 text-center space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Enter User / Team Name</h2>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="E.g., The Brainiacs"
              className="w-full px-4 py-4 text-center text-xl rounded-xl border-2 border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
              autoFocus
            />
            
            <button
              type="button"
              onClick={() => {
                const finalQuiz = { ...pendingInteractiveQuiz, teamName: teamName || 'Player 1' };
                onQuizGenerated(finalQuiz);
              }}
              className="w-full py-4 rounded-xl bg-fuchsia-600 text-white font-bold text-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/30 transition-all flex items-center justify-center gap-2 mt-8 shadow-lg shadow-fuchsia-600/20"
            >`;

const newInteractiveForm = `        ) : pendingInteractiveQuiz ? (
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 text-center">Interactive Setup</h2>
            <div className="space-y-4">
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
                <label className="text-sm font-semibold text-neutral-700">Player Details (Optional)</label>
                <textarea
                  value={playerDetails}
                  onChange={(e) => setPlayerDetails(e.target.value)}
                  placeholder="E.g., 10 years old, loves science..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 bg-white"
                  rows={3}
                />
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => {
                const finalQuiz = { ...pendingInteractiveQuiz, teamName: teamName || 'Player 1', playerPhoto, playerDetails };
                audioSynth.setVoicePreference('none');
                onQuizGenerated(finalQuiz);
              }}
              className="w-full py-4 rounded-xl bg-fuchsia-600 text-white font-bold text-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/30 transition-all flex items-center justify-center gap-2 mt-8 shadow-lg shadow-fuchsia-600/20"
            >`;

content = content.replace(oldInteractiveForm, newInteractiveForm);

fs.writeFileSync('src/components/Setup.tsx', content);
