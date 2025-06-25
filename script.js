// Construction Materials Search Application
class MatSearchApp {
    constructor() {
        this.stores = [
            {
                id: 1,
                name: "Sipocot Hardware & Construction Supply",
                material: "10mm Rebar (Grade 40)",
                price: "₱180",
                location: "Sipocot",
                contact: "09123456789",
                category: "Steel",
                description: "High-quality steel reinforcement bars for concrete structures",
                stock: "Available",
                unit: "per piece"
            },
            {
                id: 2,
                name: "Naga Builders Depot",
                material: "Portland Cement - Eagle Brand",
                price: "₱230",
                location: "Naga City",
                contact: "09987654321",
                category: "Cement",
                description: "Premium Portland cement for all construction needs",
                stock: "Available",
                unit: "per bag (40kg)"
            },
            {
                id: 3,
                name: "Libmanan Construction Materials",
                material: "Interior Latex Paint - White",
                price: "₱450",
                location: "Libmanan",
                contact: "09111222333",
                category: "Paint",
                description: "High-quality interior paint with excellent coverage",
                stock: "Available",
                unit: "per gallon"
            },
            {
                id: 4,
                name: "Sipocot Electrical Supply",
                material: "THHN Wire 2.0mm²",
                price: "₱85",
                location: "Sipocot",
                contact: "09444555666",
                category: "Electrical",
                description: "Copper electrical wire for residential wiring",
                stock: "Available",
                unit: "per meter"
            },
            {
                id: 5,
                name: "Naga Steel Center",
                material: "Angle Bar 2\" x 2\" x 1/4\"",
                price: "₱320",
                location: "Naga City",
                contact: "09777888999",
                category: "Steel",
                description: "Structural steel angle bars for framing and support",
                stock: "Available",
                unit: "per piece (6m)"
            }
        ];

        this.currentFilters = {
            search: "",
            location: "",
            category: ""
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.renderStores();
        this.updateStats();
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById("searchInput");
        searchInput.addEventListener("input", (e) => {
            this.currentFilters.search = e.target.value;
            this.renderStores();
        });

        // Location filter
        const locationSelect = document.getElementById("locationSelect");
        locationSelect.addEventListener("change", (e) => {
            this.currentFilters.location = e.target.value;
            this.renderStores();
        });

        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            });
        });

        // Form submission
        const addStoreForm = document.getElementById("addStoreForm");
        addStoreForm.addEventListener("submit", (e) => {
            e.preventDefault();
            this.addStore();
        });

        // Clear filters
        const clearFiltersBtn = document.getElementById("clearFilters");
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener("click", () => {
                this.clearFilters();
            });
        }
    }

    filterByCategory(category) {
        // Update active button state
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        if (category === 'all') {
            this.currentFilters.category = "";
        } else {
            this.currentFilters.category = category;
            document.querySelector(`[data-category="${category}"]`).classList.add('active');
        }

        this.renderStores();
    }

    clearFilters() {
        this.currentFilters = {
            search: "",
            location: "",
            category: ""
        };

        document.getElementById("searchInput").value = "";
        document.getElementById("locationSelect").value = "";
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        this.renderStores();
    }

    renderStores() {
        const storeList = document.getElementById("storeList");
        const filteredStores = this.getFilteredStores();

        if (filteredStores.length === 0) {
            storeList.innerHTML = `
        <div class="empty-state">
          <h3>No materials found</h3>
          <p>Try adjusting your search criteria or add a new store</p>
        </div>
      `;
            return;
        }

        storeList.innerHTML = filteredStores.map(store => this.createStoreCard(store)).join('');
        this.updateStats();
    }

    getFilteredStores() {
        return this.stores.filter(store => {
            const matchesSearch = !this.currentFilters.search ||
                store.material.toLowerCase().includes(this.currentFilters.search.toLowerCase()) ||
                store.name.toLowerCase().includes(this.currentFilters.search.toLowerCase()) ||
                store.description.toLowerCase().includes(this.currentFilters.search.toLowerCase());

            const matchesLocation = !this.currentFilters.location ||
                store.location === this.currentFilters.location;

            const matchesCategory = !this.currentFilters.category ||
                store.category === this.currentFilters.category;

            return matchesSearch && matchesLocation && matchesCategory;
        });
    }

    createStoreCard(store) {
        return `
      <div class="store-card" data-id="${store.id}">
        <div class="store-header">
          <div>
            <h4 class="store-name">${store.name}</h4>
            <p style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">${store.description}</p>
          </div>
          <span class="store-category">${store.category}</span>
        </div>
        <div class="store-details">
          <div class="detail-row">
            <span class="detail-label">Material:</span>
            <span class="detail-value">${store.material}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Price:</span>
            <span class="detail-value price">${store.price} ${store.unit}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Location:</span>
            <span class="detail-value">${store.location}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Stock:</span>
            <span class="detail-value" style="color: #27ae60; font-weight: 600;">${store.stock}</span>
          </div>
        </div>
        <button class="contact-btn" onclick="app.contactStore('${store.contact}')">
          📞 Contact Store
        </button>
      </div>
    `;
    }

    addStore() {
        const formData = new FormData(document.getElementById("addStoreForm"));
        const storeData = {
            id: Date.now(),
            name: formData.get("storeName"),
            material: formData.get("material"),
            price: formData.get("price"),
            location: formData.get("location"),
            contact: formData.get("contact"),
            description: formData.get("description") || "Construction material",
            stock: "Available",
            unit: formData.get("unit") || "per piece",
            category: this.guessCategory(formData.get("material"))
        };

        // Validation
        if (!storeData.name || !storeData.material || !storeData.price || !storeData.location) {
            this.showNotification("Please fill in all required fields", "error");
            return;
        }

        this.stores.push(storeData);
        this.renderStores();
        this.showNotification("Store added successfully!", "success");
        document.getElementById("addStoreForm").reset();
    }

    guessCategory(material) {
        const lower = material.toLowerCase();
        if (lower.includes("rebar") || lower.includes("steel") || lower.includes("angle") || lower.includes("beam")) return "Steel";
        if (lower.includes("cement") || lower.includes("concrete")) return "Cement";
        if (lower.includes("paint") || lower.includes("coating")) return "Paint";
        if (lower.includes("wire") || lower.includes("breaker") || lower.includes("switch") || lower.includes("outlet")) return "Electrical";
        if (lower.includes("lumber") || lower.includes("wood") || lower.includes("plywood")) return "Lumber";
        if (lower.includes("sand") || lower.includes("gravel") || lower.includes("aggregate")) return "Aggregates";
        return "Other";
    }

    contactStore(contact) {
        // In a real app, this would open a contact form or initiate a call
        if (confirm(`Contact this store?\nPhone: ${contact}`)) {
            window.open(`tel:${contact}`, '_self');
        }
    }

    updateStats() {
        const filteredStores = this.getFilteredStores();
        const statsElement = document.getElementById("stats");
        if (statsElement) {
            statsElement.innerHTML = `
        <div style="background: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: center;">
          <strong>${filteredStores.length}</strong> materials found
          ${this.currentFilters.search ? ` for "${this.currentFilters.search}"` : ''}
        </div>
      `;
        }
    }

    showNotification(message, type = "info") {
        const notification = document.createElement("div");
        notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;

        const colors = {
            success: "#27ae60",
            error: "#e74c3c",
            info: "#3498db"
        };

        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MatSearchApp();
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style); 