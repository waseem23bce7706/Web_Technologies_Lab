// 1. Dynamic Configuration Object
const validationRules = {
    Student: { 
        minAge: 13, 
        passRegex: /.{6,}/, 
        reqMsg: "Min 6 characters",
        showSkills: true 
    },
    Teacher: { 
        minAge: 21, 
        passRegex: /.{8,}/, 
        reqMsg: "Min 8 characters",
        showSkills: true 
    },
    Admin: { 
        minAge: 18, 
        passRegex: /^(?=.*[A-Z])(?=.*\d).{10,}$/, 
        reqMsg: "Min 10 chars, 1 Uppercase, 1 Number",
        showSkills: false 
    }
};

const form = document.getElementById('regForm');
const roleSelect = document.getElementById('role');

// 2. The Main Validation Function
function validateForm() {
    const role = roleSelect.value;
    const config = validationRules[role];

    const fields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        pass: document.getElementById('password'),
        confirm: document.getElementById('confirmPassword'),
        age: document.getElementById('age')
    };

    // Logical checks
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value);
    const isPassValid = config.passRegex.test(fields.pass.value);
    const isMatch = fields.pass.value === fields.confirm.value && fields.pass.value !== "";
    const isAgeValid = parseInt(fields.age.value) >= config.minAge;

    // 3. Dynamic DOM Manipulation
    // Toggle skills field
    document.getElementById('skillsSection').style.display = config.showSkills ? 'block' : 'none';

    // Update feedback text
    document.getElementById('passwordFeedback').innerText = isPassValid ? "" : config.reqMsg;
    document.getElementById('ageError').innerText = isAgeValid ? "" : `Must be at least ${config.minAge} for ${role}`;

    // Update visual styles
    applyStatus(fields.email, isEmailValid);
    applyStatus(fields.pass, isPassValid);
    applyStatus(fields.confirm, isMatch);
    applyStatus(fields.age, isAgeValid);

    // 4. Prevent submission by disabling button
    document.getElementById('submitBtn').disabled = !(isEmailValid && isPassValid && isMatch && isAgeValid && fields.name.value.length > 0);
}

function applyStatus(element, isValid) {
    if (element.value === "") {
        element.classList.remove('valid', 'invalid');
    } else {
        element.classList.toggle('valid', isValid);
        element.classList.toggle('invalid', !isValid);
    }
}

// 5. Event Listeners
form.addEventListener('input', validateForm);
roleSelect.addEventListener('change', validateForm);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("System Check Passed: User Registered Successfully!");
});

// Run once on load to set initial state
validateForm();