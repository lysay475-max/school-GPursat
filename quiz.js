/**
 * CLASSROOM INTERACTIVE QUIZ & LEADERBOARD MODULE
 * (ការប្រឡងស្ទង់សមត្ថភាពអន្តរកម្ម & តារាងពិន្ទុផ្ទាល់ក្នុងថ្នាក់)
 */

class QuizModule {
  static init() {
    this.currentQuiz = null;
    this.currentIndex = 0;
    this.timer = null;
    this.timeLeft = 20;
    this.score = 0;
    this.selectedStudentId = null;

    this.setupEventListeners();
  }

  static populateQuizSubjects() {
    const subjects = StorageManager.getSubjects();
    const select = document.getElementById("quizSubjectSelect");
    if (select) {
      select.innerHTML = `<option value="all">-- មុខវិជ្ជាទាំងអស់ (Mix Subjects) --</option>` +
        subjects.map(s => `<option value="${s.id}">${s.nameKh}</option>`).join('');
    }

    const stuSelect = document.getElementById("quizStudentSelect");
    const students = StorageManager.getStudents();
    if (stuSelect) {
      stuSelect.innerHTML = `<option value="class">🎓 សាកល្បងជាថ្នាក់រៀនទាំងមូល (Class Mode)</option>` +
        students.map(s => `<option value="${s.id}">${s.code} - ${s.nameKh}</option>`).join('');
    }
  }

  static startQuiz() {
    const subjectId = document.getElementById("quizSubjectSelect").value;
    const questionsCount = parseInt(document.getElementById("quizCountSelect").value, 10) || 5;
    const allQuestions = StorageManager.getQuestions().filter(q => q.type === "mcq" && q.options && q.options.length >= 2);

    let pool = subjectId === "all" ? allQuestions : allQuestions.filter(q => q.subjectId === subjectId);
    if (pool.length === 0) {
      pool = allQuestions; // fallback
    }

    if (pool.length === 0) {
      alert("មិនទាន់មានសំណួរពហុជ្រើសរើសក្នុងធនាគារនៅឡើយទេ! សូមបញ្ចូលសំណួរក្នុងផ្ទាំង 'ធនាគារសំណួរ' ជាមុនសិន។");
      return;
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    this.currentQuiz = shuffled.slice(0, Math.min(questionsCount, shuffled.length));
    this.currentIndex = 0;
    this.score = 0;
    this.selectedStudentId = document.getElementById("quizStudentSelect").value;

    document.getElementById("quizLobbyView").style.display = "none";
    document.getElementById("quizActiveView").style.display = "block";
    document.getElementById("quizResultView").style.display = "none";

    this.renderQuestion();
  }

  static renderQuestion() {
    if (!this.currentQuiz || this.currentIndex >= this.currentQuiz.length) {
      this.finishQuiz();
      return;
    }

    const q = this.currentQuiz[this.currentIndex];
    const total = this.currentQuiz.length;

    document.getElementById("quizProgressText").innerText = `សំណួរទី ${this.currentIndex + 1} / ${total}`;
    document.getElementById("quizProgressBar").style.width = `${((this.currentIndex) / total) * 100}%`;
    document.getElementById("quizSubjectTag").innerText = q.subjectName || q.subjectId;
    document.getElementById("quizQuestionText").innerText = q.question;

    const optionsContainer = document.getElementById("quizOptionsGrid");
    optionsContainer.innerHTML = "";

    const optLetters = ["A", "B", "C", "D"];
    const cardColors = ["quiz-opt-blue", "quiz-opt-green", "quiz-opt-amber", "quiz-opt-purple"];

    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = `quiz-option-card ${cardColors[idx % 4]}`;
      btn.innerHTML = `
        <span class="quiz-opt-letter">${optLetters[idx]}</span>
        <span class="quiz-opt-text">${opt}</span>
      `;
      btn.onclick = () => this.handleAnswer(idx, q.correctAnswer);
      optionsContainer.appendChild(btn);
    });

    // Start Timer
    this.startTimer();
  }

  static startTimer() {
    clearInterval(this.timer);
    this.timeLeft = 20;
    const timerDisplay = document.getElementById("quizTimerDisplay");
    timerDisplay.innerText = this.timeLeft;
    timerDisplay.classList.remove("timer-urgent");

    this.timer = setInterval(() => {
      this.timeLeft--;
      timerDisplay.innerText = this.timeLeft;

      if (this.timeLeft <= 5) {
        timerDisplay.classList.add("timer-urgent");
      }

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.handleTimeUp();
      }
    }, 1000);
  }

  static handleAnswer(selectedIndex, correctIndex) {
    clearInterval(this.timer);
    const buttons = document.querySelectorAll(".quiz-option-card");
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIndex) {
        btn.classList.add("opt-is-correct");
      } else if (idx === selectedIndex) {
        btn.classList.add("opt-is-wrong");
      }
    });

    if (selectedIndex === correctIndex) {
      this.score += 10;
      this.playChime(true);
      App.showToast("ចម្លើយត្រឹមត្រូវ! +10 ពិន្ទុ 🎉", "success");
    } else {
      this.playChime(false);
      App.showToast("មិនត្រឹមត្រូវទេ! ចម្លើយត្រូវគឺជម្រើស " + String.fromCharCode(65 + correctIndex), "error");
    }

    setTimeout(() => {
      this.currentIndex++;
      this.renderQuestion();
    }, 2200);
  }

  static handleTimeUp() {
    const q = this.currentQuiz[this.currentIndex];
    const buttons = document.querySelectorAll(".quiz-option-card");
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctAnswer) {
        btn.classList.add("opt-is-correct");
      }
    });

    this.playChime(false);
    App.showToast("អស់ពេលហើយ! ចម្លើយត្រឹមត្រូវគឺជម្រើស " + String.fromCharCode(65 + q.correctAnswer), "warning");

    setTimeout(() => {
      this.currentIndex++;
      this.renderQuestion();
    }, 2200);
  }

  static playChime(isCorrect) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (isCorrect) {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.1); // A5
      } else {
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.setValueAtTime(200, audioCtx.currentTime + 0.15);
      }

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // AudioContext fallback
    }
  }

  static finishQuiz() {
    clearInterval(this.timer);
    document.getElementById("quizActiveView").style.display = "none";
    document.getElementById("quizResultView").style.display = "block";

    const totalQ = this.currentQuiz.length;
    const maxScore = totalQ * 10;
    const percent = Math.round((this.score / maxScore) * 100);

    document.getElementById("quizFinalScoreText").innerText = `${this.score} / ${maxScore} ពិន្ទុ (${percent}%)`;
    
    let comment = "";
    if (percent >= 80) comment = "🌟 អស្ចារ្យណាស់! ឆ្លើយត្រូវស្ទើរតែទាំងអស់!";
    else if (percent >= 50) comment = "👍 ល្អបង្គួរ! ព្យាយាមបន្ថែមទៀតដើម្បីទទួលបានលទ្ធផលកាន់តែល្អ!";
    else comment = "💪 ត្រូវខិតខំរំលឹកមេរៀនឡើងវិញបន្ថែមទៀត!";

    document.getElementById("quizResultComment").innerText = comment;

    if (percent >= 70 && typeof confetti === "function") {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }

  static restartLobby() {
    document.getElementById("quizLobbyView").style.display = "block";
    document.getElementById("quizActiveView").style.display = "none";
    document.getElementById("quizResultView").style.display = "none";
  }

  static setupEventListeners() {
    const startBtn = document.getElementById("btnStartClassQuiz");
    if (startBtn) startBtn.addEventListener("click", () => this.startQuiz());

    const restartBtn = document.getElementById("btnQuizRestart");
    if (restartBtn) restartBtn.addEventListener("click", () => this.restartLobby());
  }
}
