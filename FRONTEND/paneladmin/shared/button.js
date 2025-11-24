// Button Component
class Button {
    static create(text, onClick, variant = 'primary', icon = null) {
        const button = document.createElement('button');
        button.className = `btn btn-${variant}`;

        if (icon) {
            button.innerHTML = `${icon}<span>${text}</span>`;
        } else {
            button.textContent = text;
        }

        if (onClick) {
            button.addEventListener('click', onClick);
        }

        return button;
    }

    static createHTML(text, variant = 'primary', icon = null) {
        return `
            <button class="btn btn-${variant}">
                ${icon ? icon : ''}
                <span>${text}</span>
            </button>
        `;
    }
}
