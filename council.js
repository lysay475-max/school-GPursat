/**
 * STUDENT COUNCIL & STUDY CLUBS MODULE (គណៈកម្មការថ្នាក់ និងក្លឹបសិក្សា)
 */

class CouncilManager {
  static init() {
    this.renderCouncilGrid();
    this.renderClubsList();
    this.setupEventListeners();
  }

  static renderCouncilGrid() {
    const container = document.getElementById("councilRolesGrid");
    if (!container) return;

    const council = StorageManager.getCouncil();
    const students = StorageManager.getStudents();
    const studentMap = {};
    students.forEach(s => studentMap[s.id] = s);

    const rolesDef = [
      { key: "president", title: "ប្រធានថ្នាក់", titleEn: "Class President", icon: "fa-crown", color: "gold" },
      { key: "vicePresident", title: "អនុប្រធានថ្នាក់", titleEn: "Vice President", icon: "fa-star", color: "blue" },
      { key: "disciplineLead", title: "ប្រធានក្រុមវិន័យ", titleEn: "Discipline Lead", icon: "fa-shield-halved", color: "red" },
      { key: "sanitationLead", title: "ប្រធានក្រុមអនាម័យ", titleEn: "Sanitation Lead", icon: "fa-broom", color: "green" },
      { key: "sportsLead", title: "ប្រធានក្រុមកីឡា & សិល្បៈ", titleEn: "Sports & Arts Lead", icon: "fa-futbol", color: "purple" }
    ];

    container.innerHTML = rolesDef.map(r => {
      const assigned = council[r.key] || {};
      const stuObj = assigned.studentId ? studentMap[assigned.studentId] : null;
      const stuName = stuObj ? stuObj.nameKh : (assigned.name || "មិនទាន់បានចាត់តាំង");
      const stuCode = stuObj ? stuObj.code : "";
      const stuGender = stuObj ? stuObj.gender : "";

      return `
        <div class="council-card council-${r.color}">
          <div class="council-card-icon">
            <i class="fa-solid ${r.icon}"></i>
          </div>
          <div class="council-card-info">
            <span class="council-role-badge">${r.title}</span>
            <h4 class="council-student-name moul-title">${stuName}</h4>
            <p class="council-student-sub text-muted">${stuCode ? `${stuCode} • ភេទ ${stuGender}` : r.titleEn}</p>
          </div>
          <div class="council-card-action">
            <button class="btn btn-sm btn-outline" onclick="CouncilManager.openAssignRoleModal('${r.key}', '${r.title}')">
              <i class="fa-solid fa-user-pen"></i> ចាត់តាំង
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  static renderClubsList() {
    const container = document.getElementById("studyClubsGrid");
    if (!container) return;

    const clubs = StorageManager.getClubs();

    if (clubs.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <i class="fa-solid fa-people-group fa-3x text-muted mb-2"></i>
          <h4>មិនទាន់មានក្លឹបសិក្សានៅឡើយទេ</h4>
          <p class="text-muted">សូមចុចប៊ូតុង "បង្កើតក្លឹបថ្មី" ដើម្បីបង្កើតសកម្មភាពក្លឹបសិក្សាក្នុងថ្នាក់។</p>
        </div>
      `;
      return;
    }

    container.innerHTML = clubs.map(club => {
      return `
        <div class="club-card">
          <div class="club-header">
            <div>
              <h4 class="club-title moul-title text-primary">${club.name}</h4>
              <span class="club-sub-en text-muted">${club.nameEn || ''}</span>
            </div>
            <span class="badge badge-primary"><i class="fa-solid fa-users"></i> ${club.membersCount || 12} នាក់</span>
          </div>

          <div class="club-body">
            <p class="club-desc font-khmer">${club.description || ''}</p>
            <div class="club-meta-tags mt-2">
              <div class="club-meta-item">
                <i class="fa-solid fa-user-tie text-accent"></i> ប្រធានក្លឹប៖ <strong>${club.leadStudent || 'សុខា មុនីរត្ន'}</strong>
              </div>
              <div class="club-meta-item">
                <i class="fa-solid fa-clock text-warning"></i> ជួបប្រជុំ៖ <strong>${club.meetingDay || 'រៀងរាល់សប្តាហ៍'}</strong>
              </div>
            </div>
          </div>

          <div class="club-footer">
            <button class="btn btn-sm btn-outline" onclick="CouncilManager.viewClubMembersModal('${club.id}')">
              <i class="fa-solid fa-address-book"></i> បញ្ជីសមាជិក
            </button>
            <button class="btn btn-sm btn-outline text-danger" onclick="CouncilManager.deleteClub('${club.id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  static openAssignRoleModal(roleKey, roleTitle) {
    const students = StorageManager.getStudents();
    const council = StorageManager.getCouncil();
    const current = council[roleKey] || {};

    const modalBody = document.getElementById("assignRoleModalBody");
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="assign-role-form">
        <input type="hidden" id="assignRoleKey" value="${roleKey}">
        <div class="form-group mb-3">
          <label class="form-label font-khmer">តួនាទី៖</label>
          <input type="text" class="form-control" value="${roleTitle}" readonly>
        </div>
        <div class="form-group mb-3">
          <label class="form-label font-khmer">ជ្រើសរើសសិស្សទទួលបន្ទុក៖</label>
          <select id="assignStudentSelect" class="form-control">
            ${students.map(s => `
              <option value="${s.id}" ${current.studentId === s.id ? 'selected' : ''}>
                ${s.code} - ${s.nameKh} (${s.gender})
              </option>
            `).join('')}
          </select>
        </div>
      </div>
    `;

    document.getElementById("assignRoleModal").classList.add("active");
  }

  static saveAssignedRole() {
    const roleKey = document.getElementById("assignRoleKey").value;
    const studentId = document.getElementById("assignStudentSelect").value;
    const students = StorageManager.getStudents();
    const student = students.find(s => s.id === studentId);

    if (!student) return;

    const council = StorageManager.getCouncil();
    council[roleKey] = {
      studentId: student.id,
      name: student.nameKh,
      role: roleKey
    };

    StorageManager.saveCouncil(council);
    this.renderCouncilGrid();
    document.getElementById("assignRoleModal").classList.remove("active");
    App.showToast(`បានចាត់តាំង "${student.nameKh}" ទទួលតួនាទីដោយជោគជ័យ!`, "success");
  }

  static openCreateClubModal() {
    const students = StorageManager.getStudents();
    const select = document.getElementById("clubLeadSelect");
    if (select) {
      select.innerHTML = students.map(s => `<option value="${s.nameKh}">${s.nameKh} (${s.code})</option>`).join('');
    }
    document.getElementById("createClubModal").classList.add("active");
  }

  static saveNewClub() {
    const name = document.getElementById("clubNameInput").value.trim();
    const nameEn = document.getElementById("clubNameEnInput").value.trim();
    const leadStudent = document.getElementById("clubLeadSelect").value;
    const meetingDay = document.getElementById("clubMeetingInput").value.trim();
    const description = document.getElementById("clubDescInput").value.trim();

    if (!name) {
      alert("សូមបញ្ចូលឈ្មោះក្លឹបសិក្សា!");
      return;
    }

    const newClub = {
      id: "CLUB-" + Date.now().toString(36).toUpperCase(),
      name,
      nameEn,
      leadStudent,
      meetingDay: meetingDay || "រៀងរាល់សប្តាហ៍",
      membersCount: 10,
      description
    };

    const clubs = StorageManager.getClubs();
    clubs.push(newClub);
    StorageManager.saveClubs(clubs);

    this.renderClubsList();
    document.getElementById("createClubModal").classList.remove("active");
    // Clear
    document.getElementById("clubNameInput").value = "";
    document.getElementById("clubNameEnInput").value = "";
    document.getElementById("clubDescInput").value = "";
    App.showToast("បានបង្កើតក្លឹបសិក្សាថ្មីដោយជោគជ័យ!", "success");
  }

  static deleteClub(clubId) {
    if (!confirm("តើអ្នកពិតជាចង់លុបក្លឹបសិក្សានេះមែនទេ?")) return;
    let clubs = StorageManager.getClubs();
    clubs = clubs.filter(c => c.id !== clubId);
    StorageManager.saveClubs(clubs);
    this.renderClubsList();
    App.showToast("បានលុបក្លឹបសិក្សារួចរាល់!", "info");
  }

  static viewClubMembersModal(clubId) {
    const clubs = StorageManager.getClubs();
    const club = clubs.find(c => c.id === clubId);
    if (!club) return;

    const students = StorageManager.getStudents();
    // Pick first 8-12 sample members
    const sampleMembers = students.slice(0, club.membersCount || 10);

    const body = document.getElementById("clubMembersModalBody");
    if (!body) return;

    body.innerHTML = `
      <div class="mb-3">
        <h3 class="moul-title text-primary">${club.name}</h3>
        <p class="text-muted"><i class="fa-solid fa-clock"></i> ពេលជួបប្រជុំ៖ <strong>${club.meetingDay}</strong></p>
      </div>

      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>ល.រ</th>
              <th>អត្តលេខ</th>
              <th>គោត្តនាម និងនាម</th>
              <th>ភេទ</th>
              <th>តួនាទីក្នុងក្លឹប</th>
            </tr>
          </thead>
          <tbody>
            ${sampleMembers.map((st, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><code>${st.code}</code></td>
                <td><strong>${st.nameKh}</strong></td>
                <td>${st.gender}</td>
                <td><span class="badge ${idx === 0 ? 'badge-primary' : 'badge-light'}">${idx === 0 ? 'ប្រធានក្លឹប' : 'សមាជិក'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById("clubMembersModal").classList.add("active");
  }

  static setupEventListeners() {
    const btnSaveRole = document.getElementById("btnSaveAssignedRole");
    if (btnSaveRole) btnSaveRole.addEventListener("click", () => this.saveAssignedRole());

    const btnCloseRoleModal = document.getElementById("closeAssignRoleModal");
    if (btnCloseRoleModal) btnCloseRoleModal.addEventListener("click", () => {
      document.getElementById("assignRoleModal").classList.remove("active");
    });

    const btnOpenCreateClub = document.getElementById("btnOpenCreateClub");
    if (btnOpenCreateClub) btnOpenCreateClub.addEventListener("click", () => this.openCreateClubModal());

    const btnSaveClub = document.getElementById("btnSaveNewClub");
    if (btnSaveClub) btnSaveClub.addEventListener("click", () => this.saveNewClub());

    const btnCloseCreateClub = document.getElementById("closeCreateClubModal");
    if (btnCloseCreateClub) btnCloseCreateClub.addEventListener("click", () => {
      document.getElementById("createClubModal").classList.remove("active");
    });

    const btnCloseClubMembers = document.getElementById("closeClubMembersModal");
    if (btnCloseClubMembers) btnCloseClubMembers.addEventListener("click", () => {
      document.getElementById("clubMembersModal").classList.remove("active");
    });
  }
}
