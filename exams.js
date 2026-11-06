/**
 * QUESTION BANK & EXAM GENERATOR MODULE (ធនាគារសំណួរ និងបង្កើតវិញ្ញាសាប្រឡង)
 */

class ExamManager {
  static init() {
    this.renderQuestionBank();
    this.populateSubjectFilters();
    this.setupEventListeners();
  }

  static populateSubjectFilters() {
    const subjects = StorageManager.getSubjects();
    const select = document.getElementById("examSubjectFilter");
    const genSelect = document.getElementById("genExamSubject");
    const modalSelect = document.getElementById("qModalSubject");

    if (select) {
      select.innerHTML = `<option value="all">-- មុខវិជ្ជាទាំងអស់ --</option>` +
        subjects.map(s => `<option value="${s.id}">${s.nameKh}</option>`).join('');
    }

    if (genSelect) {
      genSelect.innerHTML = subjects.map(s => `<option value="${s.id}">${s.nameKh}</option>`).join('');
    }

    if (modalSelect) {
      modalSelect.innerHTML = subjects.map(s => `<option value="${s.id}">${s.nameKh}</option>`).join('');
    }
  }

  static renderQuestionBank() {
    const listContainer = document.getElementById("questionBankList");
    if (!listContainer) return;

    const questions = StorageManager.getQuestions();
    const filterSubject = document.getElementById("examSubjectFilter") ? document.getElementById("examSubjectFilter").value : "all";
    const filterSearch = (document.getElementById("examSearchInput") ? document.getElementById("examSearchInput").value : "").toLowerCase().trim();

    const filtered = questions.filter(q => {
      const matchSub = filterSubject === "all" || q.subjectId === filterSubject;
      const matchText = !filterSearch || q.question.toLowerCase().includes(filterSearch) || (q.subjectName && q.subjectName.toLowerCase().includes(filterSearch));
      return matchSub && matchText;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state-box">
          <i class="fa-solid fa-file-circle-question fa-3x text-muted mb-2"></i>
          <h4>មិនមានសំណួរក្នុងធនាគារនៅឡើយទេ</h4>
          <p class="text-muted">សូមចុចប៊ូតុង "បន្ថែមសំណួរថ្មី" ដើម្បីបញ្ចូលសំណួរ និងចម្លើយ។</p>
        </div>
      `;
      return;
    }

    let html = `<div class="question-cards-grid">`;
    filtered.forEach((q, idx) => {
      const typeBadge = q.type === "mcq" ? `<span class="badge badge-info"><i class="fa-solid fa-list-check"></i> ពហុជ្រើសរើស (MCQ)</span>` : `<span class="badge badge-warning"><i class="fa-solid fa-pen-fancy"></i> សរសេររៀបរាប់/លំហាត់</span>`;
      
      let optionsHtml = "";
      if (q.type === "mcq" && q.options) {
        optionsHtml = `
          <div class="q-options-list">
            ${q.options.map((opt, oIdx) => `
              <div class="q-opt-item ${oIdx === q.correctAnswer ? 'opt-correct' : ''}">
                <span class="opt-label">${String.fromCharCode(65 + oIdx)}.</span>
                <span class="opt-text">${opt}</span>
                ${oIdx === q.correctAnswer ? '<i class="fa-solid fa-check text-success ml-auto"></i>' : ''}
              </div>
            `).join('')}
          </div>
        `;
      } else if (q.correctAnswer) {
        optionsHtml = `
          <div class="q-answer-box">
            <strong>ចម្លើយត្រឹមត្រូវ / ដំណោះស្រាយ៖</strong> ${q.correctAnswer}
          </div>
        `;
      }

      html += `
        <div class="question-card" id="qcard-${q.id}">
          <div class="qcard-header">
            <div>
              <span class="q-subject-pill">${q.subjectName || q.subjectId}</span>
              ${typeBadge}
            </div>
            <div class="q-points-tag"><i class="fa-solid fa-star"></i> ${q.points || 2} ពិន្ទុ</div>
          </div>
          <div class="qcard-body">
            <h4 class="q-text"><span class="q-num">សំណួរទី ${idx + 1}៖</span> ${q.question}</h4>
            ${optionsHtml}
          </div>
          <div class="qcard-footer">
            <label class="q-select-chk">
              <input type="checkbox" class="exam-select-q" value="${q.id}"> រើសយកដាក់ក្នុងវិញ្ញាសា
            </label>
            <button class="btn btn-sm btn-outline text-danger" onclick="ExamManager.deleteQuestion('${q.id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    listContainer.innerHTML = html;
  }

  static openAddModal() {
    document.getElementById("addQuestionModal").classList.add("active");
  }

  static toggleQuestionTypeFields() {
    const type = document.getElementById("qModalType").value;
    const mcqBox = document.getElementById("mcqOptionsBox");
    const essayBox = document.getElementById("essayAnswerBox");

    if (type === "mcq") {
      if (mcqBox) mcqBox.style.display = "block";
      if (essayBox) essayBox.style.display = "none";
    } else {
      if (mcqBox) mcqBox.style.display = "none";
      if (essayBox) essayBox.style.display = "block";
    }
  }

  static saveNewQuestion() {
    const subjectId = document.getElementById("qModalSubject").value;
    const subjects = StorageManager.getSubjects();
    const subObj = subjects.find(s => s.id === subjectId);
    const subjectName = subObj ? subObj.nameKh : subjectId;

    const type = document.getElementById("qModalType").value;
    const questionText = document.getElementById("qModalText").value.trim();
    const points = parseFloat(document.getElementById("qModalPoints").value) || 2;

    if (!questionText) {
      alert("សូមបញ្ចូលខ្លឹមសារសំណួរ!");
      return;
    }

    const newQ = {
      id: "Q-" + Date.now().toString(36).toUpperCase(),
      subjectId,
      subjectName,
      type,
      question: questionText,
      points
    };

    if (type === "mcq") {
      const optA = document.getElementById("qOptA").value.trim();
      const optB = document.getElementById("qOptB").value.trim();
      const optC = document.getElementById("qOptC").value.trim();
      const optD = document.getElementById("qOptD").value.trim();
      const correct = parseInt(document.getElementById("qCorrectOpt").value, 10);

      if (!optA || !optB) {
        alert("សូមបញ្ចូលជម្រើសយ៉ាងតិច ២ (A និង B)!");
        return;
      }

      newQ.options = [optA, optB, optC, optD].filter(Boolean);
      newQ.correctAnswer = correct;
    } else {
      newQ.correctAnswer = document.getElementById("qEssayAnswer").value.trim();
    }

    const questions = StorageManager.getQuestions();
    questions.push(newQ);
    StorageManager.saveQuestions(questions);

    this.renderQuestionBank();
    document.getElementById("addQuestionModal").classList.remove("active");
    // Clear form
    document.getElementById("qModalText").value = "";
    document.getElementById("qEssayAnswer").value = "";
    App.showToast("បានបន្ថែមសំណួរថ្មីទៅក្នុងធនាគារដោយជោគជ័យ!", "success");
  }

  static deleteQuestion(qId) {
    if (!confirm("តើអ្នកពិតជាចង់លុបសំណួរនេះមែនទេ?")) return;
    let questions = StorageManager.getQuestions();
    questions = questions.filter(q => q.id !== qId);
    StorageManager.saveQuestions(questions);
    this.renderQuestionBank();
    App.showToast("បានលុបសំណួររួចរាល់!", "info");
  }

  static generateExamPaper() {
    const selectedSubject = document.getElementById("genExamSubject").value;
    const title = document.getElementById("genExamTitle").value || "វិញ្ញាសាប្រឡង";
    const duration = document.getElementById("genExamDuration").value || "៦០ នាទី";
    const schoolInfo = StorageManager.getSchoolInfo();
    const subjects = StorageManager.getSubjects();
    const subObj = subjects.find(s => s.id === selectedSubject);
    const subName = subObj ? subObj.nameKh : selectedSubject;

    // Get checked questions, or auto-pick all questions for this subject
    const checked = Array.from(document.querySelectorAll(".exam-select-q:checked")).map(el => el.value);
    const allQuestions = StorageManager.getQuestions();
    let examQuestions = [];

    if (checked.length > 0) {
      examQuestions = allQuestions.filter(q => checked.includes(q.id));
    } else {
      // Auto pick questions for this subject
      examQuestions = allQuestions.filter(q => q.subjectId === selectedSubject);
      if (examQuestions.length === 0) {
        // Fallback pick all
        examQuestions = allQuestions;
      }
    }

    if (examQuestions.length === 0) {
      alert("មិនមានសំណួរសម្រាប់បង្កើតវិញ្ញាសាទេ! សូមបញ្ចូលសំណួរជាមុនសិន។");
      return;
    }

    const totalPoints = examQuestions.reduce((acc, q) => acc + (q.points || 2), 0);

    const container = document.getElementById("examPrintPreview");
    if (!container) return;

    let questionsHtml = "";
    let answerKeyHtml = "";

    examQuestions.forEach((q, idx) => {
      let optText = "";
      if (q.type === "mcq" && q.options) {
        optText = `
          <div class="exam-opts-grid">
            ${q.options.map((opt, oIdx) => `
              <div class="exam-opt-item"><strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}</div>
            `).join('')}
          </div>
        `;
      }

      questionsHtml += `
        <div class="exam-item-print">
          <div class="exam-item-title">
            <strong>សំណួរទី ${idx + 1} (${q.points || 2} ពិន្ទុ)៖</strong> ${q.question}
          </div>
          ${optText}
          <div class="exam-answer-line-space"></div>
        </div>
      `;

      // Answer key
      let ansVal = "";
      if (q.type === "mcq" && q.options) {
        ansVal = `${String.fromCharCode(65 + q.correctAnswer)} (${q.options[q.correctAnswer] || ''})`;
      } else {
        ansVal = q.correctAnswer || "គ្មានចម្លើយគំរូ";
      }

      answerKeyHtml += `
        <tr>
          <td style="text-align:center; font-weight:bold;">${idx + 1}</td>
          <td>${q.question}</td>
          <td style="text-align:center; font-weight:bold; color: #0284c7;">${q.points || 2}</td>
          <td style="color: #16a34a; font-weight:600;">${ansVal}</td>
        </tr>
      `;
    });

    container.innerHTML = `
      <div class="official-exam-sheet">
        <!-- Ministry Header -->
        <div class="exam-top-header">
          <div class="exam-header-left">
            <div>ក្រសួងអប់រំ យុវជន និងកីឡា</div>
            <div>${schoolInfo.nameKh}</div>
            <div>បន្ទុកថ្នាក់៖ <strong>${StorageManager.getSchoolInfo().className || '៨A'}</strong></div>
          </div>
          <div class="exam-header-center">
            <div class="moul-title">ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div class="moul-sub">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
            <div class="kh-decorative-bar">🙣 🙡 🙢 🙠</div>
          </div>
          <div class="exam-header-right">
            <div>កាលបរិច្ឆេទ៖ ....................</div>
            <div>រយៈពេល៖ <strong>${duration}</strong></div>
            <div>ពិន្ទុសរុប៖ <strong>${totalPoints} ពិន្ទុ</strong></div>
          </div>
        </div>

        <div class="exam-title-banner">
          <h2 class="moul-title text-primary">${title}</h2>
          <h3 class="exam-sub-title font-khmer">មុខវិជ្ជា៖ <strong>${subName}</strong></h3>
        </div>

        <div class="student-exam-info-fill">
          <span>គោត្តនាម និងនាមសិស្ស៖ .....................................................................</span>
          <span>ភេទ៖ ...............</span>
          <span>លេខតុ៖ ...............</span>
        </div>

        <div class="exam-body-questions">
          ${questionsHtml}
        </div>

        <div class="exam-footer-note">
          <p><em>* សិស្សមិនត្រូវបានអនុញ្ញាតឱ្យប្រើប្រាស់ឯកសារ ឬឧបករណ៍អេឡិចត្រូនិកក្នុងបន្ទប់ប្រឡងឡើយ។</em></p>
        </div>
      </div>

      <!-- ANSWER KEY SHEET (កម្រងចម្លើយ និងបំណែងចែកពិន្ទុសម្រាប់គ្រូ) -->
      <div class="official-exam-sheet page-break mt-5">
        <div class="exam-top-header">
          <div class="exam-header-left">
            <div>${schoolInfo.nameKh}</div>
            <div>ឯកសារសម្ងាត់គ្រូបង្រៀន</div>
          </div>
          <div class="exam-header-center">
            <div class="moul-title">កម្រងចម្លើយ និងបំណែងចែកពិន្ទុ (ANSWER KEY)</div>
            <div class="font-khmer">មុខវិជ្ជា៖ ${subName} • ${title}</div>
          </div>
          <div class="exam-header-right">
            <div>ពិន្ទុសរុប៖ <strong>${totalPoints}</strong></div>
          </div>
        </div>

        <table class="table-report mt-3" style="width:100%;">
          <thead>
            <tr>
              <th style="width:60px;">ល.រ</th>
              <th>ខ្លឹមសារសំណួរ</th>
              <th style="width:80px;">ពិន្ទុ</th>
              <th>ចម្លើយត្រឹមត្រូវ / អត្រាកំណែ</th>
            </tr>
          </thead>
          <tbody>
            ${answerKeyHtml}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById("examPreviewModal").classList.add("active");
  }

  static printExam() {
    window.print();
  }

  static setupEventListeners() {
    const filterSub = document.getElementById("examSubjectFilter");
    if (filterSub) filterSub.addEventListener("change", () => this.renderQuestionBank());

    const searchInput = document.getElementById("examSearchInput");
    if (searchInput) searchInput.addEventListener("input", () => this.renderQuestionBank());

    const btnAdd = document.getElementById("btnOpenAddQuestion");
    if (btnAdd) btnAdd.addEventListener("click", () => this.openAddModal());

    const qTypeSelect = document.getElementById("qModalType");
    if (qTypeSelect) qTypeSelect.addEventListener("change", () => this.toggleQuestionTypeFields());

    const btnSaveQ = document.getElementById("btnSaveQuestion");
    if (btnSaveQ) btnSaveQ.addEventListener("click", () => this.saveNewQuestion());

    const btnCloseAdd = document.getElementById("closeAddQModal");
    if (btnCloseAdd) btnCloseAdd.addEventListener("click", () => {
      document.getElementById("addQuestionModal").classList.remove("active");
    });

    const btnGen = document.getElementById("btnGenerateExam");
    if (btnGen) btnGen.addEventListener("click", () => this.generateExamPaper());

    const btnPrint = document.getElementById("btnPrintExamPaper");
    if (btnPrint) btnPrint.addEventListener("click", () => this.printExam());

    const btnClosePrev = document.getElementById("closeExamPrevModal");
    if (btnClosePrev) btnClosePrev.addEventListener("click", () => {
      document.getElementById("examPreviewModal").classList.remove("active");
    });
  }
}
