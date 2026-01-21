const surveyData = [
    {
        id: "q1",
        label: "What is your full name?",
        type: "text",
        required: true,
        limit: 20 
    },
    {
        id: "q2",
        label: "How did you hear about us?",
        type: "radio",
        options: ["Social Media", "Friend", "Advertisement"],
        required: true
    },
    {
        id: "q3",
        label: "Which features do you use? (Select at least 2)",
        type: "checkbox",
        options: ["Dashboard", "Reports", "API", "Mobile App"],
        minSelection: 2
    }
];
const container = document.getElementById('survey-container');
const form = document.getElementById('dynamicForm');

function buildSurvey() {
    surveyData.forEach(q => {
        const block = document.createElement('div');
        block.className = 'question-block';
        block.id = `block-${q.id}`;
        const label = document.createElement('label');
        label.className = 'question-label';
        label.innerText = q.label + (q.required ? " *" : "");
        block.appendChild(label);
        if (q.type === 'text') {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = q.id;
            input.placeholder = `Max ${q.limit} characters`;
            block.appendChild(input);}
        else if (q.type === 'radio' || q.type === 'checkbox') {
            q.options.forEach(opt => {
                const wrapper = document.createElement('label');
                wrapper.className = 'option-item';
                const input = document.createElement('input');
                input.type = q.type;
                input.name = q.id;
                input.value = opt;
                wrapper.appendChild(input);
                wrapper.appendChild(document.createTextNode(" " + opt));
                block.appendChild(wrapper);});}
        const error = document.createElement('div');
        error.className = 'error-msg';
        error.id = `error-${q.id}`;
        block.appendChild(error);
        container.appendChild(block);});}
function validate() {
    let isAllValid = true;
    surveyData.forEach(q => {
        const block = document.getElementById(`block-${q.id}`);
        const errorEl = document.getElementById(`error-${q.id}`);
        let isValid = true;
        let message = "";
        if (q.type === 'text') {
            const val = document.getElementById(q.id).value.trim();
            if (q.required && val === "") {
                isValid = false;
                message = "This field is required.";
            } else if (val.length > q.limit) {
                isValid = false;
                message = `Too long! Limit is ${q.limit} characters.`;}}
        else if (q.type === 'radio') {
            const checked = document.querySelector(`input[name="${q.id}"]:checked`);
            if (q.required && !checked) {
                isValid = false;
                message = "Please select one option.";}}
        else if (q.type === 'checkbox') {
            const checkedCount = document.querySelectorAll(`input[name="${q.id}"]:checked`).length;
            if (checkedCount < q.minSelection) {
                isValid = false;
                message = `Please select at least ${q.minSelection} options.`;}}
        if (!isValid) {
            block.classList.add('invalid');
            errorEl.innerText = message;
            isAllValid = false;
        } else {
            block.classList.remove('invalid');}});
    return isAllValid;}
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validate()) {
        form.classList.add('hidden');
        document.getElementById('successMsg').classList.remove('hidden');
        console.log("Survey Data Validated and Ready for API!");}});
buildSurvey();