// Report Card Component
class ReportCard {
    constructor(report, onAccept = null, onReject = null, onDelete = null) {
        this.report = report;
        this.onAccept = onAccept;
        this.onReject = onReject;
        this.onDelete = onDelete;
    }

    render() {
        const isBasura = this.report.type === 'basura';
        const isPending = this.report.status === 'pending';

        const iconBgClass = isBasura ? 'bg-orange-light' : 'bg-green-light';
        const iconColorClass = isBasura ? 'text-orange' : 'text-green';
        const icon = isBasura ? Icons.trash('icon') : Icons.recycle('icon');
        const typeLabel = isBasura ? 'Reporte de Basura' : 'Centro de Reciclaje';

        let badgeClass = 'badge-secondary';
        let badgeText = 'Pendiente';

        if (this.report.status === 'accepted') {
            badgeClass = 'badge-accepted';
            badgeText = 'Aceptado';
        } else if (this.report.status === 'rejected') {
            badgeClass = 'badge-rejected';
            badgeText = 'Denegado';
        } else if (this.report.status === 'pending') {
            badgeClass = 'badge-pending';
            badgeText = 'Pendiente';
        }

        const card = document.createElement('div');
        card.className = 'card report-card';
        card.innerHTML = `
            <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-start gap-3" style="flex: 1;">
                        <div class="icon-container ${iconBgClass} ${iconColorClass}">
                            ${icon}
                        </div>
                        <div style="flex: 1;">
                            <div class="flex items-center gap-2 mb-2">
                                <h3 class="font-medium">${typeLabel}</h3>
                                <span class="badge ${badgeClass}">${badgeText}</span>
                            </div>
                            <div class="flex items-center gap-2 text-gray-600 mb-1">
                                ${Icons.mapPin('icon-sm')}
                                <span class="text-sm">${this.report.address}</span>
                            </div>
                            <div class="flex items-center gap-2 text-gray-500">
                                ${Icons.calendar('icon-sm')}
                                <span class="text-sm">${this.report.date}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="separator"></div>
                
                <div class="report-details">
                    <div class="mb-3">
                        <p class="text-gray-500 text-sm mb-1">Comentario:</p>
                        <p class="text-gray-800">${this.report.comment}</p>
                    </div>

                    ${this.report.imageUrl ? `
                    <div class="mb-3">
                        <p class="text-gray-500 text-sm mb-1">Foto adjunta:</p>
                        <div style="background: #fafafa; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px;">
                            <img src="${this.report.imageUrl}" alt="Foto del reporte" style="width: 100%; max-height: 260px; object-fit: cover; border-radius: 8px;">
                            <div style="margin-top: 8px; text-align: right;">
                                <a href="${this.report.imageUrl}" target="_blank" rel="noopener" class="text-sm" style="color: #2563eb;">Abrir imagen</a>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div>
                        <p class="text-gray-500 text-sm mb-1">Coordenadas:</p>
                        <code class="coordinates-code">${this.report.coordinates}</code>
                    </div>
                </div>
                
                ${this.renderActions(isPending)}
            </div>
        `;

        // Add event listeners for action buttons
        if (isPending && this.onAccept && this.onReject) {
            const acceptBtn = card.querySelector('.btn-accept');
            const rejectBtn = card.querySelector('.btn-reject');

            acceptBtn.addEventListener('click', () => this.onAccept(this.report.id));
            rejectBtn.addEventListener('click', () => this.onReject(this.report.id));
        }

        const deleteBtn = card.querySelector('.btn-delete');
        if (deleteBtn && this.onDelete) {
            deleteBtn.addEventListener('click', () => this.onDelete(this.report.id));
        }

        return card;
    }

    renderActions(isPending) {
        if (isPending && this.onAccept && this.onReject) {
            return `
                <div class="separator"></div>
                <div class="flex gap-3">
                    <button class="btn btn-success btn-accept" style="flex: 1;">
                        ${Icons.checkCircle('icon-sm')}
                        <span>Aceptar Reporte</span>
                    </button>
                    <button class="btn btn-destructive btn-reject" style="flex: 1;">
                        ${Icons.xCircle('icon-sm')}
                        <span>Denegar Reporte</span>
                    </button>
                </div>
                ${this.onDelete ? `
                <div class="mt-3">
                    <button class="btn btn-destructive btn-delete" style="width: 100%;">
                        ${Icons.trash('icon-sm')}
                        <span>Eliminar reporte</span>
                    </button>
                </div>
                ` : ''}
            `;
        }

        if (this.report.status === 'accepted') {
            return `
                <div class="separator"></div>
                <div class="status-message status-accepted">
                    ${Icons.checkCircle('icon')}
                    <span>Este reporte ha sido aceptado y procesado</span>
                </div>
                ${this.onDelete ? `
                <div class="mt-3">
                    <button class="btn btn-destructive btn-delete" style="width: 100%;">
                        ${Icons.trash('icon-sm')}
                        <span>Eliminar reporte</span>
                    </button>
                </div>
                ` : ''}
            `;
        }

        if (this.report.status === 'rejected') {
            return `
                <div class="separator"></div>
                <div class="status-message status-rejected">
                    ${Icons.xCircle('icon')}
                    <span>Este reporte ha sido denegado</span>
                </div>
            `;
        }

        return '';
    }
}
