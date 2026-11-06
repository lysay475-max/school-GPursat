/**
 * SMART ACADEMIC INSIGHTS & AI ANALYSIS MODULE
 */

class InsightsModule {
  static init() {
    this.render();
  }

  static analyze() {
    const subjects = StorageManager.getSubjects();
    const results = GradesModule.getCalculatedResults("month_10");
    const totalStudents = results.length || 42;

    // 1. Analyze Subject Strengths and Weaknesses
    const subjectStats = subjects.map(sub => {
      let total = 0;
      let belowHalfCount = 0;
      results.forEach(r => {
        const score = r.subjectScores[sub.id] || 0;
        total += score;
        const max = sub.maxScore;
        if (score < max / 2) belowHalfCount++;
      });
      const rawAvg = total / totalStudents;
      const normalizedAvg = sub.maxScore === 100 ? rawAvg / 2 : rawAvg;

      return {
        subject: sub,
        rawAvg: parseFloat(rawAvg.toFixed(2)),
        normalizedAvg: parseFloat(normalizedAvg.toFixed(2)),
        belowHalfCount,
        passRate: Math.round(((totalStudents - belowHalfCount) / totalStudents) * 100)
      };
    }).sort((a, b) => a.normalizedAvg - b.normalizedAvg);

    const weakestSubjects = subjectStats.slice(0, 3);
    const strongestSubjects = [...subjectStats].reverse().slice(0, 3);

    // 2. Identify At-Risk Students (Average < 25 or multiple failed subjects)
    const atRiskStudents = results.filter(r => r.average < 27.00).sort((a, b) => a.average - b.average);

    // 3. Excellent Performers (Average >= 40)
    const topPerformers = results.filter(r => r.average >= 40.00).sort((a, b) => b.average - a.average);

    return {
      totalStudents,
      subjectStats,
      weakestSubjects,
      strongestSubjects,
      atRiskStudents,
      topPerformers
    };
  }

  static render() {
    const analysis = this.analyze();

    // 1. Render Weakest Subjects Alert Cards
    const weakListEl = document.getElementById("insightsWeakSubjectsList");
    if (weakListEl) {
      weakListEl.innerHTML = analysis.weakestSubjects.map(item => `
        <div class="insight-stat-row">
          <div class="stat-info">
            <span class="subj-tag" style="background: ${item.subject.color}; color:#fff;">${item.subject.name}</span>
            <span class="text-danger font-bold">មធ្យមភាគ៖ ${item.normalizedAvg}/50</span>
          </div>
          <div class="stat-bar-box">
            <div class="stat-bar-track">
              <div class="stat-bar-fill bg-danger" style="width: ${(item.normalizedAvg / 50) * 100}%;"></div>
            </div>
            <small class="text-muted">សិស្សក្រោមមធ្យមភាគ៖ ${item.belowHalfCount} នាក់ (${100 - item.passRate}%)</small>
          </div>
        </div>
      `).join("");
    }

    // 2. Render Strongest Subjects
    const strongListEl = document.getElementById("insightsStrongSubjectsList");
    if (strongListEl) {
      strongListEl.innerHTML = analysis.strongestSubjects.map(item => `
        <div class="insight-stat-row">
          <div class="stat-info">
            <span class="subj-tag" style="background: ${item.subject.color}; color:#fff;">${item.subject.name}</span>
            <span class="text-success font-bold">មធ្យមភាគ៖ ${item.normalizedAvg}/50</span>
          </div>
          <div class="stat-bar-box">
            <div class="stat-bar-track">
              <div class="stat-bar-fill bg-success" style="width: ${(item.normalizedAvg / 50) * 100}%;"></div>
            </div>
            <small class="text-muted">អត្រាជាប់៖ ${item.passRate}%</small>
          </div>
        </div>
      `).join("");
    }

    // 3. Render At-Risk Students Intervention Table
    const atRiskTbody = document.getElementById("insightsAtRiskTableBody");
    if (atRiskTbody) {
      if (analysis.atRiskStudents.length === 0) {
        atRiskTbody.innerHTML = `<tr><td colspan="5" class="text-center text-success p-3">🎉 អបអរសាទរ! មិនមានសិស្សប្រឈមនឹងការធ្លាក់ឡើយ។</td></tr>`;
      } else {
        atRiskTbody.innerHTML = analysis.atRiskStudents.map((res, i) => `
          <tr>
            <td class="text-center font-bold">${i + 1}</td>
            <td><span class="badge badge-soft-danger font-mono">${res.student.id}</span></td>
            <td><strong>${res.student.nameKh}</strong></td>
            <td class="text-center text-danger font-bold">${res.average.toFixed(2)}</td>
            <td>
              <span class="badge badge-soft-warning">ត្រូវការបំប៉នបន្ទាន់</span>
              <button class="btn btn-outline btn-xs ml-2" onclick="TelegramModule.openSendModal('${res.student.id}')" title="ផ្ញើសារដំណឹងទៅអាណាព្យាបាល">
                <i class="fa-brands fa-telegram text-info"></i> ដំណឹងឪពុកម្តាយ
              </button>
            </td>
          </tr>
        `).join("");
      }
    }

    // 4. Generate AI Action Plan
    const actionPlanEl = document.getElementById("insightsActionPlan");
    if (actionPlanEl) {
      const topWeak = analysis.weakestSubjects[0];
      const secondWeak = analysis.weakestSubjects[1];
      actionPlanEl.innerHTML = `
        <div class="action-plan-card">
          <div class="action-plan-header">
            <i class="fa-solid fa-lightbulb text-warning"></i>
            <h4>អនុសាសន៍គរុកោសល្យសម្រាប់លោកគ្រូបន្ទុកថ្នាក់ (Actionable Advice)</h4>
          </div>
          <ul class="action-plan-list">
            <li>
              <strong>ពង្រឹងមុខវិជ្ជា ${topWeak.subject.name} និង ${secondWeak.subject.name}៖</strong> 
              សិស្សមានពិន្ទុមធ្យមភាគទាបជាងគេលើមុខវិជ្ជានេះ (${topWeak.normalizedAvg}/50)។ គួររៀបចំក្រុមស្វ័យសិក្សា (Peer-tutoring) ដោយឱ្យសិស្សពូកែជួយបង្រៀនសិស្សខ្សោយ។
            </li>
            <li>
              <strong>ការតាមដានសិស្ស ${analysis.atRiskStudents.length} នាក់ដែលប្រឈម៖</strong> 
              គួរទាក់ទងជួបពិភាក្សាជាមួយអាណាព្យាបាលសិស្សទាំងនេះ ដើម្បីជំរុញការធ្វើស្វ័យសិក្សា និងកិច្ចការផ្ទះពេលយប់។
            </li>
            <li>
              <strong>រៀបចំការប្រឡងតេស្តសាកល្បងប្រចាំសប្តាហ៍៖</strong> 
              ជួយឱ្យសិស្សស៊ាំនឹងទម្រង់វិញ្ញាសា និងពង្រឹងល្បឿននៃការដោះស្រាយលំហាត់។
            </li>
          </ul>
        </div>
      `;
    }
  }
}
