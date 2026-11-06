/**
 * CLASS RESOURCE HUB & E-LIBRARY MODULE
 * Learning materials, lesson summaries, presentation slides, practice worksheets & QR sharing
 */

class ResourcesModule {
  static init() {
    this.container = document.getElementById("resourcesGridContainer");
    this.subjectFilter = document.getElementById("resourceSubjectFilter");
    this.typeFilter = document.getElementById("resourceTypeFilter");
    this.searchInput = document.getElementById("resourceSearchInput");

    this.bindEvents();
    this.populateSubjectDropdowns();
    this.render();
  }

  static bindEvents() {
    const addBtn = document.getElementById("btnOpenAddResourceModal");
    if (addBtn) {
      addBtn.addEventListener("click", () => this.openAddModal());
    }

    const form = document.getElementById("addResourceForm");
    if (form) {
      form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    }

    if (this.subjectFilter) {
      this.subjectFilter.addEventListener("change", () => this.render());
    }
    if (this.typeFilter) {
      this.typeFilter.addEventListener("change", () => this.render());
    }
    if (this.searchInput) {
      this.searchInput.addEventListener("input", () => this.render());
    }
  }

  static populateSubjectDropdowns() {
    const subjects = StorageManager.getSubjects();
    if (this.subjectFilter) {
      this.subjectFilter.innerHTML = `<option value="all">មុខវិជ្ជាទាំងអស់</option>` +
        subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
    }

    const formSub = document.getElementById("resSubjectSelect");
    if (formSub) {
      formSub.innerHTML = subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
    }
  }

  static render() {
    const resources = StorageManager.getResources();
    const sub = this.subjectFilter ? this.subjectFilter.value : "all";
    const type = this.typeFilter ? this.typeFilter.value : "all";
    const query = this.searchInput ? this.searchInput.value.toLowerCase().trim() : "";

    let filtered = resources.filter(r => {
      const matchSub = sub === "all" || r.subjectId === sub;
      const matchType = type === "all" || r.type === type;
      const matchQuery = !query || 
        (r.title && r.title.toLowerCase().includes(query)) ||
        (r.desc && r.desc.toLowerCase().includes(query)) ||
        (r.subjectName && r.subjectName.toLowerCase().includes(query)) ||
        (r.author && r.author.toLowerCase().includes(query));
      return matchSub && matchType && matchQuery;
    });

    if (!this.container) return;

    if (filtered.length === 0) {
      this.container.innerHTML = `
        <div class="col-12 text-center p-5 text-muted font-khmer">
          <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; margin-bottom: 12px; display: block;"></i>
          មិនមានឯកសារមេរៀនត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ
        </div>
      `;
      return;
    }

    this.container.innerHTML = filtered.map(r => {
      const icon = r.type === "pdf" ? '<i class="fa-solid fa-file-pdf text-danger"></i>' :
                   r.type === "slide" ? '<i class="fa-solid fa-file-powerpoint text-warning"></i>' :
                   r.type === "video" ? '<i class="fa-solid fa-circle-play text-info"></i>' :
                   '<i class="fa-solid fa-file-lines text-success"></i>';

      const typeBadge = r.type === "pdf" ? '<span class="badge badge-soft-danger">PDF</span>' :
                        r.type === "slide" ? '<span class="badge badge-soft-warning">Slide</span>' :
                        r.type === "video" ? '<span class="badge badge-soft-info">Video HD</span>' :
                        '<span class="badge badge-soft-success">Worksheet</span>';

      return `
        <div class="resource-card">
          <div class="resource-card-top">
            <div class="res-type-icon">${icon}</div>
            <div class="res-badge-wrap">${typeBadge}</div>
          </div>
          <div class="resource-card-body">
            <span class="badge badge-soft-primary font-khmer mb-1">${r.subjectName || 'ទូទៅ'}</span>
            <h4 class="resource-title font-khmer">${r.title}</h4>
            <p class="resource-desc font-khmer text-muted">${r.desc || 'ឯកសារជំនួយស្មារតី និងពង្រឹងការសិក្សា'}</p>
          </div>
          <div class="resource-card-footer">
            <div class="res-meta-line font-khmer text-muted">
              <span><i class="fa-solid fa-user-pen"></i> ${r.author || 'លោកគ្រូ/អ្នកគ្រូ'}</span>
              <span><i class="fa-solid fa-download"></i> ${r.downloads || 1} ទាញយក</span>
            </div>
            <div class="res-btn-group mt-2">
              <button class="btn btn-outline btn-xs" onclick="ResourcesModule.showQrCode('${r.id}', '${r.title.replace(/'/g, "\\'")}')" title="ស្កេនទាញយកលើទូរស័ព្ទ">
                <i class="fa-solid fa-qrcode"></i> QR
              </button>
              <button class="btn btn-primary btn-xs" onclick="ResourcesModule.downloadResource('${r.id}')">
                <i class="fa-solid fa-cloud-arrow-down"></i> ទាញយក
              </button>
              <button class="btn-icon text-danger" onclick="ResourcesModule.deleteResource('${r.id}')" title="លុប">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  static showQrCode(resId, title) {
    const modal = document.getElementById("qrResourceModal");
    const container = document.getElementById("qrResourceBox");
    const titleEl = document.getElementById("qrResourceTitle");

    if (titleEl) titleEl.textContent = title;
    if (container) {
      container.innerHTML = "";
      if (typeof QRCode !== "undefined") {
        new QRCode(container, {
          text: `https://school.moeys.gov.kh/materials/${resId}`,
          width: 140,
          height: 140,
          colorDark: "#1e3a8a",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M
        });
      }
    }
    openModal("qrResourceModal");
  }

  static downloadResource(resId) {
    const resources = StorageManager.getResources();
    const r = resources.find(x => x.id === resId);
    if (r) {
      r.downloads = (r.downloads || 0) + 1;
      StorageManager.saveResources(resources);
      this.render();
      showToast(`កំពុងទាញយកឯកសារ "${r.title}"...`, "success");
    }
  }

  static openAddModal() {
    document.getElementById("resTitleInput").value = "";
    document.getElementById("resDescInput").value = "";
    document.getElementById("resAuthorInput").value = "លោកគ្រូ សុខ ចាន់ថា";
    openModal("addResourceModal");
  }

  static handleFormSubmit(e) {
    e.preventDefault();
    const title = document.getElementById("resTitleInput").value.trim();
    const subjectId = document.getElementById("resSubjectSelect").value;
    const type = document.getElementById("resTypeSelect").value;
    const desc = document.getElementById("resDescInput").value.trim();
    const author = document.getElementById("resAuthorInput").value.trim() || "លោកគ្រូ/អ្នកគ្រូ";

    const subjects = StorageManager.getSubjects();
    const subObj = subjects.find(s => s.id === subjectId) || { name: "ទូទៅ" };

    const newRes = {
      id: "RES-" + Date.now(),
      title,
      subjectId,
      subjectName: subObj.name,
      type,
      size: type === "video" ? "YouTube HD" : "3.2 MB",
      date: new Date().toISOString().split('T')[0],
      author,
      url: "#",
      downloads: 0,
      desc
    };

    const resources = StorageManager.getResources();
    resources.unshift(newRes);
    StorageManager.saveResources(resources);

    closeModal("addResourceModal");
    this.render();
    showToast("បានបង្ហោះឯកសារមេរៀនជោគជ័យ!", "success");
  }

  static deleteResource(resId) {
    if (!confirm("តើអ្នកពិតជាចង់លុបឯកសារមេរៀននេះមែនទេ?")) return;
    let resources = StorageManager.getResources();
    resources = resources.filter(r => r.id !== resId);
    StorageManager.saveResources(resources);
    this.render();
    showToast("បានលុបឯកសាររួចរាល់!", "info");
  }
}
