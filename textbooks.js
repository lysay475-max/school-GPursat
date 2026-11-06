/**
 * MINISTRY TEXTBOOKS & LIBRARY TRACKER MODULE (គ្រប់គ្រងសៀវភៅពុម្ព និងបណ្ណាល័យ)
 */

class TextbookManager {
  static init() {
    this.renderOverviewStats();
    this.renderInventoryTable();
    this.renderStudentTextbookTable();
    this.setupEventListeners();
  }

  static renderOverviewStats() {
    const textbooks = StorageManager.getTextbooks();
    const students = StorageManager.getStudents();

    let totalBooks = 0;
    let totalIssued = 0;
    let totalDamaged = 0;

    textbooks.forEach(tb => {
      totalBooks += (tb.totalQty || 0);
      totalIssued += (tb.issuedQty || 0);
      totalDamaged += (tb.damagedQty || 0);
    });

    const statTotal = document.getElementById("tbStatTotal");
    const statIssued = document.getElementById("tbStatIssued");
    const statAvailable = document.getElementById("tbStatAvailable");
    const statDamaged = document.getElementById("tbStatDamaged");

    if (statTotal) statTotal.innerText = totalBooks;
    if (statIssued) statIssued.innerText = totalIssued;
    if (statAvailable) statAvailable.innerText = Math.max(0, totalBooks - totalIssued - totalDamaged);
    if (statDamaged) statDamaged.innerText = totalDamaged;
  }

  static renderInventoryTable() {
    const tbody = document.getElementById("textbookInventoryBody");
    if (!tbody) return;

    const textbooks = StorageManager.getTextbooks();

    tbody.innerHTML = textbooks.map((tb, idx) => {
      const avail = (tb.totalQty || 0) - (tb.issuedQty || 0) - (tb.damagedQty || 0);
      return `
        <tr>
          <td style="text-align:center; font-weight:bold;">${idx + 1}</td>
          <td><strong>${tb.title}</strong></td>
          <td>${tb.subject}</td>
          <td style="text-align:center; font-weight:600;">${tb.totalQty}</td>
          <td style="text-align:center; color: #2563eb; font-weight:600;">${tb.issuedQty}</td>
          <td style="text-align:center; color: #16a34a; font-weight:600;">${Math.max(0, avail)}</td>
          <td style="text-align:center; color: #dc2626; font-weight:600;">${tb.damagedQty}</td>
          <td style="text-align:center;">
            <button class="btn btn-sm btn-outline" onclick="TextbookManager.editInventoryPrompt('${tb.id}')">
              <i class="fa-solid fa-pen-to-square"></i> កែប្រែ
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  static renderStudentTextbookTable() {
    const tbody = document.getElementById("studentTextbookBody");
    if (!tbody) return;

    const students = StorageManager.getStudents();
    const textbooks = StorageManager.getTextbooks();

    tbody.innerHTML = students.map((st, idx) => {
      return `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td><code>${st.code}</code></td>
          <td><strong>${st.nameKh}</strong></td>
          <td style="text-align:center;">${st.gender}</td>
          <td style="text-align:center;">
            <span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> បានបើកគ្រប់ (៦ ក្បាល)</span>
          </td>
          <td style="text-align:center;">
            <span class="badge badge-primary">រក្សាទុកបានល្អ</span>
          </td>
          <td style="text-align:center;">
            <button class="btn btn-sm btn-outline" onclick="TextbookManager.viewStudentBooksModal('${st.id}')">
              <i class="fa-solid fa-list-check"></i> ពិនិត្យបញ្ជី
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  static viewStudentBooksModal(studentId) {
    const students = StorageManager.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const textbooks = StorageManager.getTextbooks();

    const body = document.getElementById("studentBooksModalBody");
    if (!body) return;

    body.innerHTML = `
      <div class="student-tb-modal-header mb-3">
        <h3 class="moul-title text-primary">${student.nameKh} (${student.code})</h3>
        <p class="text-muted">បញ្ជីសៀវភៅពុម្ពក្រសួងដែលបានទទួលសម្រាប់ឆ្នាំសិក្សា</p>
      </div>

      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>ល.រ</th>
              <th>ឈ្មោះសៀវភៅពុម្ព</th>
              <th>ស្ថានភាពទទួល</th>
              <th>ស្ថានភាពសង</th>
            </tr>
          </thead>
          <tbody>
            ${textbooks.map((tb, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${tb.title}</strong></td>
                <td><span class="badge badge-success">✓ បានបើកទទួល</span></td>
                <td><span class="badge badge-info">កំពុងប្រើប្រាស់</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="alert alert-info mt-3">
        <i class="fa-solid fa-circle-info"></i> សៀវភៅពុម្ពទាំងអស់ត្រូវបានផ្ទៀងផ្ទាត់ដោយគ្រូបន្ទុកថ្នាក់។ សិស្សមានកាតព្វកិច្ចថែរក្សា និងប្រគល់ជូនសាលាវិញនៅដំណាច់ឆ្នាំសិក្សា។
      </div>
    `;

    document.getElementById("studentBooksModal").classList.add("active");
  }

  static editInventoryPrompt(tbId) {
    const textbooks = StorageManager.getTextbooks();
    const tb = textbooks.find(t => t.id === tbId);
    if (!tb) return;

    const newTotalStr = prompt(`បញ្ចូលចំនួនសរុបថ្មីសម្រាប់ "${tb.title}"៖`, tb.totalQty);
    if (newTotalStr === null) return;
    const newTotal = parseInt(newTotalStr, 10);
    if (isNaN(newTotal) || newTotal < 0) {
      alert("ចំនួនមិនត្រឹមត្រូវ!");
      return;
    }

    const newDamagedStr = prompt(`បញ្ចូលចំនួនខូចខាត/បាត់បង់សម្រាប់ "${tb.title}"៖`, tb.damagedQty);
    if (newDamagedStr === null) return;
    const newDamaged = parseInt(newDamagedStr, 10);
    if (isNaN(newDamaged) || newDamaged < 0) {
      alert("ចំនួនមិនត្រឹមត្រូវ!");
      return;
    }

    tb.totalQty = newTotal;
    tb.damagedQty = newDamaged;

    StorageManager.saveTextbooks(textbooks);
    this.renderOverviewStats();
    this.renderInventoryTable();
    App.showToast("បានកែប្រែចំនួនសៀវភៅពុម្ពដោយជោគជ័យ!", "success");
  }

  static exportTextbooksExcel() {
    const textbooks = StorageManager.getTextbooks();
    const data = textbooks.map((tb, idx) => ({
      "ល.រ": idx + 1,
      "ឈ្មោះសៀវភៅពុម្ព": tb.title,
      "មុខវិជ្ជា": tb.subject,
      "ចំនួនសរុបក្នុងស្តុក": tb.totalQty,
      "ចំនួនបានចែកសិស្ស": tb.issuedQty,
      "ចំនួននៅសល់": Math.max(0, (tb.totalQty || 0) - (tb.issuedQty || 0) - (tb.damagedQty || 0)),
      "ចំនួនខូចខាត/បាត់បង់": tb.damagedQty
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "សៀវភៅពុម្ព");
    XLSX.writeFile(wb, `របាយការណ៍សៀវភៅពុម្ព_ថ្នាក់ទី_៨A_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  static setupEventListeners() {
    const btnExcel = document.getElementById("btnExportTextbooksExcel");
    if (btnExcel) btnExcel.addEventListener("click", () => this.exportTextbooksExcel());

    const btnCloseModal = document.getElementById("closeStudentBooksModal");
    if (btnCloseModal) btnCloseModal.addEventListener("click", () => {
      document.getElementById("studentBooksModal").classList.remove("active");
    });
  }
}
