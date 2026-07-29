const fs = require('fs');
let content = fs.readFileSync('src/lib/audio.ts', 'utf8');

const replacement = `class AudioSynth {
  private ctx: AudioContext | null = null;
  musicEnabled: boolean = true;
  
  private html5Correct: HTMLAudioElement | null = null;
  private html5Badge: HTMLAudioElement | null = null;
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.html5Correct = new Audio('https://actions.google.com/sounds/v1/cartoon/magic_chime_chord.ogg');
      this.html5Correct.volume = 0.6;
      this.html5Badge = new Audio('https://actions.google.com/sounds/v1/human_voices/human_crowd_cheer.ogg');
      this.html5Badge.volume = 0.5;
    }
  }

  playHTML5Correct() {
    if (!this.musicEnabled || !this.html5Correct) return;
    this.html5Correct.currentTime = 0;
    this.html5Correct.play().catch(e => console.warn('HTML5 Audio Correct Error:', e));
  }

  playHTML5Badge() {
    if (!this.musicEnabled || !this.html5Badge) return;
    this.html5Badge.currentTime = 0;
    this.html5Badge.play().catch(e => console.warn('HTML5 Audio Badge Error:', e));
  }

  setMusicPreference(enabled: boolean) {`;

content = content.replace("class AudioSynth {\n  private ctx: AudioContext | null = null;\n  musicEnabled: boolean = true;\n  setMusicPreference(enabled: boolean) {", replacement);

fs.writeFileSync('src/lib/audio.ts', content);
