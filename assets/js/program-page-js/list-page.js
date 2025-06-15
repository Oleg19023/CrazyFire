document.addEventListener('DOMContentLoaded', () => {
    // --- Получаем все необходимые элементы со страницы ---
    const checklist = document.getElementById('checklist');
    const addButton = document.getElementById('addButton');
    const clearButton = document.getElementById('clearButton');
    const inputField = document.getElementById('newItemInput');
    const taskCounter = document.getElementById('taskCounter');
    const listTitle = document.getElementById('listTitle');
    const copyListButton = document.getElementById('copyListButton');
    const downloadListButton = document.getElementById('downloadListButton');
    const importModalElement = document.getElementById('importModal');
    const importModal = new bootstrap.Modal(importModalElement);
    const confirmImportButton = document.getElementById('confirmImportButton');
    const importTextArea = document.getElementById('importTextArea');
    const importFileInput = document.getElementById('importFileInput');

    // --- Основные функции и обработчики ---
    const handleAddItem = () => {
        const itemText = inputField.value.trim();
        if (itemText) {
            addItemToChecklist(itemText, false);
            inputField.value = '';
            saveChecklist();
        }
        inputField.focus();
    };

    const processImportedText = (text) => {
        const lines = text.split('\n');
        let itemsAdded = 0;
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine) {
                addItemToChecklist(trimmedLine, false);
                itemsAdded++;
            }
        });
        if (itemsAdded > 0) saveChecklist();
        importTextArea.value = '';
        importFileInput.value = '';
        importModal.hide();
    };

    // --- Слушатели событий ---
    addButton.addEventListener('click', handleAddItem);
    inputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddItem(); } });
    clearButton.addEventListener('click', () => {
        if (checklist.children.length > 0 && confirm('Вы уверены, что хотите удалить все элементы?')) {
            checklist.innerHTML = '';
            saveChecklist();
        }
    });

    // --- Логика для редактируемого заголовка ---
    listTitle.addEventListener('blur', () => saveTitle());
    listTitle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            listTitle.blur();
        }
    });

    // --- Логика для экспорта ---
    function getTasksAsText() {
        const tasks = [];
        document.querySelectorAll('.checklist-item label span').forEach(span => {
            tasks.push(span.textContent);
        });
        return tasks.join('\n');
    }

    copyListButton.addEventListener('click', (e) => {
        e.preventDefault();
        const textToCopy = getTasksAsText();
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = e.target.textContent;
                e.target.textContent = 'Скопировано!';
                setTimeout(() => { e.target.textContent = originalText; }, 2000);
            });
        }
    });

    downloadListButton.addEventListener('click', (e) => {
        e.preventDefault();
        const textToDownload = getTasksAsText();
        if (textToDownload) {
            const blob = new Blob([textToDownload], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${listTitle.textContent.trim()}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }
    });

    // --- Слушатели для модального окна ---
    confirmImportButton.addEventListener('click', () => {
        const textFromArea = importTextArea.value.trim();
        const file = importFileInput.files[0];
        if (textFromArea) processImportedText(textFromArea);
        else if (file) {
            const reader = new FileReader();
            reader.onload = (e) => processImportedText(e.target.result);
            reader.readAsText(file);
        }
    });
    importTextArea.addEventListener('input', () => { if (importFileInput.value) importFileInput.value = ''; });
    importFileInput.addEventListener('change', () => { if (importTextArea.value) importTextArea.value = ''; });


    // --- Функция для создания элементов списка (с иконками) ---
    function addItemToChecklist(itemText, isChecked) {
        const item = document.createElement('div');
        item.classList.add('checklist-item');
    
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        const uniqueId = `item-${Math.random().toString(36).substring(2, 9)}`;
        checkbox.id = uniqueId;
        checkbox.checked = isChecked;
        checkbox.addEventListener('change', saveChecklist);
        
        const label = document.createElement('label');
        label.htmlFor = uniqueId;
    
        const textSpan = document.createElement('span');
        textSpan.textContent = itemText;
        
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'form-control form-control-sm item-edit-input';
        editInput.style.display = 'none';
    
        label.appendChild(textSpan);
        label.appendChild(editInput);
        
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'd-flex gap-2 ms-auto align-items-center';
    
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        editButton.className = 'btn btn-primary btn-sm';
        
        editButton.addEventListener('click', () => {
            const isEditing = editButton.classList.contains('btn-success');
            
            if (!isEditing) {
                textSpan.style.display = 'none';
                editInput.style.display = 'block';
                editInput.value = textSpan.textContent;
                editInput.focus();
                editInput.select();
                editButton.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
                editButton.classList.replace('btn-primary', 'btn-success');
            } else {
                const newText = editInput.value.trim();
                if (newText) {
                    textSpan.textContent = newText;
                }
                textSpan.style.display = 'block';
                editInput.style.display = 'none';
                editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
                editButton.classList.replace('btn-success', 'btn-primary');
                saveChecklist();
            }
        });
    
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                editButton.click();
            }
            if (e.key === 'Escape') {
                textSpan.style.display = 'block';
                editInput.style.display = 'none';
                editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
                editButton.classList.replace('btn-success', 'btn-primary');
            }
        });
    
        const removeItemButton = document.createElement('button');
        removeItemButton.innerHTML = '×';
        removeItemButton.className = 'btn btn-danger btn-sm';
        removeItemButton.addEventListener('click', () => {
            item.remove();
            saveChecklist();
        });
    
        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(removeItemButton);
    
        item.appendChild(checkbox);
        item.appendChild(label);
        item.appendChild(buttonGroup);
        checklist.appendChild(item);
    }

    // --- Функции для сохранения и загрузки данных ---
    function updateTaskCounter() {
        const totalTasks = document.querySelectorAll('.checklist-item').length;
        const completedTasks = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
        taskCounter.textContent = totalTasks > 0 ? `Выполнено: ${completedTasks} из ${totalTasks}` : '';
    }

    function saveChecklist() {
        const items = [];
        document.querySelectorAll('.checklist-item').forEach(item => {
            const label = item.querySelector('label span');
            const checkbox = item.querySelector('input[type="checkbox"]');
            items.push({ text: label.textContent, checked: checkbox.checked });
        });
        localStorage.setItem('checklistItems', JSON.stringify(items));
        updateTaskCounter();
    }

    function saveTitle() {
        localStorage.setItem('todoListTitle', listTitle.textContent.trim());
    }

    function loadData() {
        const savedTitle = localStorage.getItem('todoListTitle');
        if (savedTitle) {
            listTitle.textContent = savedTitle;
        }
        const savedItems = JSON.parse(localStorage.getItem('checklistItems')) || [];
        savedItems.forEach(item => addItemToChecklist(item.text, item.checked));
        updateTaskCounter();
    }

    // --- Темная тема для модального окна ---
    function syncModalTheme() {
        if (document.body.classList.contains('dark-theme')) {
            importModalElement.setAttribute('data-bs-theme', 'dark');
        } else {
            importModalElement.removeAttribute('data-bs-theme');
        }
    }
    const themeObserver = new MutationObserver(() => syncModalTheme());
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // --- Первичная загрузка данных при старте ---
    loadData();
    syncModalTheme();
});