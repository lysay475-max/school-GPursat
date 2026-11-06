/**
 * QR CODE ATTENDANCE SCANNER MODULE
 */

class ScannerModule {
  static init() {
    this.html5QrCode = null;
    this.isScanning = false;
    this.audioContext = null;

    this.startCameraBtn = document.getElementById("startCameraScannerBtn");
    this.stopCameraBtn = document.getElementById("stopCameraScannerBtn");
    this.manualScanInput = document.getElementById("manualQrInput");
    this.manualScanBtn = document.getElementById("manualQrSubmitBtn");
    this.scanResultCard = document.getElementById("scannerResultCard");
    this.recentScansList = document.getElementById("recentScansList");
    this.recentScans = [];

    this.bindEvents();
  }

  static bindEvents() {
    if (this.startCameraBtn) {
      this.startCameraBtn.addEventListener("click", () => this.startCamera());
    }
    if (this.stopCameraBtn) {
      this.stopCameraBtn.addEventListener("click", () => this.stopCamera());
    }
    if (this.manualScanBtn && this.manualScanInput) {
      this.manualScanBtn.addEventListener("click", () => {
        const val = this.manualScanInput.value.trim();
        if (val) {
          this.handleQrScanSuccess(val);
          this.manualScanInput.value = "";
        }
      });
      this.manualScanInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const val = this.manualScanInput.value.trim();
          if (val) {
            this.handleQrScanSuccess(val);
            this.manualScanInput.value = "";
          }
        }
      });
    }

    // Quick test barcode click buttons
    document.querySelectorAll(".quick-test-id-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (id) this.handleQrScanSuccess(id);
      });
    });
  }

  static playBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Audio fallback
    }
  }

  static startCamera() {
    const qrRegion = document.getElementById("qr-reader");
    if (!qrRegion) return;

    if (typeof Html5Qrcode === "undefined") {
      showToast("កំពុងដំណើរការម៉ូឌុលស្កេន សូមសាកល្បងម្ដងទៀត ឬប្រើការស្កេនរហ័សខាងក្រោម!", "info");
      return;
    }

    this.html5QrCode = new Html5Qrcode("qr-reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    this.html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        this.handleQrScanSuccess(decodedText);
      },
      (error) => {
        // Continuous scan ignore minor frame error
      }
    ).then(() => {
      this.isScanning = true;
      if (this.startCameraBtn) this.startCameraBtn.style.display = "none";
      if (this.stopCameraBtn) this.stopCameraBtn.style.display = "inline-flex";
      showToast("កាមេរ៉ាស្កេន QR Code បានបើកដំណើរការ!", "success");
    }).catch(err => {
      showToast("មិនអាចបើកកាមេរ៉ាបានទេ៖ សូមពិនិត្យ Permission កាមេរ៉ា ឬប្រើប្រាស់ការវាយបញ្ចូលអត្តលេខខាងក្រោម", "warning");
    });
  }

  static stopCamera() {
    if (this.html5QrCode && this.isScanning) {
      this.html5QrCode.stop().then(() => {
        this.html5QrCode.clear();
        this.isScanning = false;
        if (this.startCameraBtn) this.startCameraBtn.style.display = "inline-flex";
        if (this.stopCameraBtn) this.stopCameraBtn.style.display = "none";
        showToast("បានបិទកាមេរ៉ារួចរាល់", "info");
      });
    }
  }

  static handleQrScanSuccess(scannedCode) {
    this.playBeep();
    const students = StorageManager.getStudents();
    
    // Scanned text can be either "STU-8A-001" or JSON object from QR code
    let targetId = scannedCode.trim();
    try {
      if (targetId.startsWith("{")) {
        const parsed = JSON.parse(targetId);
        if (parsed.id) targetId = parsed.id;
      }
    } catch (e) {}

    const st = students.find(s => s.id.toLowerCase() === targetId.toLowerCase() || s.nameKh === targetId);

    if (!st) {
      showToast(`រកមិនឃើញសិស្សដែលមានកូដ "${targetId}" ក្នុងថ្នាក់ឡើយ!`, "error");
      return;
    }

    // Auto mark attendance today as Present (P)
    const todayStr = new Date().toISOString().split('T')[0];
    const allAttendance = StorageManager.getAttendance();
    if (!allAttendance[todayStr]) allAttendance[todayStr] = {};
    
    allAttendance[todayStr][st.id] = {
      status: "P",
      note: `ស្កេន QR វត្តមាននៅម៉ោង ${new Date().toLocaleTimeString('en-US', { hour12: false })}`
    };
    StorageManager.saveAttendance(allAttendance);

    // Update Result Card UI
    if (this.scanResultCard) {
      this.scanResultCard.style.display = "block";
      this.scanResultCard.innerHTML = `
        <div class="scan-success-banner">
          <div class="scan-success-icon"><i class="fa-solid fa-circle-check"></i></div>
          <div class="scan-success-details">
            <h4 class="text-success font-bold">ស្កេនជោគជ័យ! បានកត់ត្រាវត្តមានរួចរាល់</h4>
            <div class="student-scan-info-row">
              <img src="${st.photo || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + st.id}" class="scan-avatar" alt="">
              <div>
                <div class="scan-student-name">${st.nameKh} (${st.nameEn})</div>
                <div class="scan-meta">អត្តលេខ៖ <strong>${st.id}</strong> | ថ្នាក់ទី៖ <strong>${st.class || '៨ A'}</strong> | ភេទ៖ <strong>${st.gender}</strong></div>
                <div class="scan-time-badge"><i class="fa-regular fa-clock"></i> ម៉ោងស្កេន៖ ${new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Add to recent scans list
    this.recentScans.unshift({
      student: st,
      time: new Date().toLocaleTimeString()
    });
    if (this.recentScans.length > 8) this.recentScans.pop();
    this.renderRecentScans();

    showToast(`សិស្ស ${st.nameKh} (${st.id}) វត្តមាន! ✅`, "success");

    // Refresh attendance module
    AttendanceModule.render();
    if (window.App) App.renderDashboard();
  }

  static renderRecentScans() {
    if (!this.recentScansList) return;
    this.recentScansList.innerHTML = this.recentScans.map(item => `
      <div class="recent-scan-item">
        <img src="${item.student.photo || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + item.student.id}" alt="">
        <div class="recent-scan-info">
          <div class="name">${item.student.nameKh}</div>
          <div class="time"><span class="badge badge-soft-success">P មក</span> ម៉ោង ${item.time}</div>
        </div>
      </div>
    `).join("");
  }
}
