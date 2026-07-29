import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { WordSearchData, WordSearchWord } from '../types';

interface WordSearchQuestionProps {
  wordSearch: WordSearchData;
  isReveal: boolean;
}

const DIRECTION_DELTAS: Record<string, { dr: number; dc: number }> = {
  right:      { dr: 0,  dc: 1  },
  left:       { dr: 0,  dc: -1 },
  down:       { dr: 1,  dc: 0  },
  up:         { dr: -1, dc: 0  },
  'down-right': { dr: 1,  dc: 1  },
  'down-left':  { dr: 1,  dc: -1 },
  'up-right':   { dr: -1, dc: 1  },
  'up-left':    { dr: -1, dc: -1 },
};

/** Bright, distinguishable highlight colours for each hidden word */
const WORD_COLOURS = [
  { bg: 'bg-rose-400',   text: 'text-white',  pill: 'bg-rose-400',   border: 'border-rose-600'   },
  { bg: 'bg-sky-400',    text: 'text-white',  pill: 'bg-sky-400',    border: 'border-sky-600'    },
  { bg: 'bg-amber-400',  text: 'text-slate-900', pill: 'bg-amber-400',  border: 'border-amber-600'  },
  { bg: 'bg-emerald-400',text: 'text-white',  pill: 'bg-emerald-400',border: 'border-emerald-600'},
  { bg: 'bg-purple-400', text: 'text-white',  pill: 'bg-purple-400', border: 'border-purple-600' },
];

function getCellsForWord(w: WordSearchWord): Set<string> {
  const cells = new Set<string>();
  const delta = DIRECTION_DELTAS[w.direction];
  if (!delta) return cells;
  for (let i = 0; i < w.word.length; i++) {
    cells.add(`${w.row + delta.dr * i},${w.col + delta.dc * i}`);
  }
  return cells;
}

export default function WordSearchQuestion({ wordSearch, isReveal }: WordSearchQuestionProps) {
  const { grid, words } = wordSearch;

  /** Map each cell key → word index (first word wins if overlap) */
  const cellColourMap = useMemo<Map<string, number>>(() => {
    const map = new Map<string, number>();
    if (!isReveal) return map;
    words.forEach((w, wIdx) => {
      const cells = getCellsForWord(w);
      cells.forEach(key => {
        if (!map.has(key)) map.set(key, wIdx);
      });
    });
    return map;
  }, [isReveal, words]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">

      {/* Grid */}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${grid[0]?.length ?? 8}, 1fr)` }}
      >
        {grid.map((row, r) =>
          row.map((letter, c) => {
            const key = `${r},${c}`;
            const wordIdx = cellColourMap.get(key);
            const isHighlighted = wordIdx !== undefined;
            const colour = isHighlighted ? WORD_COLOURS[wordIdx % WORD_COLOURS.length] : null;

            return (
              <motion.div
                key={key}
                animate={isHighlighted ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.4, delay: (r * 8 + c) * 0.01 }}
                className={[
                  'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16',
                  'flex items-center justify-center',
                  'rounded-lg font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl',
                  'border-2 transition-all duration-300',
                  isHighlighted && colour
                    ? `${colour.bg} ${colour.text} ${colour.border} shadow-lg`
                    : 'bg-slate-100 text-slate-800 border-slate-300 shadow-sm',
                ].join(' ')}
              >
                {letter}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Word list */}
      <div className="flex flex-wrap gap-3 justify-center">
        {words.map((w, idx) => {
          const colour = WORD_COLOURS[idx % WORD_COLOURS.length];
          return (
            <motion.div
              key={w.word}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={[
                'px-5 py-2 rounded-full font-black text-xl md:text-2xl border-b-4 shadow-md',
                isReveal
                  ? `${colour.pill} ${colour.text} ${colour.border}`
                  : 'bg-white/20 text-white border-white/20 backdrop-blur-sm',
              ].join(' ')}
            >
              {isReveal ? w.word : `Word ${idx + 1}`}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
