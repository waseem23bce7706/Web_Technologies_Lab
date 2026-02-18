let inventory = [];

window.onload = function() {
    loadInventory();
};

function loadInventory() {
    fetch('inventory.json')
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            inventory = data;
            renderTable(inventory);
        })
        .catch(error => {
            showMessage("Failed to load inventory data.", "error");
        });
}

function renderTable(dataToRender) {
    const tbody = document.querySelector("#inventoryTable tbody");
    tbody.innerHTML = "";
    
    let totalValue = 0;

    dataToRender.forEach(product => {
        let isLowStock = product.stock < 5;
        let rowClass = isLowStock ? "low-stock" : "";
        let stockWarning = isLowStock ? " ⚠️ (Low)" : "";
        
        totalValue += (product.price * product.stock);

        let row = `<tr class="${rowClass}">
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${parseFloat(product.price).toFixed(2)}</td>
            <td>${product.stock}${stockWarning}</td>
            <td>
                <button class="action-btn" onclick="editProduct('${product.id}')">Edit</button>
                <button class="action-btn" onclick="deleteProduct('${product.id}')">Delete</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });

    document.getElementById("totalValue").textContent = totalValue.toFixed(2);
}

function saveProduct() {
    let id = document.getElementById("prodId").value.trim();
    let name = document.getElementById("prodName").value.trim();
    let category = document.getElementById("prodCategory").value.trim();
    let price = parseFloat(document.getElementById("prodPrice").value);
    let stock = parseInt(document.getElementById("prodStock").value, 10);

    if (!id || !name || !category || isNaN(price) || isNaN(stock)) {
        showMessage("Validation Error: Please fill all fields with valid data.", "error");
        return;
    }

    if (price < 0 || stock < 0) {
        showMessage("Validation Error: Price and stock cannot be negative.", "error");
        return;
    }

    let existingIndex = inventory.findIndex(p => p.id === id);

    if (existingIndex !== -1) {
        inventory[existingIndex].name = name;
        inventory[existingIndex].category = category;
        inventory[existingIndex].price = price;
        inventory[existingIndex].stock = stock;
        showMessage(`Product ${id} updated.`, "success");
    } else {
        inventory.push({ id, name, category, price, stock });
        showMessage("New product added.", "success");
    }

    clearForm();
    document.getElementById("searchCategory").value = ""; 
    renderTable(inventory);
}

function deleteProduct(id) {
    if (confirm(`Delete product ${id}?`)) {
        inventory = inventory.filter(p => p.id !== id);
        
        let searchTerm = document.getElementById("searchCategory").value.toLowerCase();
        if (searchTerm) {
            filterByCategory();
        } else {
            renderTable(inventory);
        }
        
        showMessage(`Product ${id} deleted.`, "success");
    }
}

function editProduct(id) {
    let product = inventory.find(p => p.id === id);
    if (product) {
        document.getElementById("prodId").value = product.id;
        document.getElementById("prodName").value = product.name;
        document.getElementById("prodCategory").value = product.category;
        document.getElementById("prodPrice").value = product.price;
        document.getElementById("prodStock").value = product.stock;
        
        document.getElementById("prodId").readOnly = true;
    }
}

function filterByCategory() {
    let searchTerm = document.getElementById("searchCategory").value.toLowerCase();
    let filteredData = inventory.filter(product => 
        product.category.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredData);
}

function clearForm() {
    document.getElementById("prodId").value = "";
    document.getElementById("prodName").value = "";
    document.getElementById("prodCategory").value = "";
    document.getElementById("prodPrice").value = "";
    document.getElementById("prodStock").value = "";
    document.getElementById("prodId").readOnly = false;
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
