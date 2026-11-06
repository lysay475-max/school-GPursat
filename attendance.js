/**
 * ATTENDANCE MODULE
 */

class AttendanceModule {
  static init() {
    this.tableBody = document.getElementById("attendanceTableBody");
    this.datePicker = document.getElementById("attendanceDatePicker");
    this.prevBtn = document.getElementById("attendancePrevDayBtn");
    this.todayBtn = document.getElementById("attendanceTodayBtn");
    this.nextBtn = document.getElementById("attendanceNextDayBtn");
    this.markAllBtn = document.getElementById("markAllPresentBtn");
    this.saveBtn = document.getElementById("saveAttendanceBtn");
    this.exportBtn = document.getElementById("exportAttendanceExcelBtn");
    this.matrixBtn = document.getElementById("toggleMonthlyAttendanceModalBtn");
    this.matrixMonthSelect = document.getElementById("monthlyMatrixMonthSelect");
    this.exportMatrixBtn = document.getElementById("exportMonthlyMatrixExcelBtn");

    const todayStr = new Date().toISOString().split('T')[0];
    if (this.datePicker) {
      this.datePicker.value = todayStr;
    }

    this.bindEvents();
    this.render();
  }

  static bindEvents() {
    if (this.datePicker) {
      this.datePicker.addEventListener("change", () => this.render());
    }
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => this.shiftDate(-1));
    }
    if (this.todayBtn) {
      this.todayBtn.addEventListener("click", () => {
        this.datePicker.value = new Date().toISOString().split('T')[0];
        this.render();
      });
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.shiftDate(1));
    }
    if (this.markAllBtn) {
      this.markAllBtn.addEventListener("click", () => this.markAllPresent());
    }
    if (this.saveBtn) {
      this.saveBtn.addEventListener("click", () => this.saveCurrentDayAttendance());
    }
    if (this.exportBtn) {
      this.exportBtn.addEventListener("click", () => this.exportDailyAttendanceExcel());
    }
    if (this.matrixBtn) {
      this.matrixBtn.addEventListener("click", () => this.openMonthlyMatrixModal());
    }
    if (this.matrixMonthSelect) {
      this.matrixMonthSelect.addEventListener("change", () => this.renderMonthlyMatrix());
    }
    if (this.exportMatrixBtn) {
      this.exportMatrixBtn.addEventListener("click", () => this.exportMonthlyMatrixExcel());
    }
  }

  static shiftDate(days) {
    const current = new Date(this.datePicker.value || new Date());
    current.setDate(current.getDate() + days);
    this.datePicker.value = current.toISOString().split('T')[0];
    this.render();
  }

  static getSelectedDate() {
    return this.datePicker ? this.datePicker.value : new Date().toISOString().split('T')[0];
  }

  static markAllPresent() {
    const radios = document.querySelectorAll('input[type="radio"][value="P"]');
    radios.forEach(r => {
      r.checked = true;
    });
    this.updateStatsBar();
    showToast("បានកំណត់វត្តមាន (មក) ដល់សិស្សទាំងអស់!", "success");
  }

  static saveCurrentDayAttendance() {
    const date = this.getSelectedDate();
    const students = StorageManager.getStudents();
    const allAttendance = StorageManager.getAttendance();

    if (!allAttendance[date]) allAttendance[date] = {};

    students.forEach(st => {
      const selectedRadio = document.querySelector(`input[name="att_${st.id}"]:checked`);
      const noteInput = document.getElementById(`att_note_${st.id}`);
      const status = selectedRadio ? selectedRadio.value : "P";
      const note = noteInput ? noteInput.value.trim() : "";

      allAttendance[date][st.id] = { status, note };
    });

    StorageManager.saveAttendance(allAttendance);
    showToast(`បានរក្សាទុកវត្តមានសម្រាប់ថ្ងៃ ${date} ជោគជ័យ!`, "success");
    this.updateStatsBar();
    
    if (window.App) App.renderDashboard();
  }

  static updateStatsBar() {
    const date = this.getSelectedDate();
    const allAttendance = StorageManager.getAttendance();
    const dayRecords = allAttendance[date] || {};
    const students = StorageManager.getStudents();

    let present = 0;
    let permission = 0;
    let absent = 0;
    let late = 0;

    students.forEach(st => {
      const rec = dayRecords[st.id] || { status: "P" };
      if (rec.status === "P") present++;
      else if (rec.status === "L") permission++;
      else if (rec.status === "A") absent++;
      else if (rec.status === "T") late++;
    });

    const totalEl = document.getElementById("attStatTotal");
    const presentEl = document.getElementById("attStatPresent");
    const permEl = document.getElementById("attStatPermission");
    const absentEl = document.getElementById("attStatAbsent");
    const lateEl = document.getElementById("attStatLate");

    if (totalEl) totalEl.textContent = students.length;
    if (presentEl) presentEl.textContent = present;
    if (permEl) permEl.textContent = permission;
    if (absentEl) absentEl.textContent = absent;
    if (lateEl) lateEl.textContent = late;
  }

  static getMonthlyAbsenceCount(studentId) {
    const allAttendance = StorageManager.getAttendance();
    let absentCount = 0;
    let permCount = 0;

    Object.keys(allAttendance).forEach(dateStr => {
      const rec = allAttendance[dateStr][studentId];
      if (rec) {
        if (rec.status === "A") absentCount++;
        if (rec.status === "L") permCount++;
      }
    });

    return { absentCount, permCount };
  }

  static render() {
    const date = this.getSelectedDate();
    const students = StorageManager.getStudents();
    const allAttendance = StorageManager.getAttendance();
    const dayRecords = allAttendance[date] || {};

    if (!this.tableBody) return;

    this.tableBody.innerHTML = students.map((st, index) => {
      const rec = dayRecords[st.id] || { status: "P", note: "" };
      const status = rec.status || "P";
      const note = rec.note || "";
      const stats = this.getMonthlyAbsenceCount(st.id);

      return `
        <tr>
          <td class="text-center font-bold">${index + 1}</td>
          <td><span class="badge badge-soft-primary font-mono">${st.id}</span></td>
          <td>
            <div class="student-name-kh">${st.nameKh}</div>
            <small class="text-muted">${st.nameEn}</small>
          </td>
          <td class="text-center ${st.gender === 'ស្រី' ? 'text-accent' : 'text-primary'} font-bold">${st.gender}</td>
          <td>
            <div class="attendance-radio-group">
              <label class="att-radio-label att-radio-p" title="វត្តមាន">
                <input type="radio" name="att_${st.id}" value="P" ${status === 'P' ? 'checked' : ''} onchange="AttendanceModule.updateStatsBar()">
                <i class="fa-solid fa-check"></i> វត្តមាន (មក)
              </label>
              <label class="att-radio-label att-radio-l" title="មានច្បាប់ (Permission)">
                <input type="radio" name="att_${st.id}" value="L" ${status === 'L' ? 'checked' : ''} onchange="AttendanceModule.updateStatsBar()">
                <i class="fa-solid fa-envelope-open-text"></i> ច្បាប់
              </label>
              <label class="att-radio-label att-radio-a" title="ឥតច្បាប់ (Absent)">
                <input type="radio" name="att_${st.id}" value="A" ${status === 'A' ? 'checked' : ''} onchange="AttendanceModule.updateStatsBar()">
                <i class="fa-solid fa-xmark"></i> ឥតច្បាប់
              </label>
              <label class="att-radio-label att-radio-t" title="យឺត (Late)">
                <input type="radio" name="att_${st.id}" value="T" ${status === 'T' ? 'checked' : ''} onchange="AttendanceModule.updateStatsBar()">
                <i class="fa-regular fa-clock"></i> យឺត
              </label>
            </div>
          </td>
          <td>
            <input type="text" id="att_note_${st.id}" class="form-input-sm w-100" value="${note}" placeholder="មូលហេតុ...">
          </td>
          <td class="text-center">
            <span class="badge ${stats.absentCount > 0 ? 'badge-soft-danger' : 'badge-soft-success'}">
              ឥតច្បាប់៖ ${stats.absentCount} | ច្បាប់៖ ${stats.permCount}
            </span>
          </td>
        </tr>
      `;
    }).join("");

    this.updateStatsBar();
  }

  static openMonthlyMatrixModal() {
    openModal("monthlyAttendanceModal");
    this.renderMonthlyMatrix();
  }

  static renderMonthlyMatrix() {
    const table = document.getElementById("monthlyAttendanceMatrixTable");
    if (!table) return;

    const monthVal = parseInt(document.getElementById("monthlyMatrixMonthSelect").value || "10", 10);
    const year = 2025;
    const daysInMonth = new Date(year, monthVal, 0).getDate();

    const students = StorageManager.getStudents();
    const allAttendance = StorageManager.getAttendance();

    // Table Header
    let theadHtml = `
      <tr>
        <th style="width: 40px;">ល.រ</th>
        <th style="width: 140px;">ឈ្មោះសិស្ស</th>
        <th style="width: 50px;">ភេទ</th>
    `;
    for (let d = 1; d <= daysInMonth; d++) {
      theadHtml += `<th style="width: 28px; text-align: center; padding: 4px 2px;">${d}</th>`;
    }
    theadHtml += `
        <th style="width: 60px;">វត្តមាន</th>
        <th style="width: 60px;">ច្បាប់</th>
        <th style="width: 60px;">ឥតច្បាប់</th>
      </tr>
    `;
    table.querySelector("thead").innerHTML = theadHtml;

    // Table Body
    const tbodyHtml = students.map((st, i) => {
      let pCount = 0;
      let lCount = 0;
      let aCount = 0;

      let daysCells = "";
      for (let d = 1; d <= daysInMonth; d++) {
        const dStr = `${year}-${monthVal.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
        const dayRec = allAttendance[dStr] ? allAttendance[dStr][st.id] : null;
        
        let symbol = "-";
        let colorClass = "text-muted";

        if (dayRec) {
          if (dayRec.status === "P") { symbol = "P"; colorClass = "text-success font-bold"; pCount++; }
          else if (dayRec.status === "L") { symbol = "L"; colorClass = "text-info font-bold"; lCount++; }
          else if (dayRec.status === "A") { symbol = "A"; colorClass = "text-danger font-bold"; aCount++; }
          else if (dayRec.status === "T") { symbol = "T"; colorClass = "text-warning font-bold"; }
        }

        daysCells += `<td class="text-center ${colorClass}" style="padding: 4px 2px; font-size: 0.75rem;">${symbol}</td>`;
      }

      return `
        <tr>
          <td class="text-center">${i + 1}</td>
          <td><strong>${st.nameKh}</strong></td>
          <td class="text-center">${st.gender}</td>
          ${daysCells}
          <td class="text-center text-success font-bold">${pCount}</td>
          <td class="text-center text-info font-bold">${lCount}</td>
          <td class="text-center text-danger font-bold">${aCount}</td>
        </tr>
      `;
    }).join("");

    document.getElementById("monthlyAttendanceMatrixBody").innerHTML = tbodyHtml;
  }

  static exportDailyAttendanceExcel() {
    const date = this.getSelectedDate();
    const students = StorageManager.getStudents();
    const allAttendance = StorageManager.getAttendance();
    const dayRecords = allAttendance[date] || {};

    const rows = [
      ["បញ្ជីវត្តមានសិស្សប្រចាំថ្ងៃ", date],
      ["ល.រ", "អត្តលេខ", "គោត្តនាម-នាម", "ភេទ", "ស្ថានភាពវត្តមាន", "មូលហេតុ/ចំណាំ"]
    ];

    students.forEach((st, i) => {
      const rec = dayRecords[st.id] || { status: "P", note: "" };
      const statusLabel = rec.status === "P" ? "វត្តមាន (មក)" :
                          rec.status === "L" ? "មានច្បាប់ (L)" :
                          rec.status === "A" ? "ឥតច្បាប់ (A)" : "យឺត (T)";
      rows.push([
        i + 1,
        st.id,
        st.nameKh,
        st.gender,
        statusLabel,
        rec.note || ""
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "វត្តមានថ្ងៃនេះ");
    XLSX.writeFile(wb, `វត្តមានសិស្ស_${date}.xlsx`);
    showToast("បានទាញយក Excel វត្តមានថ្ងៃនេះរួចរាល់!", "success");
  }

  static exportMonthlyMatrixExcel() {
    const table = document.getElementById("monthlyAttendanceMatrixTable");
    if (!table) return;
    const wb = XLSX.utils.table_to_book(table, { sheet: "វត្តមានប្រចាំខែ" });
    XLSX.writeFile(wb, `តារាងបូកសរុបវត្តមានប្រចាំខែ_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast("បានទាញយក Excel វត្តមានប្រចាំខែរួចរាល់!", "success");
  }
}
