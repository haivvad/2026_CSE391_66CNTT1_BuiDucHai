// Kịch bản này khởi chạy khi DOM đã sẵn sàng.
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('orderForm');
    const confirmation = document.getElementById('confirmation');
    const successMessage = document.getElementById('successMessage');
    const totalPriceEl = document.getElementById('totalPrice');
    const charCountEl = document.getElementById('charCount');
    const notesEl = document.getElementById('notes');

    // Giá sản phẩm
    const prices = {
        "Áo": 150000,
        "Quần": 200000,
        "Giày": 300000
    };

    // Utility functions
    function showError(fieldId, message) {
        const errorSpan = document.getElementById(fieldId + 'Error');
        const input = document.getElementById(fieldId);
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.style.display = 'block';
        }
        if (input) {
            input.classList.add('invalid');
            input.classList.remove('valid');
        }
    }

    function clearError(fieldId) {
        const errorSpan = document.getElementById(fieldId + 'Error');
        const input = document.getElementById(fieldId);
        if (errorSpan) errorSpan.style.display = 'none';
        if (input) {
            input.classList.remove('invalid');
            input.classList.add('valid');
        }
    }

    // Validation functions
    function validateProduct() {
        const product = document.getElementById('product').value;
        if (product === '') {
            showError('product', 'Vui lòng chọn sản phẩm.');
            return false;
        }
        clearError('product');
        return true;
    }

    function validateQuantity() {
        const quantity = document.getElementById('quantity').value;
        if (quantity === '' || quantity < 1 || quantity > 99) {
            showError('quantity', 'Số lượng phải từ 1 đến 99.');
            return false;
        }
        clearError('quantity');
        return true;
    }

    function validateDeliveryDate() {
        const dateStr = document.getElementById('deliveryDate').value;
        if (dateStr === '') {
            showError('deliveryDate', 'Vui lòng chọn ngày giao hàng.');
            return false;
        }
        const selectedDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 30);
        if (selectedDate < today) {
            showError('deliveryDate', 'Ngày giao hàng không được là ngày trong quá khứ.');
            return false;
        }
        if (selectedDate > maxDate) {
            showError('deliveryDate', 'Ngày giao hàng không được quá 30 ngày từ hôm nay.');
            return false;
        }
        clearError('deliveryDate');
        return true;
    }

    function validateAddress() {
        const address = document.getElementById('address').value.trim();
        if (address === '' || address.length < 10) {
            showError('address', 'Địa chỉ giao phải có ít nhất 10 ký tự.');
            return false;
        }
        clearError('address');
        return true;
    }

    function validateNotes() {
        const notes = notesEl.value;
        if (notes.length > 200) {
            showError('notes', 'Ghi chú không được quá 200 ký tự.');
            return false;
        }
        clearError('notes');
        return true;
    }

    function validatePayment() {
        const payment = document.querySelector('input[name="payment"]:checked');
        if (!payment) {
            showError('payment', 'Vui lòng chọn phương thức thanh toán.');
            return false;
        }
        clearError('payment');
        return true;
    }

    // Tính tổng tiền
    function calculateTotal() {
        const product = document.getElementById('product').value;
        const quantity = parseInt(document.getElementById('quantity').value) || 0;
        const price = prices[product] || 0;
        const total = price * quantity;
        totalPriceEl.textContent = total.toLocaleString('vi-VN') + ' VND';
    }

    // Đếm ký tự ghi chú
    function updateCharCount() {
        const length = notesEl.value.length;
        charCountEl.textContent = `${length}/200`;
        if (length > 200) {
            charCountEl.style.color = 'red';
        } else {
            charCountEl.style.color = 'gray';
        }
    }

    // Event listeners
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const isValid = validateProduct() & validateQuantity() & validateDeliveryDate() & validateAddress() & validateNotes() & validatePayment();
        if (isValid) {
            // Hiển thị xác nhận
            const product = document.getElementById('product').options[document.getElementById('product').selectedIndex].text;
            const quantity = document.getElementById('quantity').value;
            const total = totalPriceEl.textContent;
            const summary = `Sản phẩm: ${product}<br>Số lượng: ${quantity}<br>Tổng tiền: ${total}`;
            document.getElementById('orderSummary').innerHTML = summary;
            confirmation.style.display = 'block';
        }
    });

    // Xác nhận
    document.getElementById('confirmBtn').addEventListener('click', function () {
        form.style.display = 'none';
        confirmation.style.display = 'none';
        successMessage.textContent = 'Đặt hàng thành công! 🎉';
        successMessage.style.display = 'block';
    });

    // Hủy
    document.getElementById('cancelBtn').addEventListener('click', function () {
        confirmation.style.display = 'none';
    });

    // Tính tổng tiền khi thay đổi
    document.getElementById('product').addEventListener('change', calculateTotal);
    document.getElementById('quantity').addEventListener('input', calculateTotal);

    // Đếm ký tự
    notesEl.addEventListener('input', updateCharCount);

    // Blur validation
    document.getElementById('product').addEventListener('change', validateProduct);
    document.getElementById('quantity').addEventListener('blur', validateQuantity);
    document.getElementById('deliveryDate').addEventListener('blur', validateDeliveryDate);
    document.getElementById('address').addEventListener('blur', validateAddress);
    notesEl.addEventListener('blur', validateNotes);
    document.querySelectorAll('input[name="payment"]').forEach(radio => radio.addEventListener('change', validatePayment));

    // Clear errors on input
    document.getElementById('quantity').addEventListener('input', () => clearError('quantity'));
    document.getElementById('deliveryDate').addEventListener('input', () => clearError('deliveryDate'));
    document.getElementById('address').addEventListener('input', () => clearError('address'));
    notesEl.addEventListener('input', () => clearError('notes'));
});