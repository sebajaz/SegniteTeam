// Badge Component
class Badge {
    static create(text, variant = 'default') {
        const badge = document.createElement('span');
        badge.className = `badge badge-${variant}`;
        badge.textContent = text;
        return badge;
    }

    static createHTML(text, variant = 'default') {
        return `<span class="badge badge-${variant}">${text}</span>`;
    }
}
