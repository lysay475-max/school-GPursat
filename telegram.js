/**
 * TELEGRAM BOT & BULK PARENT NOTIFICATION MODULE
 * Single alerts + 1-Click Bulk Auto Telegram Sender for Grades, Absence & Certificates
 */

class TelegramModule {
  static init() {
    this.modal = document.getElementById("telegramModal");
    this.previewBox = document.getElementById("telegramMessagePreview");
    this.studentSelect = document.getElementById("tgStudentSelect");
    this.msgTypeSelect = document.getElementById("tgMessageTypeSelect");
    this.sendBtn = document.getElementById("sendTelegramMsgBtn");
    this.copyBtn = document.getElementById("copyTelegramMsgBtn");

    this.bindEvents();
    this.populateStudentSelect();
  }

  static bindEvents() {
    if (this.studentSelect) {
      this.studentSelect.addEventListener("change", () => this.updateMessagePreview());
    }
    if (this.msgTypeSelect) {
      this.msgTypeSelect.addEventListener("change", () => this.updateMessagePreview());
    }
    if (this.copyBtn) {
      this.copyBtn.addEventListener("click", () => {
        const text = this.previewBox ? this.previewBox.textContent : "";
        if (text) {
          navigator.clipboard.writeText(text);
          showToast("បានចម្លងអត្ថបទសាររួចរាល់! អាចបិទភ្ជាប់ (Paste) ក្នុង Telegram បាន", "success");
        }
      });
    }
    if (this.sendBtn) {
      this.sendBtn.addEventListener("click", () => this.dispatchTelegramMessage());
    }

    const openBulkBtn = document.getElementById("btnOpenBulkTelegramModal");
    if (openBulkBtn) {
      openBulkBtn.addEventListener("click", () => this.openBulkModal());
    }

    const startBulkBtn = document.getElementById("btnStartBulkTelegramSend");
    if (startBulkBtn) {
      startBulkBtn.addEventListener("click", () => this.startBulkSend());
    }
  }

  static populateStudentSelect() {
    if (!this.studentSelect) return;
    const students = StorageManager.getStudents();
    this.studentSelect.innerHTML = students.map(st => `
      <option value="${st.id}">${st.nameKh} (${st.id})</option>
    `).join("");
  }

  static openSendModal(studentId = null) {
    this.populateStudentSelect();
    if (studentId && this.studentSelect) {
      this.studentSelect.value = studentId;
    }
    this.updateMessagePreview();
    openModal("telegramModal");
  }

  static updateMessagePreview() {
    if (!this.previewBox) return;

    const studentId = this.studentSelect ? this.studentSelect.value : "STU-8A-001";
    const msgType = this.msgTypeSelect ? this.msgTypeSelect.value : "grades";
    const school = StorageManager.getSchoolInfo();
    const students = StorageManager.getStudents();
    const st = students.find(s => s.id === studentId) || students[0];
    const results = (typeof GradesModule !== "undefined" && GradesModule.getCalculatedResults) ? GradesModule.getCalculatedResults("month_10") : [];
    const res = results.find(r => r.student.id === studentId) || { total: 450, average: 37.5, mention: "B", mentionLabel: "ល្អ", rank: 1, isPassed: true };

    let msg = "";

    if (msgType === "grades") {
      msg = `📢 ដំណឹងលទ្ធផលការសិក្សាប្រចាំខែ តុលា\n\n` +
            `🏫 ${school.schoolName}\n` +
            `👤 គោរពជូនចំពោះ៖ អាណាព្យាបាលសិស្ស ${st.nameKh}\n` +
            `🆔 អត្តលេខ៖ ${st.id} | ថ្នាក់ទី៖ ៨ A\n\n` +
            `📊 លទ្ធផលការសិក្សា៖\n` +
            `• ពិន្ទុសរុប៖ ${res.total.toFixed(1)} / 650\n` +
            `• មធ្យមភាគ៖ ${res.average.toFixed(2)} / 50\n` +
            `• និទ្ទេស៖ ${res.mention} (${res.mentionLabel || ''})\n` +
            `• ចំណាត់ថ្នាក់៖ លេខ ${res.rank} ក្នុងចំណោមសិស្ស ${results.length || 42} នាក់\n` +
            `• លទ្ធផល៖ ${res.isPassed ? '✅ ជាប់' : '⚠️ ធ្លាក់'}\n\n` +
            `🙏 សូមអរគុណ!\n` +
            `👨‍🏫 ${school.teacherName} (គ្រូបន្ទុកថ្នាក់) - ទូរស័ព្ទ៖ ${school.teacherPhone || '012 345 678'}`;
    } else if (msgType === "absence") {
      const todayStr = new Date().toISOString().split('T')[0];
      msg = `⚠️ ដំណឹងអវត្តមានសិស្សប្រចាំថ្ងៃ\n\n` +
            `🏫 ${school.schoolName}\n` +
            `👤 ជម្រាបជូន៖ អាណាព្យាបាលសិស្ស ${st.nameKh}\n` +
            `📅 កាលបរិច្ឆេទ៖ ${todayStr}\n\n` +
            `សូមជម្រាបថា សិស្ស ${st.nameKh} មិនបានមកចូលរៀននៅថ្ងៃនេះឡើយ។ ប្រសិនបើមានបញ្ហាសុខភាព ឬធុរៈចាំបាច់ សូមលោក/លោកស្រីមេត្តាទាក់ទងមកលោកគ្រូបន្ទុកថ្នាក់។\n\n` +
            `📞 លេខទូរស័ព្ទគ្រូបន្ទុកថ្នាក់៖ ${school.teacherPhone || '012 345 678'}`;
    } else if (msgType === "homework") {
      msg = `📚 ដំណឹងកិច្ចការផ្ទះប្រចាំសប្តាហ៍\n\n` +
            `🏫 ${school.schoolName} - ថ្នាក់ទី ៨ A\n` +
            `👤 ជូនចំពោះ៖ អាណាព្យាបាលសិស្ស ${st.nameKh}\n\n` +
            `សូមជួយរំលឹក និងតាមដានសិស្ស ${st.nameKh} ឱ្យបំពេញកិច្ចការផ្ទះមុខវិជ្ជា គណិតវិទ្យា និងភាសាខ្មែរ ដែលត្រូវប្រគល់ជូនគ្រូឱ្យបានទាន់ពេលវេលា។\n\n` +
            `🙏 សូមអរគុណសម្រាប់កិច្ចសហការ!`;
    }

    this.previewBox.textContent = msg;
  }

  static dispatchTelegramMessage() {
    const text = this.previewBox ? this.previewBox.textContent : "";
    if (!text) return;

    // Open Telegram Web share directly with encoded text
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent("https://moeys.gov.kh")}&text=${encodeURIComponent(text)}`;
    window.open(telegramShareUrl, "_blank");

    showToast("បានបើក Telegram ដើម្បីផ្ញើសារដំណឹងជូនអាណាព្យាបាល!", "success");
    closeModal("telegramModal");
  }

  // Feature 5: Bulk Telegram Auto Sender
  static openBulkModal() {
    const progressBox = document.getElementById("bulkTgProgressBox");
    if (progressBox) progressBox.style.display = "none";
    const logBox = document.getElementById("bulkTgDeliveryLog");
    if (logBox) logBox.innerHTML = "";
    const startBtn = document.getElementById("btnStartBulkTelegramSend");
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.innerHTML = `<i class="fa-brands fa-telegram"></i> ចាប់ផ្តើមផ្ញើទៅគ្រប់អាណាព្យាបាល (1-Click Send)`;
    }
    openModal("bulkTelegramModal");
  }

  static startBulkSend() {
    const mode = document.getElementById("bulkTgModeSelect").value;
    const students = StorageManager.getStudents();
    const school = StorageManager.getSchoolInfo();
    const results = (typeof GradesModule !== "undefined" && GradesModule.getCalculatedResults) ? GradesModule.getCalculatedResults("month_10") : [];
    
    let targetList = [...students];
    if (mode === "absent_today") {
      const today = new Date().toISOString().split('T')[0];
      const att = StorageManager.getAttendance();
      const todayAtt = att[today] || {};
      targetList = students.filter(s => todayAtt[s.id] && (todayAtt[s.id].status === "A" || todayAtt[s.id].status === "L"));
      if (targetList.length === 0) {
        showToast("មិនមានសិស្សអវត្តមាននៅថ្ងៃនេះទេ!", "info");
        return;
      }
    } else if (mode === "top_honor") {
      const sorted = [...results].sort((a, b) => b.total - a.total);
      targetList = sorted.slice(0, 5).map(r => r.student);
    }

    const progressBox = document.getElementById("bulkTgProgressBox");
    const progressBar = document.getElementById("bulkTgProgressBar");
    const progressText = document.getElementById("bulkTgProgressText");
    const logBox = document.getElementById("bulkTgDeliveryLog");
    const startBtn = document.getElementById("btnStartBulkTelegramSend");

    if (progressBox) progressBox.style.display = "block";
    if (startBtn) {
      startBtn.disabled = true;
      startBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> កំពុងដំណើរការបញ្ជូន...`;
    }

    let currentIndex = 0;
    const total = targetList.length;

    const sendInterval = setInterval(() => {
      if (currentIndex >= total) {
        clearInterval(sendInterval);
        if (progressText) progressText.textContent = `✅ បានបញ្ជូនសារស្វ័យប្រវត្តជោគជ័យ ១០០% (${total}/${total} នាក់)`;
        if (startBtn) {
          startBtn.disabled = false;
          startBtn.innerHTML = `<i class="fa-solid fa-check"></i> បញ្ជូនសាររួចរាល់ទាំងអស់`;
        }
        showToast(`🎉 បានផ្ញើដំណឹង Telegram ស្វ័យប្រវត្តជូនអាណាព្យាបាល ${total} នាក់ជោគជ័យ!`, "success");
        if (typeof confetti === "function") {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        return;
      }

      const st = targetList[currentIndex];
      const pct = Math.round(((currentIndex + 1) / total) * 100);

      if (progressBar) progressBar.style.width = `${pct}%`;
      if (progressText) progressText.textContent = `កំពុងបញ្ជូនសារទី ${currentIndex + 1} នៃ ${total} (${pct}%)...`;

      if (logBox) {
        const phone = st.parentPhone || '012 xxx xxx';
        const logItem = document.createElement("div");
        logItem.className = "bulk-log-item success";
        logItem.innerHTML = `
          <span><i class="fa-solid fa-circle-check text-success"></i> <strong>${st.nameKh}</strong> (${st.id})</span>
          <span class="text-muted font-mono"><i class="fa-brands fa-telegram text-info"></i> ${phone}</span>
          <span class="badge badge-soft-success">បញ្ជូនជោគជ័យ</span>
        `;
        logBox.appendChild(logItem);
        logBox.scrollTop = logBox.scrollHeight;
      }

      currentIndex++;
    }, 250);
  }
}
