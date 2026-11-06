/**
 * MAIN APP CONTROLLER
 * Khmer Junior High School Classroom Management System (v2.0 Expanded)
 */

// Global Modal Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("active");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const icon = type === "success" ? "fa-circle-check" :
               type === "error"   ? "fa-circle-exclamation" :
               type === "warning" ? "fa-triangle-exclamation" : "fa-circle-info";

  toast.innerHTML = `
    <i class="fa-solid ${icon} toast-icon"></i>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Drag & Scroll Controller for 2D Horizontal and Vertical Smooth Panning with Kinetic Momentum
class DragScrollManager {
  static init() {
    this.attachDragToScroll();
  }

  static attachDragToScroll() {
    setTimeout(() => {
      const containers = document.querySelectorAll(".table-responsive, .grade-table-wrapper, .print-preview-container");
      containers.forEach(slider => {
        if (slider.dataset.dragInitialized === "true") return;
        slider.dataset.dragInitialized = "true";

        let isDown = false;
        let lastX = 0, lastY = 0;
        let velX = 0, velY = 0;
        let lastTime = 0;
        let rafId = null;

        const cancelMomentum = () => {
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        };

        const stepMomentum = () => {
          if (Math.abs(velX) > 0.25 || Math.abs(velY) > 0.25) {
            slider.scrollLeft -= velX;
            slider.scrollTop -= velY;
            velX *= 0.93; // Smooth kinetic friction factor
            velY *= 0.93;
            rafId = requestAnimationFrame(stepMomentum);
          } else {
            cancelMomentum();
          }
        };

        // Pointer down (mouse, touch, stylus)
        slider.addEventListener('pointerdown', (e) => {
          // Ignore clicks on inputs, buttons, selects, links, or radio labels
          if (e.target.closest('input, select, button, textarea, a, label, .btn, .grade-score-input, .att-radio-label')) {
            return;
          }

          cancelMomentum();
          isDown = true;
          slider.classList.add('is-dragging');
          lastX = e.clientX;
          lastY = e.clientY;
          velX = 0;
          velY = 0;
          lastTime = performance.now();
          
          try {
            slider.setPointerCapture(e.pointerId);
          } catch(err) {}
        });

        // Pointer move
        slider.addEventListener('pointermove', (e) => {
          if (!isDown) return;
          e.preventDefault();

          const now = performance.now();
          const dt = Math.max(now - lastTime, 10);
          lastTime = now;

          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;

          slider.scrollLeft -= dx;
          slider.scrollTop -= dy;

          // Track instantaneous speed for flick release
          velX = (dx / dt) * 16;
          velY = (dy / dt) * 16;

          lastX = e.clientX;
          lastY = e.clientY;
        });

        const endDrag = (e) => {
          if (isDown) {
            isDown = false;
            slider.classList.remove('is-dragging');
            try {
              slider.releasePointerCapture(e.pointerId);
            } catch(err) {}
            // Silky-smooth kinetic inertia glide
            stepMomentum();
          }
        };

        slider.addEventListener('pointerup', endDrag);
        slider.addEventListener('pointercancel', endDrag);
        slider.addEventListener('pointerleave', endDrag);

        // Smooth Wheel horizontal panning
        slider.addEventListener('wheel', (e) => {
          cancelMomentum();
          if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            slider.scrollLeft += (e.deltaX || e.deltaY);
          }
        }, { passive: true });

        // Auto-scroll when tabbing or focusing grade inputs near edges
        slider.addEventListener('focusin', (e) => {
          if (e.target && e.target.classList.contains('grade-score-input')) {
            const rect = e.target.getBoundingClientRect();
            const parentRect = slider.getBoundingClientRect();
            if (rect.right > parentRect.right - 80) {
              slider.scrollTo({
                left: slider.scrollLeft + (rect.right - parentRect.right + 120),
                behavior: 'smooth'
              });
            } else if (rect.left < parentRect.left + 380) {
              slider.scrollTo({
                left: Math.max(0, slider.scrollLeft - (parentRect.left + 400 - rect.left)),
                behavior: 'smooth'
              });
            }
          }
        });
      });
    }, 100);
  }

  static scrollToLeft(containerId) {
    const el = document.getElementById(containerId);
    if (el) el.scrollTo({ left: 0, behavior: 'smooth' });
  }

  static scrollToRight(containerId) {
    const el = document.getElementById(containerId);
    if (el) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
  }

  static scrollToTop(containerId) {
    const el = document.getElementById(containerId);
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
  }

  static scrollToBottom(containerId) {
    const el = document.getElementById(containerId);
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }
}

function switchTab(tabId) {
  const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
  const tabContents = document.querySelectorAll(".tab-content");

  navLinks.forEach(link => {
    if (link.dataset.tab === tabId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  tabContents.forEach(content => {
    if (content.id === `tab-${tabId}`) {
      content.classList.add("active");
    } else {
      content.classList.remove("active");
    }
  });

  // Update Page Title
  const titles = {
    dashboard: { title: "ផ្ទាំងទិដ្ឋភាពរួម (Dashboard)", sub: "ទំព័រដើម / ផ្ទាំងទិដ្ឋភាពទូទៅនៃថ្នាក់រៀន" },
    students: { title: "គ្រប់គ្រងព័ត៌មានសិស្ស (Students)", sub: "សិស្ស / បញ្ជីរាយនាមសិស្សានុសិស្ស" },
    attendance: { title: "ស្រង់វត្តមានប្រចាំថ្ងៃ (Attendance)", sub: "វត្តមាន / ការស្រង់វត្តមាន និងសង្ខេបប្រចាំខែ" },
    scanner: { title: "ស្កេន QR Code វត្តមាន (QR Scanner)", sub: "វត្តមាន / ស្កេនកាតសិស្សរហ័សតាមកាមេរ៉ា" },
    homework: { title: "កិច្ចការផ្ទះ & លំហាត់ (Homework Hub)", sub: "ការសិក្សា / តាមដានការប្រគល់កិច្ចការ និងដាក់ពិន្ទុ" },
    grades: { title: "បញ្ចូល & គណនាពិន្ទុ (Grades)", sub: "លទ្ធផលសិក្សា / តារាងពិន្ទុ និងចំណាត់ថ្នាក់" },
    semester: { title: "សរុបឆមាស & ប្រចាំឆ្នាំ (Semester Aggregation)", sub: "លទ្ធផលសិក្សា / សម្រេចឡើងថ្នាក់-ត្រួតថ្នាក់" },
    reports: { title: "តារាងចំណាត់ថ្នាក់ & ប័ណ្ណ (Reports)", sub: "របាយការណ៍ / តារាងកិត្តិយស និងប័ណ្ណសរសើរ" },
    insights: { title: "វិភាគឆ្លាតវៃ & អនុសាសន៍ (Smart AI Insights)", sub: "វិភាគ / រកមុខវិជ្ជាខ្សោយ និងសិស្សប្រឈម" },
    seating: { title: "ប្លង់តុអង្គុយសិស្ស (Seating Layout)", sub: "ថ្នាក់រៀន / ប្លង់តុ និងទីតាំងអង្គុយរបស់សិស្ស" },
    exams: { title: "ធនាគារសំណួរ & វិញ្ញាសា (Exam Generator)", sub: "ការប្រឡង / គ្រប់គ្រងសំណួរ និងបង្កើតវិញ្ញាសា" },
    textbooks: { title: "គ្រប់គ្រងសៀវភៅពុម្ព (Ministry Textbooks)", sub: "សម្ភារៈ / តាមដានសៀវភៅពុម្ព និងបណ្ណាល័យ" },
    council: { title: "គណៈកម្មការ & ក្លឹបសិក្សា (Council & Clubs)", sub: "សកម្មភាព / តួនាទីដឹកនាំ និងក្លឹបសិក្សា" },
    quiz: { title: "Quiz អន្តរកម្មក្នុងថ្នាក់ (Interactive Class Quiz)", sub: "ការសិក្សា / តេស្តចំណេះដឹង និងតារាងពិន្ទុផ្ទាល់" },
    health: { title: "សុខភាព & BMI សិស្ស (Student Health & Growth)", sub: "សុខភាព / តាមដានកម្ពស់ ទម្ងន់ និងកាយសម្បទា" },
    election: { title: "ការបោះឆ្នោតប្រធានថ្នាក់ (Digital Class Election)", sub: "សកម្មភាព / បោះឆ្នោតប្រជាធិបតេយ្យក្នុងថ្នាក់" },
    gamification: { title: "ប្រព័ន្ធផ្កាយលើកទឹកចិត្ត & ផ្លាកសញ្ញា (Gamification)", sub: "លើកទឹកចិត្ត / ផ្កាយ ផ្លាកសញ្ញា និងតារាងកិត្តិយស" },
    fund: { title: "គ្រប់គ្រងមូលនិធិថ្នាក់រៀន (Classroom Fund & Treasury)", sub: "ហិរញ្ញវត្ថុ / តាមដានចំណូល ចំណាយ និងវិភាគទាន" },
    logbook: { title: "សៀវភៅកិច្ចតែងការ & កំណត់ត្រាបង្រៀន (Teacher's Logbook)", sub: "រដ្ឋបាល / កំណត់ត្រាបង្រៀនប្រចាំថ្ងៃផ្លូវការ" },
    resources: { title: "ឃ្លាំងឯកសារមេរៀន & E-Library (Class Resource Hub)", sub: "ឯកសារ / ស្លាយ PDF លំហាត់ និងវីដេអូ" },
    timetable: { title: "កាលវិភាគបង្រៀន (Timetable)", sub: "កាលវិភាគ / កាលវិភាគប្រចាំសប្តាហ៍" },
    discipline: { title: "វិន័យ និងសកម្មភាព (Discipline)", sub: "វិន័យ / កំណត់ត្រាវិន័យ និងទំនាក់ទំនង" },
    settings: { title: "ការកំណត់សាលារៀន (Settings)", sub: "ប្រព័ន្ធ / ព័ត៌មានសាលា និងការបម្រុងទុក" }
  };

  const current = titles[tabId] || titles.dashboard;
  document.getElementById("currentPageTitle").textContent = current.title;
  document.getElementById("currentBreadcrumb").textContent = current.sub;

  window.location.hash = tabId;

  // Refresh active tab renders
  if (tabId === "dashboard") App.renderDashboard();
  if (tabId === "students") StudentsModule.render();
  if (tabId === "attendance") AttendanceModule.render();
  if (tabId === "homework") HomeworkModule.render();
  if (tabId === "grades") GradesModule.render();
  if (tabId === "semester") SemesterModule.render();
  if (tabId === "insights") InsightsModule.render();
  if (tabId === "seating") SeatingManager.renderSeatingGrid();
  if (tabId === "exams") {
    ExamManager.populateSubjectFilters();
    ExamManager.renderQuestionBank();
  }
  if (tabId === "textbooks") {
    TextbookManager.renderOverviewStats();
    TextbookManager.renderInventoryTable();
    TextbookManager.renderStudentTextbookTable();
  }
  if (tabId === "council") {
    CouncilManager.renderCouncilGrid();
    CouncilManager.renderClubsList();
  }
  if (tabId === "quiz") {
    QuizModule.populateQuizSubjects();
  }
  if (tabId === "health") {
    HealthModule.renderOverview();
    HealthModule.renderHealthTable();
  }
  if (tabId === "election") {
    ElectionModule.renderElections();
  }
  if (tabId === "gamification") {
    GamificationModule.render();
  }
  if (tabId === "fund") {
    FundModule.render();
  }
  if (tabId === "logbook") {
    LogbookModule.render();
  }
  if (tabId === "resources") {
    ResourcesModule.render();
  }
  if (tabId === "reports") {
    ReportsModule.populateStudentDropdown();
    ReportsModule.render();
  }

  // Re-attach 2D drag to scroll for any newly rendered containers
  DragScrollManager.attachDragToScroll();
}

class App {
  static init() {
    this.subjectChart = null;
    this.gradeDistChart = null;

    this.initTheme();
    this.initLiveClock();
    this.initNavigation();
    this.initSchoolInfo();
    this.initGlobalSearch();
    this.initSettingsForm();
    this.initBackupActions();

    // Init Drag-to-Scroll Manager
    DragScrollManager.init();

    // Init All Modules
    StudentsModule.init();
    AttendanceModule.init();
    ScannerModule.init();
    HomeworkModule.init();
    GradesModule.init();
    SemesterModule.init();
    ReportsModule.init();
    InsightsModule.init();
    TelegramModule.init();
    TimetableModule.init();
    DisciplineModule.init();
    SeatingManager.init();
    ExamManager.init();
    TextbookManager.init();
    CouncilManager.init();
    QuizModule.init();
    HealthModule.init();
    ElectionModule.init();
    GamificationModule.init();
    FundModule.init();
    LogbookModule.init();
    ResourcesModule.init();
    VoiceModule.init();

    this.renderDashboard();

    // Handle hash navigation
    const currentHash = window.location.hash.replace("#", "");
    if (currentHash) {
      switchTab(currentHash);
    }
  }

  static initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    this.updateThemeIcon(savedTheme);

    const toggleBtn = document.getElementById("themeToggleBtn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
        this.updateThemeIcon(newTheme);
        this.renderCharts();
      });
    }
  }

  static updateThemeIcon(theme) {
    const btn = document.getElementById("themeToggleBtn");
    if (btn) {
      btn.innerHTML = theme === "dark" ? `<i class="fa-solid fa-sun text-warning"></i>` : `<i class="fa-solid fa-moon"></i>`;
    }
  }

  static initLiveClock() {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
      const timeEl = document.getElementById("currentLiveTime");
      if (timeEl) timeEl.textContent = timeStr;
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  static initNavigation() {
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        switchTab(tab);
        // Mobile sidebar auto close
        document.getElementById("sidebar").classList.remove("mobile-open");
      });
    });

    const toggleBtn = document.getElementById("toggleSidebarBtn");
    const closeBtn = document.getElementById("sidebarCloseBtn");
    const sidebar = document.getElementById("sidebar");

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => sidebar.classList.toggle("mobile-open"));
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", () => sidebar.classList.remove("mobile-open"));
    }

    const quickAddBtn = document.getElementById("quickAddStudentBtn");
    if (quickAddBtn) {
      quickAddBtn.addEventListener("click", () => StudentsModule.openAddModal());
    }

    const quickAttBtn = document.getElementById("quickAttendanceBtn");
    if (quickAttBtn) {
      quickAttBtn.addEventListener("click", () => switchTab("attendance"));
    }
  }

  static initSchoolInfo() {
    const school = StorageManager.getSchoolInfo();
    document.getElementById("sidebarSchoolName").textContent = school.schoolName;
    document.getElementById("sidebarAcademicYear").textContent = school.academicYear;
    document.getElementById("sidebarTeacherName").textContent = school.teacherName;
    document.getElementById("heroWelcomeText").textContent = `សួស្តី${school.teacherName}! 👋`;

    // Populate Settings form
    document.getElementById("setSchoolName").value = school.schoolName;
    document.getElementById("setAcademicYear").value = school.academicYear;
    document.getElementById("setPrincipalName").value = school.principalName;
    document.getElementById("setTeacherName").value = school.teacherName;
    document.getElementById("setSchoolAddress").value = school.schoolAddress || "រាជធានីភ្នំពេញ ព្រះរាជាណាចក្រកម្ពុជា";
    document.getElementById("setSchoolPhone").value = school.teacherPhone || "០១២ ៣៤៥ ៦៧៨";
  }

  static initGlobalSearch() {
    const searchInput = document.getElementById("globalQuickSearch");
    const dropdown = document.getElementById("searchResultsDropdown");
    if (!searchInput || !dropdown) return;

    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        dropdown.style.display = "none";
        return;
      }

      const students = StorageManager.getStudents();
      const matches = students.filter(s => 
        s.nameKh.toLowerCase().includes(q) || 
        s.nameEn.toLowerCase().includes(q) || 
        s.id.toLowerCase().includes(q)
      ).slice(0, 6);

      if (matches.length === 0) {
        dropdown.innerHTML = `<div class="p-3 text-muted text-center" style="font-size: 0.85rem;">រកមិនឃើញសិស្សឈ្មោះ "${q}" ឡើយ</div>`;
        dropdown.style.display = "block";
        return;
      }

      dropdown.innerHTML = matches.map(s => `
        <div class="search-result-item" onclick="StudentsModule.viewCard('${s.id}'); document.getElementById('searchResultsDropdown').style.display='none';">
          <img src="${s.photo || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + s.id}" class="search-result-avatar" alt="">
          <div class="search-result-info">
            <div class="name">${s.nameKh} <small>(${s.nameEn})</small></div>
            <div class="meta">${s.id} | ថ្នាក់ទី ${s.class || '៨ A'} | ភេទ៖ ${s.gender}</div>
          </div>
        </div>
      `).join("");
      dropdown.style.display = "block";
    });

    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });
  }

  static initSettingsForm() {
    const form = document.getElementById("schoolSettingsForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        schoolName: document.getElementById("setSchoolName").value.trim(),
        academicYear: document.getElementById("setAcademicYear").value.trim(),
        principalName: document.getElementById("setPrincipalName").value.trim(),
        teacherName: document.getElementById("setTeacherName").value.trim(),
        schoolAddress: document.getElementById("setSchoolAddress").value.trim(),
        teacherPhone: document.getElementById("setSchoolPhone").value.trim(),
        currentClass: "8A"
      };

      StorageManager.saveSchoolInfo(data);
      this.initSchoolInfo();
      showToast("បានរក្សាទុកព័ត៌មានសាលារៀនជោគជ័យ!", "success");
      this.refreshAllModules();
    });
  }

  static initBackupActions() {
    const exportBtn = document.getElementById("exportDataJsonBtn");
    const importBtn = document.getElementById("triggerImportJsonBtn");
    const fileInput = document.getElementById("importJsonFileInput");
    const resetBtn = document.getElementById("resetSampleDataBtn");

    if (exportBtn) {
      exportBtn.addEventListener("click", () => StorageManager.exportBackupJSON());
    }

    if (importBtn && fileInput) {
      importBtn.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const res = StorageManager.importBackupJSON(ev.target.result);
          if (res.success) {
            showToast("បានស្ដារទិន្នន័យពី JSON ដោយជោគជ័យ!", "success");
            setTimeout(() => window.location.reload(), 800);
          } else {
            showToast("បរាជ័យក្នុងការស្ដារទិន្នន័យ៖ " + res.error, "error");
          }
        };
        reader.readAsText(file);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("តើអ្នកពិតជាចង់កំណត់ទិន្នន័យគំរូសាលា ៤២ នាក់ឡើងវិញមែនទេ?")) {
          StorageManager.resetToDefaults();
          showToast("បានផ្ទុកទិន្នន័យគំរូដើមរួចរាល់!", "success");
          setTimeout(() => window.location.reload(), 600);
        }
      });
    }
  }

  static renderDashboard() {
    const students = StorageManager.getStudents();
    const results = GradesModule.getCalculatedResults("month_10");
    const attendance = StorageManager.getAttendance();
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAtt = attendance[todayStr] || {};

    // 1. KPI & Hero metrics
    const totalStudents = students.length;
    const femaleCount = students.filter(s => s.gender === "ស្រី").length;
    const maleCount = totalStudents - femaleCount;

    let presentToday = 0;
    let absentToday = 0;
    let permToday = 0;

    students.forEach(st => {
      const rec = todayAtt[st.id] || { status: "P" };
      if (rec.status === "P") presentToday++;
      else if (rec.status === "A") absentToday++;
      else if (rec.status === "L") permToday++;
    });

    const attRate = totalStudents > 0 ? ((presentToday / totalStudents) * 100).toFixed(0) : "100";

    // Hero
    document.getElementById("heroTotalStudents").textContent = `${totalStudents} នាក់`;
    document.getElementById("heroFemaleStudents").textContent = `${femaleCount} នាក់`;
    document.getElementById("heroAttendanceRate").textContent = `${attRate}%`;

    // KPI Cards
    document.getElementById("kpiTotalStudents").textContent = totalStudents;
    document.getElementById("kpiGenderRatio").textContent = `ប្រុស ${maleCount} / ស្រី ${femaleCount}`;
    document.getElementById("kpiPresentCount").innerHTML = `${presentToday} <span class="val-unit">នាក់</span>`;
    document.getElementById("kpiAbsentCount").textContent = `អវត្តមាន ${absentToday} (ច្បាប់ ${permToday})`;
    document.getElementById("kpiAttendanceRateBadge").textContent = `អត្រាវត្តមាន ${attRate}%`;

    // Class average
    let sumAvg = 0;
    let passCount = 0;
    results.forEach(r => {
      sumAvg += r.average;
      if (r.isPassed) passCount++;
    });
    const classAvg = totalStudents > 0 ? (sumAvg / totalStudents).toFixed(2) : "0.00";
    const passRate = totalStudents > 0 ? ((passCount / totalStudents) * 100).toFixed(1) : "0";

    document.getElementById("kpiClassAverage").innerHTML = `${classAvg} <span class="val-unit">/ 50</span>`;
    document.getElementById("kpiPassRate").textContent = `អត្រាជាប់ ${passRate}%`;

    // Top Student
    const sorted = [...results].sort((a, b) => b.total - a.total);
    const top1 = sorted[0];
    if (top1) {
      document.getElementById("kpiTopStudentName").textContent = top1.student.nameKh;
      document.getElementById("kpiTopStudentScore").textContent = `ម.ភ ${top1.average.toFixed(2)} (និទ្ទេស ${top1.mention})`;
    }

    // Top 5 Table
    const top5 = sorted.slice(0, 5);
    const top5Tbody = document.getElementById("dashboardTopStudentsTableBody");
    if (top5Tbody) {
      top5Tbody.innerHTML = top5.map((res, i) => `
        <tr>
          <td class="text-center font-bold">
            <span class="rank-badge ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-default'}">${i + 1}</span>
          </td>
          <td>
            <div class="student-row-flex">
              <img src="${res.student.photo || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + res.student.id}" class="student-table-avatar" alt="">
              <div>
                <div class="student-name-kh">${res.student.nameKh}</div>
                <div class="student-name-en">${res.student.nameEn}</div>
              </div>
            </div>
          </td>
          <td class="text-center ${res.student.gender === 'ស្រី' ? 'text-accent' : 'text-primary'} font-bold">${res.student.gender}</td>
          <td class="text-center font-bold text-primary">${res.average.toFixed(2)}</td>
          <td class="text-center"><span class="mention-badge ${res.mentionClass}">${res.mention}</span></td>
          <td class="text-center font-bold">លេខ ${res.rank}</td>
        </tr>
      `).join("");
    }

    // Today Schedule List
    const timetable = StorageManager.getTimetable();
    const schedList = document.getElementById("dashboardTodayScheduleList");
    if (schedList) {
      schedList.innerHTML = timetable.map(slot => {
        if (slot.isBreak) {
          return `
            <div class="schedule-item-card" style="border-left-color: #f59e0b; background: rgba(245,158,11,0.08);">
              <div class="schedule-time text-warning"><i class="fa-solid fa-mug-hot"></i> ${slot.time}</div>
              <div class="schedule-subject text-warning">${slot.label}</div>
            </div>
          `;
        }
        const cell = slot.thu || slot.mon;
        return `
          <div class="schedule-item-card">
            <div class="schedule-time"><i class="fa-regular fa-clock"></i> ${slot.time}</div>
            <div>
              <div class="schedule-subject">${cell.subject}</div>
              <div class="schedule-teacher">${cell.teacher}</div>
            </div>
          </div>
        `;
      }).join("");
    }

    this.renderCharts();
  }

  static renderCharts() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const textColor = isDark ? "#cbd5e1" : "#475569";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

    const subjects = StorageManager.getSubjects();
    const results = GradesModule.getCalculatedResults("month_10");

    // 1. Subject Average Chart
    const subjectAverages = subjects.map(sub => {
      let total = 0;
      results.forEach(r => {
        total += r.subjectScores[sub.id] || 0;
      });
      const avg = results.length > 0 ? (total / results.length) : 0;
      return sub.maxScore === 100 ? parseFloat((avg / 2).toFixed(2)) : parseFloat(avg.toFixed(2));
    });

    const ctxSubj = document.getElementById("subjectPerformanceChart");
    if (ctxSubj) {
      if (this.subjectChart) this.subjectChart.destroy();
      this.subjectChart = new Chart(ctxSubj, {
        type: "bar",
        data: {
          labels: subjects.map(s => s.name),
          datasets: [{
            label: "មធ្យមភាគ (គិតលើ ៥០)",
            data: subjectAverages,
            backgroundColor: subjects.map(s => s.color || "#4f46e5"),
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 50,
              grid: { color: gridColor },
              ticks: { color: textColor }
            },
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { family: "'Kantumruy Pro', sans-serif" } }
            }
          }
        }
      });
    }

    // 2. Grade Distribution Chart
    const mentionCounts = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
    results.forEach(r => {
      if (mentionCounts[r.mention] !== undefined) {
        mentionCounts[r.mention]++;
      }
    });

    const ctxGrade = document.getElementById("gradeDistributionChart");
    if (ctxGrade) {
      if (this.gradeDistChart) this.gradeDistChart.destroy();
      this.gradeDistChart = new Chart(ctxGrade, {
        type: "doughnut",
        data: {
          labels: [
            `និទ្ទេស A (${mentionCounts.A})`,
            `និទ្ទេស B (${mentionCounts.B})`,
            `និទ្ទេស C (${mentionCounts.C})`,
            `និទ្ទេស D (${mentionCounts.D})`,
            `និទ្ទេស E (${mentionCounts.E})`,
            `និទ្ទេស F (${mentionCounts.F})`
          ],
          datasets: [{
            data: [
              mentionCounts.A,
              mentionCounts.B,
              mentionCounts.C,
              mentionCounts.D,
              mentionCounts.E,
              mentionCounts.F
            ],
            backgroundColor: [
              "#10b981", // A (Green)
              "#0ea5e9", // B (Blue)
              "#f59e0b", // C (Amber)
              "#f97316", // D (Orange)
              "#8b5cf6", // E (Purple)
              "#ef4444"  // F (Red)
            ],
            borderWidth: 2,
            borderColor: isDark ? "#111827" : "#ffffff"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: {
                color: textColor,
                font: { family: "'Kantumruy Pro', sans-serif" }
              }
            }
          }
        }
      });
    }
  }

  static refreshAllModules() {
    this.initSchoolInfo();
    StudentsModule.render();
    AttendanceModule.render();
    HomeworkModule.render();
    GradesModule.render();
    SemesterModule.render();
    ReportsModule.render();
    InsightsModule.render();
    TimetableModule.render();
    DisciplineModule.render();
    if (typeof HealthModule !== "undefined") {
      HealthModule.renderOverview();
      HealthModule.renderHealthTable();
    }
    if (typeof ElectionModule !== "undefined") ElectionModule.renderElections();
    if (typeof GamificationModule !== "undefined") GamificationModule.render();
    if (typeof FundModule !== "undefined") FundModule.render();
    if (typeof LogbookModule !== "undefined") LogbookModule.render();
    if (typeof ResourcesModule !== "undefined") ResourcesModule.render();
    this.renderDashboard();
  }
}

// Bootstrap application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
