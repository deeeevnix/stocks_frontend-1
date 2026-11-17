const searchInput = document.querySelector('.products__search');
const statusFilter = document.querySelector('.products__filter');
const locationFilter = document.querySelector('.products__location');
const categoryFilter = document.querySelector('.products__category');
const count = document.querySelector('.products__count');
const emptyStock = document.querySelector('#empty-stock');
const emptySearch = document.querySelector('#empty-search');

function updateStats(cards) {
    const totals = {
        total: cards.length,
        good: 0,
        soon: 0,
        expired: 0,
        none: 0,
    };

    for (const card of cards) {
        const status = card.dataset.status;
        totals[status] += 1;
    }

    const statValues = document.querySelectorAll('[data-stat]');

    for (const value of statValues) {
        value.textContent = totals[value.dataset.stat];
    }
}

function updateSearch() {
    const cards = document.querySelectorAll('.products__list .product-card');
    updateStats(cards);
    const query = searchInput.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;
    const selectedLocation = locationFilter.value;
    const selectedCategory = categoryFilter.value;
    let visibleCount = 0;

    for (const card of cards) {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const matchesSearch = name.includes(query);
        const matchesStatus = selectedStatus == 'all' || card.dataset.status === selectedStatus;

        const matchesLocation = selectedLocation === 'all' || card.dataset.location === selectedLocation;
        const matchesCategory = selectedCategory === 'all' || card.dataset.category === selectedCategory;
        const isVisible = matchesSearch && matchesStatus && matchesLocation && matchesCategory;
        card.hidden = !isVisible;

        if (isVisible) {
            visibleCount += 1;
        }
    }

    count.textContent = `${visibleCount} из ${cards.length}`;
    const hasProducts = cards.length > 0;

    emptyStock.hidden = hasProducts;
    emptySearch.hidden = !hasProducts || visibleCount > 0;
}

searchInput.addEventListener('input', updateSearch);
statusFilter.addEventListener('change', updateSearch);
locationFilter.addEventListener('change', updateSearch);
categoryFilter.addEventListener('change', updateSearch);
updateSearch();

const deleteDialog = document.querySelector('#delete-dialog');
const deleteName = document.querySelector('#delete-name');
const deleteButtons = document.querySelectorAll('.product-card__delete');

let cardToDelete = null;

for (const button of deleteButtons) {
    button.addEventListener('click', () => {
        cardToDelete = button.closest('.product-card');
        deleteName.textContent = cardToDelete.querySelector('h3').textContent.trim();

        deleteDialog.returnValue = '',
        deleteDialog.showModal();
    });
}

deleteDialog.addEventListener('close', () => {
    if (deleteDialog.returnValue === 'confirm' && cardToDelete) {
        cardToDelete.remove();
        updateSearch();
        searchInput.focus();
    }

    cardToDelete = null;
});


const sortSelect = document.querySelector('.products__sort');
const productList = document.querySelector('.products__list');

function sortProducts() {
    const cards = Array.from(productList.querySelectorAll('.product-card'));

    cards.sort((first, second) => {
        if (sortSelect.value === 'expiry') {
            const firstDate = first.querySelector('time')?.dateTime ?? '9999-12-31';
            const secondDate = second.querySelector('time')?.dateTime ?? '9999-12-31';

            return firstDate.localeCompare(secondDate);
        }

        const firstName = first.querySelector('h3').textContent.trim();
        const secondName = second.querySelector('h3').textContent.trim();

        return firstName.localeCompare(secondName, 'ru');
    });

    productList.append(...cards);
}

sortSelect.addEventListener('change', sortProducts);
sortProducts();