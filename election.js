/**
 * DIGITAL CLASS ELECTION & VOTING MODULE
 * (ការបោះឆ្នោតជ្រើសរើសប្រធានថ្នាក់ឌីជីថល)
 */

class ElectionModule {
  static init() {
    this.renderElections();
    this.setupEventListeners();
  }

  static renderElections() {
    const container = document.getElementById("electionsContainer");
    if (!container) return;

    const elections = StorageManager.getElections();

    if (elections.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <i class="fa-solid fa-check-to-slot fa-3x text-muted mb-2"></i>
          <h4>មិនទាន់មានការបោះឆ្នោតនៅឡើយទេ</h4>
          <p class="text-muted">សូមចុចប៊ូតុង "បង្កើតការបោះឆ្នោតថ្មី" ដើម្បីរៀបចំការបោះឆ្នោតជ្រើសរើសគណៈកម្មការថ្នាក់។</p>
        </div>
      `;
      return;
    }

    container.innerHTML = elections.map(elec => {
      const totalVotes = elec.candidates.reduce((sum, c) => sum + (c.votes || 0), 0);

      return `
        <div class="election-event-card mb-4" id="election-${elec.id}">
          <div class="election-header">
            <div>
              <span class="badge ${elec.status === 'completed' ? 'badge-success' : 'badge-primary'} mb-1">
                ${elec.status === 'completed' ? '✓ បញ្ចប់រួចរាល់' : '⚡ កំពុងដំណើរការបោះឆ្នោត'}
              </span>
              <h3 class="moul-title text-primary">${elec.title}</h3>
              <p class="text-muted font-khmer"><i class="fa-regular fa-calendar"></i> កាលបរិច្ឆេទ៖ ${elec.date} • សំឡេងឆ្នោតសរុប៖ <strong>${totalVotes} / ${elec.totalVoters || 42} សំឡេង</strong></p>
            </div>
            <div class="election-actions">
              ${elec.status !== 'completed' ? `
                <button class="btn btn-primary" onclick="ElectionModule.openVoteModal('${elec.id}')">
                  <i class="fa-solid fa-check-to-slot"></i> បោះឆ្នោត (Cast Vote)
                </button>
              ` : `
                <button class="btn btn-outline" onclick="ElectionModule.openVoteModal('${elec.id}')">
                  <i class="fa-solid fa-plus"></i> បន្ថែមសំឡេងឆ្នោត
                </button>
              `}
            </div>
          </div>

          <div class="candidates-grid mt-4">
            ${elec.candidates.map((cand, idx) => {
              const pct = totalVotes > 0 ? ((cand.votes / totalVotes) * 100).toFixed(1) : 0;
              const isLead = cand.elected || (idx === 0 && cand.votes > 0);

              return `
                <div class="candidate-card ${isLead ? 'candidate-winner' : ''}">
                  <div class="candidate-header-row">
                    <div class="candidate-avatar-wrap">
                      <div class="candidate-num">លេខ ${idx + 1}</div>
                      ${isLead ? '<div class="winner-crown-badge"><i class="fa-solid fa-crown text-warning"></i></div>' : ''}
                    </div>
                    <div class="candidate-meta">
                      <h4 class="cand-name moul-title">${cand.name}</h4>
                      <span class="cand-sub text-muted">${cand.studentId || ''}</span>
                    </div>
                  </div>

                  <div class="candidate-votes-box mt-3">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <span class="font-bold text-primary">${cand.votes} សំឡេង</span>
                      <span class="font-bold">${pct}%</span>
                    </div>
                    <div class="progress" style="height: 10px;">
                      <div class="progress-bar ${isLead ? 'bg-success' : 'bg-primary'}" style="width: ${pct}%"></div>
                    </div>
                  </div>

                  <div class="candidate-vote-btn-wrap mt-3">
                    <button class="btn btn-sm btn-outline-primary w-100" onclick="ElectionModule.quickVote('${elec.id}', '${cand.studentId || cand.name}')">
                      <i class="fa-solid fa-thumbs-up"></i> បោះឆ្នោតគាំទ្រ (+1)
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  static quickVote(electionId, candidateIdOrName) {
    const elections = StorageManager.getElections();
    const elec = elections.find(e => e.id === electionId);
    if (!elec) return;

    const cand = elec.candidates.find(c => (c.studentId && c.studentId === candidateIdOrName) || c.name === candidateIdOrName);
    if (!cand) return;

    cand.votes = (cand.votes || 0) + 1;

    // Recalculate leader
    elec.candidates.sort((a, b) => b.votes - a.votes);
    elec.candidates.forEach((c, idx) => {
      c.elected = idx === 0;
    });

    StorageManager.saveElections(elections);
    this.renderElections();
    App.showToast(`បានបោះឆ្នោតគាំទ្រ "${cand.name}" ដោយជោគជ័យ! 🎉`, "success");
  }

  static openNewElectionModal() {
    const students = StorageManager.getStudents();
    const c1 = document.getElementById("elecCand1");
    const c2 = document.getElementById("elecCand2");
    const c3 = document.getElementById("elecCand3");

    const optHtml = students.map(s => `<option value="${s.id}|${s.nameKh}">${s.nameKh} (${s.code})</option>`).join('');
    if (c1) c1.innerHTML = optHtml;
    if (c2) c2.innerHTML = optHtml;
    if (c3) c3.innerHTML = `<option value="">-- គ្មាន --</option>` + optHtml;

    if (c2 && students.length > 1) c2.selectedIndex = 1;
    if (c3 && students.length > 2) c3.selectedIndex = 3;

    document.getElementById("newElectionModal").classList.add("active");
  }

  static saveNewElection() {
    const title = document.getElementById("elecTitleInput").value.trim();
    if (!title) {
      alert("សូមបញ្ចូលចំណងជើងការបោះឆ្នោត!");
      return;
    }

    const c1Val = document.getElementById("elecCand1").value;
    const c2Val = document.getElementById("elecCand2").value;
    const c3Val = document.getElementById("elecCand3").value;

    const candidates = [];
    if (c1Val) {
      const [id, name] = c1Val.split('|');
      candidates.push({ studentId: id, name, votes: 0, elected: false });
    }
    if (c2Val) {
      const [id, name] = c2Val.split('|');
      candidates.push({ studentId: id, name, votes: 0, elected: false });
    }
    if (c3Val) {
      const [id, name] = c3Val.split('|');
      candidates.push({ studentId: id, name, votes: 0, elected: false });
    }

    if (candidates.length < 2) {
      alert("សូមជ្រើសរើសបេក្ខជនយ៉ាងតិច ២ នាក់!");
      return;
    }

    const newElection = {
      id: "ELEC-" + Date.now().toString(36).toUpperCase(),
      title,
      date: new Date().toISOString().split('T')[0],
      status: "active",
      totalVoters: 42,
      candidates
    };

    const elections = StorageManager.getElections();
    elections.unshift(newElection);
    StorageManager.saveElections(elections);

    this.renderElections();
    document.getElementById("newElectionModal").classList.remove("active");
    App.showToast("បានបង្កើតការបោះឆ្នោតថ្មីដោយជោគជ័យ!", "success");
  }

  static setupEventListeners() {
    const openBtn = document.getElementById("btnOpenNewElection");
    if (openBtn) openBtn.addEventListener("click", () => this.openNewElectionModal());

    const saveBtn = document.getElementById("btnSaveNewElection");
    if (saveBtn) saveBtn.addEventListener("click", () => this.saveNewElection());

    const closeBtn = document.getElementById("closeNewElectionModal");
    if (closeBtn) closeBtn.addEventListener("click", () => {
      document.getElementById("newElectionModal").classList.remove("active");
    });
  }
}
