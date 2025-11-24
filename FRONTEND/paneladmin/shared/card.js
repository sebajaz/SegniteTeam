// Card Component
class Card {
    static create(content, className = '') {
        const card = document.createElement('div');
        card.className = `card ${className}`;
        card.innerHTML = content;
        return card;
    }

    static createWithHeader(title, description, content, className = '') {
        return Card.create(`
            <div class="card-header">
                <h3 class="card-title">${title}</h3>
                ${description ? `<p class="card-description">${description}</p>` : ''}
            </div>
            <div class="card-content">
                ${content}
            </div>
        `, className);
    }
}
