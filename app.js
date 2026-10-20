const QUESTION_COUNT = 10;
const MAX_LEVEL = 10;

const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-button");
const playAgainButton = document.getElementById("play-again-button");
const nextLevelButton = document.getElementById("next-level-button");
const nextButton = document.getElementById("next-button");
const answerGrid = document.getElementById("answer-grid");
const questionCount = document.getElementById("question-count");
const progressTrack = document.getElementById("progress-track");
const progressFill = document.getElementById("progress-fill");
const topicTag = document.getElementById("topic-tag");
const questionText = document.getElementById("question-text");
const questionHint = document.getElementById("question-hint");
const questionIllustration = document.getElementById("question-illustration");
const feedback = document.getElementById("feedback");
const scoreLabel = document.getElementById("score");
const starBoard = document.getElementById("star-board");
const finalScore = document.getElementById("final-score");
const resultTitle = document.getElementById("result-title");
const resultMessage = document.getElementById("result-message");
const resultMedal = document.getElementById("result-medal");
const currentLevelLabel = document.getElementById("current-level");
const resultLevelLabel = document.getElementById("result-level");
const soundToggle = document.getElementById("sound-toggle");
const soundIcon = document.getElementById("sound-icon");
const soundLabel = document.getElementById("sound-label");

const starSlots = [...starBoard.querySelectorAll(".board-star")];
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let currentLevel = 1;
const usedQuestionKeys = new Set();
let soundEnabled = true;
let audioContext;

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function createQuestionPool() {
  const topicGroups = [
    ["順數和倒數"],
    ["奇數和偶數"],
    ["比較數量"],
    ["排次序"],
    ["數的分解和合成"],
    ["基本加法"],
    ["基本減法"],
    ["0 的認識"],
    ["長度和距離", "量度活動"],
  ];
  const selectedQuestionKeys = new Set();
  const selected = topicGroups.map((topics) => {
    const candidates = window.MATH_QUESTION_BANK.filter(
      (question) =>
        topics.includes(question.topic) &&
        !selectedQuestionKeys.has(questionKey(question)),
    );
    const freshCandidates = candidates.filter(
      (question) => !usedQuestionKeys.has(questionKey(question)),
    );
    const question = shuffle(freshCandidates)[0];
    if (question) {
      selectedQuestionKeys.add(questionKey(question));
    }
    return question;
  }).filter(Boolean);
  const selectedQuestions = new Set(selected);
  const remainingQuestions = window.MATH_QUESTION_BANK.filter(
    (question) => !selectedQuestions.has(question),
  );
  const freshExtras = shuffle(
    remainingQuestions.filter((question) => !usedQuestionKeys.has(questionKey(question))),
  );
  const usedExtras = shuffle(
    remainingQuestions.filter((question) => usedQuestionKeys.has(questionKey(question))),
  );
  const extraQuestions = [...freshExtras, ...usedExtras].slice(
    0,
    QUESTION_COUNT - selected.length,
  );

  const questionPool = shuffle([...selected, ...extraQuestions]).map((question) => ({
    ...question,
    options: shuffle(question.options),
  }));

  questionPool.forEach((question) => usedQuestionKeys.add(questionKey(question)));
  return questionPool;
}

function questionKey(question) {
  return `${question.source}|${question.page}|${question.number}`;
}

function updateProgress(answeredCount) {
  progressTrack.setAttribute("aria-valuenow", String(answeredCount));
  progressFill.style.width = `${(answeredCount / QUESTION_COUNT) * 100}%`;
}

function updateStars() {
  starSlots.forEach((star, index) => {
    star.classList.toggle("earned", index < score);
  });
  starBoard.setAttribute("aria-label", `已獲得 ${score} 粒星星`);
  scoreLabel.textContent = String(score);
}

function showScreen(screenToShow) {
  [welcomeScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function renderQuestion() {
  if (currentQuestionIndex >= questions.length) {
    showResults();
    return;
  }

  const question = questions[currentQuestionIndex];
  currentLevelLabel.textContent = `第 ${currentLevel} 級`;
  questionCount.innerHTML = `第 ${currentQuestionIndex + 1} 題 <span>/ ${QUESTION_COUNT}</span>`;
  topicTag.textContent = question.topic;
  questionText.textContent = question.prompt;
  questionHint.textContent = `${question.source} 冊・第 ${question.page} 頁・第 ${question.number} 題`;
  renderQuestionIllustration(question);
  feedback.textContent = "";
  feedback.classList.remove("wrong");
  nextButton.hidden = true;
  nextButton.innerHTML =
    currentQuestionIndex === questions.length - 1
      ? "看看結果 <span aria-hidden=\"true\">➜</span>"
      : "下一題 <span aria-hidden=\"true\">➜</span>";
  answerGrid.replaceChildren();

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";
    button.dataset.answer = option;
    button.setAttribute("aria-label", `選項 ${String.fromCharCode(65 + index)}：${option}`);
    button.innerHTML = `<span class="answer-letter" aria-hidden="true">${String.fromCharCode(65 + index)}</span><span>${option}</span>`;
    button.addEventListener("click", () => chooseAnswer(button, question));
    answerGrid.append(button);
  });
}

function renderQuestionIllustration(question) {
  questionIllustration.replaceChildren();
  questionIllustration.hidden = true;

  if (question.illustration === "c-page6-student-queue") {
    renderStudentQueueIllustration(question);
    return;
  }
  if (question.illustration !== "c-page6-customer-queue") {
    return;
  }

  const illustration = document.createElement("div");
  illustration.className = "shared-illustration";
  illustration.setAttribute("role", "img");
  illustration.setAttribute(
    "aria-label",
    "原題排隊插圖：十位顧客在收銀處排隊，圖中標示林小姐和陳先生的位置",
  );

  const image = document.createElement("img");
  image.src = "assets/c1-page6-customer-queue.png";
  image.alt = "";
  image.draggable = false;

  const linLabel = document.createElement("span");
  linLabel.className = "shared-illustration-label shared-illustration-label-lin";
  linLabel.textContent = "林小姐";

  const chenLabel = document.createElement("span");
  chenLabel.className = "shared-illustration-label shared-illustration-label-chen";
  chenLabel.textContent = "陳先生";

  illustration.append(image, linLabel, chenLabel);
  questionIllustration.append(illustration);
  questionIllustration.hidden = false;
}

function renderStudentQueueIllustration(question) {
  const illustration = document.createElement("div");
  illustration.className = "student-queue-illustration";

  const title = document.createElement("strong");
  title.className = "student-queue-title";
  title.textContent = "15 個小朋友排隊";

  const instruction = document.createElement("p");
  instruction.className = "student-queue-instruction";
  instruction.textContent = "由左至右、由上而下依次數位置";

  const positions = document.createElement("ol");
  positions.className = "student-queue-positions";
  positions.setAttribute("aria-label", "15 個小朋友的排隊位置");

  for (let position = 1; position <= 15; position += 1) {
    const item = document.createElement("li");
    const isNamedChild = position === question.illustrationPosition;
    item.className = isNamedChild
      ? "student-queue-position is-highlighted"
      : "student-queue-position";
    if (isNamedChild) {
      item.setAttribute(
        "aria-label",
        position === 15
          ? `第 ${position} 位：${question.illustrationPerson}，排最後`
          : `第 ${position} 位：${question.illustrationPerson}`,
      );
    }

    const child = document.createElement("span");
    child.className = "student-queue-child";
    child.setAttribute("aria-hidden", "true");
    child.textContent = "🧒";

    const label = document.createElement("span");
    label.className = "student-queue-number";
    label.textContent = `第 ${position} 位`;

    item.append(child, label);
    if (isNamedChild) {
      const name = document.createElement("span");
      name.className = "student-queue-name";
      name.textContent = position === 15
        ? `${question.illustrationPerson}・最後`
        : question.illustrationPerson;
      item.append(name);
    }
    positions.append(item);
  }

  const note = document.createElement("small");
  note.className = "student-queue-note";
  note.textContent = "遊戲輔助示意圖，並非 PDF 原圖";

  illustration.append(title, instruction, positions, note);
  questionIllustration.append(illustration);
  questionIllustration.hidden = false;
}

function chooseAnswer(selectedButton, question) {
  if (nextButton.hidden === false) {
    return;
  }

  const isCorrect = selectedButton.dataset.answer === question.answer;
  const answerButtons = [...answerGrid.querySelectorAll(".answer-button")];
  answerButtons.forEach((button) => {
    button.disabled = true;
    if (button.dataset.answer === question.answer) {
      button.classList.add("correct");
    }
  });

  if (isCorrect) {
    score += 1;
    selectedButton.setAttribute("aria-label", `${selectedButton.getAttribute("aria-label")}，答對`);
    feedback.textContent = "答對了！你真棒！獲得一粒星星！";
    questionHint.textContent = "太厲害了，星星收進口袋！";
    playCorrectSound();
  } else {
    selectedButton.classList.add("incorrect");
    const correctOption = question.answer;
    feedback.textContent = `差一點點！正確答案是 ${correctOption}。`;
    feedback.classList.add("wrong");
    questionHint.textContent = "不用怕，記住這個小知識！";
    playGentleSound();
  }

  updateStars();
  updateProgress(currentQuestionIndex + 1);
  nextButton.hidden = false;
  nextButton.focus();
}

function startChallenge() {
  questions = createQuestionPool();
  currentQuestionIndex = 0;
  score = 0;
  updateStars();
  updateProgress(0);
  showScreen(quizScreen);
  renderQuestion();
}

function showResults() {
  showScreen(resultScreen);
  finalScore.textContent = String(score);
  resultLevelLabel.textContent =
    currentLevel === MAX_LEVEL ? "全部挑戰完成！" : `第 ${currentLevel} 級完成！`;
  nextLevelButton.hidden = currentLevel === MAX_LEVEL;

  if (currentLevel === MAX_LEVEL) {
    resultTitle.textContent = "恭喜完成全部 10 級！";
    resultMessage.textContent = "十級挑戰全數完成，你是數學小勇士！";
    resultMedal.textContent = "🏆";
  } else if (score === QUESTION_COUNT) {
    resultTitle.textContent = "滿分！太厲害了！";
    resultMessage.textContent = "十粒星星都被你收集到了！";
    resultMedal.textContent = "🏆";
  } else if (score >= 7) {
    resultTitle.textContent = "你做到了！";
    resultMessage.textContent = "你的數學星星閃閃發亮！";
    resultMedal.textContent = "🌟";
  } else if (score >= 4) {
    resultTitle.textContent = "好棒的挑戰！";
    resultMessage.textContent = "再練習幾次，你會收集更多星星！";
    resultMedal.textContent = "🎖️";
  } else {
    resultTitle.textContent = "勇敢完成挑戰！";
    resultMessage.textContent = "每次練習都會更進步，繼續加油！";
    resultMedal.textContent = "🌱";
  }

  playCelebration();
  (nextLevelButton.hidden ? playAgainButton : nextLevelButton).focus();
}

function startNextLevel() {
  if (currentLevel >= MAX_LEVEL) {
    return;
  }
  currentLevel += 1;
  startChallenge();
}

function getAudioContext() {
  if (!soundEnabled || !window.AudioContext) {
    return null;
  }

  audioContext ??= new window.AudioContext();
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  return audioContext;
}

function playTone(frequency, startTime, duration, volume, waveType = "sine") {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = waveType;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.03);
}

function playCorrectSound() {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  playTone(659.25, context.currentTime, 0.16, 0.09);
  playTone(783.99, context.currentTime + 0.1, 0.23, 0.08);
}

function playGentleSound() {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  playTone(392, context.currentTime, 0.17, 0.035, "triangle");
}

function playClaps(context) {
  const bufferLength = Math.floor(context.sampleRate * 0.8);
  const buffer = context.createBuffer(1, bufferLength, context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let index = 0; index < bufferLength; index += 1) {
    samples[index] = Math.random() * 2 - 1;
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.value = 1500;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  const startTime = context.currentTime + 0.2;
  gain.gain.setValueAtTime(0.0001, startTime);
  for (let index = 0; index < 7; index += 1) {
    const clapTime = startTime + index * 0.105;
    gain.gain.setValueAtTime(0.0001, clapTime);
    gain.gain.linearRampToValueAtTime(0.12, clapTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, clapTime + 0.065);
  }
  source.start(startTime);
  source.stop(startTime + 0.8);
}

function playCelebration() {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  const now = context.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
    playTone(frequency, now + index * 0.13, 0.42, 0.07);
  });
  playClaps(context);
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute("aria-label", soundEnabled ? "關閉音效" : "開啟音效");
  soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
  soundLabel.textContent = soundEnabled ? "音效開" : "音效關";
}

startButton.addEventListener("click", startChallenge);
playAgainButton.addEventListener("click", startChallenge);
nextLevelButton.addEventListener("click", startNextLevel);
nextButton.addEventListener("click", () => {
  currentQuestionIndex += 1;
  renderQuestion();
});
soundToggle.addEventListener("click", toggleSound);
