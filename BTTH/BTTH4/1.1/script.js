let students = [];
let filteredStudents = [];
let sortOrder = 'asc'; // 'asc' or 'desc'
let searchKeyword = '';
let filterRank = '';

const btnAdd = document.getElementById('btnAdd');
const tableBody = document.getElementById('studentTableBody');
const searchInput = document.getElementById('searchInput');
const filterRankSelect = document.getElementById('filterRank');
const scoreHeader = document.getElementById('scoreHeader');
const sortArrow = document.getElementById('sortArrow');

// Hàm tính xếp loại
function getRank(score) {
    if (score >= 8.5) return "Giỏi";
    if (score >= 7.0) return "Khá";
    if (score >= 5.0) return "Trung bình";
    return "Yếu";
}

// Hàm áp dụng bộ lọc, tìm kiếm, sắp xếp
function applyFilters() {
    filteredStudents = [...students];

    // Tìm kiếm
    if (searchKeyword) {
        filteredStudents = filteredStudents.filter(s =>
            s.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }

    // Lọc theo xếp loại
    if (filterRank) {
        filteredStudents = filteredStudents.filter(s => getRank(s.score) === filterRank);
    }

    // Sắp xếp theo điểm
    filteredStudents.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.score - b.score;
        } else {
            return b.score - a.score;
        }
    });

    renderTable();
}

// Hàm render bảng và thống kê
function renderTable() {
    tableBody.innerHTML = '';

    if (filteredStudents.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">Không có kết quả</td></tr>';
        return;
    }

    filteredStudents.forEach((s, index) => {
        const row = document.createElement('tr');
        if (s.score < 5) row.classList.add('weak-student'); // Tô màu vàng điểm < 5

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${s.name}</td>
            <td>${s.score}</td>
            <td>${getRank(s.score)}</td>
            <td><button class="btnDelete" data-id="${s.id}">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    });

    // Cập nhật thống kê dựa trên toàn bộ students
    const totalScore = students.reduce((sum, s) => sum + s.score, 0);
    const avg = students.length > 0 ? (totalScore / students.length).toFixed(2) : 0;
    document.getElementById('statistics').textContent =
        `Tổng số SV: ${students.length} | Điểm trung bình lớp: ${avg}`;
}

// Xử lý thêm sinh viên
function addStudent() {
    const nameInput = document.getElementById('fullname');
    const scoreInput = document.getElementById('score');
    const name = nameInput.value.trim();
    const score = parseFloat(scoreInput.value);

    // Validate dữ liệu
    if (name === "" || isNaN(score) || score < 0 || score > 10) {
        alert("Vui lòng nhập tên và điểm hợp lệ (0-10)!");
        return;
    }

    students.push({ id: Date.now(), name, score });
    nameInput.value = '';
    scoreInput.value = '';
    nameInput.focus(); // Đưa con trỏ về ô họ tên
    applyFilters();
}

// Sự kiện Click nút Thêm
btnAdd.addEventListener('click', addStudent);

// Sự kiện Enter tại ô điểm
document.getElementById('score').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') addStudent();
});

// Sự kiện tìm kiếm
searchInput.addEventListener('input', (e) => {
    searchKeyword = e.target.value;
    applyFilters();
});

// Sự kiện lọc xếp loại
filterRankSelect.addEventListener('change', (e) => {
    filterRank = e.target.value;
    applyFilters();
});

// Sự kiện sắp xếp điểm
scoreHeader.addEventListener('click', () => {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    sortArrow.textContent = sortOrder === 'asc' ? '▲' : '▼';
    applyFilters();
});

// Event Delegation cho nút Xóa
tableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('btnDelete')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        students = students.filter(s => s.id !== id);
        applyFilters();
    }
});

// Khởi tạo
applyFilters();