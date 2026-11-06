/**
 * DISCIPLINE & BEHAVIOR MODULE
 */

class DisciplineModule {
  static init() {
    this.feedList = document.getElementById("disciplineFeedList");
    this.filterChips = document.querySelectorAll(".discipline-filters .filter-chip");
    this.addBtn = document.getElementById("openAddDisciplineModalBtn");
    this.form = document.getElementById("disciplineForm");
    this.studentSelect = document.getElementById("discStudentSelect");
    this.currentFilter = "all";

    this.bindEvents();
    this.populateStudentSelect();
    this.render();
  }

  static bindEvents() {
    this.filterChips.forEach(chip => {
      chip.addEventListener("click", () => {
        this.filterChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.currentFilter = chip.dataset.type;
        this.render();
      });
    });

    if (this.addBtn) {
      this.addBtn.addEventListener("click", () => this.openAddModal());
    }

    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    }
  }

  static populateStudentSelect() {
    if (!this.studentSelect) return;
    const students = StorageManager.getStudents();
    this.studentSelect.innerHTML = students.map(st => `
      <option value="${st.id}">${st.nameKh} (${st.id})</option>
    `).join("");
  }

  static openAddModal() {
    this.populateStudentSelect();
    document.getElementById("discDateInput").value = new Date().toISOString().split('T')[0];
    document.getElementById("discTitleInput").value = "";
    document.getElementById("discNotesInput").value = "";
    openModal("disciplineModal");
  }

  static handleFormSubmit(e) {
    e.preventDefault();
    const students = StorageManager.getStudents();
    const studentId = document.getElementById("discStudentSelect").value;
    const st = students.find(s => s.id === studentId);

    const newRecord = {
      id: "DISC-" + Date.now().toString().slice(-4),
      studentId: studentId,
      studentName: st ? st.nameKh : "សិស្ស",
      type: document.getElementById("discTypeSelect").value,
      date: document.getElementById("discDateInput").value,
      title: document.getElementById("discTitleInput").value.trim(),
      notes: document.getElementById("discNotesInput").value.trim()
    };

    const records = StorageManager.getDiscipline();
    records.unshift(newRecord);
    StorageManager.saveDiscipline(records);

    closeModal("disciplineModal");
    showToast("បានបន្ថែមកំណត់ត្រាវិន័យជោគជ័យ!", "success");
    this.render();
  }

  static deleteRecord(id) {
    if (!confirm("តើអ្នកពិតជាចង់លុបកំណត់ត្រានេះមែនទេ?")) return;
    let records = StorageManager.getDiscipline();
    records = records.filter(r => r.id !== id);
    StorageManager.saveDiscipline(records);
    showToast("បានលុបកំណត់ត្រារួចរាល់!", "info");
    this.render();
  }

  static render() {
    const records = StorageManager.getDiscipline();

    // Counts
    const praiseCount = records.filter(r => r.type === "praise").length;
    const warnCount = records.filter(r => r.type === "warning").length;
    const contactCount = records.filter(r => r.type === "parent_contact").length;

    document.getElementById("countDiscAll").textContent = records.length;
    document.getElementById("countDiscPraise").textContent = praiseCount;
    document.getElementById("countDiscWarning").textContent = warnCount;
    document.getElementById("countDiscContact").textContent = contactCount;

    const filtered = records.filter(r => this.currentFilter === "all" || r.type === this.currentFilter);

    if (!this.feedList) return;

    if (filtered.length === 0) {
      this.feedList.innerHTML = `
        <div class="text-center p-4 text-muted">
          <i class="fa-solid fa-note-sticky" style="font-size: 2rem; margin-bottom: 8px; display: block;"></i>
          មិនទាន់មានកំណត់ត្រាវិន័យ ឬសកម្មភាពនៅឡើយទេ
        </div>
      `;
      return;
    }

    this.feedList.innerHTML = filtered.map(rec => {
      const typeClass = `type-${rec.type}`;
      const icon = rec.type === "praise" ? `<i class="fa-solid fa-heart"></i>` :
                   rec.type === "warning" ? `<i class="fa-solid fa-triangle-exclamation"></i>` :
                   `<i class="fa-solid fa-phone"></i>`;
      
      const typeBadge = rec.type === "praise" ? `<span class="badge badge-soft-success">ការសរសើរ</span>` :
                        rec.type === "warning" ? `<span class="badge badge-soft-danger">ការព្រមាន</span>` :
                        `<span class="badge badge-soft-info">ទំនាក់ទំនងអាណាព្យាបាល</span>`;

      return `
        <div class="discipline-record-card ${typeClass}">
          <div class="disc-type-icon">${icon}</div>
          <div class="disc-content">
            <div class="disc-header-row">
              <div class="d-flex align-items-center gap-2">
                <span class="disc-student-name text-primary">${rec.studentName} (${rec.studentId})</span>
                ${typeBadge}
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="disc-date"><i class="fa-regular fa-calendar"></i> ${rec.date}</span>
                <button class="btn-icon text-danger" onclick="DisciplineModule.deleteRecord('${rec.id}')" title="លុប">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
            <div class="disc-title">${rec.title}</div>
            <div class="disc-notes">${rec.notes}</div>
          </div>
        </div>
      `;
    }).join("");
  }
}
