const form = document.getElementById('registrationForm');
const userTableBody = document.getElementById('userTable').querySelector('tbody');
const clearAllBtn = document.getElementById('clearAll');

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    userTableBody.innerHTML = '';
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.mobile}</td>
            <td><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;
        userTableBody.appendChild(row);
    });
}

function validateForm(name, email, mobile, password) {
    let isValid = true;

    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('mobileError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    if (!name.trim()) {
        document.getElementById('nameError').textContent = 'Name is required';
        isValid = false;
    }
    if (!email) {
        document.getElementById('emailError').textContent = 'Email is required';
        isValid = false;
    }
    if (!mobile || !/^\d{10}$/.test(mobile)) {
        document.getElementById('mobileError').textContent = 'Mobile number must be exactly 10 digits';
        isValid = false;
    }
    if (!password || password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
        isValid = false;
    }

    return isValid;
}

function isDuplicateEmail(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.some(user => user.email === email);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const password = document.getElementById('password').value;

    if (!validateForm(name, email, mobile, password)) return;

    if (isDuplicateEmail(email)) {
        document.getElementById('emailError').textContent = 'Email already registered';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ name, email, mobile, password });
    localStorage.setItem('users', JSON.stringify(users));

    loadUsers();
    form.reset();
});

userTableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.dataset.index;
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
    }
});

clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all users?')) {
        localStorage.removeItem('users');
        loadUsers();
    }
});

loadUsers();

