/**
 * TIMETABLE MODULE (WITH FULL SHIFTS & INTERACTIVE DIRECT EDITING)
 * Supports: វេនព្រឹក (Morning Shift), វេនរសៀល/ល្ងាច (Afternoon Shift), & Full Day
 */

class TimetableModule {
  static currentShift = "morning"; // 'morning' | 'afternoon' | 'all'

  static init() {
    this.tableBody = document.getElementById("timetableTableBody");
    this.teachersGrid = document.getElementById("teachersGrid");
    this.printBtn = document.getElementById("printTimetableBtn");
    this.editBtn = document.getElementById("editTimetableBtn");

    this.bindEvents();
    this.render();
  }

  static setShift(shift) {
    this.currentShift = shift;
    
    // Update active button state
    const buttons = document.querySelectorAll("#timetableShiftToggle .btn");
    buttons.forEach(btn => {
      if (btn.dataset.shift === shift) {
        btn.classList.add("active", "btn-primary");
        btn.classList.remove("btn-outline");
      } else {
        btn.classList.remove("active", "btn-primary");
        btn.classList.add("btn-outline");
      }
    });

    // Update Subtitle
    const subtitle = document.getElementById("timetableSubtitle");
    if (subtitle) {
      if (shift === "morning") {
        subtitle.textContent = "កាលវិភាគថ្នាក់ទី ៨ A (វេនព្រឹក៖ ០៧:០០ - ១១:១៥ ព្រឹក)";
      } else if (shift === "afternoon") {
        subtitle.textContent = "កាលវិភាគថ្នាក់ទី ៨ A (វេនរសៀល/ល្ងាច៖ ១៣:០០ - ១៧:១៥ រសៀល)";
      } else {
        subtitle.textContent = "កាលវិភាគថ្នាក់ទី ៨ A (ពេញមួយថ្ងៃ៖ ព្រឹក + រសៀល)";
      }
    }

    this.render();
  }

  static bindEvents() {
    if (this.printBtn) {
      this.printBtn.addEventListener("click", () => window.print());
    }
    if (this.editBtn) {
      this.editBtn.addEventListener("click", () => this.openFullEditModal());
    }

    // Shift Toggle Buttons
    const shiftContainer = document.getElementById("timetableShiftToggle");
    if (shiftContainer) {
      shiftContainer.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-shift]");
        if (btn) {
          this.setShift(btn.dataset.shift);
        }
      });
    }

    // Modal Slot Save & Clear
    const saveSlotBtn = document.getElementById("saveTimetableSlotBtn");
    if (saveSlotBtn) {
      saveSlotBtn.addEventListener("click", () => this.saveSlot());
    }

    const clearSlotBtn = document.getElementById("clearTimetableSlotBtn");
    if (clearSlotBtn) {
      clearSlotBtn.addEventListener("click", () => this.clearSlot());
    }

    const closeSlotModalBtn = document.getElementById("closeTimetableSlotModal");
    if (closeSlotModalBtn) {
      closeSlotModalBtn.addEventListener("click", () => {
        closeModal("editTimetableSlotModal");
      });
    }

    // Full Modal Events
    const closeFullModalBtn = document.getElementById("closeFullTimetableModal");
    if (closeFullModalBtn) {
      closeFullModalBtn.addEventListener("click", () => {
        closeModal("fullTimetableModal");
      });
    }

    const saveFullBtn = document.getElementById("saveFullTimetableBtn");
    if (saveFullBtn) {
      saveFullBtn.addEventListener("click", () => this.saveFullTimetable());
    }

    const resetTimetableBtn = document.getElementById("resetTimetableBtn");
    if (resetTimetableBtn) {
      resetTimetableBtn.addEventListener("click", () => this.resetToDefault());
    }

    // Teacher Edit Modal Events
    const saveTeacherBtn = document.getElementById("saveTeacherProfileBtn");
    if (saveTeacherBtn) {
      saveTeacherBtn.addEventListener("click", () => this.saveTeacherProfile());
    }

    const closeTeacherModalBtn = document.getElementById("closeEditTeacherModal");
    if (closeTeacherModalBtn) {
      closeTeacherModalBtn.addEventListener("click", () => {
        closeModal("editTeacherModal");
      });
    }

    // Auto fill teacher name when subject selected in slot modal
    const slotSubSelect = document.getElementById("slotSubjectSelect");
    if (slotSubSelect) {
      slotSubSelect.addEventListener("change", (e) => {
        const subName = e.target.value;
        const subjects = StorageManager.getSubjects();
        const found = subjects.find(s => (s.nameKh || s.name) === subName || s.id === subName);
        const teacherInput = document.getElementById("slotTeacherInput");
        if (found && teacherInput) {
          teacherInput.value = found.teacher || "";
        }
      });
    }
  }

  static render() {
    const timetable = StorageManager.getTimetable();
    const subjects = StorageManager.getSubjects();

    const days = [
      { key: "mon", label: "ចន្ទ (Mon)" },
      { key: "tue", label: "អង្គារ (Tue)" },
      { key: "wed", label: "ពុធ (Wed)" },
      { key: "thu", label: "ព្រហស្បតិ៍ (Thu)" },
      { key: "fri", label: "សុក្រ (Fri)" },
      { key: "sat", label: "សៅរ៍ (Sat)" }
    ];

    // Filter by shift
    const filteredSlots = timetable.map((slot, originalIdx) => ({ slot, originalIdx })).filter(item => {
      const slot = item.slot;
      const hour = parseInt((slot.time || "").split(":")[0], 10);
      const isMorning = slot.shift === "morning" || (!slot.shift && hour < 12);
      const isAfternoon = slot.shift === "afternoon" || (!slot.shift && hour >= 12);

      if (this.currentShift === "morning") return isMorning;
      if (this.currentShift === "afternoon") return isAfternoon;
      return true; // 'all'
    });

    if (this.tableBody) {
      if (filteredSlots.length === 0) {
        this.tableBody.innerHTML = `
          <tr>
            <td colspan="7" class="text-center p-4 text-muted font-khmer">
              <i class="fa-regular fa-calendar-xmark fa-2x mb-2 d-block"></i>
              មិនមានម៉ោងសិក្សាសម្រាប់វេននេះនៅឡើយទេ។ សូមចុចប៊ូតុង "កែប្រែកាលវិភាគ" ដើម្បីរៀបចំ។
            </td>
          </tr>
        `;
      } else {
        this.tableBody.innerHTML = filteredSlots.map(({ slot, originalIdx }) => {
          if (slot.isBreak) {
            return `
              <tr style="background: rgba(245, 158, 11, 0.12); border-top: 2px dashed rgba(245, 158, 11, 0.3); border-bottom: 2px dashed rgba(245, 158, 11, 0.3);">
                <td class="text-center font-bold text-warning" style="white-space: nowrap;">
                  <i class="fa-regular fa-clock"></i> ${slot.time}
                </td>
                <td colspan="6" class="text-center font-bold text-warning" style="padding: 12px; font-size: 0.95rem;">
                  <i class="fa-solid fa-mug-hot"></i> ${slot.label || 'ម៉ោងចេញលេង & សម្រាក'}
                </td>
              </tr>
            `;
          }

          const renderSlot = (cell, dayKey) => {
            if (!cell || !cell.subject) {
              return `
                <div class="timetable-slot-cell empty-slot" onclick="TimetableModule.openEditSlot(${originalIdx}, '${dayKey}')" title="ចុចដើម្បីបន្ថែម/កែប្រែម៉ោងនេះ">
                  <div class="time-empty-text"><i class="fa-solid fa-plus"></i> បន្ថែម</div>
                </div>
              `;
            }
            return `
              <div class="timetable-slot-cell" onclick="TimetableModule.openEditSlot(${originalIdx}, '${dayKey}')" title="ចុចដើម្បីកែប្រែ (${cell.subject} - ${cell.teacher || ''})">
                <div class="time-subj-name">${cell.subject}</div>
                <div class="time-teacher-name"><i class="fa-solid fa-chalkboard-user"></i> ${cell.teacher || 'គ្រូបង្រៀន'}</div>
                <div class="slot-hover-edit"><i class="fa-solid fa-pen"></i> កែប្រែ</div>
              </div>
            `;
          };

          return `
            <tr>
              <td class="text-center font-bold font-khmer text-primary" style="white-space: nowrap; background: rgba(79, 70, 229, 0.03);">
                ${slot.time}
                ${slot.period ? `<div style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal;">ម៉ោងទី ${slot.period}</div>` : ''}
              </td>
              <td>${renderSlot(slot.mon, 'mon')}</td>
              <td>${renderSlot(slot.tue, 'tue')}</td>
              <td>${renderSlot(slot.wed, 'wed')}</td>
              <td>${renderSlot(slot.thu, 'thu')}</td>
              <td>${renderSlot(slot.fri, 'fri')}</td>
              <td>${renderSlot(slot.sat, 'sat')}</td>
            </tr>
          `;
        }).join("");
      }
    }

    // Render Teachers Grid with Direct Click to Edit
    if (this.teachersGrid) {
      this.teachersGrid.innerHTML = subjects.map((sub, idx) => `
        <div class="teacher-item-card" onclick="TimetableModule.openEditTeacher('${sub.id}')" title="ចុចដើម្បីកែប្រែព័ត៌មាន ${sub.teacher || sub.name}">
          <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Teacher_${sub.id || idx}" alt="${sub.teacher || ''}">
          <div class="teacher-item-info">
            <div class="t-name font-khmer font-bold">${sub.teacher || 'លោកគ្រូ/អ្នកគ្រូ'}</div>
            <div class="t-subj font-khmer text-primary">${sub.nameKh || sub.name}</div>
            <div class="t-phone font-sm text-muted"><i class="fa-solid fa-phone text-success"></i> ${sub.phone || ('០១២ ៣៤៥ ៦៧' + (idx % 10))}</div>
          </div>
          <button type="button" class="btn-icon btn-sm text-primary ms-auto" style="border: none; background: transparent;" title="កែប្រែ">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      `).join("");
    }
  }

  static openEditSlot(slotIndex, dayKey) {
    const timetable = StorageManager.getTimetable();
    const slot = timetable[slotIndex];
    if (!slot) return;

    const daysMap = {
      mon: "ថ្ងៃចន្ទ (Monday)",
      tue: "ថ្ងៃអង្គារ (Tuesday)",
      wed: "ថ្ងៃពុធ (Wednesday)",
      thu: "ថ្ងៃព្រហស្បតិ៍ (Thursday)",
      fri: "ថ្ងៃសុក្រ (Friday)",
      sat: "ថ្ងៃសៅរ៍ (Saturday)"
    };

    const currentCell = slot[dayKey] || { subject: "", teacher: "" };

    const idxInput = document.getElementById("editSlotIndex");
    const dayInput = document.getElementById("editSlotDayKey");
    const infoEl = document.getElementById("editSlotTimeInfo");

    if (idxInput) idxInput.value = slotIndex;
    if (dayInput) dayInput.value = dayKey;
    if (infoEl) {
      infoEl.innerHTML = `<strong>${daysMap[dayKey] || dayKey}</strong> • ម៉ោងសិក្សា៖ <strong>${slot.time}</strong>`;
    }

    // Populate Subjects dropdown
    const subjects = StorageManager.getSubjects();
    const select = document.getElementById("slotSubjectSelect");
    if (select) {
      select.innerHTML = `<option value="">-- ជ្រើសរើសមុខវិជ្ជា --</option>` +
        subjects.map(s => {
          const sName = s.nameKh || s.name;
          return `<option value="${sName}" ${sName === currentCell.subject ? 'selected' : ''}>${sName} (${s.teacher || ''})</option>`;
        }).join('');
      
      // If current cell subject not in list, add as custom option
      if (currentCell.subject && !subjects.some(s => (s.nameKh || s.name) === currentCell.subject)) {
        select.innerHTML += `<option value="${currentCell.subject}" selected>${currentCell.subject} (ផ្សេងៗ)</option>`;
      }
    }

    const teacherInput = document.getElementById("slotTeacherInput");
    if (teacherInput) {
      teacherInput.value = currentCell.teacher || "";
    }

    openModal("editTimetableSlotModal");
  }

  static saveSlot() {
    const idxEl = document.getElementById("editSlotIndex");
    const dayEl = document.getElementById("editSlotDayKey");
    const subEl = document.getElementById("slotSubjectSelect");
    const teachEl = document.getElementById("slotTeacherInput");

    if (!idxEl || !dayEl || !subEl || !teachEl) return;

    const slotIndex = parseInt(idxEl.value, 10);
    const dayKey = dayEl.value;
    const subject = subEl.value.trim();
    const teacher = teachEl.value.trim();

    if (!subject) {
      alert("សូមជ្រើសរើស ឬបញ្ចូលមុខវិជ្ជា!");
      return;
    }

    const timetable = StorageManager.getTimetable();
    if (!timetable[slotIndex]) return;

    timetable[slotIndex][dayKey] = {
      subject,
      teacher: teacher || "គ្រូបង្រៀន"
    };

    StorageManager.saveTimetable(timetable);
    this.render();
    closeModal("editTimetableSlotModal");
    showToast(`បានកែប្រែម៉ោងសិក្សាជោគជ័យ! (${subject})`, "success");
  }

  static clearSlot() {
    const idxEl = document.getElementById("editSlotIndex");
    const dayEl = document.getElementById("editSlotDayKey");
    if (!idxEl || !dayEl) return;

    const slotIndex = parseInt(idxEl.value, 10);
    const dayKey = dayEl.value;

    const timetable = StorageManager.getTimetable();
    if (!timetable[slotIndex]) return;

    timetable[slotIndex][dayKey] = null;
    StorageManager.saveTimetable(timetable);
    this.render();
    closeModal("editTimetableSlotModal");
    showToast("បានលុបម៉ោងសិក្សានេះរួចរាល់!", "info");
  }

  // Edit Teacher Profile Directly
  static openEditTeacher(subjectId) {
    const subjects = StorageManager.getSubjects();
    const sub = subjects.find(s => s.id === subjectId);
    if (!sub) return;

    const idInput = document.getElementById("editTeacherSubjectId");
    const nameInput = document.getElementById("editTeacherNameInput");
    const subjInput = document.getElementById("editTeacherSubjectName");
    const phoneInput = document.getElementById("editTeacherPhoneInput");

    if (idInput) idInput.value = sub.id;
    if (nameInput) nameInput.value = sub.teacher || "";
    if (subjInput) subjInput.value = sub.nameKh || sub.name || "";
    if (phoneInput) phoneInput.value = sub.phone || "";

    openModal("editTeacherModal");
  }

  static saveTeacherProfile() {
    const idInput = document.getElementById("editTeacherSubjectId");
    const nameInput = document.getElementById("editTeacherNameInput");
    const phoneInput = document.getElementById("editTeacherPhoneInput");

    if (!idInput || !nameInput) return;

    const subjectId = idInput.value;
    const newTeacherName = nameInput.value.trim();
    const newPhone = phoneInput ? phoneInput.value.trim() : "";

    if (!newTeacherName) {
      alert("សូមបញ្ចូលឈ្មោះលោកគ្រូ/អ្នកគ្រូ!");
      return;
    }

    const subjects = StorageManager.getSubjects();
    const sub = subjects.find(s => s.id === subjectId);
    if (!sub) return;

    const oldTeacherName = sub.teacher;
    sub.teacher = newTeacherName;
    sub.phone = newPhone;

    StorageManager.saveSubjects(subjects);

    // Update timetable slot teachers for this subject
    const timetable = StorageManager.getTimetable();
    const subName = sub.nameKh || sub.name;
    let updatedSlots = 0;

    const days = ["mon", "tue", "wed", "thu", "fri", "sat"];
    timetable.forEach(slot => {
      if (slot.isBreak) return;
      days.forEach(d => {
        if (slot[d] && (slot[d].subject === subName || slot[d].teacher === oldTeacherName)) {
          slot[d].teacher = newTeacherName;
          updatedSlots++;
        }
      });
    });

    if (updatedSlots > 0) {
      StorageManager.saveTimetable(timetable);
    }

    this.render();
    closeModal("editTeacherModal");
    showToast(`បានកែប្រែព័ត៌មាន ${newTeacherName} ជោគជ័យ!`, "success");
  }

  static openFullEditModal() {
    const timetable = StorageManager.getTimetable();
    const subjects = StorageManager.getSubjects();
    const container = document.getElementById("fullTimetableFormContainer");
    if (!container) return;

    const days = [
      { key: "mon", label: "ចន្ទ (Mon)" },
      { key: "tue", label: "អង្គារ (Tue)" },
      { key: "wed", label: "ពុធ (Wed)" },
      { key: "thu", label: "ព្រហស្បតិ៍ (Thu)" },
      { key: "fri", label: "សុក្រ (Fri)" },
      { key: "sat", label: "សៅរ៍ (Sat)" }
    ];

    let html = `
      <div class="table-responsive" style="max-height: 65vh; overflow-y: auto;">
        <table class="data-table align-middle">
          <thead>
            <tr>
              <th style="width: 140px;">វេន & ម៉ោងសិក្សា</th>
              ${days.map(d => `<th>${d.label}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
    `;

    timetable.forEach((slot, sIdx) => {
      const isAft = slot.shift === "afternoon" || parseInt((slot.time || "").split(":")[0], 10) >= 12;
      const shiftTag = isAft ? `<span class="badge badge-warning" style="font-size: 0.65rem;">វេនរសៀល</span>` : `<span class="badge badge-primary" style="font-size: 0.65rem;">វេនព្រឹក</span>`;

      if (slot.isBreak) {
        html += `
          <tr style="background: rgba(245, 158, 11, 0.12);">
            <td class="font-bold text-center">
              ${shiftTag}
              <input type="text" class="form-input form-input-sm text-center font-bold mt-1" id="time_slot_${sIdx}" value="${slot.time}">
            </td>
            <td colspan="6" class="text-center font-bold text-warning">
              <input type="text" class="form-input form-input-sm text-center font-bold" id="label_slot_${sIdx}" value="${slot.label || 'ម៉ោងចេញលេង & សម្រាក'}">
            </td>
          </tr>
        `;
        return;
      }

      html += `
        <tr>
          <td class="text-center">
            ${shiftTag}
            <input type="text" class="form-input form-input-sm text-center font-bold mt-1" id="time_slot_${sIdx}" value="${slot.time}">
          </td>
      `;

      days.forEach(d => {
        const cell = slot[d.key] || { subject: "", teacher: "" };
        html += `
          <td style="min-width: 150px;">
            <select class="form-select form-select-sm mb-1" id="sub_${sIdx}_${d.key}" onchange="
              const sName = this.value;
              const subObj = (${JSON.stringify(subjects)}).find(s => (s.nameKh || s.name) === sName);
              if (subObj) {
                const tInput = document.getElementById('teach_${sIdx}_${d.key}');
                if (tInput) tInput.value = subObj.teacher || '';
              }
            ">
              <option value="">--ទំនេរ--</option>
              ${subjects.map(s => {
                const sName = s.nameKh || s.name;
                return `<option value="${sName}" ${sName === cell.subject ? 'selected' : ''}>${sName}</option>`;
              }).join('')}
            </select>
            <input type="text" class="form-input form-input-sm" id="teach_${sIdx}_${d.key}" placeholder="ឈ្មោះគ្រូ" value="${cell.teacher || ''}">
          </td>
        `;
      });

      html += `</tr>`;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
    openModal("fullTimetableModal");
  }

  static saveFullTimetable() {
    const timetable = StorageManager.getTimetable();
    const days = ["mon", "tue", "wed", "thu", "fri", "sat"];

    timetable.forEach((slot, sIdx) => {
      const timeInput = document.getElementById(`time_slot_${sIdx}`);
      if (timeInput) slot.time = timeInput.value.trim();

      if (slot.isBreak) {
        const labelInput = document.getElementById(`label_slot_${sIdx}`);
        if (labelInput) slot.label = labelInput.value.trim();
        return;
      }

      days.forEach(d => {
        const subSelect = document.getElementById(`sub_${sIdx}_${d}`);
        const teachInput = document.getElementById(`teach_${sIdx}_${d}`);

        const subVal = subSelect ? subSelect.value.trim() : "";
        const teachVal = teachInput ? teachInput.value.trim() : "";

        if (subVal) {
          slot[d] = {
            subject: subVal,
            teacher: teachVal || "គ្រូបង្រៀន"
          };
        } else {
          slot[d] = null;
        }
      });
    });

    StorageManager.saveTimetable(timetable);
    this.render();
    closeModal("fullTimetableModal");
    showToast("បានរក្សាទុកកាលវិភាគបង្រៀនទាំងអស់ដោយជោគជ័យ!", "success");
  }

  static resetToDefault() {
    if (!confirm("តើអ្នកពិតជាចង់កំណត់កាលវិភាគគំរូដើម (ទាំងវេនព្រឹក និងវេនរសៀល) ឡើងវិញមែនទេ?")) return;
    StorageManager.saveTimetable(SEED_TIMETABLE);
    this.render();
    closeModal("fullTimetableModal");
    showToast("បានកំណត់កាលវិភាគឡើងវិញ!", "info");
  }
}
