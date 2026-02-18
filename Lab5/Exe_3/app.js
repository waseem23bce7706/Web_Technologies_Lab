let students = [];

window.onload = function() {
    loadStudents();
};

function loadStudents() {
    fetch('students.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            students = data;
            renderTable();
        })
        .catch(error => {
            showMessage("Error loading or parsing JSON data.", "error");
            console.error("Fetch error:", error);
        });
}

function renderTable() {
    const tbody = document.querySelector("#studentsTable tbody");
    tbody.innerHTML = "";

    students.forEach(student => {
        let row = `<tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.marks}</td>
            <td>
                <button class="action-btn" onclick="editStudent('${student.id}')">Edit</button>
                <button class="action-btn" onclick="deleteStudent('${student.id}')">Delete</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function saveStudent() {
    let id = document.getElementById("studentId").value.trim();
    let name = document.getElementById("studentName").value.trim();
    let course = document.getElementById("studentCourse").value.trim();
    let marks = document.getElementById("studentMarks").value.trim();

    if (!id || !name || !course || !marks) {
        showMessage("Validation Error: All fields are required.", "error");
        return;
    }

    marks = Number(marks);
    if (isNaN(marks) || marks < 0 || marks > 100) {
        showMessage("Validation Error: Marks must be a number between 0 and 100.", "error");
        return;
    }

    let existingIndex = students.findIndex(s => s.id === id);

    if (existingIndex !== -1) {
        students[existingIndex].name = name;
        students[existingIndex].course = course;
        students[existingIndex].marks = marks;
        showMessage(`Student ${id} updated successfully.`, "success");
    } else {
        students.push({ id, name, course, marks });
        showMessage("New student added successfully.", "success");
    }

    clearForm();
    renderTable();
}

function deleteStudent(id) {
    if (confirm(`Are you sure you want to delete student ${id}?`)) {
        students = students.filter(s => s.id !== id);
        renderTable();
        showMessage(`Student ${id} deleted successfully.`, "success");
    }
}

function editStudent(id) {
    let student = students.find(s => s.id === id);
    if (student) {
        document.getElementById("studentId").value = student.id;
        document.getElementById("studentName").value = student.name;
        document.getElementById("studentCourse").value = student.course;
        document.getElementById("studentMarks").value = student.marks;
        
        document.getElementById("studentId").readOnly = true;
    }
}

function clearForm() {
    document.getElementById("studentId").value = "";
    document.getElementById("studentName").value = "";
    document.getElementById("studentCourse").value = "";
    document.getElementById("studentMarks").value = "";
    document.getElementById("studentId").readOnly = false;
}

function showMessage(text, type) {
    const msgBox = document.getElementById("messageBox");
    msgBox.textContent = text;
    msgBox.className = type; 
    msgBox.style.display = "block";
    
    setTimeout(() => {
        msgBox.style.display = "none";
    }, 3000);
}
