/**
 * STUDENT HEALTH, GROWTH & BMI TRACKER MODULE
 * (តាមដានសុខភាព កម្ពស់ ទម្ងន់ និង BMI សិស្ស)
 */

class HealthModule {
  static init() {
    this.renderOverview();
    this.renderHealthTable();
    this.setupEventListeners();
  }

  static calculateBMI(weightKg, heightCm) {
    if (!weightKg || !heightCm || heightCm <= 0) return { bmi: 0, category: "មិនទាន់មានទិន្នន័យ", badgeClass: "badge-light" };
    const hM = heightCm / 100;
    const bmi = parseFloat((weightKg / (hM * hM)).toFixed(1));

    // WHO Asian adolescent standards
    if (bmi < 18.5) {
      return { bmi, category: "ស្គមពេក (Underweight)", badgeClass: "badge-warning" };
    } else if (bmi <= 22.9) {
      return { bmi, category: "ស្តង់ដារល្អ (Normal)", badgeClass: "badge-success" };
    } else if (bmi <= 24.9) {
      return { bmi, category: "លើសទម្ងន់ (Overweight)", badgeClass: "badge-info" };
    } else {
      return { bmi, category: "ធាត់កម្រិត១ (Obese)", badgeClass: "badge-danger" };
    }
  }

  static renderOverview() {
    const students = StorageManager.getStudents();
    const healthData = StorageManager.getHealth();

    let totalH = 0;
    let totalW = 0;
    let counted = 0;
    let normalBMICount = 0;
    let allergyCount = 0;

    students.forEach((st, idx) => {
      // Default height/weight generator if not in healthData
      const hRec = healthData[st.id] || {
        height: 148 + (idx % 16),
        weight: 38 + (idx % 14),
        bloodType: ["A+", "B+", "O+", "AB+"][idx % 4],
        allergies: idx === 2 ? "អាឡែហ្ស៊ីគ្រឿងសមុទ្រ" : "គ្មាន"
      };

      totalH += hRec.height;
      totalW += hRec.weight;
      counted++;

      const bmiObj = this.calculateBMI(hRec.weight, hRec.height);
      if (bmiObj.bmi >= 18.5 && bmiObj.bmi <= 22.9) normalBMICount++;
      if (hRec.allergies && hRec.allergies !== "គ្មាន") allergyCount++;
    });

    const avgH = counted > 0 ? (totalH / counted).toFixed(1) : 0;
    const avgW = counted > 0 ? (totalW / counted).toFixed(1) : 0;
    const normalRate = counted > 0 ? Math.round((normalBMICount / counted) * 100) : 0;

    const elH = document.getElementById("healthAvgHeight");
    const elW = document.getElementById("healthAvgWeight");
    const elRate = document.getElementById("healthNormalRate");
    const elAllergy = document.getElementById("healthAllergyCount");

    if (elH) elH.innerText = `${avgH} cm`;
    if (elW) elW.innerText = `${avgW} kg`;
    if (elRate) elRate.innerText = `${normalRate}%`;
    if (elAllergy) elAllergy.innerText = `${allergyCount} នាក់`;
  }

  static renderHealthTable() {
    const tbody = document.getElementById("studentHealthTableBody");
    if (!tbody) return;

    const students = StorageManager.getStudents();
    const healthData = StorageManager.getHealth();

    tbody.innerHTML = students.map((st, idx) => {
      const hRec = healthData[st.id] || {
        height: 148 + (idx % 16),
        weight: 38 + (idx % 14),
        bloodType: ["A+", "B+", "O+", "AB+"][idx % 4],
        allergies: idx === 2 ? "អាឡែហ្ស៊ីគ្រឿងសមុទ្រ" : "គ្មាន",
        vision: "ធម្មតា (10/10)",
        lastCheckup: "2025-09-15"
      };

      const bmiObj = this.calculateBMI(hRec.weight, hRec.height);

      return `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td><code>${st.code}</code></td>
          <td><strong>${st.nameKh}</strong></td>
          <td style="text-align:center;">${st.gender}</td>
          <td style="text-align:center; font-weight:600;">${hRec.height} cm</td>
          <td style="text-align:center; font-weight:600;">${hRec.weight} kg</td>
          <td style="text-align:center; font-weight:700; color: #2563eb;">${bmiObj.bmi}</td>
          <td style="text-align:center;"><span class="badge ${bmiObj.badgeClass}">${bmiObj.category}</span></td>
          <td style="text-align:center;"><span class="badge badge-light font-bold">${hRec.bloodType || 'O+'}</span></td>
          <td><small class="${hRec.allergies && hRec.allergies !== 'គ្មាន' ? 'text-danger font-bold' : 'text-muted'}">${hRec.allergies || 'គ្មាន'}</small></td>
          <td style="text-align:center;">
            <button class="btn btn-sm btn-outline" onclick="HealthModule.openEditModal('${st.id}')">
              <i class="fa-solid fa-pen-to-square"></i> កែប្រែ
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  static openEditModal(studentId) {
    const students = StorageManager.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const healthData = StorageManager.getHealth();
    const hRec = healthData[student.id] || {
      height: 152,
      weight: 42,
      bloodType: "O+",
      allergies: "គ្មាន",
      vision: "ធម្មតា (10/10)"
    };

    document.getElementById("editHealthStudentId").value = student.id;
    document.getElementById("editHealthStudentName").innerText = `${student.nameKh} (${student.code})`;
    document.getElementById("editHealthHeight").value = hRec.height || 150;
    document.getElementById("editHealthWeight").value = hRec.weight || 40;
    document.getElementById("editHealthBlood").value = hRec.bloodType || "O+";
    document.getElementById("editHealthAllergies").value = hRec.allergies || "គ្មាន";
    document.getElementById("editHealthVision").value = hRec.vision || "ធម្មតា (10/10)";

    document.getElementById("editHealthModal").classList.add("active");
  }

  static saveHealthRecord() {
    const studentId = document.getElementById("editHealthStudentId").value;
    const height = parseFloat(document.getElementById("editHealthHeight").value) || 150;
    const weight = parseFloat(document.getElementById("editHealthWeight").value) || 40;
    const bloodType = document.getElementById("editHealthBlood").value;
    const allergies = document.getElementById("editHealthAllergies").value.trim() || "គ្មាន";
    const vision = document.getElementById("editHealthVision").value.trim();

    const healthData = StorageManager.getHealth();
    healthData[studentId] = {
      height,
      weight,
      bloodType,
      allergies,
      vision,
      lastCheckup: new Date().toISOString().split('T')[0]
    };

    StorageManager.saveHealth(healthData);
    this.renderOverview();
    this.renderHealthTable();
    document.getElementById("editHealthModal").classList.remove("active");
    App.showToast("បានរក្សាទុកកំណត់ត្រាសុខភាពសិស្សជោគជ័យ!", "success");
  }

  static exportExcel() {
    const students = StorageManager.getStudents();
    const healthData = StorageManager.getHealth();

    const data = students.map((st, idx) => {
      const hRec = healthData[st.id] || {
        height: 148 + (idx % 16),
        weight: 38 + (idx % 14),
        bloodType: "O+",
        allergies: "គ្មាន",
        vision: "ធម្មតា"
      };
      const bmiObj = this.calculateBMI(hRec.weight, hRec.height);
      return {
        "ល.រ": idx + 1,
        "អត្តលេខ": st.code,
        "គោត្តនាម និងនាម": st.nameKh,
        "ភេទ": st.gender,
        "កម្ពស់ (cm)": hRec.height,
        "ទម្ងន់ (kg)": hRec.weight,
        "សន្ទស្សន៍ BMI": bmiObj.bmi,
        "ស្ថានភាពសុខភាព": bmiObj.category,
        "ក្រុមឈាម": hRec.bloodType,
        "ប្រវត្តិអាឡែហ្ស៊ី": hRec.allergies,
        "កាលបរិច្ឆេទពិនិត្យ": hRec.lastCheckup || "2025-09-15"
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "សុខភាពសិស្ស");
    XLSX.writeFile(wb, `របាយការណ៍សុខភាពសិស្ស_ថ្នាក់ទី_៨A_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  static setupEventListeners() {
    const saveBtn = document.getElementById("btnSaveHealthRecord");
    if (saveBtn) saveBtn.addEventListener("click", () => this.saveHealthRecord());

    const closeBtn = document.getElementById("closeEditHealthModal");
    if (closeBtn) closeBtn.addEventListener("click", () => {
      document.getElementById("editHealthModal").classList.remove("active");
    });

    const exportBtn = document.getElementById("btnExportHealthExcel");
    if (exportBtn) exportBtn.addEventListener("click", () => this.exportExcel());
  }
}
