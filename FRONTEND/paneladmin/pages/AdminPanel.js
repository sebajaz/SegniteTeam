// Admin Panel Component
class AdminPanel {
    constructor(onLogout) {
        this.onLogout = onLogout;
        this.reports = [];
        this.activeTab = 'pending';
    }

    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    getBackendBaseUrl() {
        return CONFIG.API_URL.replace(/\/api\/v1$/, '');
    }

    async fetchReports() {
        try {
            const response = await fetch(`${CONFIG.API_URL}/reportes`, {
                headers: this.getAuthHeaders()
            });
            if (response.ok) {
                const responseData = await response.json();
                // Backend returns { success: true, data: [...], pagination: ... }

                if (responseData.success && Array.isArray(responseData.data)) {
                    const backendBase = this.getBackendBaseUrl();

                    this.reports = responseData.data.map(r => {
                        const rawImage = r.imagenUrlPublica || r.imagenUrl;
                        let imageUrl = null;

                        if (rawImage) {
                            if (rawImage.startsWith('http')) {
                                imageUrl = rawImage;
                            } else {
                                const normalized = rawImage.startsWith('/') ? rawImage : `/${rawImage}`;
                                imageUrl = `${backendBase}${normalized}`;
                            }
                        }

                        return {
                            id: r._id || r.id,
                            address: r.direccion || 'Sin direccion',
                            coordinates: `${r.latitud}, ${r.longitud}`,
                            comment: r.comentario || 'Sin comentario',
                            type: 'basura', // Backend currently only handles this type implicitly
                            status: this.mapStatusBackendToFrontend(r.estado),
                            date: new Date(r.fechaCreacion).toLocaleString(),
                            imageUrl
                        };
                    });

                    this.renderReports();
                    this.updateStats();
                }
            } else {
                console.error("Error fetching reports");
                if (response.status === 401 || response.status === 403) {
                    this.onLogout();
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    mapStatusBackendToFrontend(status) {
        const map = {
            'pendiente': 'pending',
            'aprobado': 'accepted',
            'rechazado': 'rejected'
        };
        return map[status] || 'pending';
    }

    async handleAccept(id) {
        try {
            const response = await fetch(`${CONFIG.API_URL}/reportes/${id}/aprobar`, {
                method: 'PUT',
                headers: this.getAuthHeaders()
            });

            if (response.ok) {
                await this.fetchReports(); // Refresh data
            } else {
                alert("Error al aprobar el reporte");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexiÃ³n");
        }
    }

    async handleReject(id) {
        try {
            const response = await fetch(`${CONFIG.API_URL}/reportes/${id}/rechazar`, {
                method: 'PUT',
                headers: this.getAuthHeaders()
            });

            if (response.ok) {
                await this.fetchReports(); // Refresh data
            } else {
                alert("Error al rechazar el reporte");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexiÃ³n");
        }
    }

    setActiveTab(tab) {
        this.activeTab = tab;

        // Update tab triggers
        document.querySelectorAll('.tab-trigger').forEach(trigger => {
            trigger.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`tab-${tab}`).classList.add('active');

        this.renderReports();
    }

    updateStats() {
        const pendingCount = this.reports.filter(r => r.status === 'pending').length;
        const acceptedCount = this.reports.filter(r => r.status === 'accepted').length;
        const rejectedCount = this.reports.filter(r => r.status === 'rejected').length;

        document.getElementById('pending-count').textContent = pendingCount;
        document.getElementById('accepted-count').textContent = acceptedCount;
        document.getElementById('rejected-count').textContent = rejectedCount;

        // Update tab counts
        document.querySelector('[data-tab="pending"] .tab-count').textContent = `(${pendingCount})`;
        document.querySelector('[data-tab="accepted"] .tab-count').textContent = `(${acceptedCount})`;
        document.querySelector('[data-tab="rejected"] .tab-count').textContent = `(${rejectedCount})`;
    }

    renderReports() {
        const pendingReports = this.reports.filter(r => r.status === 'pending');
        const acceptedReports = this.reports.filter(r => r.status === 'accepted');
        const rejectedReports = this.reports.filter(r => r.status === 'rejected');

        this.renderReportList('pending', pendingReports, true);
        this.renderReportList('accepted', acceptedReports, false);
        this.renderReportList('rejected', rejectedReports, false);
    }

    renderReportList(status, reports, withActions) {
        const container = document.getElementById(`${status}-reports`);
        container.innerHTML = '';

        if (reports.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';

            let icon = Icons.clock('icon');
            let message = 'No hay reportes pendientes';

            if (status === 'accepted') {
                icon = Icons.checkCircle('icon');
                message = 'No hay reportes aceptados';
            } else if (status === 'rejected') {
                icon = Icons.xCircle('icon');
                message = 'No hay reportes denegados';
            }

            emptyState.innerHTML = `
                ${icon}
                <p>${message}</p>
            `;
            container.appendChild(emptyState);
        } else {
            reports.forEach(report => {
                const reportCard = new ReportCard(
                    report,
                    withActions ? (id) => this.handleAccept(id) : null,
                    withActions ? (id) => this.handleReject(id) : null
                );
                container.appendChild(reportCard.render());
            });
        }
    }

    render() {
        const page = document.createElement('div');
        page.className = 'admin-body';
        page.innerHTML = `
            <header class="admin-header">
                <div class="container">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            ${Icons.recycle('icon-lg')}
                            <div>
                                <h1>Panel de AdministraciÃ³n - EcoResi</h1>
                                <p>GestiÃ³n de reportes ambientales</p>
                            </div>
                        </div>
                        <button class="btn btn-outline" id="logoutBtn">
                            ${Icons.logOut('icon-sm')}
                            <span>Cerrar SesiÃ³n</span>
                        </button>
                    </div>
                </div>
            </header>
            
            <div class="container py-8">
                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="card stat-card">
                        <div class="card-header">
                            <h3 class="card-title">Reportes Pendientes</h3>
                            ${Icons.clock('icon', 'text-orange')}
                        </div>
                        <div class="card-content">
                            <div class="stat-value" id="pending-count">0</div>
                            <span class="badge badge-pending">Por revisar</span>
                        </div>
                    </div>
                    
                    <div class="card stat-card">
                        <div class="card-header">
                            <h3 class="card-title">Reportes Aceptados</h3>
                            ${Icons.checkCircle('icon', 'text-green')}
                        </div>
                        <div class="card-content">
                            <div class="stat-value" id="accepted-count">0</div>
                            <span class="badge badge-accepted">Aprobados</span>
                        </div>
                    </div>
                    
                    <div class="card stat-card">
                        <div class="card-header">
                            <h3 class="card-title">Reportes Denegados</h3>
                            ${Icons.xCircle('icon', 'text-orange')}
                        </div>
                        <div class="card-content">
                            <div class="stat-value" id="rejected-count">0</div>
                            <span class="badge badge-rejected">Rechazados</span>
                        </div>
                    </div>
                </div>
                
                <!-- Reports Section -->
                <div class="card reports-section">
                    <div class="card-header">
                        <h3 class="card-title">Reportes Recibidos</h3>
                        <p class="card-description">Revisa y gestiona los reportes de basura y centros de reciclaje</p>
                    </div>
                    <div class="card-content">
                        <div class="tabs">
                            <div class="tabs-list">
                                <button class="tab-trigger active" data-tab="pending">
                                    ${Icons.clock('icon-sm')}
                                    <span>Pendientes <span class="tab-count">(0)</span></span>
                                </button>
                                <button class="tab-trigger" data-tab="accepted">
                                    ${Icons.checkCircle('icon-sm')}
                                    <span>Aceptados <span class="tab-count">(0)</span></span>
                                </button>
                                <button class="tab-trigger" data-tab="rejected">
                                    ${Icons.xCircle('icon-sm')}
                                    <span>Denegados <span class="tab-count">(0)</span></span>
                                </button>
                            </div>
                            
                            <div class="tab-content active" id="tab-pending">
                                <div id="pending-reports" class="reports-list"></div>
                            </div>
                            
                            <div class="tab-content" id="tab-accepted">
                                <div id="accepted-reports" class="reports-list"></div>
                            </div>
                            
                            <div class="tab-content" id="tab-rejected">
                                <div id="rejected-reports" class="reports-list"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        setTimeout(() => {
            document.getElementById('logoutBtn').addEventListener('click', this.onLogout);

            document.querySelectorAll('.tab-trigger').forEach(trigger => {
                trigger.addEventListener('click', () => {
                    this.setActiveTab(trigger.dataset.tab);
                });
            });

            this.fetchReports(); // Fetch real data
        }, 0);

        return page;
    }
}

