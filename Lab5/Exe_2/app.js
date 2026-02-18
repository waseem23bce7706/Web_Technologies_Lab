let xmlDoc = null;

window.onload = function() {
    loadBooks();
};

function loadBooks() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "books.xml", true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
            xmlDoc = xhr.responseXML;
            if (!xmlDoc || xmlDoc.getElementsByTagName("parsererror").length > 0) {
                showMessage("Failed to load or parse XML.", "error");
                return;
            }
            renderTable();
        }
    };
    xhr.send();
}

function renderTable() {
    const tbody = document.querySelector("#booksTable tbody");
    tbody.innerHTML = ""; 

    const books = xmlDoc.getElementsByTagName("book");

    for (let i = 0; i < books.length; i++) {
        let book = books[i];
        
        let id = book.getElementsByTagName("id")[0].textContent;
        let title = book.getElementsByTagName("title")[0].textContent;
        let author = book.getElementsByTagName("author")[0].textContent;
        let status = book.getElementsByTagName("status")[0].textContent;

        let statusClass = status === "Available" ? "available" : "checked-out";

        let row = `<tr>
            <td>${id}</td>
            <td>${title}</td>
            <td>${author}</td>
            <td><span class="status-badge ${statusClass}">${status}</span></td>
            <td>
                <button class="toggle-btn" onclick="toggleStatus('${id}')">Toggle Status</button>
                <button class="delete-btn" onclick="deleteBook('${id}')">Delete</button>
            </td>
        </tr>`;
        
        tbody.innerHTML += row;
    }
}

function addBook() {
    let id = document.getElementById("bookId").value.trim();
    let title = document.getElementById("bookTitle").value.trim();
    let author = document.getElementById("bookAuthor").value.trim();
    let status = document.getElementById("bookStatus").value;

    if (!id || !title || !author) {
        showMessage("Validation Error: All fields are required.", "error");
        return;
    }
    
    if (findBookById(id)) {
        showMessage(`Validation Error: Book ID '${id}' already exists.`, "error");
        return;
    }

    let newBook = xmlDoc.createElement("book");

    let idNode = xmlDoc.createElement("id");
    idNode.textContent = id;
    newBook.appendChild(idNode);

    let titleNode = xmlDoc.createElement("title");
    titleNode.textContent = title;
    newBook.appendChild(titleNode);

    let authorNode = xmlDoc.createElement("author");
    authorNode.textContent = author;
    newBook.appendChild(authorNode);

    let statusNode = xmlDoc.createElement("status");
    statusNode.textContent = status;
    newBook.appendChild(statusNode);

    xmlDoc.getElementsByTagName("library")[0].appendChild(newBook);
    
    renderTable();
    clearForm();
    showMessage("Book added successfully!", "success");
}

function toggleStatus(id) {
    let book = findBookById(id);
    if (book) {
        let statusNode = book.getElementsByTagName("status")[0];
        let currentStatus = statusNode.textContent;
        
        statusNode.textContent = currentStatus === "Available" ? "Checked Out" : "Available";
        
        renderTable();
        showMessage(`Status for Book '${id}' updated.`, "success");
    }
}

function deleteBook(id) {
    if (confirm(`Are you sure you want to remove Book '${id}' from the library?`)) {
        let book = findBookById(id);
        if (book) {
            book.parentNode.removeChild(book);
            renderTable();
            showMessage(`Book '${id}' deleted successfully.`, "success");
        }
    }
}

function findBookById(id) {
    let books = xmlDoc.getElementsByTagName("book");
    for (let i = 0; i < books.length; i++) {
        if (books[i].getElementsByTagName("id")[0].textContent === id) {
            return books[i];
        }
    }
    return null;
}

function clearForm() {
    document.getElementById("bookId").value = "";
    document.getElementById("bookTitle").value = "";
    document.getElementById("bookAuthor").value = "";
    document.getElementById("bookStatus").value = "Available";
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
