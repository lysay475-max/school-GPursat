/**
 * DIGITAL TEACHER'S LOGBOOK MODULE
 * Daily teaching records, lesson objectives, classroom activities, homework & reflections
 */

class LogbookModule {
  static init() {
    this.container = document.getElementById("logbookListContainer");
    this.subjectFilter = document.getElementById("logbookSubjectFilter");
    this.searchInput = document.getElementById("logbookSearchInput");

    this.bindEvents();
    this.populateSubjectDropdowns();
    this.render();
  }

  static bindEvents() {
    const addBtn = document.getElementById("btnOpenAddLogbookModal");
    if (addBtn) {
      addBtn.addEventListener("click", () => this.openAddModal());
    }

    const form = document.getElementById("addLogbookForm");
    if (form) {
      form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    }

    if (this.subjectFilter) {
      this.subjectFilter.addEventListener("change", () => this.render());
    }
    if (this.searchInput) {
      this.searchInput.addEventListener("input", () => this.render());
    }

    const printBtn = document.getElementById("btnPrintLogbook");
    if (printBtn) {
      printBtn.addEventListener("click", () => window.print());
    }
  }

  static populateSubjectDropdowns() {
    const subjects = StorageManager.getSubjects();
    if (this.subjectFilter) {
      this.subjectFilter.innerHTML = `<option value="all">មុខវិជ្ជាទាំងអស់</option>` +
        subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
    }

    const formSubSelect = document.getElementById("logSubjectSelect");
    if (formSubSelect) {
      formSubSelect.innerHTML = subjects.map(s => `<option value="${s.id}" data-teacher="${s.teacher}">${s.name} (${s.teacher})</option>`).join("");
      formSubSelect.addEventListener("change", (e) => {
        const selectedOpt = e.target.options[e.target.selectedIndex];
        const teacherInput = document.getElementById("logTeacherInput");
        if (teacherInput && selectedOpt) {
          teacherInput.value = selectedOpt.dataset.teacher || "";
        }
      });
    }
  }

  static render() {
    const logs = StorageManager.getLogbook();
    const query = this.searchInput ? this.searchInput.value.toLowerCase().trim() : "";
    const subject = this.subjectFilter ? this.subjectFilter.value : "all";

    let filtered = logs.filter(l => {
      const matchSub = subject === "all" || l.subjectId === subject;
      const matchQuery = !query || 
        (l.chapter && l.chapter.toLowerCase().includes(query)) ||
        (l.objective && l.objective.toLowerCase().includes(query)) ||
        (l.subjectName && l.subjectName.toLowerCase().includes(query)) ||
        (l.teacher && l.teacher.toLowerCase().includes(query));
      return matchSub && matchQuery;
    });

    if (!this.container) return;

    if (filtered.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state-box p-5 text-center text-muted font-khmer">
          <i class="fa-solid fa-book-bookmark" style="font-size: 2.5rem; margin-bottom: 12px; display: block;"></i>
          មិនមានកំណត់ត្រាកិច្ចតែងការបង្រៀនត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ
        </div>
      `;
      return;
    }

    this.container.innerHTML = filtered.map(log => `
      <div class="logbook-entry-card mb-3">
        <div class="logbook-header-row">
          <div class="logbook-title-box">
            <span class="badge badge-primary font-khmer">${log.subjectName || 'មុខវិជ្ជា'}</span>
            <h4 class="font-khmer font-bold text-primary mb-0">${log.chapter}</h4>
          </div>
          <div class="logbook-meta-chips">
            <span class="chip-item"><i class="fa-regular fa-calendar"></i> ${log.date}</span>
            <span class="chip-item"><i class="fa-regular fa-clock"></i> ${log.timeSlot || '07:00 - 08:30'}</span>
            <span class="chip-item"><i class="fa-solid fa-user-tie"></i> ${log.teacher}</span>
            <button class="btn-icon text-danger" onclick="LogbookModule.deleteLog('${log.id}')" title="លុប"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>

        <div class="logbook-body-grid mt-3">
          <div class="log-info-block">
            <div class="block-lbl"><i class="fa-solid fa-bullseye text-primary"></i> វត្ថុបំណងមេរៀន (Objectives)៖</div>
            <div class="block-val">${log.objective}</div>
          </div>

          <div class="log-info-block">
            <div class="block-lbl"><i class="fa-solid fa-chalkboard-user text-info"></i> សកម្មភាពបង្រៀន & រៀន (Activities)៖</div>
            <div class="block-val">${log.activities}</div>
          </div>

          <div class="log-info-block">
            <div class="block-lbl"><i class="fa-solid fa-book-open-reader text-warning"></i> កិច្ចការផ្ទះ & លំហាត់ (Homework)៖</div>
            <div class="block-val">${log.homework || 'គ្មាន'}</div>
          </div>

          <div class="log-info-block">
            <div class="block-lbl"><i class="fa-solid fa-comment-dots text-success"></i> ការឆ្លុះបញ្ចាំង & វាយតម្លៃ (Teacher's Reflection)៖</div>
            <div class="block-val text-muted">${log.reflection || 'ដំណើរការបង្រៀនប្រព្រឹត្តទៅបានល្អ។'}</div>
          </div>
        </div>
      </div>
    `).join("");
  }

  static openAddModal() {
    document.getElementById("logDateInput").value = new Date().toISOString().split('T')[0];
    document.getElementById("logChapterInput").value = "";
    document.getElementById("logObjectiveInput").value = "";
    document.getElementById("logActivitiesInput").value = "";
    document.getElementById("logHomeworkInput").value = "";
    document.getElementById("logReflectionInput").value = "";
    
    const subjects = StorageManager.getSubjects();
    if (subjects.length > 0) {
      document.getElementById("logTeacherInput").value = subjects[0].teacher;
    }

    openModal("addLogbookModal");
  }

  static handleFormSubmit(e) {
    e.preventDefault();
    const date = document.getElementById("logDateInput").value;
    const timeSlot = document.getElementById("logTimeSlotInput").value;
    const subjectId = document.getElementById("logSubjectSelect").value;
    const subjects = StorageManager.getSubjects();
    const subjectObj = subjects.find(s => s.id === subjectId) || { name: "មុខវិជ្ជា" };
    const teacher = document.getElementById("logTeacherInput").value.trim() || subjectObj.teacher;
    const chapter = document.getElementById("logChapterInput").value.trim();
    const objective = document.getElementById("logObjectiveInput").value.trim();
    const activities = document.getElementById("logActivitiesInput").value.trim();
    const homework = document.getElementById("logHomeworkInput").value.trim();
    const reflection = document.getElementById("logReflectionInput").value.trim();

    const newLog = {
      id: "LOG-" + Date.now(),
      date,
      timeSlot,
      subjectId,
      subjectName: subjectObj.name,
      teacher,
      chapter,
      objective,
      activities,
      homework,
      absentCount: 0,
      reflection
    };

    const logs = StorageManager.getLogbook();
    logs.unshift(newLog);
    StorageManager.saveLogbook(logs);

    closeModal("addLogbookModal");
    this.render();
    showToast("បានកត់ត្រាកិច្ចតែងការបង្រៀនជោគជ័យ!", "success");
  }

  static deleteLog(logId) {
    if (!confirm("តើអ្នកពិតជាចង់លុបកំណត់ត្រាបង្រៀននេះមែនទេ?")) return;
    let logs = StorageManager.getLogbook();
    logs = logs.filter(l => l.id !== logId);
    StorageManager.saveLogbook(logs);
    this.render();
    showToast("បានលុបកំណត់ត្រាបង្រៀនរួចរាល់!", "info");
  }
}
