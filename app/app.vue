<template>
  <div v-if="view === 'menu'" class="menu-container">
    <h1 class="menu-title">Choose Your Experience</h1>
    <div class="menu-cards">
      <div class="menu-card" @click="view = 'quiz'">
        <span class="menu-card-emoji">🧍</span>
        <h2>Wide Test</h2>
        <p>Which Alejandro are you?</p>
      </div>
      <div class="menu-card" @click="view = 'pooks'">
        <span class="menu-card-emoji">🚪</span>
        <h2>Pooks Countdown</h2>
        <p>He's on his way.</p>
      </div>
    </div>
  </div>

  <div v-else-if="view === 'pooks'" class="pooks-scene">
    <button class="pooks-back" @click="view = 'menu'">← Back</button>
    <div class="countdown">
      <div v-for="unit in countdownUnits" :key="unit.label" class="countdown-unit">
        <span class="countdown-number">{{ unit.value }}</span>
        <span class="countdown-label">{{ unit.label }}</span>
      </div>
    </div>
    <div class="doorway">
      <div class="door-frame">
        <div class="outside">
          <div class="sky">
            <div v-for="(s, i) in stars" :key="i" class="star" :style="s"></div>
            <div class="moon"></div>
          </div>
          <div class="ground">
            <div class="path"></div>
          </div>
          <img
            :src="getAssetUrl('/pooks/pooks.png')"
            alt="Pooks"
            class="pooks-walker"
            :style="pooksStyle"
          />
        </div>
        <div class="door-left"></div>
        <div class="door-threshold"></div>
      </div>
    </div>
    <p v-if="pooksProgress >= 1" class="pooks-arrived">POOKS HAS ARRIVED</p>
  </div>

  <div v-else class="quiz-container">
    <!-- Floating background images -->
    <div class="floating-background">
      <img v-for="n in 12" :key="n" 
           :src="getAssetUrl('/wides/chillwide.png')" 
           :class="`floating-wide floating-wide-${n}`"
           alt="Floating Wide" />
    </div>
    
    <div v-if="!showResult" class="quiz-section">
      <div class="collection-counter">
        <span class="collection-text">Wide Collection: {{ collectedWides.size }}/{{ totalWides }}</span>
        <div class="collection-icons">
          <span v-for="wide in wideInfo" :key="wide.title" 
                :class="['wide-icon', { collected: collectedWides.has(wide.title) }]"
                :title="wide.title">
            {{ collectedWides.has(wide.title) ? '✅' : '❌' }}
          </span>
        </div>
      </div>
      
      <h1 class="quiz-title">Which Alejandro Are You?</h1>
      <div class="progress-bar">
        <div class="progress" :style="{ width: (currentQuestion / questions.length) * 100 + '%' }"></div>
      </div>
      <div class="question-counter">
        Question {{ currentQuestion + 1 }} of {{ questions.length }}
      </div>
      
      <div v-if="currentQuestion < questions.length && questions[currentQuestion]" class="question-card">
        <h2 class="question-text">{{ questions[currentQuestion].question }}</h2>
        <div class="answers">
          <button
            v-for="(answer, index) in questions[currentQuestion].answers"
            :key="index"
            @click="selectAnswer(answer)"
            class="answer-button"
          >
            {{ answer.text }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="result-section">
      <div class="collection-counter">
        <span class="collection-text">Wide Collection: {{ collectedWides.size }}/{{ totalWides }}</span>
        <div class="collection-icons">
          <span v-for="wide in wideInfo" :key="wide.title" 
                :class="['wide-icon', { collected: collectedWides.has(wide.title) }]"
                :title="wide.title">
            {{ collectedWides.has(wide.title) ? '✅' : '❌' }}
          </span>
        </div>
      </div>
      
      <h1 class="result-title">Your Wide Type:</h1>
      <div class="result-card">
        <img :src="getAssetUrl(result.image)" :alt="result.title" class="result-image" />
        <h2 class="result-name">{{ result.title }}</h2>
        <p class="result-description">{{ result.description }}</p>
        
        <div class="stats">
          <h3>Your Stats:</h3>
          <div class="stat-bars">
            <div v-for="(value, stat) in displayStats" :key="stat" class="stat-row">
              <span class="stat-label">{{ formatStatName(stat) }}:</span>
              <div class="stat-bar">
                <div class="stat-fill" :style="{ width: getStatPercentage(value || 0) + '%' }"></div>
              </div>
              <span class="stat-value">{{ formatStatValue(value || 0) }}</span>
            </div>
          </div>
        </div>
        
        <button @click="resetQuiz" class="reset-button">Take Quiz Again</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import wideInfo from './data/wideinfo';
import questions from './data/questions'; 

interface Scores {
  creative: number;
  chill: number;
  angry: number;
  suspicious: number;
  golden?: number;
}

const view = ref<'menu' | 'quiz' | 'pooks'>('menu');

// Pooks countdown — arrival: Aug 8 2026 6PM ET, journey starts Aug 4 2026
const POOKS_START = new Date('2026-08-04T00:00:00-04:00').getTime();
const POOKS_ARRIVAL = new Date('2026-08-08T11:00:00-04:00').getTime();
const now = ref(Date.now());
let pooksTimer: ReturnType<typeof setInterval> | undefined;

const countdownUnits = computed(() => {
  const remaining = Math.max(0, POOKS_ARRIVAL - now.value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return [
    { label: 'DAYS', value: pad(Math.floor(remaining / 86400000)) },
    { label: 'HOURS', value: pad(Math.floor(remaining / 3600000) % 24) },
    { label: 'MINUTES', value: pad(Math.floor(remaining / 60000) % 60) },
    { label: 'SECONDS', value: pad(Math.floor(remaining / 1000) % 60) },
  ];
});

const pooksProgress = computed(() =>
  Math.min(1, Math.max(0, (now.value - POOKS_START) / (POOKS_ARRIVAL - POOKS_START)))
);

const stars = Array.from({ length: 40 }, (_, i) => ({
  left: `${(i * 37 + 13) % 100}%`,
  top: `${(i * 53 + 7) % 55}%`,
  animationDelay: `${(i % 7) * 0.6}s`,
}));

const pooksStyle = computed(() => {
  const p = pooksProgress.value;
  // Exponential scale sells the perspective: tiny speck far away, full size at the door
  const scale = 0.06 * Math.pow(1 / 0.06, p);
  return {
    transform: `translateX(-50%) scale(${scale})`,
    bottom: `${34 - p * 30}%`,
    filter: `blur(${(1 - p) * 1.5}px) brightness(${0.5 + p * 0.5})`,
  };
});

const currentQuestion = ref(0);
const scores = ref<Scores>({
  creative: 0,
  chill: 0,
  angry: 0,
  suspicious: 0,
  golden: 0
});
const showResult = ref(false);
const result = ref<any>(null);

// Collection tracking
const collectedWides = ref<Set<string>>(new Set());
const totalWides = computed(() => wideInfo.length);

// Load collected wides from localStorage on component mount
onMounted(() => {
  pooksTimer = setInterval(() => { now.value = Date.now(); }, 1000);
  const saved = localStorage.getItem('wide-collection');
  if (saved) {
    try {
      const savedArray = JSON.parse(saved);
      collectedWides.value = new Set(savedArray);
    } catch (e) {
      console.error('Failed to load collection from localStorage:', e);
    }
  }
});

onUnmounted(() => clearInterval(pooksTimer));

// Save to localStorage when collection changes
const saveCollection = () => {
  try {
    localStorage.setItem('wide-collection', JSON.stringify([...collectedWides.value]));
  } catch (e) {
    console.error('Failed to save collection to localStorage:', e);
  }
};

const selectAnswer = (answer: any) => {
  // Add weights to scores
  Object.keys(answer.weights).forEach(key => {
    if (scores.value[key as keyof Scores] !== undefined) {
      scores.value[key as keyof Scores] += answer.weights[key];
    }
  });

  currentQuestion.value++;
  
  if (currentQuestion.value >= questions.length) {
    calculateResult();
  }
};

const calculateResult = () => {
  let bestMatch = wideInfo[0];
  let bestScore = -1;

  wideInfo.forEach(wide => {
    let score = 0;
    
    // Special handling for Golden Wide - requires ALL golden answers (70 points)
    if (wide.title === 'Golden Wide' && scores.value.golden && scores.value.golden >= 70) {
      bestMatch = wide;
      bestScore = Number.MAX_VALUE;
      return;
    }
    
    // Calculate similarity score for other types
    if (wide.title !== 'Golden Wide') {
      Object.keys(scores.value).forEach(stat => {
        if (stat !== 'golden' && wide.stats[stat as keyof typeof wide.stats] !== undefined) {
          const userStat = scores.value[stat as keyof Scores] || 0;
          const wideStat = wide.stats[stat as keyof typeof wide.stats];
          
          // Calculate inverse of difference (higher score = better match)
          if (typeof wideStat === 'number') {
            const difference = Math.abs(userStat - wideStat);
            score += Math.max(0, 100 - difference);
          }
        }
      });
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = wide;
      }
    }
  });

  result.value = bestMatch;
  
  // Add to collection if it's a new result
  if (bestMatch && !collectedWides.value.has(bestMatch.title)) {
    collectedWides.value.add(bestMatch.title);
    saveCollection();
  }
  
  showResult.value = true;
};

const displayStats = computed(() => {
  const stats = { ...scores.value };
  if (stats.golden === 0) {
    delete stats.golden;
  }
  return stats;
});

const formatStatName = (stat: string) => {
  return stat.charAt(0).toUpperCase() + stat.slice(1);
};

const formatStatValue = (value: number) => {
  if (value === Number.MAX_VALUE) return '∞';
  return value.toString();
};

const getStatPercentage = (value: number) => {
  if (value === Number.MAX_VALUE) return 100;
  return Math.min(100, (value / 100) * 100);
};

const resetQuiz = () => {
  currentQuestion.value = 0;
  scores.value = {
    creative: 0,
    chill: 0,
    angry: 0,
    suspicious: 0,
    golden: 0
  };
  showResult.value = false;
  result.value = null;
};

// Helper function to get proper asset URLs for GitHub Pages
const getAssetUrl = (path: string) => {
  // In development, use the path as-is
  if (process.dev) {
    return path;
  }
  // In production (GitHub Pages), prepend the base URL
  const baseURL = '/which-alejandro';
  return path.startsWith('/') ? baseURL + path : path;
};
</script>

<style scoped>
/* ---------- Menu ---------- */
.menu-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.menu-title {
  font-size: 2.5rem;
  color: #333;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  text-align: center;
}

.menu-cards {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.menu-card {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #ddd;
  border-radius: 20px;
  padding: 40px 50px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  width: 260px;
}

.menu-card:hover {
  transform: translateY(-5px);
  border-color: #007bff;
  box-shadow: 0 12px 40px rgba(0,123,255,0.25);
}

.menu-card-emoji {
  font-size: 3.5rem;
  display: block;
  margin-bottom: 15px;
}

.menu-card h2 {
  color: #333;
  margin-bottom: 10px;
}

.menu-card p {
  color: #666;
}

/* ---------- Pooks Countdown ---------- */
.pooks-scene {
  position: fixed;
  inset: 0;
  background: #050508;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
  z-index: 1000;
}

.pooks-back {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255,255,255,0.1);
  color: #ccc;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  z-index: 10;
}

.countdown {
  display: flex;
  gap: clamp(12px, 4vw, 40px);
  padding: 30px 10px 10px;
}

.countdown-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.countdown-number {
  font-size: clamp(3rem, 12vw, 7rem);
  font-weight: 900;
  color: #fff;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 20px rgba(255, 200, 80, 0.8), 0 0 60px rgba(255, 140, 0, 0.4);
  line-height: 1;
}

.countdown-label {
  font-size: clamp(0.6rem, 2vw, 1rem);
  letter-spacing: 0.3em;
  color: rgba(255, 200, 80, 0.7);
  margin-top: 8px;
}

.doorway {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  perspective: 900px;
  padding-bottom: 4vh;
}

.door-frame {
  position: relative;
  width: min(64vw, 52vh);
  height: min(110vw, 82vh);
  border: 22px solid #2b1a10;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  box-shadow:
    0 0 0 10px #17100a,
    0 0 80px rgba(255, 180, 90, 0.12),
    inset 0 0 60px rgba(0,0,0,0.8);
  overflow: hidden;
  background: #000;
}

.outside {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.sky {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 62%;
  background: linear-gradient(180deg, #04040f 0%, #0a1030 55%, #1b2c55 90%, #33456e 100%);
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #fff;
  border-radius: 50%;
  animation: twinkle 3s infinite ease-in-out;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.moon {
  position: absolute;
  top: 12%;
  right: 15%;
  width: 14%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fdf6e3, #cfc9a8);
  box-shadow: 0 0 40px 10px rgba(253, 246, 227, 0.35);
}

.ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 38%;
  background: linear-gradient(180deg, #16241a 0%, #0d150f 60%, #070b08 100%);
}

.path {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #4a3b28 0%, #6b573c 100%);
  clip-path: polygon(46% 0, 54% 0, 100% 100%, 0 100%);
  opacity: 0.85;
}

.pooks-walker {
  position: absolute;
  left: 50%;
  width: 70%;
  transform-origin: bottom center;
  transition: transform 1s linear, bottom 1s linear, filter 1s linear;
  animation: pooks-sway 2.4s infinite ease-in-out;
}

@keyframes pooks-sway {
  0%, 100% { margin-left: -0.4%; }
  50% { margin-left: 0.4%; }
}

.door-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 16%;
  height: 100%;
  background: linear-gradient(90deg, #3d2817 0%, #2b1a10 70%, #170e07 100%);
  transform: perspective(600px) rotateY(52deg);
  transform-origin: left center;
  box-shadow: 10px 0 30px rgba(0,0,0,0.7);
  border-right: 3px solid #17100a;
}

.door-threshold {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3.5%;
  background: linear-gradient(180deg, #4a3520 0%, #2b1a10 100%);
}

.pooks-arrived {
  position: absolute;
  bottom: 6vh;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: 900;
  color: #ffd54a;
  text-shadow: 0 0 30px rgba(255, 180, 0, 0.9);
  animation: twinkle 1s infinite;
  z-index: 5;
}

body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.floating-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.floating-wide {
  position: absolute;
  width: 120px;
  height: 120px;
  opacity: 0.1;
  filter: blur(1px);
  animation: float 20s infinite linear;
}

.floating-wide-1 {
  left: 10%;
  animation-delay: 0s;
  animation-duration: 25s;
}

.floating-wide-2 {
  left: 20%;
  animation-delay: -5s;
  animation-duration: 30s;
}

.floating-wide-3 {
  left: 30%;
  animation-delay: -10s;
  animation-duration: 22s;
}

.floating-wide-4 {
  left: 40%;
  animation-delay: -15s;
  animation-duration: 28s;
}

.floating-wide-5 {
  left: 50%;
  animation-delay: -20s;
  animation-duration: 24s;
}

.floating-wide-6 {
  left: 60%;
  animation-delay: -25s;
  animation-duration: 26s;
}

.floating-wide-7 {
  left: 70%;
  animation-delay: -30s;
  animation-duration: 32s;
}

.floating-wide-8 {
  left: 80%;
  animation-delay: -35s;
  animation-duration: 29s;
}

.floating-wide-9 {
  left: 90%;
  animation-delay: -40s;
  animation-duration: 27s;
}

.floating-wide-10 {
  left: 15%;
  animation-delay: -45s;
  animation-duration: 31s;
}

.floating-wide-11 {
  left: 35%;
  animation-delay: -50s;
  animation-duration: 23s;
}

.floating-wide-12 {
  left: 75%;
  animation-delay: -55s;
  animation-duration: 33s;
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg) scale(0.8);
    opacity: 0;
  }
  10% {
    opacity: 0.4;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100px) rotate(360deg) scale(1.2);
    opacity: 0;
  }
}

.quiz-section, .result-section {
  position: relative;
  z-index: 100;
  background: rgba(255, 255, 255, 0.55);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.collection-counter {
  background: rgba(0, 123, 255, 0.1);
  border: 2px solid rgba(0, 123, 255, 0.3);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
}

.collection-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #007bff;
  display: block;
  margin-bottom: 10px;
}

.collection-icons {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.wide-icon {
  font-size: 1.2rem;
  padding: 5px;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: help;
}

.wide-icon.collected {
  background: rgba(40, 167, 69, 0.2);
  border: 2px solid rgba(40, 167, 69, 0.5);
}

.wide-icon:not(.collected) {
  background: rgba(108, 117, 125, 0.2);
  border: 2px solid rgba(108, 117, 125, 0.5);
  filter: grayscale(100%);
}

.quiz-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #333;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-bottom: 10px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  transition: width 0.3s ease;
}

.question-counter {
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.1rem;
  color: #666;
}

.question-card {
  background: rgba(255, 255, 255);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border: 2px solid rgba(240, 240, 240, 0.8);
}

.question-text {
  font-size: 1.5rem;
  margin-bottom: 25px;
  text-align: center;
  color: #333;
}

.answers {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.answer-button {
  padding: 15px 20px;
  border: 2px solid #ddd;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.answer-button:hover {
  border-color: #007bff;
}

.result-section {
  text-align: center;
}

.result-title {
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #333;
}

.result-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 6px 30px rgba(0,0,0,0.15);
  border: 3px solid rgba(240, 240, 240, 0.8);
}

.result-image {
  max-width: 300px;
  max-height: 300px;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.result-name {
  font-size: 2rem;
  margin-bottom: 15px;
  color: #333;
  font-weight: bold;
}

.result-description {
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: #666;
  line-height: 1.6;
}

.stats {
  margin-bottom: 30px;
}

.stats h3 {
  margin-bottom: 20px;
  color: #333;
}

.stat-bars {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
  margin: 0 auto;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-label {
  min-width: 80px;
  text-align: right;
  font-weight: bold;
  color: #555;
}

.stat-bar {
  flex: 1;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcf7f, #4d79ff);
  transition: width 0.5s ease;
}

.stat-value {
  min-width: 40px;
  text-align: left;
  font-weight: bold;
  color: #333;
}

.reset-button {
  padding: 15px 30px;
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,123,255,0.3);
}

.reset-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,123,255,0.4);
}

@media (max-width: 600px) {
  .quiz-container {
    padding: 10px;
  }
  
  .question-card {
    padding: 20px;
  }
  
  .result-card {
    padding: 20px;
  }
  
  .result-image {
    max-width: 250px;
    max-height: 250px;
  }
  
  .stat-row {
    flex-direction: column;
    align-items: stretch;
    gap: 5px;
  }
  
  .stat-label {
    text-align: center;
  }
}
</style>
