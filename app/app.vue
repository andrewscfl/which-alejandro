<template>
  <div class="quiz-container">
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
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(10px);
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
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border: 2px solid rgba(240, 240, 240, 0.8);
  backdrop-filter: blur(10px);
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
  backdrop-filter: blur(5px);
}

.answer-button:hover {
  background: rgba(248, 249, 250, 0.95);
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,123,255,0.2);
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
  backdrop-filter: blur(10px);
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
