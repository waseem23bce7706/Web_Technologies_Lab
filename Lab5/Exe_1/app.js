let xmlDoc = null; 
window.onload = function() {
    loadXMLData();
};

function loadXMLData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "employees.xml", true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 0) { 
                xmlDoc = xhr.responseXML;
                
                if (!xmlDoc || xmlDoc.getElementsByTagName("parsererror").length > 0) {
                    showMessage("Error: XML file is empty or malformed.", "error");
                    return;
                }
                
                renderTable();
                showMessage("Employee data loaded successfully.", "success");
            } else {
                showMessage("Error fetching XML file.", "error");
            }
        }
    };
    xhr.send();
}

function renderTable() {
    const tbody = document.querySelector("#employeeTable tbody");
    tbody.innerHTML = ""; 

    const employees = xmlDoc.getElementsByTagName("employee");

    for (let i = 0; i < employees.length; i++) {
        let emp = employees[i];
        
        let id = emp.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        let name = emp.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        let dept = emp.getElementsByTagName("department")[0].childNodes[0].nodeValue;
        let salary = emp.getElementsByTagName("salary")[0].childNodes[0].nodeValue;

        let row = `<tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${dept}</td>
            <td>$${salary}</td>
            <td>
                <button onclick="editEmployee('${id}')">Edit</button>
                <button onclick="deleteEmployee('${id}')">Delete</button>
            </td>
        </tr>`;
        
        tbody.innerHTML += row;
    }
}

function addOrUpdateEmployee() {
    let id = document.getElementById("empId").value.trim();
    let name = document.getElementById("empName").value.trim();
    let dept = document.getElementById("empDept").value.trim();
    let salary = document.getElementById("empSalary").value.trim();

    if (!id || !name || !dept || !salary) {
        showMessage("Please fill in all fields.", "error");
        return;
    }

    let existingEmp = findEmployeeById(id);

    if (existingEmp) {
        existingEmp.getElementsByTagName("name")[0].childNodes[0].nodeValue = name;
        existingEmp.getElementsByTagName("department")[0].childNodes[0].nodeValue = dept;
        existingEmp.getElementsByTagName("salary")[0].childNodes[0].nodeValue = salary;
        showMessage(`Employee ${id} updated successfully.`, "success");
    } else {
        let newEmp = xmlDoc.createElement("employee");

        let idNode = xmlDoc.createElement("id");
        idNode.appendChild(xmlDoc.createTextNode(id));
        newEmp.appendChild(idNode);

        let nameNode = xmlDoc.createElement("name");
        nameNode.appendChild(xmlDoc.createTextNode(name));
        newEmp.appendChild(nameNode);

        let deptNode = xmlDoc.createElement("department");
        deptNode.appendChild(xmlDoc.createTextNode(dept));
        newEmp.appendChild(deptNode);

        let salaryNode = xmlDoc.createElement("salary");
        salaryNode.appendChild(xmlDoc.createTextNode(salary));
        newEmp.appendChild(salaryNode);

        xmlDoc.getElementsByTagName("employees")[0].appendChild(newEmp);
        showMessage("New employee added successfully.", "success");
    }

    clearForm();
    renderTable(); 
}

function deleteEmployee(id) {
    if (confirm(`Are you sure you want to delete employee ${id}?`)) {
        let emp = findEmployeeById(id);
        if (emp) {
            emp.parentNode.removeChild(emp);
            renderTable();
            showMessage(`Employee ${id} deleted.`, "success");
        }
    }
}

function findEmployeeById(id) {
    let employees = xmlDoc.getElementsByTagName("employee");
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].getElementsByTagName("id")[0].childNodes[0].nodeValue === id) {
            return employees[i];
        }
    }
    return null;
}


function editEmployee(id) {
    let emp = findEmployeeById(id);
    if (emp) {
        document.getElementById("empId").value = emp.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        document.getElementById("empName").value = emp.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        document.getElementById("empDept").value = emp.getElementsByTagName("department")[0].childNodes[0].nodeValue;
        document.getElementById("empSalary").value = emp.getElementsByTagName("salary")[0].childNodes[0].nodeValue;
        document.getElementById("empId").readOnly = true; 
    }
}

function clearForm() {
    document.getElementById("empId").value = "";
    document.getElementById("empName").value = "";
    document.getElementById("empDept").value = "";
    document.getElementById("empSalary").value = "";
    document.getElementById("empId").readOnly = false;
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
