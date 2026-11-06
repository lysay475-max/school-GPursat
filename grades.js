/**
 * GRADES & EVALUATION ENGINE
 * Standard Cambodian Junior High School (អនុវិទ្យាល័យ) Formula
 */

class GradesModule {
  static init() {
    this.tableBody = document.getElementById("gradesTableBody");
    this.monthSelect = document.getElementById("gradeMonthSelect");
    this.autoCalcBtn = document.getElementById("autoCalculateRankBtn");
    this.saveBtn = document.getElementById("saveGradesBtn");
    this.exportBtn = document.getElementById("exportGradesExcelBtn");

    this.bindEvents();
    this.render();
  }

  static bindEvents() {
    if (this.monthSelect) {
      this.monthSelect.addEventListener("change", () => this.render());
    }
    if (this.autoCalcBtn) {
      this.autoCalcBtn.addEventListener("click", () => {
        this.saveGradesFromInputs();
        this.render();
        showToast("បានគណនាមធ្យមភាគ និងចំណាត់ថ្នាក់សិស្សរួចរាល់!", "success");
      });
    }
    if (this.saveBtn) {
      this.saveBtn.addEventListener("click", () => {
        this.saveGradesFromInputs();
        showToast("បានរក្សាទុកពិន្ទុសិស្សជោគជ័យ!", "success");
        if (window.App) App.renderDashboard();
      });
    }
    if (this.exportBtn) {
      this.exportBtn.addEventListener("click", () => this.exportGradesExcel());
    }
  }

  static getSelectedMonth() {
    return this.monthSelect ? this.monthSelect.value : "month_10";
  }

  static getEvaluation(avg) {
    if (avg >= 45.00) return { mention: "A", label: "ល្អប្រសើរ", class: "mention-A" };
    if (avg >= 40.00) return { mention: "B", label: "ល្អណាស់", class: "mention-B" };
    if (avg >= 35.00) return { mention: "C", label: "ល្អ", class: "mention-C" };
    if (avg >= 30.00) return { mention: "D", label: "ល្អបង្គួរ", class: "mention-D" };
    if (avg >= 25.00) return { mention: "E", label: "មធ្យម", class: "mention-E" };
    return { mention: "F", label: "ខ្សោយ", class: "mention-F" };
  }

  /**
   * Computes computed results for a given month or period
   * Returns array of objects with calculated totals, average, ranks, mentions
   */
  static getCalculatedResults(monthKey) {
    const period = monthKey || this.getSelectedMonth();
    const students = StorageManager.getStudents();
    const allGrades = StorageManager.getGrades();
    const periodGrades = allGrades[period] || {};
    const subjects = StorageManager.getSubjects();

    const results = students.map(st => {
      const stScores = periodGrades[st.id] || {};
      let total = 0;
      const subjectScores = {};

      subjects.forEach(sub => {
        const rawScore = parseFloat(stScores[sub.id]) || 0;
        subjectScores[sub.id] = rawScore;
        total += rawScore;
      });

      // Dynamic coefficient calculation based on subjects (Max 700, Total Coef 14 => Average /50)
      const totalCoef = subjects.reduce((sum, s) => sum + (s.coef || (s.maxScore === 100 ? 2 : 1)), 0) || 14;
      const average = parseFloat((total / totalCoef).toFixed(2));
      const evalInfo = this.getEvaluation(average);
      const isPassed = average >= 25.00;

      return {
        student: st,
        subjectScores,
        total,
        average,
        mention: evalInfo.mention,
        mentionLabel: evalInfo.label,
        mentionClass: evalInfo.class,
        isPassed,
        rank: 0
      };
    });

    // Compute ranks sorted by average / total score descending
    const sorted = [...results].sort((a, b) => b.total - a.total);
    let currentRank = 1;
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i].total < sorted[i - 1].total) {
        currentRank = i + 1;
      }
      sorted[i].rank = currentRank;
    }

    return results;
  }

  static render() {
    const period = this.getSelectedMonth();
    const results = this.getCalculatedResults(period);
    const subjects = StorageManager.getSubjects();

    if (!this.tableBody) return;

    let maxAvg = 0;
    let minAvg = results.length > 0 ? 50 : 0;
    let sumAvg = 0;
    let passCount = 0;

    this.tableBody.innerHTML = results.map((res, index) => {
      const st = res.student;
      if (res.average > maxAvg) maxAvg = res.average;
      if (res.average < minAvg) minAvg = res.average;
      sumAvg += res.average;
      if (res.isPassed) passCount++;

      const rankBadgeClass = res.rank === 1 ? "rank-1" :
                             res.rank === 2 ? "rank-2" :
                             res.rank === 3 ? "rank-3" : "rank-default";

      return `
        <tr>
          <td class="sticky-col col-no text-center font-bold">${index + 1}</td>
          <td class="sticky-col col-id"><span class="badge badge-soft-primary font-mono">${st.id}</span></td>
          <td class="sticky-col col-name"><strong>${st.nameKh}</strong></td>
          <td class="sticky-col col-gender text-center ${st.gender === 'ស្រី' ? 'text-accent' : 'text-primary'} font-bold">${st.gender}</td>
          
          ${subjects.map(sub => `
            <td>
              <input type="number" step="0.5" min="0" max="${sub.maxScore}" 
                     class="grade-score-input" 
                     id="grade_${period}_${st.id}_${sub.id}"
                     value="${res.subjectScores[sub.id] || 0}"
                     oninput="GradesModule.handleScoreChange('${period}', '${st.id}', '${sub.id}')">
            </td>
          `).join("")}

          <td class="summary-col bg-soft-blue font-bold text-center" id="total_${st.id}">${res.total.toFixed(1)}</td>
          <td class="summary-col bg-soft-green font-bold text-center text-primary" id="avg_${st.id}">${res.average.toFixed(2)}</td>
          <td class="summary-col bg-soft-amber text-center" id="mention_${st.id}">
            <span class="mention-badge ${res.mentionClass}">${res.mention} (${res.mentionLabel})</span>
          </td>
          <td class="summary-col bg-soft-purple text-center" id="rank_${st.id}">
            <span class="rank-badge ${rankBadgeClass}">${res.rank}</span>
          </td>
          <td class="summary-col text-center" id="pass_${st.id}">
            <span class="badge ${res.isPassed ? 'badge-soft-success' : 'badge-soft-danger'}">
              ${res.isPassed ? 'ជាប់' : 'ធ្លាក់'}
            </span>
          </td>
        </tr>
      `;
    }).join("");

    // Update statistics footer
    const count = results.length || 1;
    const overallAvg = (sumAvg / count).toFixed(2);
    const passRate = ((passCount / count) * 100).toFixed(1);

    const maxEl = document.getElementById("gradeStatsMax");
    const minEl = document.getElementById("gradeStatsMin");
    const avgEl = document.getElementById("gradeStatsAvg");
    const passEl = document.getElementById("gradeStatsPassRate");

    if (maxEl) maxEl.textContent = `${maxAvg.toFixed(2)} / 50`;
    if (minEl) minEl.textContent = `${minAvg.toFixed(2)} / 50`;
    if (avgEl) avgEl.textContent = `${overallAvg} / 50`;
    if (passEl) passEl.textContent = `${passRate}% (${passCount}/${count})`;
  }

  static handleScoreChange(period, studentId, subjectId) {
    // Quick row update
    const subjects = StorageManager.getSubjects();
    let rowTotal = 0;
    subjects.forEach(sub => {
      const inp = document.getElementById(`grade_${period}_${studentId}_${sub.id}`);
      if (inp) {
        rowTotal += parseFloat(inp.value) || 0;
      }
    });

    const totalCoef = subjects.reduce((sum, s) => sum + (s.coef || (s.maxScore === 100 ? 2 : 1)), 0) || 14;
    const rowAvg = parseFloat((rowTotal / totalCoef).toFixed(2));
    const evalInfo = this.getEvaluation(rowAvg);

    const totalEl = document.getElementById(`total_${studentId}`);
    const avgEl = document.getElementById(`avg_${studentId}`);
    const mentionEl = document.getElementById(`mention_${studentId}`);
    const passEl = document.getElementById(`pass_${studentId}`);

    if (totalEl) totalEl.textContent = rowTotal.toFixed(1);
    if (avgEl) avgEl.textContent = rowAvg.toFixed(2);
    if (mentionEl) {
      mentionEl.innerHTML = `<span class="mention-badge ${evalInfo.class}">${evalInfo.mention} (${evalInfo.label})</span>`;
    }
    if (passEl) {
      passEl.innerHTML = `<span class="badge ${rowAvg >= 25 ? 'badge-soft-success' : 'badge-soft-danger'}">${rowAvg >= 25 ? 'ជាប់' : 'ធ្លាក់'}</span>`;
    }
  }

  static saveGradesFromInputs() {
    const period = this.getSelectedMonth();
    const students = StorageManager.getStudents();
    const subjects = StorageManager.getSubjects();
    const allGrades = StorageManager.getGrades();

    if (!allGrades[period]) allGrades[period] = {};

    students.forEach(st => {
      if (!allGrades[period][st.id]) allGrades[period][st.id] = {};
      subjects.forEach(sub => {
        const inp = document.getElementById(`grade_${period}_${st.id}_${sub.id}`);
        if (inp) {
          allGrades[period][st.id][sub.id] = parseFloat(inp.value) || 0;
        }
      });
    });

    StorageManager.saveGrades(allGrades);
  }

  static exportGradesExcel() {
    const period = this.getSelectedMonth();
    const results = this.getCalculatedResults(period);
    const subjects = StorageManager.getSubjects();

    const headers = [
      "ល.រ", "អត្តលេខ", "គោត្តនាម-នាម", "ភេទ",
      ...subjects.map(s => `${s.name} (${s.maxScore})`),
      "ពិន្ទុសរុប (650)", "មធ្យមភាគ (50)", "និទ្ទេស", "ចំណាត់ថ្នាក់", "លទ្ធផល"
    ];

    const rows = [
      [`តារាងលទ្ធផលសិក្សាសិស្ស ថ្នាក់ទី ៨A - ${period}`],
      headers
    ];

    results.forEach((res, i) => {
      const st = res.student;
      rows.push([
        i + 1,
        st.id,
        st.nameKh,
        st.gender,
        ...subjects.map(s => res.subjectScores[s.id] || 0),
        res.total,
        res.average,
        res.mention,
        res.rank,
        res.isPassed ? "ជាប់" : "ធ្លាក់"
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "ពិន្ទុសិស្ស");
    XLSX.writeFile(wb, `តារាងពិន្ទុ_ថ្នាក់ទី៨A_${period}.xlsx`);
    showToast("បាននាំចេញ Excel ពិន្ទុសិស្សជោគជ័យ!", "success");
  }
}
