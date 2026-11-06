/**
 * STUDENTS MANAGEMENT MODULE (WITH QR CODE INTEGRATION)
 */

class StudentsModule {
  static init() {
    this.tableBody = document.getElementById("studentsTableBody");
    this.searchInput = document.getElementById("studentTableSearch");
    this.genderFilter = document.getElementById("studentGenderFilter");
    this.statusFilter = document.getElementById("studentStatusFilter");
    this.studentForm = document.getElementById("studentForm");
    this.addBtn = document.getElementById("addNewStudentModalBtn");
    this.exportBtn = document.getElementById("exportStudentsExcelBtn");
    this.printBtn = document.getElementById("printStudentListBtn");
    this.randomAvatarBtn = document.getElementById("randomizeAvatarBtn");

    this.bindEvents();
    this.render();
  }

  static bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener("input", () => this.render());
    }
    if (this.genderFilter) {
      this.genderFilter.addEventListener("change", () => this.render());
    }
    if (this.statusFilter) {
      this.statusFilter.addEventListener("change", () => this.render());
    }
    if (this.addBtn) {
      this.addBtn.addEventListener("click", () => this.openAddModal());
    }
    if (this.studentForm) {
      this.studentForm.addEventListener("submit", (e) => this.handleFormSubmit(e));
    }
    if (this.exportBtn) {
      this.exportBtn.addEventListener("click", () => this.exportToExcel());
    }
    if (this.printBtn) {
      this.printBtn.addEventListener("click", () => window.print());
    }
    if (this.randomAvatarBtn) {
      this.randomAvatarBtn.addEventListener("click", () => {
        const randomSeed = Math.random().toString(36).substring(7);
        const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`;
        document.getElementById("studentPhotoUrl").value = avatarUrl;
        document.getElementById("formAvatarPreview").src = avatarUrl;
      });
    }

    const photoInput = document.getElementById("studentPhotoUrl");
    if (photoInput) {
      photoInput.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        if (val) {
          document.getElementById("formAvatarPreview").src = val;
        }
      });
    }

    const printCardBtn = document.getElementById("printSingleIdCardBtn");
    if (printCardBtn) {
      printCardBtn.addEventListener("click", () => window.print());
    }
  }

  static getFilteredStudents() {
    const students = StorageManager.getStudents();
    const query = this.searchInput ? this.searchInput.value.toLowerCase().trim() : "";
    const gender = this.genderFilter ? this.genderFilter.value : "all";
    const status = this.statusFilter ? this.statusFilter.value : "all";

    return students.filter(st => {
      const matchQuery = !query || 
        (st.nameKh && st.nameKh.toLowerCase().includes(query)) || 
        (st.nameEn && st.nameEn.toLowerCase().includes(query)) || 
        (st.id && st.id.toLowerCase().includes(query)) ||
        (st.studentPhone && st.studentPhone.includes(query)) ||
        (st.parentPhone && st.parentPhone.includes(query)) ||
        (st.pob && st.pob.toLowerCase().includes(query)) ||
        (st.address && st.address.toLowerCase().includes(query)) ||
        (st.fatherName && st.fatherName.toLowerCase().includes(query)) ||
        (st.motherName && st.motherName.toLowerCase().includes(query));

      const matchGender = gender === "all" || st.gender === gender;
      const matchStatus = status === "all" || st.status === status;

      return matchQuery && matchGender && matchStatus;
    });
  }

  static formatPob(st) {
    if (st.pobVillage || st.pobCommune || st.pobDistrict || st.pobProvince) {
      const parts = [];
      if (st.pobVillage) parts.push(`ភូមិ${st.pobVillage.replace(/^ភូមិ/, '')}`);
      if (st.pobCommune) parts.push(`ឃុំ/សង្កាត់${st.pobCommune.replace(/^(ឃុំ|សង្កាត់)/, '')}`);
      if (st.pobDistrict) parts.push(`ស្រុក/ខណ្ឌ${st.pobDistrict.replace(/^(ស្រុក|ខណ្ឌ)/, '')}`);
      if (st.pobProvince) parts.push(st.pobProvince);
      return parts.join(', ');
    }
    return st.pob || "រាជធានីភ្នំពេញ";
  }

  static formatCurAddress(st) {
    if (st.curVillage || st.curCommune || st.curDistrict || st.curProvince) {
      const parts = [];
      if (st.curVillage) parts.push(`ភូមិ${st.curVillage.replace(/^ភូមិ/, '')}`);
      if (st.curCommune) parts.push(`ឃុំ/សង្កាត់${st.curCommune.replace(/^(ឃុំ|សង្កាត់)/, '')}`);
      if (st.curDistrict) parts.push(`ស្រុក/ខណ្ឌ${st.curDistrict.replace(/^(ស្រុក|ខណ្ឌ)/, '')}`);
      if (st.curProvince) parts.push(st.curProvince);
      return parts.join(', ');
    }
    return st.address || "រាជធានីភ្នំពេញ";
  }

  static render() {
    const filtered = this.getFilteredStudents();
    const allStudents = StorageManager.getStudents();

    // Update badges & stats
    const totalCount = allStudents.length;
    const femaleCount = allStudents.filter(s => s.gender === "ស្រី").length;
    const maleCount = totalCount - femaleCount;

    const countBadge = document.getElementById("studentCountBadge");
    if (countBadge) countBadge.textContent = totalCount;

    const subTitle = document.getElementById("studentsListSubtitle");
    if (subTitle) {
      subTitle.textContent = `សរុប ${totalCount} នាក់ (ស្រី ${femaleCount} នាក់, ប្រុស ${maleCount} នាក់)`;
    }

    const infoText = document.getElementById("studentTableInfoText");
    if (infoText) {
      infoText.textContent = `បង្ហាញ ${filtered.length} នៃ ${totalCount} សិស្សក្នុងបញ្ជី`;
    }

    if (!this.tableBody) return;

    if (filtered.length === 0) {
      this.tableBody.innerHTML = `
        <tr>
          <td colspan="11" class="text-center p-4 text-muted">
            <i class="fa-solid fa-user-slash" style="font-size: 2rem; margin-bottom: 8px; display: block;"></i>
            មិនមានទិន្នន័យសិស្សត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ
          </td>
        </tr>
      `;
      return;
    }

    this.tableBody.innerHTML = filtered.map((st, index) => {
      const fallbackPhoto = `https://api.dicebear.com/7.x/bottts/svg?seed=${st.id}`;
      const photoSrc = st.photo || fallbackPhoto;
      
      const statusBadge = st.status === "កំពុងរៀន"
        ? `<span class="badge badge-soft-success">${st.status}</span>`
        : st.status === "ផ្អាកការសិក្សា"
        ? `<span class="badge badge-soft-warning">${st.status}</span>`
        : `<span class="badge badge-soft-danger">${st.status}</span>`;

      const pobDisplay = this.formatPob(st);
      const curAddressDisplay = this.formatCurAddress(st);

      const fatherLine = st.fatherName 
        ? `<div style="font-size:0.83rem; white-space:nowrap;"><i class="fa-solid fa-user-tie text-primary" style="font-size:0.75rem;"></i> <strong>${st.fatherName}</strong> ${st.fatherJob ? `<small class="text-muted">(${st.fatherJob})</small>` : ''}</div>`
        : (st.parentName ? `<div style="font-size:0.83rem;"><strong>${st.parentName}</strong></div>` : '');

      const motherLine = st.motherName 
        ? `<div style="font-size:0.83rem; white-space:nowrap;"><i class="fa-solid fa-person-dress text-accent" style="font-size:0.75rem;"></i> <strong>${st.motherName}</strong> ${st.motherJob ? `<small class="text-muted">(${st.motherJob})</small>` : ''}</div>`
        : '';

      const phoneContent = `
        <div style="font-size:0.82rem; line-height:1.4;">
          ${st.studentPhone ? `<div><i class="fa-solid fa-mobile-screen text-info" style="font-size:0.75rem;"></i> <span class="font-mono">${st.studentPhone}</span></div>` : ''}
          ${st.parentPhone ? `<div><i class="fa-solid fa-phone text-success" style="font-size:0.75rem;"></i> <span class="font-mono">${st.parentPhone}</span></div>` : ''}
          ${!st.studentPhone && !st.parentPhone ? '<span class="text-muted">-</span>' : ''}
        </div>
      `;

      return `
        <tr>
          <td class="text-center font-bold">${index + 1}</td>
          <td><span class="badge badge-soft-primary font-mono">${st.id}</span></td>
          <td>
            <div class="student-row-flex">
              <img src="${photoSrc}" alt="${st.nameKh}" class="student-table-avatar" onerror="this.src='${fallbackPhoto}'">
              <div>
                <div class="student-name-kh">${st.nameKh}</div>
                <div class="student-name-en">${st.nameEn}</div>
              </div>
            </div>
          </td>
          <td class="text-center font-bold ${st.gender === 'ស្រី' ? 'text-accent' : 'text-primary'}">${st.gender}</td>
          <td><span class="font-mono" style="font-size:0.85rem;">${st.dob || '-'}</span></td>
          <td><div style="font-size:0.82rem; max-width:180px; line-height:1.35;" title="${pobDisplay}"><i class="fa-solid fa-hospital-user text-primary" style="font-size:0.72rem;"></i> ${pobDisplay}</div></td>
          <td><div style="font-size:0.82rem; max-width:180px; line-height:1.35;" title="${curAddressDisplay}"><i class="fa-solid fa-location-dot text-danger" style="font-size:0.72rem;"></i> ${curAddressDisplay}</div></td>
          <td>
            ${fatherLine || motherLine ? `${fatherLine}${motherLine}` : '<span class="text-muted">-</span>'}
          </td>
          <td>${phoneContent}</td>
          <td class="text-center">${statusBadge}</td>
          <td class="text-center">
            <div class="table-action-btns">
              <button class="btn-icon text-accent" onclick="StudentsModule.viewCard('${st.id}')" title="កាតសិស្ស & QR">
                <i class="fa-solid fa-qrcode"></i>
              </button>
              <button class="btn-icon text-primary" onclick="StudentsModule.openEditModal('${st.id}')" title="កែប្រែ">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn-icon text-info" onclick="TelegramModule.openSendModal('${st.id}')" title="ផ្ញើសារ Telegram">
                <i class="fa-brands fa-telegram"></i>
              </button>
              <button class="btn-icon text-danger" onclick="StudentsModule.deleteStudent('${st.id}')" title="លុប">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  static openAddModal() {
    const students = StorageManager.getStudents();
    const nextNum = (students.length + 1).toString().padStart(3, '0');
    const newId = `STU-8A-${nextNum}`;

    document.getElementById("studentModalTitle").innerHTML = `<i class="fa-solid fa-user-plus text-primary"></i> បន្ថែមសិស្សថ្មី`;
    document.getElementById("studentFormIndex").value = "-1";
    document.getElementById("studentIdInput").value = newId;
    document.getElementById("studentIdInput").disabled = false;
    document.getElementById("studentKhmerName").value = "";
    document.getElementById("studentLatinName").value = "";
    document.getElementById("studentGenderSelect").value = "ស្រី";
    document.getElementById("studentDobInput").value = "2012-01-01";
    document.getElementById("studentStatusSelect").value = "កំពុងរៀន";
    document.getElementById("studentPhoneInput").value = "";

    // Reset POB
    document.getElementById("studentPobVillage").value = "";
    document.getElementById("studentPobCommune").value = "";
    document.getElementById("studentPobDistrict").value = "";
    document.getElementById("studentPobProvince").value = "រាជធានីភ្នំពេញ";

    // Reset Current Address
    document.getElementById("studentCurVillage").value = "";
    document.getElementById("studentCurCommune").value = "";
    document.getElementById("studentCurDistrict").value = "";
    document.getElementById("studentCurProvince").value = "រាជធានីភ្នំពេញ";

    // Reset Parents
    document.getElementById("studentFatherName").value = "";
    document.getElementById("studentFatherJob").value = "";
    document.getElementById("studentMotherName").value = "";
    document.getElementById("studentMotherJob").value = "";
    document.getElementById("studentParentPhone").value = "";
    document.getElementById("studentNoteInput").value = "";
    
    const randomAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${newId}`;
    document.getElementById("studentPhotoUrl").value = randomAvatar;
    document.getElementById("formAvatarPreview").src = randomAvatar;

    openModal("studentModal");
  }

  static openEditModal(studentId) {
    const students = StorageManager.getStudents();
    const st = students.find(s => s.id === studentId);
    if (!st) return;

    document.getElementById("studentModalTitle").innerHTML = `<i class="fa-solid fa-user-pen text-primary"></i> កែប្រែព័ត៌មានសិស្ស (${st.id})`;
    document.getElementById("studentFormIndex").value = studentId;
    document.getElementById("studentIdInput").value = st.id;
    document.getElementById("studentIdInput").disabled = true;
    document.getElementById("studentKhmerName").value = st.nameKh || "";
    document.getElementById("studentLatinName").value = st.nameEn || "";
    document.getElementById("studentGenderSelect").value = st.gender || "ស្រី";
    document.getElementById("studentDobInput").value = st.dob || "2012-01-01";
    document.getElementById("studentStatusSelect").value = st.status || "កំពុងរៀន";
    document.getElementById("studentPhoneInput").value = st.studentPhone || "";

    // Place of Birth
    document.getElementById("studentPobVillage").value = st.pobVillage || "";
    document.getElementById("studentPobCommune").value = st.pobCommune || "";
    document.getElementById("studentPobDistrict").value = st.pobDistrict || "";
    document.getElementById("studentPobProvince").value = st.pobProvince || "រាជធានីភ្នំពេញ";

    // Current Address
    document.getElementById("studentCurVillage").value = st.curVillage || "";
    document.getElementById("studentCurCommune").value = st.curCommune || "";
    document.getElementById("studentCurDistrict").value = st.curDistrict || "";
    document.getElementById("studentCurProvince").value = st.curProvince || "រាជធានីភ្នំពេញ";

    // Parents
    document.getElementById("studentFatherName").value = st.fatherName || st.parentName || "";
    document.getElementById("studentFatherJob").value = st.fatherJob || "";
    document.getElementById("studentMotherName").value = st.motherName || "";
    document.getElementById("studentMotherJob").value = st.motherJob || "";
    document.getElementById("studentParentPhone").value = st.parentPhone || "";
    document.getElementById("studentNoteInput").value = st.note || "";

    document.getElementById("studentPhotoUrl").value = st.photo || "";
    document.getElementById("formAvatarPreview").src = st.photo || `https://api.dicebear.com/7.x/bottts/svg?seed=${st.id}`;

    openModal("studentModal");
  }

  static handleFormSubmit(e) {
    e.preventDefault();
    const formIndex = document.getElementById("studentFormIndex").value;
    const students = StorageManager.getStudents();

    const pobVillage = document.getElementById("studentPobVillage").value.trim();
    const pobCommune = document.getElementById("studentPobCommune").value.trim();
    const pobDistrict = document.getElementById("studentPobDistrict").value.trim();
    const pobProvince = document.getElementById("studentPobProvince").value.trim();

    const curVillage = document.getElementById("studentCurVillage").value.trim();
    const curCommune = document.getElementById("studentCurCommune").value.trim();
    const curDistrict = document.getElementById("studentCurDistrict").value.trim();
    const curProvince = document.getElementById("studentCurProvince").value.trim();

    const studentPhone = document.getElementById("studentPhoneInput").value.trim();
    const parentPhone = document.getElementById("studentParentPhone").value.trim();
    const fatherName = document.getElementById("studentFatherName").value.trim();
    const fatherJob = document.getElementById("studentFatherJob").value.trim();
    const motherName = document.getElementById("studentMotherName").value.trim();
    const motherJob = document.getElementById("studentMotherJob").value.trim();
    const note = document.getElementById("studentNoteInput").value.trim();

    const fullPob = [
      pobVillage ? 'ភូមិ' + pobVillage.replace(/^ភូមិ/, '') : '',
      pobCommune ? 'ឃុំ/សង្កាត់' + pobCommune.replace(/^(ឃុំ|សង្កាត់)/, '') : '',
      pobDistrict ? 'ស្រុក/ខណ្ឌ' + pobDistrict.replace(/^(ស្រុក|ខណ្ឌ)/, '') : '',
      pobProvince
    ].filter(Boolean).join(', ');

    const fullAddress = [
      curVillage ? 'ភូមិ' + curVillage.replace(/^ភូមិ/, '') : '',
      curCommune ? 'ឃុំ/សង្កាត់' + curCommune.replace(/^(ឃុំ|សង្កាត់)/, '') : '',
      curDistrict ? 'ស្រុក/ខណ្ឌ' + curDistrict.replace(/^(ស្រុក|ខណ្ឌ)/, '') : '',
      curProvince
    ].filter(Boolean).join(', ');

    const studentData = {
      id: document.getElementById("studentIdInput").value.trim(),
      nameKh: document.getElementById("studentKhmerName").value.trim(),
      nameEn: document.getElementById("studentLatinName").value.trim().toUpperCase(),
      gender: document.getElementById("studentGenderSelect").value,
      dob: document.getElementById("studentDobInput").value,
      class: document.getElementById("studentClassInput").value,
      status: document.getElementById("studentStatusSelect").value,
      studentPhone,
      pobVillage,
      pobCommune,
      pobDistrict,
      pobProvince,
      pob: fullPob,
      curVillage,
      curCommune,
      curDistrict,
      curProvince,
      address: fullAddress,
      fatherName,
      fatherJob,
      motherName,
      motherJob,
      parentName: fatherName || motherName,
      parentPhone,
      note,
      photo: document.getElementById("studentPhotoUrl").value.trim()
    };

    if (formIndex === "-1") {
      if (students.some(s => s.id === studentData.id)) {
        showToast("អត្តលេខសិស្សនេះមានក្នុងប្រព័ន្ធរួចហើយ!", "error");
        return;
      }
      students.push(studentData);
      showToast("បានបន្ថែមសិស្សថ្មីជោគជ័យ!", "success");
    } else {
      const idx = students.findIndex(s => s.id === formIndex);
      if (idx !== -1) {
        students[idx] = { ...students[idx], ...studentData };
        showToast("បានកែប្រែទិន្នន័យសិស្សជោគជ័យ!", "success");
      }
    }

    StorageManager.saveStudents(students);
    closeModal("studentModal");
    this.render();
    if (window.App) App.refreshAllModules();
  }

  static deleteStudent(studentId) {
    if (!confirm(`តើអ្នកពិតជាចង់លុបសិស្សអត្តលេខ ${studentId} មែនទេ?`)) return;

    let students = StorageManager.getStudents();
    students = students.filter(s => s.id !== studentId);
    StorageManager.saveStudents(students);

    showToast("បានលុបទិន្នន័យសិស្សរួចរាល់!", "info");
    this.render();
    if (window.App) App.refreshAllModules();
  }

  static viewCard(studentId) {
    const students = StorageManager.getStudents();
    const st = students.find(s => s.id === studentId);
    if (!st) return;

    const pobDisplay = this.formatPob(st);
    const curAddressDisplay = this.formatCurAddress(st);

    document.getElementById("idCardPhoto").src = st.photo || `https://api.dicebear.com/7.x/bottts/svg?seed=${st.id}`;
    document.getElementById("idCardNameKh").textContent = st.nameKh;
    document.getElementById("idCardNameEn").textContent = st.nameEn;
    document.getElementById("idCardId").textContent = st.id;
    document.getElementById("idCardClass").textContent = st.class || "៨ A";
    document.getElementById("idCardGender").textContent = st.gender;
    document.getElementById("idCardDob").textContent = st.dob;
    
    const pobEl = document.getElementById("idCardPob");
    if (pobEl) pobEl.textContent = pobDisplay;
    const addrEl = document.getElementById("idCardAddress");
    if (addrEl) addrEl.textContent = curAddressDisplay;

    const phoneEl = document.getElementById("idCardPhone");
    if (phoneEl) {
      phoneEl.textContent = st.studentPhone ? `${st.studentPhone} (សិស្ស) / ${st.parentPhone || ''}` : (st.parentPhone || "N/A");
    }

    // Generate Dynamic QR Code on Card
    const qrContainer = document.getElementById("idCardQrCodeBox");
    if (qrContainer) {
      qrContainer.innerHTML = "";
      if (typeof QRCode !== "undefined") {
        new QRCode(qrContainer, {
          text: JSON.stringify({ 
            id: st.id, 
            nameKh: st.nameKh, 
            nameEn: st.nameEn,
            class: st.class || "8A",
            dob: st.dob,
            pob: pobDisplay,
            curAddress: curAddressDisplay,
            studentPhone: st.studentPhone || "",
            parentPhone: st.parentPhone || "",
            father: st.fatherName || st.parentName || "",
            mother: st.motherName || ""
          }),
          width: 75,
          height: 75,
          colorDark: "#1e3a8a",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M
        });
      }
    }

    openModal("studentCardModal");
  }

  static exportToExcel() {
    const students = StorageManager.getStudents();
    const worksheetData = [
      [
        "ល.រ", 
        "អត្តលេខសិស្ស", 
        "គោត្តនាម និងនាម", 
        "ឈ្មោះឡាតាំង", 
        "ភេទ", 
        "ថ្ងៃខែឆ្នាំកំណើត", 
        "ថ្នាក់",
        "ភូមិកំណើត",
        "ឃុំ/សង្កាត់កំណើត",
        "ស្រុក/ខណ្ឌកំណើត",
        "ខេត្ត/រាជធានីកំណើត",
        "ទីកន្លែងកំណើតសរុប",
        "ភូមិបច្ចុប្បន្ន",
        "ឃុំ/សង្កាត់បច្ចុប្បន្ន",
        "ស្រុក/ខណ្ឌបច្ចុប្បន្ន",
        "ខេត្ត/រាជធានីបច្ចុប្បន្ន",
        "អាសយដ្ឋានបច្ចុប្បន្នសរុប",
        "ទូរស័ព្ទសិស្ស",
        "ឈ្មោះឪពុក", 
        "មុខរបរឪពុក", 
        "ឈ្មោះម្តាយ", 
        "មុខរបរម្តាយ", 
        "ទូរស័ព្ទអាណាព្យាបាល", 
        "ស្ថានភាព",
        "ចំណាំ"
      ]
    ];

    students.forEach((st, i) => {
      worksheetData.push([
        i + 1,
        st.id,
        st.nameKh,
        st.nameEn,
        st.gender,
        st.dob,
        st.class || "8A",
        st.pobVillage || "",
        st.pobCommune || "",
        st.pobDistrict || "",
        st.pobProvince || "",
        this.formatPob(st),
        st.curVillage || "",
        st.curCommune || "",
        st.curDistrict || "",
        st.curProvince || "",
        this.formatCurAddress(st),
        st.studentPhone || "",
        st.fatherName || st.parentName || "",
        st.fatherJob || "",
        st.motherName || "",
        st.motherJob || "",
        st.parentPhone || "",
        st.status || "កំពុងរៀន",
        st.note || ""
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(wb, ws, "បញ្ជីសិស្ស");
    XLSX.writeFile(wb, `បញ្ជីរាយនាមសិស្ស_ថ្នាក់ទី៨A_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast("បានទាញយកឯកសារ Excel រួចរាល់!", "success");
  }
}
