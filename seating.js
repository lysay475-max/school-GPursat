/**
 * CLASSROOM SEATING PLAN MODULE (ប្លង់តុអង្គុយសិស្សក្នុងថ្នាក់រៀន)
 * Junior High School Standard: 3 Columns x 7 Rows of 2-seat desks = 42 seats
 */

class SeatingManager {
  static init() {
    this.renderSeatingGrid();
    this.setupEventListeners();
  }

  static getSeatingData() {
    const saved = StorageManager.getSeating();
    if (saved && Array.isArray(saved) && saved.length === 42) {
      return saved;
    }
    // Default assignment: ordered by student list
    const students = StorageManager.getStudents();
    const grid = [];
    for (let i = 0; i < 42; i++) {
      grid.push(students[i] ? students[i].id : null);
    }
    StorageManager.saveSeating(grid);
    return grid;
  }

  static renderSeatingGrid() {
    const container = document.getElementById("seatingGridContainer");
    if (!container) return;

    const seating = this.getSeatingData();
    const students = StorageManager.getStudents();
    const studentMap = {};
    students.forEach(s => studentMap[s.id] = s);

    // Get grades to show top ranks / honor badge
    const gradesData = StorageManager.getGrades();
    const m10 = gradesData["month_10"] || {};
    const calculated = GradeCalculator.calculateRankings(students, m10);
    const rankMap = {};
    calculated.forEach(c => rankMap[c.student.id] = c.rank);

    let html = `
      <div class="blackboard-area">
        <div class="blackboard-bar">
          <i class="fa-solid fa-chalkboard"></i> ក្តារខៀន / វេទិកាគ្រូបង្រៀន (BLACKBOARD & TEACHER DESK)
        </div>
      </div>
      <div class="classroom-columns-wrap">
    `;

    // 3 Columns (ជួរទី១ ឆ្វេង, ជួរទី២ កណ្តាល, ជួរទី៣ ស្តាំ)
    // Each column has 7 desks (តុទី១ ដល់ តុទី៧), each desk has 2 seats (ឆ្វេង/ស្តាំ)
    // Total 3 cols * 7 rows * 2 seats = 42 seats
    for (let col = 0; col < 3; col++) {
      const colName = col === 0 ? "ជួរឆ្វេង (Left Column)" : (col === 1 ? "ជួរកណ្តាល (Center Column)" : "ជួរស្តាំ (Right Column)");
      html += `
        <div class="seating-column">
          <div class="column-header"><i class="fa-solid fa-table-columns"></i> ${colName}</div>
          <div class="desks-list">
      `;

      for (let row = 0; row < 7; row++) {
        const deskNumber = row + 1;
        const seatIndex1 = (col * 14) + (row * 2);
        const seatIndex2 = seatIndex1 + 1;

        const stuId1 = seating[seatIndex1];
        const stuId2 = seating[seatIndex2];

        const stu1 = stuId1 ? studentMap[stuId1] : null;
        const stu2 = stuId2 ? studentMap[stuId2] : null;

        html += `
          <div class="desk-unit" data-desk="${deskNumber}" data-col="${col}">
            <div class="desk-label">តុទី ${deskNumber}</div>
            <div class="desk-seats">
              ${this.renderSeatHTML(seatIndex1, stu1, rankMap[stuId1])}
              ${this.renderSeatHTML(seatIndex2, stu2, rankMap[stuId2])}
            </div>
          </div>
        `;
      }

      html += `
          </div>
        </div>
      `;
    }

    html += `</div>`;
    container.innerHTML = html;
  }

  static renderSeatHTML(seatIndex, student, rank) {
    if (!student) {
      return `
        <div class="seat-slot empty-seat" data-seat-idx="${seatIndex}" onclick="SeatingManager.openAssignModal(${seatIndex})">
          <div class="seat-icon"><i class="fa-regular fa-circle-dashed"></i></div>
          <div class="seat-name">កៅអីទំនេរ (${seatIndex + 1})</div>
        </div>
      `;
    }

    const genderClass = student.gender === "ស្រី" ? "gender-female" : "gender-male";
    const rankBadge = rank && rank <= 5 ? `<span class="seat-rank-tag rank-top">ចំណាត់ថ្នាក់ទី ${rank}</span>` : (rank ? `<span class="seat-rank-tag">លេខ ${rank}</span>` : "");
    const avatarLetter = student.nameKh.charAt(0);

    return `
      <div class="seat-slot occupied-seat ${genderClass}" data-seat-idx="${seatIndex}" onclick="SeatingManager.showStudentQuickCard('${student.id}', ${seatIndex})">
        <div class="seat-top-info">
          <span class="seat-num">${seatIndex + 1}</span>
          ${rankBadge}
        </div>
        <div class="seat-avatar">${avatarLetter}</div>
        <div class="seat-name font-khmer">${student.nameKh}</div>
        <div class="seat-sub">${student.gender} • ${student.code}</div>
      </div>
    `;
  }

  static autoArrange(type) {
    const students = [...StorageManager.getStudents()];
    let arranged = [];

    if (type === "alphabetical") {
      // Sort alphabetically by Khmer name
      students.sort((a, b) => a.nameKh.localeCompare(b.nameKh, 'km'));
      arranged = students.map(s => s.id);
    } else if (type === "rank") {
      // Sort by academic performance
      const gradesData = StorageManager.getGrades();
      const m10 = gradesData["month_10"] || {};
      const calculated = GradeCalculator.calculateRankings(students, m10);
      arranged = calculated.map(c => c.student.id);
    } else if (type === "gender_paired") {
      // Pair male and female students together
      const males = students.filter(s => s.gender === "ប្រុស");
      const females = students.filter(s => s.gender === "ស្រី");
      arranged = [];
      const maxLen = Math.max(males.length, females.length);
      for (let i = 0; i < maxLen; i++) {
        if (males[i]) arranged.push(males[i].id);
        if (females[i]) arranged.push(females[i].id);
      }
    } else if (type === "random") {
      // Random shuffle
      for (let i = students.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [students[i], students[j]] = [students[j], students[i]];
      }
      arranged = students.map(s => s.id);
    }

    // Pad with nulls if needed to reach 42
    while (arranged.length < 42) {
      arranged.push(null);
    }

    StorageManager.saveSeating(arranged);
    this.renderSeatingGrid();
    App.showToast("បានរៀបចំប្លង់តុអង្គុយស្វ័យប្រវត្តដោយជោគជ័យ!", "success");
  }

  static showStudentQuickCard(studentId, seatIndex) {
    const students = StorageManager.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const gradesData = StorageManager.getGrades();
    const m10 = gradesData["month_10"] || {};
    const stGrade = m10[student.id];
    let avgStr = "មិនទាន់មានពិន្ទុ";
    if (stGrade) {
      const gCalc = GradeCalculator.calculateStudentMonthly(stGrade);
      avgStr = `${gCalc.avg.toFixed(2)} (${gCalc.mention})`;
    }

    const modalBody = document.getElementById("seatingModalBody");
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="seating-modal-profile">
        <div class="profile-header-box">
          <div class="avatar-lg ${student.gender === 'ស្រី' ? 'avatar-female' : 'avatar-male'}">
            ${student.nameKh.charAt(0)}
          </div>
          <div>
            <h3 class="moul-title text-primary">${student.nameKh}</h3>
            <p class="text-muted">${student.nameEn} • ${student.code}</p>
          </div>
        </div>

        <div class="info-grid-2 mt-3">
          <div class="info-item"><strong>ភេទ៖</strong> ${student.gender}</div>
          <div class="info-item"><strong>ថ្ងៃខែឆ្នាំកំណើត៖</strong> ${student.dob}</div>
          <div class="info-item"><strong>កៅអីអង្គុយ៖</strong> លេខ ${seatIndex + 1}</div>
          <div class="info-item"><strong>មធ្យមភាគប្រចាំខែ៖</strong> <span class="badge badge-primary">${avgStr}</span></div>
          <div class="info-item"><strong>អាណាព្យាបាល៖</strong> ${student.parentName || 'មិនមាន'}</div>
          <div class="info-item"><strong>លេខទូរស័ព្ទ៖</strong> ${student.parentPhone || 'មិនមាន'}</div>
        </div>

        <div class="seating-action-btns mt-4">
          <button class="btn btn-outline" onclick="SeatingManager.swapSeatPrompt(${seatIndex})">
            <i class="fa-solid fa-arrow-right-arrow-left"></i> ប្តូរកៅអីជាមួយសិស្សផ្សេង
          </button>
          <button class="btn btn-danger" onclick="SeatingManager.unassignSeat(${seatIndex})">
            <i class="fa-solid fa-user-minus"></i> ដកចេញពីកៅអីនេះ
          </button>
        </div>
      </div>
    `;

    document.getElementById("seatingModal").classList.add("active");
  }

  static swapSeatPrompt(currentSeatIndex) {
    const seating = this.getSeatingData();
    const students = StorageManager.getStudents();
    const studentMap = {};
    students.forEach(s => studentMap[s.id] = s);

    const targetSeatStr = prompt(`សូមបញ្ចូលលេខកៅអីដែលចង់ប្តូរជាមួយ (១ ដល់ ៤២)៖`);
    if (!targetSeatStr) return;

    const targetIndex = parseInt(targetSeatStr, 10) - 1;
    if (isNaN(targetIndex) || targetIndex < 0 || targetIndex >= 42) {
      alert("លេខកៅអីមិនត្រឹមត្រូវទេ!");
      return;
    }

    // Swap
    const temp = seating[currentSeatIndex];
    seating[currentSeatIndex] = seating[targetIndex];
    seating[targetIndex] = temp;

    StorageManager.saveSeating(seating);
    this.renderSeatingGrid();
    document.getElementById("seatingModal").classList.remove("active");
    App.showToast(`បានប្តូរកៅអីលេខ ${currentSeatIndex + 1} ជាមួយលេខ ${targetIndex + 1} រួចរាល់!`, "success");
  }

  static unassignSeat(seatIndex) {
    const seating = this.getSeatingData();
    seating[seatIndex] = null;
    StorageManager.saveSeating(seating);
    this.renderSeatingGrid();
    document.getElementById("seatingModal").classList.remove("active");
    App.showToast("បានដកសិស្សចេញពីកៅអីជោគជ័យ!", "info");
  }

  static printSeatingPlan() {
    window.print();
  }

  static setupEventListeners() {
    const btnAlpha = document.getElementById("btnArrangeAlpha");
    if (btnAlpha) btnAlpha.addEventListener("click", () => this.autoArrange("alphabetical"));

    const btnRank = document.getElementById("btnArrangeRank");
    if (btnRank) btnRank.addEventListener("click", () => this.autoArrange("rank"));

    const btnGender = document.getElementById("btnArrangeGender");
    if (btnGender) btnGender.addEventListener("click", () => this.autoArrange("gender_paired"));

    const btnRandom = document.getElementById("btnArrangeRandom");
    if (btnRandom) btnRandom.addEventListener("click", () => this.autoArrange("random"));

    const btnPrint = document.getElementById("btnPrintSeating");
    if (btnPrint) btnPrint.addEventListener("click", () => this.printSeatingPlan());

    const closeBtn = document.getElementById("closeSeatingModal");
    if (closeBtn) closeBtn.addEventListener("click", () => {
      document.getElementById("seatingModal").classList.remove("active");
    });
  }
}
