// Kịch bản này khởi chạy khi DOM đã sẵn sàng (đảm bảo tất cả phần tử đã có trong trang).
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');

    // ----- Hàm tiện ích (utility functions) -----

    /**
     * Hiển thị thông báo lỗi cho một trường và đổi viền thành màu đỏ.
     * @param {string} fieldId - id của input (ví dụ: 'fullname').
     * @param {string} message - thông báo lỗi.
     */
    function showError(fieldId, message) {
        const errorSpan = document.getElementById(fieldId + 'Error');
        const input = document.getElementById(fieldId);
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
        // Đặt class để input có viền đỏ và tắt viền xanh nếu từng hợp lệ
        input.classList.add('invalid');
        input.classList.remove('valid');
    }

    /**
     * Xóa thông báo lỗi và gán viền xanh cho input (khi hợp lệ).
     * @param {string} fieldId
     */
    function clearError(fieldId) {
        const errorSpan = document.getElementById(fieldId + 'Error');
        const input = document.getElementById(fieldId);
        errorSpan.style.display = 'none';
        input.classList.remove('invalid');
        input.classList.add('valid');
    }

    /**
     * Cập nhật thanh sức mạnh mật khẩu.
     * @param {string} password
     */
    function updatePasswordStrength(password) {
        const strengthFill = document.getElementById('strengthFill');
        let strength = 0;
        let className = 'weak';

        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[^a-zA-Z\d]/.test(password)) strength += 1;

        if (strength <= 2) {
            className = 'weak';
            strengthFill.style.width = '33%';
        } else if (strength <= 4) {
            className = 'medium';
            strengthFill.style.width = '66%';
        } else {
            className = 'strong';
            strengthFill.style.width = '100%';
        }

        strengthFill.className = 'strength-fill ' + className;
    }

    /**
     * Cập nhật đếm ký tự họ tên.
     */
    function updateFullnameCount() {
        const fullname = document.getElementById('fullname').value;
        const countSpan = document.getElementById('fullnameCount');
        countSpan.textContent = fullname.length + '/50';
        if (fullname.length > 50) {
            countSpan.style.color = 'red';
        } else {
            countSpan.style.color = '#666';
        }
    }

    // ----- Các hàm validate cho từng trường -----

    function validateFullname() {
        const fullname = document.getElementById('fullname').value.trim();

        // Không được để trống
        if (fullname === '') {
            showError('fullname', 'Họ và tên không được trống.');
            return false;
        }

        // Ít nhất 3 ký tự
        if (fullname.length < 3) {
            showError('fullname', 'Họ và tên phải có ít nhất 3 ký tự.');
            return false;
        }

        // Không quá 50 ký tự
        if (fullname.length > 50) {
            showError('fullname', 'Họ và tên không được quá 50 ký tự.');
            return false;
        }

        // Chỉ gồm chữ và khoảng trắng
        if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(fullname)) {
            showError('fullname', 'Họ và tên chỉ chứa chữ cái và khoảng trắng.');
            return false;
        }

        // Hợp lệ
        clearError('fullname');
        return true;
    }

    function validateEmail() {
        const email = document.getElementById('email').value.trim();

        if (email === '') {
            showError('email', 'Email không được trống.');
            return false;
        }

        // Kiểm tra dạng email đơn giản
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email', 'Email không hợp lệ.');
            return false;
        }

        clearError('email');
        return true;
    }

    function validatePhone() {
        const phone = document.getElementById('phone').value.trim();

        if (phone === '') {
            showError('phone', 'Số điện thoại không được trống.');
            return false;
        }

        // Số điện thoại bắt đầu bằng 0 và đúng 10 chữ số
        if (!/^0[0-9]{9}$/.test(phone)) {
            showError('phone', 'Số điện thoại phải là 10 chữ số bắt đầu bằng 0.');
            return false;
        }

        clearError('phone');
        return true;
    }

    function validatePassword() {
        const password = document.getElementById('password').value;

        if (password === '') {
            showError('password', 'Mật khẩu không được trống.');
            return false;
        }

        // Tối thiểu 8 ký tự
        if (password.length < 8) {
            showError('password', 'Mật khẩu phải có ít nhất 8 ký tự.');
            return false;
        }

        // Phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            showError('password', 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số.');
            return false;
        }

        clearError('password');
        return true;
    }

    function validateConfirmPassword() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (confirmPassword === '') {
            showError('confirmPassword', 'Xác nhận mật khẩu không được trống.');
            return false;
        }

        if (confirmPassword !== password) {
            showError('confirmPassword', 'Xác nhận mật khẩu không khớp.');
            return false;
        }

        clearError('confirmPassword');
        return true;
    }

    function validateGender() {
        const gender = document.querySelector('input[name="gender"]:checked');

        if (!gender) {
            showError('gender', 'Vui lòng chọn giới tính.');
            return false;
        }

        clearError('gender');
        return true;
    }

    function validateTerms() {
        const terms = document.getElementById('terms').checked;

        if (!terms) {
            showError('terms', 'Vui lòng đồng ý với điều khoản.');
            return false;
        }

        clearError('terms');
        return true;
    }

    // ----- Event listeners -----

    // Khi submit form: chạy toàn bộ validation; nếu hợp lệ thì ẩn form và hiện thông báo thành công.
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Dùng toán tử & để đảm bảo tất cả hàm validate được gọi (không dừng sớm như &&).
        const isValid = validateFullname() & validateEmail() & validatePhone() & validatePassword() & validateConfirmPassword() & validateGender() & validateTerms();

        if (isValid) {
            form.style.display = 'none';
            successMessage.textContent = `Đăng ký thành công! 🎉 Chào mừng ${document.getElementById('fullname').value.trim()}.`;
            successMessage.style.display = 'block';
        }
    });

    // Khi người dùng rời khỏi trường (blur): kiểm tra ngay trường đó.
    document.getElementById('fullname').addEventListener('blur', validateFullname);
    document.getElementById('email').addEventListener('blur', validateEmail);
    document.getElementById('phone').addEventListener('blur', validatePhone);
    document.getElementById('password').addEventListener('blur', validatePassword);
    document.getElementById('confirmPassword').addEventListener('blur', validateConfirmPassword);
    document.querySelectorAll('input[name="gender"]').forEach(radio => radio.addEventListener('change', validateGender));
    document.getElementById('terms').addEventListener('change', validateTerms);

    // Khi người dùng nhập lại: xóa thông báo lỗi để không gây khó chịu.
    document.getElementById('fullname').addEventListener('input', () => {
        clearError('fullname');
        updateFullnameCount();
    });
    document.getElementById('email').addEventListener('input', () => clearError('email'));
    document.getElementById('phone').addEventListener('input', () => clearError('phone'));
    document.getElementById('password').addEventListener('input', () => {
        clearError('password');
        updatePasswordStrength(document.getElementById('password').value);
    });
    document.getElementById('confirmPassword').addEventListener('input', () => clearError('confirmPassword'));

    // Sự kiện cho toggle mật khẩu
    document.getElementById('passwordToggle').addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁' : '🙈';
    });
});
