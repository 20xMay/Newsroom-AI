let sourcesData = [
    {
        id: 1,
        name: "Tổng cục Thống kê",
        url: "gso.gov.vn",
        type: "Cơ quan nhà nước",
        trust: "Cao",
        usage: 124,
        status: "Hoạt động"
    },
    {
        id: 2,
        name: "World Bank Việt Nam",
        url: "worldbank.org/vi",
        type: "Tổ chức quốc tế",
        trust: "Cao",
        usage: 89,
        status: "Hoạt động"
    },
    {
        id: 3,
        name: "Bộ Thông tin và Truyền thông",
        url: "mic.gov.vn",
        type: "Cơ quan nhà nước",
        trust: "Cao",
        usage: 210,
        status: "Hoạt động"
    },
    {
        id: 4,
        name: "Viện Kinh tế Việt Nam",
        url: "ie.vass.gov.vn",
        type: "Viện nghiên cứu",
        trust: "Trung bình",
        usage: 45,
        status: "Chờ duyệt"
    }
];

const tableBody = document.getElementById('source-table-body');
const searchInput = document.getElementById('filter-search');
const typeSelect = document.getElementById('filter-type');
const statusSelect = document.getElementById('filter-status');
const modal = document.getElementById('add-modal');
const btnAddSource = document.getElementById('btn-add-source');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const addForm = document.getElementById('add-source-form');
const themeToggleBtn = document.getElementById('theme-toggle');

function renderTable(data) {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">
                    Không tìm thấy nguồn tin phù hợp
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="source-name">${item.name}</td>
            <td><a href="https://${item.url}" target="_blank" class="source-url">${item.url}</a></td>
            <td>${item.type}</td>
            <td><span class="badge-trust">${item.trust}</span></td>
            <td>${item.usage}</td>
            <td><span class="badge-status">${item.status}</span></td>
        `;
        tableBody.appendChild(row);
    });

    updateCounters();
}

function updateCounters() {
    const statTotal = document.getElementById('stat-total');
    const statVerified = document.getElementById('stat-verified');
    const statPending = document.getElementById('stat-pending');

    if (statTotal) statTotal.textContent = sourcesData.length;
    if (statVerified) statVerified.textContent = sourcesData.filter(i => i.trust === 'Cao').length;
    if (statPending) statPending.textContent = sourcesData.filter(i => i.status === 'Chờ duyệt').length;
}

function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedType = typeSelect ? typeSelect.value : 'all';
    const selectedStatus = statusSelect ? statusSelect.value : 'all';

    const filtered = sourcesData.filter(item => {
        const matchesQuery = item.name.toLowerCase().includes(query) || item.url.toLowerCase().includes(query);
        const matchesType = (selectedType === 'all') || (item.type === selectedType);
        const matchesStatus = (selectedStatus === 'all') || (item.status === selectedStatus);

        return matchesQuery && matchesType && matchesStatus;
    });

    renderTable(filtered);
}

if (searchInput) searchInput.addEventListener('input', applyFilters);
if (typeSelect) typeSelect.addEventListener('change', applyFilters);
if (statusSelect) statusSelect.addEventListener('change', applyFilters);

function openModal() {
    if (modal) modal.classList.add('active');
}

function closeModal() {
    if (modal) modal.classList.remove('active');
    if (addForm) addForm.reset();
}

if (btnAddSource) btnAddSource.addEventListener('click', openModal);
if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

if (addForm) {
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newSource = {
            id: Date.now(),
            name: document.getElementById('input-name').value,
            url: document.getElementById('input-url').value,
            type: document.getElementById('input-type').value,
            trust: document.getElementById('input-trust').value,
            usage: 0,
            status: "Hoạt động"
        };

        sourcesData.unshift(newSource);
        renderTable(sourcesData);
        closeModal();
    });
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.body.removeAttribute('data-theme');
            themeToggleBtn.innerHTML = '<i class="fa-regular fa-moon"></i>';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fa-regular fa-sun"></i>';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderTable(sourcesData);
});