const fs = require('fs');

function createWav(samples, sampleRate) {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write('WAVE', 8);
  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28); // Byte rate
  buffer.writeUInt16LE(2, 32); // Block align
  buffer.writeUInt16LE(16, 34); // Bits per sample
  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(samples.length * 2, 40);
  
  for (let i = 0; i < samples.length; i++) {
    // 16-bit PCM
    buffer.writeInt16LE(samples[i], 44 + i * 2);
  }
  return buffer;
}

const sampleRate = 22050;

// Correct sound (Chime / Bell)
const duration1 = 0.5;
const samples1 = new Int16Array(sampleRate * duration1);
for (let i = 0; i < samples1.length; i++) {
  const t = i / sampleRate;
  const envelope = Math.exp(-t * 5);
  // Major chord: C, E, G
  const f1 = Math.sin(2 * Math.PI * 523.25 * t);
  const f2 = Math.sin(2 * Math.PI * 659.25 * t);
  const f3 = Math.sin(2 * Math.PI * 783.99 * t);
  const mix = (f1 + f2 + f3) / 3;
  samples1[i] = mix * envelope * 32767;
}

// Badge sound (Cheer / Applause / Noise)
const duration2 = 1.5;
const samples2 = new Int16Array(sampleRate * duration2);
for (let i = 0; i < samples2.length; i++) {
  const t = i / sampleRate;
  // Fade in and out envelope
  const envelope = t < 0.2 ? (t / 0.2) : (t > 1.0 ? 1.0 - (t - 1.0) / 0.5 : 1.0);
  // White noise
  const noise = (Math.random() * 2 - 1);
  samples2[i] = noise * envelope * 10000; // not too loud
}

const b64_1 = createWav(samples1, sampleRate).toString('base64');
const b64_2 = createWav(samples2, sampleRate).toString('base64');

fs.writeFileSync('audio_base64.json', JSON.stringify({ chime: 'data:audio/wav;base64,' + b64_1, cheer: 'data:audio/wav;base64,' + b64_2 }));
console.log("Generated audio base64!");
