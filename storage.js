/**
 * LOCAL STORAGE & STATE MANAGEMENT (UPDATED WITH HOMEWORK & SEMESTER)
 */

const STORAGE_KEYS = {
  SCHOOL: "kh_school_info_v1",
  STUDENTS: "kh_students_v1",
  SUBJECTS: "kh_subjects_v1",
  GRADES: "kh_grades_v1",
  ATTENDANCE: "kh_attendance_v1",
  DISCIPLINE: "kh_discipline_v1",
  TIMETABLE: "kh_timetable_v1",
  HOMEWORK: "kh_homework_v1",
  QUESTIONS: "kh_questions_v1",
  TEXTBOOKS: "kh_textbooks_v1",
  COUNCIL: "kh_council_v1",
  CLUBS: "kh_clubs_v1",
  SEATING: "kh_seating_v1",
  HEALTH: "kh_health_v1",
  ELECTIONS: "kh_elections_v1",
  GAMIFICATION: "kh_gamification_v1",
  FUND: "kh_fund_v1",
  LOGBOOK: "kh_logbook_v1",
  RESOURCES: "kh_resources_v1",
  THEME: "kh_app_theme_v1",
  CURRENT_CLASS: "kh_current_class_v1"
};

class StorageManager {
  static init() {
    if (!localStorage.getItem(STORAGE_KEYS.SCHOOL)) {
      this.resetToDefaults();
    }
  }

  static resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(SEED_SCHOOL_INFO));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(SEED_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(SEED_SUBJECTS));
    
    // Seed initial grades for Month 10 & 09
    const initialGrades = {
      "month_10": SEED_MONTH_10_GRADES,
      "month_11": {},
      "month_12": {},
      "sem_1": {},
      "month_01": {},
      "month_02": {},
      "month_03": {},
      "month_04": {},
      "month_05": {},
      "sem_2": {}
    };
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(initialGrades));

    // Seed initial attendance
    const today = new Date().toISOString().split('T')[0];
    const initialAttendance = {};
    initialAttendance[today] = {};
    SEED_STUDENTS.forEach((st, idx) => {
      if (idx === 7) {
        initialAttendance[today][st.id] = { status: "A", note: "ឈឺផ្ដាសាយធ្ងន់ធ្ងរ" };
      } else if (idx === 19) {
        initialAttendance[today][st.id] = { status: "L", note: "សុំច្បាប់ការងារគ្រួសារ" };
      } else {
        initialAttendance[today][st.id] = { status: "P", note: "" };
      }
    });
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(initialAttendance));

    localStorage.setItem(STORAGE_KEYS.DISCIPLINE, JSON.stringify(SEED_DISCIPLINE_RECORDS));
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(SEED_TIMETABLE));
    localStorage.setItem(STORAGE_KEYS.HOMEWORK, JSON.stringify(SEED_HOMEWORK));
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(typeof SEED_QUESTIONS !== "undefined" ? SEED_QUESTIONS : []));
    localStorage.setItem(STORAGE_KEYS.TEXTBOOKS, JSON.stringify(typeof SEED_TEXTBOOKS !== "undefined" ? SEED_TEXTBOOKS : []));
    localStorage.setItem(STORAGE_KEYS.COUNCIL, JSON.stringify(typeof SEED_COUNCIL !== "undefined" ? SEED_COUNCIL : {}));
    localStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(typeof SEED_CLUBS !== "undefined" ? SEED_CLUBS : []));
    localStorage.setItem(STORAGE_KEYS.HEALTH, JSON.stringify(typeof SEED_HEALTH_RECORDS !== "undefined" ? SEED_HEALTH_RECORDS : {}));
    localStorage.setItem(STORAGE_KEYS.ELECTIONS, JSON.stringify(typeof SEED_ELECTIONS !== "undefined" ? SEED_ELECTIONS : []));
    localStorage.setItem(STORAGE_KEYS.GAMIFICATION, JSON.stringify(typeof SEED_GAMIFICATION !== "undefined" ? SEED_GAMIFICATION : {}));
    localStorage.setItem(STORAGE_KEYS.FUND, JSON.stringify(typeof SEED_FUND !== "undefined" ? SEED_FUND : {}));
    localStorage.setItem(STORAGE_KEYS.LOGBOOK, JSON.stringify(typeof SEED_LOGBOOK !== "undefined" ? SEED_LOGBOOK : []));
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(typeof SEED_RESOURCES !== "undefined" ? SEED_RESOURCES : []));
    localStorage.setItem(STORAGE_KEYS.CURRENT_CLASS, "8A");
  }

  static getSchoolInfo() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOOL)) || SEED_SCHOOL_INFO;
  }

  static saveSchoolInfo(data) {
    localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(data));
  }

  static getStudents() {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS));
    const list = (!raw || !Array.isArray(raw)) ? SEED_STUDENTS : raw;
    return list.map((st, i) => {
      const fatherDefault = st.fatherName || st.parentName || `លោក ${st.nameKh ? st.nameKh.split(' ')[0] : 'សុខ'} វិចិត្រ`;
      const motherDefault = st.motherName || "អ្នកស្រី កែវ ស្រីមុំ";
      const fatherJobDefault = st.fatherJob || (i % 3 === 0 ? "មន្ត្រីរាជការ" : i % 3 === 1 ? "គ្រូបង្រៀន" : "អាជីវករ");
      const motherJobDefault = st.motherJob || (i % 2 === 0 ? "មេផ្ទះ" : "អាជីវករ");

      const pobVillDefault = st.pobVillage || (i % 3 === 0 ? "ភូមិ១" : i % 3 === 1 ? "ព្រែកតាពៅ" : "ដើមស្លែង");
      const pobComDefault = st.pobCommune || (i % 4 === 0 ? "ទឹកល្អក់១" : i % 4 === 1 ? "ដើមមៀន" : i % 4 === 2 ? "រកាកោង" : "ព្រែកថ្មី");
      const pobDistDefault = st.pobDistrict || (i % 3 === 0 ? "ទួលគោក" : i % 3 === 1 ? "ក្រុងតាខ្មៅ" : "មុខកំពូល");
      const pobProvDefault = st.pobProvince || (i % 3 === 0 ? "រាជធានីភ្នំពេញ" : i % 3 === 1 ? "ខេត្តកណ្តាល" : "ខេត្តកំពង់ចាម");

      const curVillDefault = st.curVillage || (i % 3 === 0 ? "ភូមិ២" : i % 3 === 1 ? "ប៉ប្រក" : "ត្រពាំងឈូក");
      const curComDefault = st.curCommune || (i % 3 === 0 ? "ទឹកល្អក់១" : i % 3 === 1 ? "កាកាប" : "ទឹកថ្លា");
      const curDistDefault = st.curDistrict || (i % 3 === 0 ? "ទួលគោក" : i % 3 === 1 ? "ពោធិ៍សែនជ័យ" : "សែនសុខ");
      const curProvDefault = st.curProvince || "រាជធានីភ្នំពេញ";

      const studentPhoneDefault = st.studentPhone || (i % 2 === 0 ? `012 ${String(300 + i).padStart(3, '0')} ${String(400 + i).padStart(3, '0')}` : "");
      const parentPhoneDefault = st.parentPhone || `012 ${String(700 + i).padStart(3, '0')} ${String(800 + i).padStart(3, '0')}`;

      const fullPob = st.pob || [
        pobVillDefault ? 'ភូមិ' + pobVillDefault : '',
        pobComDefault ? 'ឃុំ/សង្កាត់' + pobComDefault : '',
        pobDistDefault ? 'ស្រុក/ខណ្ឌ' + pobDistDefault : '',
        pobProvDefault
      ].filter(Boolean).join(', ');

      const fullAddress = st.address || [
        curVillDefault ? 'ភូមិ' + curVillDefault : '',
        curComDefault ? 'ឃុំ/សង្កាត់' + curComDefault : '',
        curDistDefault ? 'ស្រុក/ខណ្ឌ' + curDistDefault : '',
        curProvDefault
      ].filter(Boolean).join(', ');

      return {
        ...st,
        fatherName: st.fatherName !== undefined && st.fatherName !== "" ? st.fatherName : fatherDefault,
        fatherJob: st.fatherJob !== undefined && st.fatherJob !== "" ? st.fatherJob : fatherJobDefault,
        motherName: st.motherName !== undefined && st.motherName !== "" ? st.motherName : motherDefault,
        motherJob: st.motherJob !== undefined && st.motherJob !== "" ? st.motherJob : motherJobDefault,
        parentName: st.parentName || st.fatherName || fatherDefault,
        pobVillage: st.pobVillage !== undefined && st.pobVillage !== "" ? st.pobVillage : pobVillDefault,
        pobCommune: st.pobCommune !== undefined && st.pobCommune !== "" ? st.pobCommune : pobComDefault,
        pobDistrict: st.pobDistrict !== undefined && st.pobDistrict !== "" ? st.pobDistrict : pobDistDefault,
        pobProvince: st.pobProvince !== undefined && st.pobProvince !== "" ? st.pobProvince : pobProvDefault,
        curVillage: st.curVillage !== undefined && st.curVillage !== "" ? st.curVillage : curVillDefault,
        curCommune: st.curCommune !== undefined && st.curCommune !== "" ? st.curCommune : curComDefault,
        curDistrict: st.curDistrict !== undefined && st.curDistrict !== "" ? st.curDistrict : curDistDefault,
        curProvince: st.curProvince !== undefined && st.curProvince !== "" ? st.curProvince : curProvDefault,
        pob: fullPob,
        address: fullAddress,
        studentPhone: st.studentPhone !== undefined ? st.studentPhone : studentPhoneDefault,
        parentPhone: st.parentPhone !== undefined && st.parentPhone !== "" ? st.parentPhone : parentPhoneDefault
      };
    });
  }

  static saveStudents(students) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }

  static getSubjects() {
    let subs = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS));
    if (!subs || !Array.isArray(subs) || subs.length === 0) return SEED_SUBJECTS;

    // Ensure home_eco (គេហវិទ្យា) is included if missing
    const hasHomeEco = subs.some(s => s.id === "home_eco" || (s.nameKh && s.nameKh.includes("គេហវិទ្យា")) || (s.name && s.name.includes("គេហវិទ្យា")));
    if (!hasHomeEco) {
      const defaultHomeEco = (typeof SEED_SUBJECTS !== "undefined" ? SEED_SUBJECTS.find(s => s.id === "home_eco") : null) || {
        id: "home_eco",
        name: "គេហវិទ្យា",
        nameKh: "គេហវិទ្យា",
        nameEn: "Home Economics",
        maxScore: 50,
        coef: 1,
        teacher: "អ្នកគ្រូ ឡុង ស្រីពៅ",
        color: "#ec4899",
        phone: "០១២ ៣៤៥ ៦៨០"
      };
      subs.push(defaultHomeEco);
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subs));
    }
    return subs;
  }

  static saveSubjects(subjects) {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }

  static getGrades() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.GRADES)) || {};
  }

  static saveGrades(grades) {
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  }

  static getAttendance() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || {};
  }

  static saveAttendance(attendance) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }

  static getDiscipline() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DISCIPLINE)) || [];
  }

  static saveDiscipline(records) {
    localStorage.setItem(STORAGE_KEYS.DISCIPLINE, JSON.stringify(records));
  }

  static getTimetable() {
    let tt = JSON.parse(localStorage.getItem(STORAGE_KEYS.TIMETABLE));
    if (!tt || !Array.isArray(tt) || tt.length === 0) return SEED_TIMETABLE.filter(s => !s.isBreak);
    
    // Filter out break slots (កាត់ម៉ោងសម្រាកចេញ)
    tt = tt.filter(s => !s.isBreak);

    // If the saved timetable only contains morning slots (or lacks shift markers), merge with SEED afternoon slots
    const hasAfternoon = tt.some(s => s.shift === 'afternoon' || (s.time && parseInt(s.time.split(':')[0], 10) >= 12));
    if (!hasAfternoon && typeof SEED_TIMETABLE !== "undefined") {
      const afternoonSlots = SEED_TIMETABLE.filter(s => s.shift === 'afternoon' && !s.isBreak);
      tt = [...tt.map(s => ({ ...s, shift: s.shift || 'morning' })), ...afternoonSlots];
    }
    return tt;
  }

  static saveTimetable(timetable) {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetable));
  }

  static getHomework() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HOMEWORK)) || (typeof SEED_HOMEWORK !== "undefined" ? SEED_HOMEWORK : []);
  }

  static saveHomework(homework) {
    localStorage.setItem(STORAGE_KEYS.HOMEWORK, JSON.stringify(homework));
  }

  static getQuestions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTIONS)) || (typeof SEED_QUESTIONS !== "undefined" ? SEED_QUESTIONS : []);
  }

  static saveQuestions(questions) {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }

  static getTextbooks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TEXTBOOKS)) || (typeof SEED_TEXTBOOKS !== "undefined" ? SEED_TEXTBOOKS : []);
  }

  static saveTextbooks(textbooks) {
    localStorage.setItem(STORAGE_KEYS.TEXTBOOKS, JSON.stringify(textbooks));
  }

  static getCouncil() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COUNCIL)) || (typeof SEED_COUNCIL !== "undefined" ? SEED_COUNCIL : {});
  }

  static saveCouncil(council) {
    localStorage.setItem(STORAGE_KEYS.COUNCIL, JSON.stringify(council));
  }

  static getClubs() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLUBS)) || (typeof SEED_CLUBS !== "undefined" ? SEED_CLUBS : []);
  }

  static saveClubs(clubs) {
    localStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(clubs));
  }

  static getSeating() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SEATING)) || null;
  }

  static saveSeating(seating) {
    localStorage.setItem(STORAGE_KEYS.SEATING, JSON.stringify(seating));
  }

  static getHealth() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HEALTH)) || (typeof SEED_HEALTH_RECORDS !== "undefined" ? SEED_HEALTH_RECORDS : {});
  }

  static saveHealth(health) {
    localStorage.setItem(STORAGE_KEYS.HEALTH, JSON.stringify(health));
  }

  static getElections() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ELECTIONS)) || (typeof SEED_ELECTIONS !== "undefined" ? SEED_ELECTIONS : []);
  }

  static saveElections(elections) {
    localStorage.setItem(STORAGE_KEYS.ELECTIONS, JSON.stringify(elections));
  }

  static getGamification() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.GAMIFICATION)) || (typeof SEED_GAMIFICATION !== "undefined" ? SEED_GAMIFICATION : { badges: [], studentStars: {}, history: [] });
  }

  static saveGamification(gamification) {
    localStorage.setItem(STORAGE_KEYS.GAMIFICATION, JSON.stringify(gamification));
  }

  static getFund() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FUND)) || (typeof SEED_FUND !== "undefined" ? SEED_FUND : { currency: "KHR", transactions: [] });
  }

  static saveFund(fund) {
    localStorage.setItem(STORAGE_KEYS.FUND, JSON.stringify(fund));
  }

  static getLogbook() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGBOOK)) || (typeof SEED_LOGBOOK !== "undefined" ? SEED_LOGBOOK : []);
  }

  static saveLogbook(logbook) {
    localStorage.setItem(STORAGE_KEYS.LOGBOOK, JSON.stringify(logbook));
  }

  static getResources() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RESOURCES)) || (typeof SEED_RESOURCES !== "undefined" ? SEED_RESOURCES : []);
  }

  static saveResources(resources) {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  }

  static exportBackupJSON() {
    const backup = {
      school: this.getSchoolInfo(),
      students: this.getStudents(),
      subjects: this.getSubjects(),
      grades: this.getGrades(),
      attendance: this.getAttendance(),
      discipline: this.getDiscipline(),
      timetable: this.getTimetable(),
      homework: this.getHomework(),
      questions: this.getQuestions(),
      textbooks: this.getTextbooks(),
      council: this.getCouncil(),
      clubs: this.getClubs(),
      seating: this.getSeating(),
      exportDate: new Date().toISOString(),
      version: "2.1"
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ថ្នាក់ទី_៨A_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static importBackupJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.students && Array.isArray(data.students)) {
        if (data.school) this.saveSchoolInfo(data.school);
        if (data.students) this.saveStudents(data.students);
        if (data.grades) this.saveGrades(data.grades);
        if (data.attendance) this.saveAttendance(data.attendance);
        if (data.discipline) this.saveDiscipline(data.discipline);
        if (data.homework) this.saveHomework(data.homework);
        if (data.questions) this.saveQuestions(data.questions);
        if (data.textbooks) this.saveTextbooks(data.textbooks);
        if (data.council) this.saveCouncil(data.council);
        if (data.clubs) this.saveClubs(data.clubs);
        if (data.seating) this.saveSeating(data.seating);
        return { success: true };
      }
      return { success: false, error: "ទម្រង់ឯកសារ JSON មិនត្រឹមត្រូវ" };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

// Auto init on load
StorageManager.init();
