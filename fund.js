/**
 * CLASSROOM FUND & TREASURY MANAGEMENT MODULE
 * Income, expenses, student contribution checklist, receipts & balance reports
 */

class FundModule {
  static init() {
    this.tableBody = document.getElementById("fundTransactionsTableBody");
    this.studentChecklistBody = document.getElementById("fundStudentChecklistBody");
    this.searchInput = document.getElementById("fundSearchInput");
    this.typeFilter = document.getElementById("fundTypeFilter");

    this.bindEvents();
    this.render();
  }

  static bindEvents() {
    const addBtn = document.getElementById("btnOpenAddFundModal");
    if (addBtn) {
      addBtn.addEventListener("click", () => this.openAddModal());
    }

    const form = document.getElementById("addFundForm");
    if (form) {
      form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    }

    if (this.searchInput) {
      this.searchInput.addEventListener("input", () => this.renderTransactions());
    }
    if (this.typeFilter) {
      this.typeFilter.addEventListener("change", () => this.renderTransactions());
    }

    const exportBtn = document.getElementById("btnExportFundExcel");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => this.exportToExcel());
    }

    const printBtn = document.getElementById("btnPrintFundReport");
    if (printBtn) {
      printBtn.addEventListener("click", () => window.print());
    }
  }

  static formatCurrency(amount) {
    return new Intl.NumberFormat('km-KH').format(amount) + " ៛";
  }

  static render() {
    this.renderStats();
    this.renderTransactions();
    this.renderStudentContributionChecklist();
  }

  static renderStats() {
    const fund = StorageManager.getFund();
    const transactions = fund.transactions || [];

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      if (t.type === "income") totalIncome += Number(t.amount || 0);
      else if (t.type === "expense") totalExpense += Number(t.amount || 0);
    });

    const balance = totalIncome - totalExpense;

    const balEl = document.getElementById("fundCurrentBalance");
    if (balEl) balEl.textContent = this.formatCurrency(balance);

    const incEl = document.getElementById("fundTotalIncome");
    if (incEl) incEl.textContent = this.formatCurrency(totalIncome);

    const expEl = document.getElementById("fundTotalExpense");
    if (expEl) expEl.textContent = this.formatCurrency(totalExpense);

    const countEl = document.getElementById("fundTotalTransactions");
    if (countEl) countEl.textContent = transactions.length + " ប្រតិបត្តិការ";
  }

  static renderTransactions() {
    const fund = StorageManager.getFund();
    let transactions = fund.transactions || [];
    const query = this.searchInput ? this.searchInput.value.toLowerCase().trim() : "";
    const type = this.typeFilter ? this.typeFilter.value : "all";

    if (type !== "all") {
      transactions = transactions.filter(t => t.type === type);
    }
    if (query) {
      transactions = transactions.filter(t => 
        (t.description && t.description.toLowerCase().includes(query)) ||
        (t.category && t.category.toLowerCase().includes(query)) ||
        (t.recordedBy && t.recordedBy.toLowerCase().includes(query))
      );
    }

    if (!this.tableBody) return;

    if (transactions.length === 0) {
      this.tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center p-4 text-muted font-khmer">
            <i class="fa-solid fa-receipt" style="font-size: 2rem; margin-bottom: 8px; display: block;"></i>
            មិនមានទិន្នន័យប្រតិបត្តិការត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ
          </td>
        </tr>
      `;
      return;
    }

    this.tableBody.innerHTML = transactions.map((t, idx) => {
      const isIncome = t.type === "income";
      const typeBadge = isIncome 
        ? `<span class="badge badge-soft-success"><i class="fa-solid fa-arrow-down-left"></i> ចំណូល</span>`
        : `<span class="badge badge-soft-danger"><i class="fa-solid fa-arrow-up-right"></i> ចំណាយ</span>`;
      
      const amountFormatted = isIncome 
        ? `<strong class="text-success font-mono">+${this.formatCurrency(t.amount)}</strong>`
        : `<strong class="text-danger font-mono">-${this.formatCurrency(t.amount)}</strong>`;

      return `
        <tr>
          <td class="text-center font-bold">${idx + 1}</td>
          <td><span class="font-mono" style="font-size: 0.85rem;">${t.date}</span></td>
          <td class="text-center">${typeBadge}</td>
          <td><span class="badge badge-soft-primary font-khmer">${t.category}</span></td>
          <td>
            <strong>${t.description}</strong>
            ${t.recordedBy ? `<br><small class="text-muted"><i class="fa-solid fa-user-pen" style="font-size:0.75rem;"></i> កត់ត្រាដោយ៖ ${t.recordedBy}</small>` : ''}
          </td>
          <td class="text-end">${amountFormatted}</td>
          <td class="text-center">
            <button class="btn-icon text-danger" onclick="FundModule.deleteTransaction('${t.id}')" title="លុប">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  static renderStudentContributionChecklist() {
    if (!this.studentChecklistBody) return;
    const students = StorageManager.getStudents();
    const fund = StorageManager.getFund();
    if (!fund.studentContributions) fund.studentContributions = {};

    let paidCount = 0;
    students.forEach(st => {
      if (fund.studentContributions[st.id] === true) paidCount++;
    });

    const statusBadge = document.getElementById("fundContributionStatusBadge");
    if (statusBadge) {
      statusBadge.textContent = `បានបង់ ${paidCount} / ${students.length} នាក់ (${((paidCount / (students.length || 1)) * 100).toFixed(0)}%)`;
    }

    this.studentChecklistBody.innerHTML = students.map((st, i) => {
      const isPaid = fund.studentContributions[st.id] === true;
      return `
        <tr>
          <td class="text-center font-bold">${i + 1}</td>
          <td><span class="badge badge-soft-primary font-mono">${st.id}</span></td>
          <td><strong>${st.nameKh}</strong></td>
          <td class="text-center">${st.gender}</td>
          <td class="text-center">
            <span class="badge ${isPaid ? 'badge-soft-success' : 'badge-soft-warning'}">
              ${isPaid ? '<i class="fa-solid fa-check"></i> បានបង់រួច (5,000 ៛)' : '<i class="fa-solid fa-clock"></i> មិនទាន់បង់'}
            </span>
          </td>
          <td class="text-center">
            <button class="btn btn-xs ${isPaid ? 'btn-outline text-warning' : 'btn-success'}" onclick="FundModule.toggleStudentContribution('${st.id}')">
              ${isPaid ? '<i class="fa-solid fa-rotate-left"></i> ប្តូរជាមិនទាន់បង់' : '<i class="fa-solid fa-check"></i> កត់ត្រាថាបានបង់'}
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  static toggleStudentContribution(studentId) {
    const fund = StorageManager.getFund();
    if (!fund.studentContributions) fund.studentContributions = {};
    fund.studentContributions[studentId] = !fund.studentContributions[studentId];
    StorageManager.saveFund(fund);
    this.renderStudentContributionChecklist();
    showToast("បានធ្វើបច្ចុប្បន្នភាពការបង់វិភាគទាន!", "info");
  }

  static openAddModal() {
    document.getElementById("fundDateInput").value = new Date().toISOString().split('T')[0];
    document.getElementById("fundAmountInput").value = "";
    document.getElementById("fundDescInput").value = "";
    document.getElementById("fundRecorderInput").value = "លោកគ្រូបន្ទុកថ្នាក់";
    openModal("addFundModal");
  }

  static handleFormSubmit(e) {
    e.preventDefault();
    const type = document.getElementById("fundTypeSelect").value;
    const category = document.getElementById("fundCategorySelect").value;
    const amount = parseFloat(document.getElementById("fundAmountInput").value);
    const date = document.getElementById("fundDateInput").value;
    const description = document.getElementById("fundDescInput").value.trim();
    const recordedBy = document.getElementById("fundRecorderInput").value.trim() || "លោកគ្រូបន្ទុកថ្នាក់";

    if (!amount || amount <= 0) {
      showToast("សូមបញ្ចូលចំនួនទឹកប្រាក់ឱ្យបានត្រឹមត្រូវ!", "error");
      return;
    }

    const fund = StorageManager.getFund();
    if (!fund.transactions) fund.transactions = [];

    const newTrx = {
      id: "TRX-" + Date.now(),
      date,
      type,
      category,
      amount,
      description,
      recordedBy
    };

    fund.transactions.unshift(newTrx);
    StorageManager.saveFund(fund);

    closeModal("addFundModal");
    this.render();
    showToast("បានកត់ត្រាប្រតិបត្តិការហិរញ្ញវត្ថុជោគជ័យ!", "success");
  }

  static deleteTransaction(trxId) {
    if (!confirm("តើអ្នកពិតជាចង់លុបកំណត់ត្រាប្រតិបត្តិការនេះមែនទេ?")) return;
    const fund = StorageManager.getFund();
    fund.transactions = (fund.transactions || []).filter(t => t.id !== trxId);
    StorageManager.saveFund(fund);
    this.render();
    showToast("បានលុបប្រតិបត្តិការរួចរាល់!", "info");
  }

  static exportToExcel() {
    const fund = StorageManager.getFund();
    const transactions = fund.transactions || [];

    const worksheetData = [
      ["ល.រ", "កាលបរិច្ឆេទ", "ប្រភេទ", "ជំពូក/ប្រភេទចំណាយ-ចំណូល", "បរិយាយ", "ចំនួនទឹកប្រាក់ (៛)", "កត់ត្រាដោយ"]
    ];

    transactions.forEach((t, i) => {
      worksheetData.push([
        i + 1,
        t.date,
        t.type === "income" ? "ចំណូល (+)" : "ចំណាយ (-)",
        t.category,
        t.description,
        t.amount,
        t.recordedBy || ""
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(wb, ws, "មូលនិធិថ្នាក់រៀន");
    XLSX.writeFile(wb, `របាយការណ៍មូលនិធិថ្នាក់រៀន_៨A_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast("បានទាញយកតារាង Excel មូលនិធិថ្នាក់រៀនរួចរាល់!", "success");
  }
}
