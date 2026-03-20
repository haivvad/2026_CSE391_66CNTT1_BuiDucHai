// 1. Hàm hiển thị thông báo (Toast)
function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = msg;
    toast.style.backgroundColor = isError ? "red" : "green";
    toast.style.display = "block";
    setTimeout(() => toast.style.display = "none", 3000);
}

// 1.2. Hàm tính số phòng trống
function getEmptyRooms() {
    let list = JSON.parse(localStorage.getItem('hotelBookings')) || [];
    let roomTypes = { 'Standard': 10, 'Deluxe': 8, 'Suite': 5, 'VIP': 3 };
    let booked = {};

    for (let type in roomTypes) {
        booked[type] = list.filter(x => x.room === type && x.status === "Booked").length;
    }

    let emptyCount = 0;
    for (let type in roomTypes) {
        emptyCount += (roomTypes[type] - booked[type]);
    }
    return emptyCount;
}

// 1.3. Hàm tính doanh thu dự kiến
function getExpectedRevenue() {
    let list = JSON.parse(localStorage.getItem('hotelBookings')) || [];
    let roomPrices = { 'Standard': 500000, 'Deluxe': 750000, 'Suite': 1000000, 'VIP': 1500000 };
    let revenue = 0;

    list.forEach(booking => {
        if (booking.status === "Booked") {
            let dateIn = new Date(booking.checkIn);
            let dateOut = new Date(booking.checkOut);
            let nights = (dateOut - dateIn) / (1000 * 60 * 60 * 24);
            let price = roomPrices[booking.room] || 500000;
            revenue += nights * price;
        }
    });

    return revenue;
}

// 1.5. Khởi tạo dữ liệu mẫu
function initSampleData() {
    let list = JSON.parse(localStorage.getItem('hotelBookings'));
    if (!list || list.length === 0) {
        const sampleData = [
            {
                id: "PH123456",
                name: "Nguyễn Văn A",
                phone: "0987654321",
                room: "Standard",
                checkIn: "2026-04-01",
                checkOut: "2026-04-05",
                adults: 2,
                children: 1,
                promoCode: "SAVE20%",
                status: "Booked"
            },
            {
                id: "PH123457",
                name: "Thầy Hiếu đẹp trai",
                phone: "0912345678",
                room: "Deluxe",
                checkIn: "2026-04-02",
                checkOut: "2026-04-07",
                adults: 1,
                children: 0,
                promoCode: "",
                status: "Booked"
            },
            {
                id: "PH123458",
                name: "Lê Văn C",
                phone: "0923456789",
                room: "Suite",
                checkIn: "2026-04-03",
                checkOut: "2026-04-08",
                adults: 3,
                children: 2,
                promoCode: "SAVE10%",
                status: "Cancelled"
            },
            {
                id: "PH123459",
                name: "Phạm Thị D",
                phone: "0934567890",
                room: "VIP",
                checkIn: "2026-04-04",
                checkOut: "2026-04-10",
                adults: 2,
                children: 0,
                promoCode: "",
                status: "Booked"
            },
            {
                id: "PH123460",
                name: "Đặng Văn E",
                phone: "0945678901",
                room: "Standard",
                checkIn: "2026-04-05",
                checkOut: "2026-04-06",
                adults: 1,
                children: 1,
                promoCode: "SAVE20%",
                status: "Booked"
            }
        ];
        localStorage.setItem('hotelBookings', JSON.stringify(sampleData));
    }
}

// Gọi khởi tạo khi tải trang
initSampleData();

// 2. Xử lý lưu dữ liệu (Dùng cho trang add-booking.html)
const form = document.getElementById('bookingForm');
if (form) {
    form.onsubmit = function (e) {
        e.preventDefault();

        // Lấy giá trị từ form
        const booking = {
            id: document.getElementById('bookingId').value,
            name: document.getElementById('customerName').value,
            phone: document.getElementById('phone').value,
            room: document.getElementById('roomType').value,
            checkIn: document.getElementById('checkIn').value,
            checkOut: document.getElementById('checkOut').value,
            adults: parseInt(document.getElementById('adults').value) || 0,
            children: parseInt(document.getElementById('children').value) || 0,
            promoCode: document.getElementById('promoCode').value,
            status: "Booked" // Mặc định khi tạo mới
        };

        // --- VALIDATION (Quan trọng nhất bài 1) ---
        const idRegex = /^PH\d{6}$/;
        if (!idRegex.test(booking.id)) {
            showToast("ID phải là PH + 6 số!", true);
            return;
        }

        // Validation họ tên: 2-50 ký tự, chỉ chữ/số/khoảng trắng
        const nameRegex = /^[a-zA-Z0-9\sàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]{2,50}$/i;
        if (!nameRegex.test(booking.name)) {
            showToast("Họ tên phải 2-50 ký tự, chỉ chứa chữ cái, số và khoảng trắng!", true);
            return;
        }

        // Validation số điện thoại: 10 số bắt đầu là 0
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(booking.phone)) {
            showToast("Số điện thoại phải có 10 số và bắt đầu bằng 0!", true);
            return;
        }

        const dateIn = new Date(booking.checkIn);
        const dateOut = new Date(booking.checkOut);
        const diffDays = (dateOut - dateIn) / (1000 * 60 * 60 * 24);

        if (diffDays < 1) {
            showToast("Ngày trả phải sau ngày nhận ít nhất 1 ngày!", true);
            return;
        }

        // Validation mã khuyến mãi (nếu nhập thì phải 8 ký tự và giống xác nhận mã)
        const promoCode = document.getElementById('promoCode').value.trim();
        const confirmPromo = document.getElementById('confirmPromo').value.trim();

        if (promoCode || confirmPromo) {
            if (promoCode.length !== 8) {
                showToast("Mã khuyến mãi phải có 8 ký tự!", true);
                return;
            }
            if (promoCode !== confirmPromo) {
                showToast("Mã khuyến mãi và xác nhận mã không khớp!", true);
                return;
            }
        }

        // --- LƯU VÀO LOCAL STORAGE ---
        let list = JSON.parse(localStorage.getItem('hotelBookings')) || [];

        // Kiểm tra nếu đang ở chế độ sửa
        const editingIndex = sessionStorage.getItem('editingIndex');
        if (editingIndex !== null) {
            // Cập nhật bản ghi cũ
            booking.status = list[editingIndex].status;
            list[editingIndex] = booking;
            localStorage.setItem('hotelBookings', JSON.stringify(list));
            sessionStorage.removeItem('editingBooking');
            sessionStorage.removeItem('editingIndex');
            showToast("Cập nhật đặt phòng thành công!");
        } else {
            // Thêm bản ghi mới
            list.push(booking);
            localStorage.setItem('hotelBookings', JSON.stringify(list));
            showToast("Đặt phòng " + booking.id + " thành công!");
        }

        setTimeout(() => window.location.href = "bookings.html", 2000);
    };
}

// 3. Hàm hiển thị danh sách (Dùng cho trang bookings.html)
function renderBookings() {
    const tableBody = document.getElementById('bookingTableBody');
    if (!tableBody) return;

    let list = JSON.parse(localStorage.getItem('hotelBookings')) || [];

    // Lấy từ khóa tìm kiếm
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    // Lọc danh sách theo tìm kiếm
    let filteredList = list;
    if (searchTerm) {
        filteredList = list.filter(item =>
            item.id.toLowerCase().includes(searchTerm) ||
            item.name.toLowerCase().includes(searchTerm)
        );
    }

    // Cập nhật thống kê
    document.getElementById('totalCount').innerText = list.length;
    document.getElementById('cancelCount').innerText = list.filter(x => x.status === "Cancelled").length;

    // Cập nhật số phòng trống và doanh thu
    const emptyRoomsEl = document.getElementById('emptyRooms');
    const revenueEl = document.getElementById('expectedRevenue');
    if (emptyRoomsEl) emptyRoomsEl.innerText = getEmptyRooms();
    if (revenueEl) revenueEl.innerText = getExpectedRevenue().toLocaleString('vi-VN') + ' VND';

    tableBody.innerHTML = filteredList.map((item, index) => {
        // Tìm index thực tế của item trong danh sách gốc
        const actualIndex = list.findIndex(x => x.id === item.id && x.name === item.name && x.checkIn === item.checkIn);
        return `
        <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.phone}</td>
            <td>${item.room}</td>
            <td>${(item.adults || 0)}/${(item.children || 0)}</td>
            <td>${item.checkIn}</td>
            <td>${item.checkOut}</td>
            <td>${item.promoCode ? 'SAVE20%' : '-'}</td>
            <td>${item.status}</td>
            <td>
                <button onclick="editBooking(${actualIndex})">Sửa</button>
                ${item.status === "Cancelled" ? '<span style="color: red; font-weight: bold;">Đã hủy</span>' : '<button onclick="cancelBooking(' + actualIndex + ')">Hủy</button>'}
            </td>
        </tr>
    `}).join('');
}

// 4. Hàm hủy đơn
function cancelBooking(index) {
    if (confirm("Bạn có chắc chắn muốn hủy đặt phòng này?")) {
        let list = JSON.parse(localStorage.getItem('hotelBookings'));
        list[index].status = "Cancelled";
        localStorage.setItem('hotelBookings', JSON.stringify(list));
        showToast("Hủy đặt phòng thành công!");
        renderBookings(); // Vẽ lại bảng
    }
}

// 5. Hàm sửa đơn
function editBooking(index) {
    let list = JSON.parse(localStorage.getItem('hotelBookings'));
    let booking = list[index];

    // Lưu dữ liệu cần chỉnh sửa vào sessionStorage
    sessionStorage.setItem('editingBooking', JSON.stringify({ index: index, data: booking }));

    // Chuyển hướng đến trang add-booking.html để chỉnh sửa
    window.location.href = "add-booking.html?edit=" + index;
}

// 6. Xử lý tìm kiếm
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', renderBookings);
}