/**
 * CLASSROOM GAMIFICATION & BADGES MODULE
 * Star points, honor badges, weekly leaderboards & live celebration
 */

class GamificationModule {
  static init() {
    this.container = document.getElementById("gamificationContainer");
    this.leaderboardBody = document.getElementById("gamificationLeaderboardBody");
    this.podiumContainer = document.getElementById("gamificationPodium");
    this.historyBody = document.getElementById("gamificationHistoryBody");
    this.badgeGrid = document.getElementById("gamificationBadgeGrid");
    
    this.bindEvents();
    this.render();
  }

  static playRewardSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major Arpeggio)
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + (idx * 0.08));
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + (idx * 0.08));
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (idx * 0.08) + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + (idx * 0.08));
        osc.stop(audioCtx.currentTime + (idx * 0.08) + 0.35);
      });
    } catch (e) {
      console.warn("Audio not supported or blocked", e);
    }
  }

  static bindEvents() {
    const awardModalBtn = document.getElementById("btnOpenAwardModal");
    if (awardModalBtn) {
      awardModalBtn.addEventListener("click", () => this.openAwardModal());
    }

    const saveAwardBtn = document.getElementById("btnConfirmAwardBadge");
    if (saveAwardBtn) {
      saveAwardBtn.addEventListener("click", () => this.handleAwardSubmit());
    }

    const searchInput = document.getElementById("gamificationSearch");
    if (searchInput) {
      searchInput.addEventListener("input", () => this.renderLeaderboard());
    }
  }

  static render() {
    this.renderBadgesOverview();
    this.renderLeaderboard();
    this.renderHistory();
  }

  static renderBadgesOverview() {
    const data = StorageManager.getGamification();
    const badges = data.badges || [];
    if (!this.badgeGrid) return;

    this.badgeGrid.innerHTML = badges.map(b => `
      <div class="badge-card-item" style="border-top: 4px solid ${b.color};">
        <div class="badge-card-icon" style="background: ${b.color}20;">${b.icon}</div>
        <div class="badge-card-info">
          <h4 class="font-khmer font-bold">${b.name}</h4>
          <span class="badge-pts font-mono">+${b.points} ⭐</span>
          <p class="text-muted font-khmer">${b.desc || ''}</p>
        </div>
      </div>
    `).join("");
  }

  static renderLeaderboard() {
    const data = StorageManager.getGamification();
    const students = StorageManager.getStudents();
    const studentStars = data.studentStars || {};
    const query = document.getElementById("gamificationSearch") ? document.getElementById("gamificationSearch").value.toLowerCase().trim() : "";

    // Build ranking list
    let ranked = students.map(st => {
      const starInfo = studentStars[st.id] || { totalStars: 0, streak: 0, badges: {} };
      return {
        student: st,
        stars: starInfo.totalStars || 0,
        streak: starInfo.streak || 0,
        badges: starInfo.badges || {}
      };
    }).sort((a, b) => b.stars - a.stars);

    // Render Podium for Top 3
    if (this.podiumContainer && ranked.length >= 3) {
      const top1 = ranked[0];
      const top2 = ranked[1];
      const top3 = ranked[2];

      this.podiumContainer.innerHTML = `
        <!-- Rank 2 -->
        <div class="podium-card podium-rank-2">
          <div class="podium-crown">🥈</div>
          <img src="${top2.student.photo || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + top2.student.id}" class="podium-photo" alt="">
          <div class="podium-name">${top2.student.nameKh}</div>
          <div class="podium-stars"><i class="fa-solid fa-star text-warning"></i> ${top2.stars} ផ្កាយ</div>
          <div class="podium-mention">🔥 ${top2.streak} ថ្ងៃជាប់គ្នា</div>
          <button class="btn btn-outline btn-xs mt-2" onclick="GamificationModule.quickAward('${top2.student.id}')">+ ផ្ដល់ពិន្ទុ</button>
        </div>

        <!-- Rank 1 -->
        <div class="podium-card podium-rank-1">
          <div class="podium-crown">👑 🥇</div>
          <img src="${top1.student.photo || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + top1.student.id}" class="podium-photo" alt="">
          <div class="podium-name">${top1.student.nameKh}</div>
          <div class="podium-stars font-bold"><i class="fa-solid fa-star text-warning"></i> ${top1.stars} ផ្កាយ</div>
          <div class="podium-mention">🔥 ${top1.streak} ថ្ងៃជាប់គ្នា (កំពូលតារា)</div>
          <button class="btn btn-primary btn-xs mt-2" onclick="GamificationModule.quickAward('${top1.student.id}')">🌟 + ផ្ដល់ពិន្ទុ</button>
        </div>

        <!-- Rank 3 -->
        <div class="podium-card podium-rank-3">
          <div class="podium-crown">🥉</div>
          <img src="${top3.student.photo || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + top3.student.id}" class="podium-photo" alt="">
          <div class="podium-name">${top3.student.nameKh}</div>
          <div class="podium-stars"><i class="fa-solid fa-star text-warning"></i> ${top3.stars} ផ្កាយ</div>
          <div class="podium-mention">🔥 ${top3.streak} ថ្ងៃជាប់គ្នា</div>
          <button class="btn btn-outline btn-xs mt-2" onclick="GamificationModule.quickAward('${top3.student.id}')">+ ផ្ដល់ពិន្ទុ</button>
        </div>
      `;
    }

    if (query) {
      ranked = ranked.filter(r => r.student.nameKh.toLowerCase().includes(query) || r.student.id.toLowerCase().includes(query));
    }

    if (!this.leaderboardBody) return;

    this.leaderboardBody.innerHTML = ranked.map((r, idx) => {
      const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}`;
      const badgeList = Object.entries(r.badges).map(([bId, cnt]) => {
        const bObj = (data.badges || []).find(x => x.id === bId);
        if (!bObj) return "";
        return `<span class="badge-tag" title="${bObj.name}: ${cnt} ដង">${bObj.icon} ${cnt}</span>`;
      }).join(" ");

      return `
        <tr>
          <td class="text-center font-bold font-mono" style="font-size: 1.1rem;">${medal}</td>
          <td><span class="badge badge-soft-primary font-mono">${r.student.id}</span></td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <img src="${r.student.photo || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + r.student.id}" class="avatar-xs" alt="">
              <strong>${r.student.nameKh}</strong>
            </div>
          </td>
          <td class="text-center font-bold text-warning" style="font-size: 1.05rem;">
            ⭐ ${r.stars}
          </td>
          <td class="text-center font-mono">
            ${r.streak > 0 ? `<span class="badge badge-soft-danger">🔥 ${r.streak} ថ្ងៃ</span>` : '<span class="text-muted">-</span>'}
          </td>
          <td>
            <div class="d-flex flex-wrap gap-1">${badgeList || '<span class="text-muted" style="font-size:0.8rem;">មិនទាន់មាន</span>'}</div>
          </td>
          <td class="text-center">
            <button class="btn btn-primary btn-xs" onclick="GamificationModule.quickAward('${r.student.id}')">
              <i class="fa-solid fa-award"></i> លើកទឹកចិត្ត
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  static renderHistory() {
    const data = StorageManager.getGamification();
    const history = data.history || [];
    if (!this.historyBody) return;

    if (history.length === 0) {
      this.historyBody.innerHTML = `<tr><td colspan="5" class="text-center p-3 text-muted font-khmer">មិនទាន់មានប្រវត្តិនៃការផ្ដល់រង្វាន់នៅឡើយទេ</td></tr>`;
      return;
    }

    this.historyBody.innerHTML = history.slice(0, 15).map((h, i) => `
      <tr>
        <td class="text-center font-bold">${i + 1}</td>
        <td><span class="font-mono" style="font-size: 0.85rem;">${h.date}</span></td>
        <td><strong>${h.studentName}</strong></td>
        <td>
          <span class="badge badge-soft-success font-khmer">${h.icon || '⭐'} ${h.badgeName}</span>
        </td>
        <td class="text-center font-bold text-warning">+${h.points} ⭐</td>
      </tr>
    `).join("");
  }

  static openAwardModal(preselectedStudentId = "") {
    const students = StorageManager.getStudents();
    const data = StorageManager.getGamification();
    const badges = data.badges || [];

    const stuSelect = document.getElementById("awardStudentSelect");
    if (stuSelect) {
      stuSelect.innerHTML = `<option value="ALL">📢 ផ្ដល់ជូនសិស្សទាំងអស់ក្នុងថ្នាក់ (All 42 Students)</option>` +
        students.map(s => `<option value="${s.id}" ${s.id === preselectedStudentId ? 'selected' : ''}>${s.nameKh} (${s.id})</option>`).join("");
    }

    const badgeContainer = document.getElementById("awardBadgeChoices");
    if (badgeContainer) {
      badgeContainer.innerHTML = badges.map((b, idx) => `
        <label class="award-choice-label ${idx === 0 ? 'selected' : ''}">
          <input type="radio" name="awardBadgeRadio" value="${b.id}" ${idx === 0 ? 'checked' : ''} onchange="GamificationModule.selectBadgeRadio(this)">
          <div class="award-choice-box" style="border-color: ${b.color};">
            <span class="choice-icon">${b.icon}</span>
            <span class="choice-name">${b.name}</span>
            <span class="choice-pts">+${b.points} ⭐</span>
          </div>
        </label>
      `).join("");
    }

    openModal("awardBadgeModal");
  }

  static selectBadgeRadio(radio) {
    document.querySelectorAll(".award-choice-label").forEach(l => l.classList.remove("selected"));
    if (radio && radio.parentElement) {
      radio.parentElement.classList.add("selected");
    }
  }

  static quickAward(studentId) {
    this.openAwardModal(studentId);
  }

  static handleAwardSubmit() {
    const stuId = document.getElementById("awardStudentSelect").value;
    const selectedBadgeRadio = document.querySelector('input[name="awardBadgeRadio"]:checked');
    if (!selectedBadgeRadio) {
      showToast("សូមជ្រើសរើសផ្លាកសញ្ញាដែលត្រូវផ្ដល់!", "error");
      return;
    }

    const badgeId = selectedBadgeRadio.value;
    const customPoints = parseInt(document.getElementById("awardCustomPoints")?.value || 0, 10);
    const data = StorageManager.getGamification();
    const badgeObj = (data.badges || []).find(b => b.id === badgeId) || { name: "ផ្កាយលើកទឹកចិត្ត", points: 2, icon: "⭐" };
    const pointsToAdd = customPoints > 0 ? customPoints : badgeObj.points;
    const students = StorageManager.getStudents();
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (!data.studentStars) data.studentStars = {};
    if (!data.history) data.history = [];

    if (stuId === "ALL") {
      students.forEach(st => {
        if (!data.studentStars[st.id]) {
          data.studentStars[st.id] = { totalStars: 0, streak: 1, badges: {} };
        }
        data.studentStars[st.id].totalStars = (data.studentStars[st.id].totalStars || 0) + pointsToAdd;
        if (!data.studentStars[st.id].badges) data.studentStars[st.id].badges = {};
        data.studentStars[st.id].badges[badgeId] = (data.studentStars[st.id].badges[badgeId] || 0) + 1;
      });

      data.history.unshift({
        id: "STAR-" + Date.now(),
        studentId: "ALL",
        studentName: "សិស្សទាំងអស់ក្នុងថ្នាក់ (៤២ នាក់)",
        badgeId: badgeId,
        badgeName: badgeObj.name,
        icon: badgeObj.icon,
        points: pointsToAdd,
        date: nowStr
      });

      showToast(`🎉 បានផ្ដល់ ${pointsToAdd} ⭐ ជូនសិស្សទាំងអស់ក្នុងថ្នាក់ជោគជ័យ!`, "success");
    } else {
      const st = students.find(s => s.id === stuId);
      if (!st) return;

      if (!data.studentStars[stuId]) {
        data.studentStars[stuId] = { totalStars: 0, streak: 1, badges: {} };
      }
      data.studentStars[stuId].totalStars = (data.studentStars[stuId].totalStars || 0) + pointsToAdd;
      data.studentStars[stuId].streak = (data.studentStars[stuId].streak || 0) + 1;
      if (!data.studentStars[stuId].badges) data.studentStars[stuId].badges = {};
      data.studentStars[stuId].badges[badgeId] = (data.studentStars[stuId].badges[badgeId] || 0) + 1;

      data.history.unshift({
        id: "STAR-" + Date.now(),
        studentId: stuId,
        studentName: st.nameKh,
        badgeId: badgeId,
        badgeName: badgeObj.name,
        icon: badgeObj.icon,
        points: pointsToAdd,
        date: nowStr
      });

      showToast(`🎉 បានផ្ដល់ "${badgeObj.name}" (+${pointsToAdd} ⭐) ជូន ${st.nameKh}!`, "success");
    }

    StorageManager.saveGamification(data);
    this.playRewardSound();
    
    if (typeof confetti === "function") {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    closeModal("awardBadgeModal");
    this.render();
  }
}
