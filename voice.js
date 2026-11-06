/**
 * AI KHMER VOICE COMMANDS & VOICE ATTENDANCE MODULE
 * Web Speech Recognition, Voice Navigation & Voice Attendance Marking
 */

class VoiceModule {
  static init() {
    this.recognition = null;
    this.isListening = false;
    this.hudModal = document.getElementById("voiceHudModal");
    this.transcriptEl = document.getElementById("voiceLiveTranscript");
    this.statusEl = document.getElementById("voiceStatusText");
    this.waveEl = document.getElementById("voiceWaveVisualizer");

    this.setupRecognition();
    this.bindEvents();
  }

  static setupRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "km-KH"; // Khmer language code

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateHUD("កំពុងស្តាប់សំឡេង... (សូមនិយាយបញ្ជា ឬហៅឈ្មោះសិស្ស)", true);
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const fullText = (finalTranscript || interimTranscript).trim();
        if (this.transcriptEl) {
          this.transcriptEl.textContent = `"${fullText}"`;
        }

        if (finalTranscript) {
          this.processCommand(finalTranscript);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          this.updateHUD("❌ មិនបានអនុញ្ញាតឱ្យប្រើមីក្រូហ្វូន (Microphone Denied)", false);
        } else {
          this.updateHUD("សូមព្យាយាមនិយាយម្តងទៀត...", false);
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          try { this.recognition.start(); } catch (e) {}
        }
      };
    }
  }

  static bindEvents() {
    const triggerBtn = document.getElementById("voiceCommandBtn");
    if (triggerBtn) {
      triggerBtn.addEventListener("click", () => this.toggleVoiceAssistant());
    }

    const modalMicBtn = document.getElementById("voiceModalMicToggle");
    if (modalMicBtn) {
      modalMicBtn.addEventListener("click", () => this.toggleListening());
    }
  }

  static playBeep(success = true) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.value = success ? 880 : 330;
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {}
  }

  static toggleVoiceAssistant() {
    openModal("voiceHudModal");
    this.startListening();
  }

  static startListening() {
    if (!this.recognition) {
      this.updateHUD("Browser របស់លោកអ្នកមិនទាន់គាំទ្រ Speech Recognition ទេ។ លោកអ្នកអាចសាកល្បងវាយ Command សាកល្បងបាន។", false);
      return;
    }
    try {
      this.isListening = true;
      this.recognition.start();
    } catch (e) {
      this.updateHUD("កំពុងស្តាប់...", true);
    }
  }

  static stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }
    this.updateHUD("បានផ្អាកការស្តាប់", false);
  }

  static toggleListening() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  static updateHUD(statusText, isActive) {
    if (this.statusEl) this.statusEl.textContent = statusText;
    if (this.waveEl) {
      if (isActive) this.waveEl.classList.add("active");
      else this.waveEl.classList.remove("active");
    }
    const micBtn = document.getElementById("voiceModalMicToggle");
    if (micBtn) {
      if (isActive) micBtn.classList.add("listening");
      else micBtn.classList.remove("listening");
    }
  }

  static processCommand(transcript) {
    const text = transcript.toLowerCase().trim();
    const students = StorageManager.getStudents();
    let handled = false;

    // 1. Check Voice Attendance Command: "[ឈ្មោះ] មក" | "[ឈ្មោះ] អវត្តមាន" | "[ឈ្មោះ] ច្បាប់"
    for (let st of students) {
      const name = st.nameKh.toLowerCase();
      if (text.includes(name)) {
        const today = new Date().toISOString().split('T')[0];
        const att = StorageManager.getAttendance();
        if (!att[today]) att[today] = {};

        if (text.includes("អវត្តមាន") || text.includes("អត់មក") || text.includes("ខាន")) {
          att[today][st.id] = { status: "A", note: "ស្រង់តាមសំឡេង (អវត្តមាន)" };
          StorageManager.saveAttendance(att);
          this.playBeep(true);
          showToast(`🎙️ បានកត់ត្រា៖ ${st.nameKh} [អវត្តមាន ❌]`, "error");
          handled = true;
        } else if (text.includes("ច្បាប់") || text.includes("សុំច្បាប់")) {
          att[today][st.id] = { status: "L", note: "ស្រង់តាមសំឡេង (ច្បាប់)" };
          StorageManager.saveAttendance(att);
          this.playBeep(true);
          showToast(`🎙️ បានកត់ត្រា៖ ${st.nameKh} [មានច្បាប់ ⚠️]`, "warning");
          handled = true;
        } else if (text.includes("មក") || text.includes("វត្តមាន")) {
          att[today][st.id] = { status: "P", note: "ស្រង់តាមសំឡេង (វត្តមាន)" };
          StorageManager.saveAttendance(att);
          this.playBeep(true);
          showToast(`🎙️ បានកត់ត្រា៖ ${st.nameKh} [មក ✅]`, "success");
          handled = true;
        }

        if (handled) {
          if (typeof AttendanceModule !== "undefined" && AttendanceModule.render) {
            AttendanceModule.render();
          }
          break;
        }
      }
    }

    if (handled) return;

    // 2. Navigation Commands
    if (text.includes("ផ្ទាំងដើម") || text.includes("dashboard") || text.includes("ទំព័រដើម")) {
      switchTab("dashboard");
      this.playBeep(true);
      showToast("🎙️ ប្តូរទៅកាន់៖ ផ្ទាំងទិដ្ឋភាពរួម", "info");
      handled = true;
    } else if (text.includes("សិស្ស") || text.includes("បញ្ជីសិស្ស")) {
      switchTab("students");
      this.playBeep(true);
      showToast("🎙️ ប្តូរទៅកាន់៖ បញ្ជីឈ្មោះសិស្ស", "info");
      handled = true;
    } else if (text.includes("វត្តមាន") || text.includes("ស្រង់វត្តមាន")) {
      switchTab("attendance");
      this.playBeep(true);
      showToast("🎙️ ប្តូរទៅកាន់៖ ស្រង់វត្តមាន", "info");
      handled = true;
    } else if (text.includes("ពិន្ទុ") || text.includes("ចំណាត់ថ្នាក់")) {
      switchTab("grades");
      this.playBeep(true);
      showToast("🎙️ ប្តូរទៅកាន់៖ បញ្ចូល & គណនាពិន្ទុ", "info");
      handled = true;
    } else if (text.includes("កិច្ចការផ្ទះ") || text.includes("លំហាត់")) {
      switchTab("homework");
      this.playBeep(true);
      showToast("🎙️ ប្តូរទៅកាន់៖ កិច្ចការផ្ទះ", "info");
      handled = true;
    } else if (text.includes("ផ្កាយ") || text.includes("រង្វាន់") || text.includes("badge")) {
      switchTab("gamification");
      this.playBeep(true);
      showToast("🎙️ ប្តូរទៅកាន់៖ ផ្កាយ & ផ្លាកសញ្ញា", "info");
      handled = true;
    } else if (text.includes("មូលនិធិ") || text.includes("លុយ") || text.includes("ថវិកា")) {
      switchTab("fund");
      this.playBeep(true);
      showToast("🎙️ ប្តូរទៅកាន់៖ មូលនិធិថ្នាក់រៀន", "info");
      handled = true;
    } else if (text.includes("កិច្ចតែងការ") || text.includes("សៀវភៅបង្រៀន")) {
      switchTab("logbook");
      this.playBeep(true);
      showToast("🎙️ ប្តូរទៅកាន់៖ សៀវភៅកិច្ចតែងការ", "info");
      handled = true;
    } else if (text.includes("ឯកសារ") || text.includes("មេរៀន") || text.includes("បណ្ណាល័យ")) {
      switchTab("resources");
      this.playBeep(true);
      showToast("🎙️ ប្តូរទៅកាន់៖ ឃ្លាំងឯកសារមេរៀន", "info");
      handled = true;
    } else if (text.includes("ស្កេន") || text.includes("qr")) {
      switchTab("scanner");
      this.playBeep(true);
      showToast("🎙️ ប្តូរទៅកាន់៖ ស្កេន QR", "info");
      handled = true;
    } else if (text.includes("ប្តូរពណ៌") || text.includes("ងងឹត") || text.includes("ភ្លឺ")) {
      const themeBtn = document.getElementById("themeToggleBtn");
      if (themeBtn) themeBtn.click();
      this.playBeep(true);
      showToast("🎙️ បានប្តូររចនាបថ យប់/ថ្ងៃ", "info");
      handled = true;
    }

    if (!handled) {
      this.playBeep(false);
      showToast(`🎙️ មិនស្គាល់បញ្ជា៖ "${transcript}"`, "warning");
    }
  }

  static testCommandText(text) {
    if (this.transcriptEl) {
      this.transcriptEl.textContent = `"${text}"`;
    }
    this.processCommand(text);
  }
}
