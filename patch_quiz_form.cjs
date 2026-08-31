const fs = require('fs');
let code = fs.readFileSync('src/components/Setup.tsx', 'utf8');

// Replace the main quiz form tag
code = code.replace(
  '<form onSubmit={(e) => handleGenerate(e, \'video\')} className="p-8 space-y-6">',
  '<form onSubmit={(e) => handleGenerate(e, \'video\')} className="p-8 lg:p-12 space-y-8 max-w-4xl mx-auto w-full">'
);

// Modernize the input fields in the Quiz Form
code = code.replace(/className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-neutral-400"/g, 
'className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 bg-slate-50/50 text-slate-800 text-lg font-medium"');

// Modernize select elements
code = code.replace(/className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"/g, 
'className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50 text-slate-800 text-lg font-medium cursor-pointer"');

// And other select elements
code = code.replace(/className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500\/30 bg-white"/g,
'className="w-full px-5 py-4 rounded-2xl border-2 border-indigo-200 hover:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all bg-indigo-50/30 text-indigo-900 text-lg font-bold cursor-pointer"');

// Give labels a stronger look
code = code.replace(/text-sm font-semibold text-neutral-700/g, 'text-sm font-bold text-slate-700 uppercase tracking-wider');

fs.writeFileSync('src/components/Setup.tsx', code);
console.log("Done");
