import React, { useMemo, useState, useEffect } from 'react';
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
  { bg: 'bg-rose-500',   text: 'text-white',  pill: 'bg-rose-500',   border: 'border-rose-400'   },
  { bg: 'bg-sky-500',    text: 'text-white',  pill: 'bg-sky-500',    border: 'border-sky-400'    },
  { bg: 'bg-amber-400',  text: 'text-slate-900', pill: 'bg-amber-400',  border: 'border-amber-300'  },
  { bg: 'bg-emerald-500',text: 'text-white',  pill: 'bg-emerald-500',border: 'border-emerald-400'},
  { bg: 'bg-purple-500', text: 'text-white',  pill: 'bg-purple-500', border: 'border-purple-400' },
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

  const [revealedWordsCount, setRevealedWordsCount] = useState(0);

  useEffect(() => {
    if (!isReveal) {
      setRevealedWordsCount(0);
      return;
    }
    const interval = setInterval(() => {
      setRevealedWordsCount((prev) => {
        if (prev < words.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isReveal, words.length]);

  /** Map each cell key → word index (first word wins if overlap) */
  const cellColourMap = useMemo<Map<string, number>>(() => {
    const map = new Map<string, number>();
    if (!isReveal) return map;
    
    words.slice(0, revealedWordsCount).forEach((w, wIdx) => {
      const cells = getCellsForWord(w);
      cells.forEach(key => {
        if (!map.has(key)) map.set(key, wIdx);
      });
    });
    return map;
  }, [isReveal, words, revealedWordsCount]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto">
      {/* Grid */}
      <div
        className="grid gap-2 p-4 sm:p-6 bg-white/10 backdrop-blur-md rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.2)] border border-white/20"
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
                animate={isHighlighted ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] } : {}}
                transition={{ duration: 0.5, type: 'spring' }}
                className={[
                  'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24',
                  'flex items-center justify-center',
                  'rounded-2xl font-black text-2xl sm:text-3xl md:text-5xl lg:text-6xl uppercase',
                  'transition-all duration-300 transform',
                  isHighlighted && colour
                    ? `${colour.bg} ${colour.text} ${colour.border} shadow-[0_0_20px_rgba(0,0,0,0.4)] ring-4 ring-white/60 z-10 scale-105`
                    : 'bg-white/90 text-slate-800 shadow-md hover:bg-white',
                ].join(' ')}
              >
                {letter}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Word list */}
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {words.map((w, idx) => {
          const colour = WORD_COLOURS[idx % WORD_COLOURS.length];
          const isWordRevealed = isReveal && idx < revealedWordsCount;
          return (
             <motion.div
              key={w.word}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, scale: isWordRevealed ? 1.1 : 1 }}
              transition={{ delay: idx * 0.1, type: 'spring' }}
              className={[
                'px-6 py-3 rounded-2xl font-black text-2xl md:text-3xl border shadow-xl transition-all duration-500',
                isWordRevealed
                  ? `${colour.bg} ${colour.text} ${colour.border} ring-4 ring-white/40 scale-110`
                  : 'bg-white/10 text-white/80 border-white/20 backdrop-blur-md',
              ].join(' ')}
            >
              {isWordRevealed ? w.word : `WORD ${idx + 1}`}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
