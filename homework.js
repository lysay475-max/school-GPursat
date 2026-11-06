/**
 * HOMEWORK & ASSIGNMENT MODULE
 */

class HomeworkModule {
  static init() {
    this.listContainer = document.getElementById("homeworkListContainer");
    this.addBtn = document.getElementById("openAddHomeworkModalBtn");
    this.form = document.getElementById("homeworkForm");
    this.subjectSelect = document.getElementById("hwSubjectSelect");
    this.activeHwId = null;

    this.bindEvents();
    this.populateSubjectSelect();
    this.render();
  }

  static bindEvents() {
    if (this.addBtn) {
      this.addBtn.addEventListener("click", () => this.openAddModal());
    }
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    }
  }

  static populateSubjectSelect() {
    if (!this.subjectSelect) return;
    const subjects = StorageManager.getSubjects();
    this.subjectSelect.innerHTML = subjects.map(s => `
      <option value="${s.id}">${s.name} (${s.nameEn})</option>
    `).join("");
  }

  static openAddModal() {
    this.populateSubjectSelect();
    document.getElementById("hwTitleInput").value = "";
    document.getElementById("hwDescInput").value = "";
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    document.getElementById("hwDueDateInput").value = nextWeek.toISOString().split('T')[0];
    openModal("homeworkModal");
  }

  static handleFormSubmit(e) {
    e.preventDefault();
    const subjects = StorageManager.getSubjects();
    const subId = document.getElementById("hwSubjectSelect").value;
    const sub = subjects.find(s => s.id === subId);

    const newHw = {
      id: "HW-" + Date.now().toString().slice(-4),
      subjectId: subId,
      subjectName: sub ? sub.name : "មុខវិជ្ជា",
      title: document.getElementById("hwTitleInput").value.trim(),
      description: document.getElementById("hwDescInput").value.trim(),
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: document.getElementById("hwDueDateInput").value,
      submissions: {}
    };

    const list = StorageManager.getHomework();
    list.unshift(newHw);
    StorageManager.saveHomework(list);

    closeModal("homeworkModal");
    showToast("បានដាក់កិច្ចការផ្ទះថ្មីជោគជ័យ!", "success");
    this.render();
  }

  static deleteHomework(hwId) {
    if (!confirm("តើអ្នកពិតជាចង់លុបកិច្ចការផ្ទះនេះមែនទេ?")) return;
    let list = StorageManager.getHomework();
    list = list.filter(h => h.id !== hwId);
    StorageManager.saveHomework(list);
    showToast("បានលុបកិច្ចការផ្ទះរួចរាល់!", "info");
    this.render();
  }

  static openSubmissionModal(hwId) {
    this.activeHwId = hwId;
    const list = StorageManager.getHomework();
    const hw = list.find(h => h.id === hwId);
    if (!hw) return;

    const students = StorageManager.getStudents();
    document.getElementById("subModalTitle").innerHTML = `<i class="fa-solid fa-list-check text-primary"></i> តាមដានការប្រគល់កិច្ចការ៖ <strong>${hw.title}</strong> (${hw.subjectName})`;

    const tbody = document.getElementById("hwSubmissionTableBody");
    if (tbody) {
      tbody.innerHTML = students.map((st, i) => {
        const sub = (hw.submissions && hw.submissions[st.id]) || { status: "pending", score: 0, note: "" };
        const isSubmitted = sub.status === "submitted";

        return `
          <tr>
            <td class="text-center">${i + 1}</td>
            <td><span class="badge badge-soft-primary font-mono">${st.id}</span></td>
            <td><strong>${st.nameKh}</strong></td>
            <td class="text-center">
              <label class="submission-toggle-label">
                <input type="checkbox" id="hw_chk_${st.id}" ${isSubmitted ? 'checked' : ''} onchange="HomeworkModule.toggleStudentSubmission('${hw.id}', '${st.id}')">
                <span class="submission-slider"></span>
              </label>
            </td>
            <td class="text-center">
              <input type="number" min="0" max="10" step="0.5" class="grade-score-input" id="hw_score_${st.id}" value="${sub.score || 0}" onchange="HomeworkModule.updateStudentScore('${hw.id}', '${st.id}')">
            </td>
            <td>
              <input type="text" class="form-input-sm w-100" id="hw_note_${st.id}" value="${sub.note || ''}" placeholder="ចំណាំ..." onchange="HomeworkModule.updateStudentNote('${hw.id}', '${st.id}')">
            </td>
          </tr>
        `;
      }).join("");
    }

    openModal("homeworkSubmissionModal");
  }

  static toggleStudentSubmission(hwId, studentId) {
    const list = StorageManager.getHomework();
    const hw = list.find(h => h.id === hwId);
    if (!hw) return;

    if (!hw.submissions) hw.submissions = {};
    const isChecked = document.getElementById(`hw_chk_${studentId}`).checked;
    
    hw.submissions[studentId] = {
      status: isChecked ? "submitted" : "pending",
      score: parseFloat(document.getElementById(`hw_score_${studentId}`).value) || 0,
      note: document.getElementById(`hw_note_${studentId}`).value.trim()
    };

    StorageManager.saveHomework(list);
    this.render();
  }

  static updateStudentScore(hwId, studentId) {
    const list = StorageManager.getHomework();
    const hw = list.find(h => h.id === hwId);
    if (!hw) return;
    if (!hw.submissions) hw.submissions = {};
    
    const scoreVal = parseFloat(document.getElementById(`hw_score_${studentId}`).value) || 0;
    const isChecked = document.getElementById(`hw_chk_${studentId}`).checked;

    hw.submissions[studentId] = {
      status: isChecked ? "submitted" : (scoreVal > 0 ? "submitted" : "pending"),
      score: scoreVal,
      note: document.getElementById(`hw_note_${studentId}`).value.trim()
    };
    if (scoreVal > 0 && !isChecked) {
      document.getElementById(`hw_chk_${studentId}`).checked = true;
    }

    StorageManager.saveHomework(list);
    this.render();
  }

  static updateStudentNote(hwId, studentId) {
    const list = StorageManager.getHomework();
    const hw = list.find(h => h.id === hwId);
    if (!hw || !hw.submissions) return;

    if (!hw.submissions[studentId]) {
      hw.submissions[studentId] = { status: "pending", score: 0, note: "" };
    }
    hw.submissions[studentId].note = document.getElementById(`hw_note_${studentId}`).value.trim();
    StorageManager.saveHomework(list);
  }

  static render() {
    const list = StorageManager.getHomework();
    const students = StorageManager.getStudents();
    const totalStudents = students.length || 42;

    if (!this.listContainer) return;

    if (list.length === 0) {
      this.listContainer.innerHTML = `
        <div class="text-center p-5 text-muted">
          <i class="fa-solid fa-book-open-reader" style="font-size: 2.5rem; margin-bottom: 12px; display: block;"></i>
          មិនទាន់មានការដាក់កិច្ចការផ្ទះនៅឡើយទេ។ ចុច «ដាក់កិច្ចការថ្មី» ដើម្បីចាប់ផ្តើម!
        </div>
      `;
      return;
    }

    this.listContainer.innerHTML = list.map(hw => {
      let submittedCount = 0;
      if (hw.submissions) {
        Object.values(hw.submissions).forEach(s => {
          if (s.status === "submitted") submittedCount++;
        });
      }

      const percent = Math.round((submittedCount / totalStudents) * 100);
      const isDueSoon = new Date(hw.dueDate) <= new Date(Date.now() + 86400000 * 2);

      return `
        <div class="homework-card">
          <div class="hw-header">
            <div class="d-flex align-items-center gap-2">
              <span class="badge badge-soft-primary"><i class="fa-solid fa-book"></i> ${hw.subjectName}</span>
              <h4 class="hw-title">${hw.title}</h4>
            </div>
            <div class="d-flex align-items-center gap-2">
              <span class="badge ${isDueSoon ? 'badge-soft-danger' : 'badge-soft-warning'}">
                <i class="fa-regular fa-clock"></i> ផុតកំណត់៖ ${hw.dueDate}
              </span>
              <button class="btn-icon text-danger" onclick="HomeworkModule.deleteHomework('${hw.id}')" title="លុប">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>

          <p class="hw-desc">${hw.description || 'មិនមានការពិពណ៌នាបន្ថែម'}</p>

          <div class="hw-progress-bar-wrap">
            <div class="hw-progress-info">
              <span><i class="fa-solid fa-circle-check text-success"></i> បានប្រគល់៖ <strong>${submittedCount}/${totalStudents} នាក់</strong> (${percent}%)</span>
              <span>ថ្ងៃដាក់៖ ${hw.assignedDate || '-'}</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${percent}%;"></div>
            </div>
          </div>

          <div class="hw-footer">
            <button class="btn btn-outline btn-sm" onclick="HomeworkModule.openSubmissionModal('${hw.id}')">
              <i class="fa-solid fa-clipboard-check"></i> កត់ត្រាការប្រគល់ & ដាក់ពិន្ទុ
            </button>
          </div>
        </div>
      `;
    }).join("");
  }
}
