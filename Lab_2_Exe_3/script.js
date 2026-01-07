        let taskIdCounter = 0;

        function addTask() {
            const input = document.getElementById('taskInput');
            const taskName = input.value;

            if (taskName.trim() === "") {
                alert("Please enter a task name.");
                return;
            }

            const taskId = "task-" + taskIdCounter++;
            const currentDate = new Date().toLocaleDateString();

            // Create card element
            const card = document.createElement('div');
            card.className = 'task-card';
            card.id = taskId;
            card.draggable = true;
            card.ondragstart = drag;

            card.innerHTML = `
                <strong>${taskName}</strong>
                <span class="date">Created: ${currentDate}</span>
                <div class="status-msg"></div>
            `;

            document.getElementById('todo').appendChild(card);
            input.value = ""; // Clear input after adding
        }

        // Standard Drag & Drop functions
        function allowDrop(ev) {
            ev.preventDefault(); // Required to allow a drop
        }

        function drag(ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        }

        function drop(ev) {
            ev.preventDefault();
            const data = ev.dataTransfer.getData("text");
            const draggedElement = document.getElementById(data);
            
            // Find the closest column if drop happens on a card inside the column
            let targetColumn = ev.target;
            while (!targetColumn.classList.contains('column')) {
                targetColumn = targetColumn.parentElement;
            }

            targetColumn.appendChild(draggedElement);

            // Handle logic for dropping into 'Completed'
            const msgDiv = draggedElement.querySelector('.status-msg');
            
            if (targetColumn.id === 'completed') {
                draggedElement.classList.add('completed-task');
                msgDiv.innerHTML = '<span class="success-msg">Task Completed Successfully</span>';
            } else {
                draggedElement.classList.remove('completed-task');
                msgDiv.innerHTML = '';
            }
        }