document.addEventListener('DOMContentLoaded', () => {
    // --- Получаем обычные элементы со страницы ---
    const checklist = document.getElementById('checklist');
    const addButton = document.getElementById('addButton');
    const clearButton = document.getElementById('clearButton');
    const inputField = document.getElementById('newItemInput');
    const taskCounter = document.getElementById('taskCounter');
    
    // --- Новые элементы ---
    const listTitle = document.getElementById('listTitle');
    const copyListButton = document.getElementById('copyListButton');
    const downloadListButton = document.getElementById('downloadListButton');

    // --- Элементы модального окна ---
    const importModalElement = document.getElementById('importModal');
    const importModal = new bootstrap.Modal(importModalElement);
    const confirmImportButton = document.getElementById('confirmImportButton');
    const importTextArea = document.getElementById('importTextArea');
    const importFileInput = document.getElementById('importFileInput');
    
    // --- Основные функции ---
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
    listTitle.addEventListener('blur', () => saveTitle()); // Сохраняем, когда убираем фокус
    listTitle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Предотвращаем перенос строки
            listTitle.blur();   // Убираем фокус, что вызовет сохранение
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
            link.download = `${listTitle.textContent.trim()}.txt`; // Имя файла = заголовок списка
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

    // --- Функции для работы со списком и localStorage ---
    function addItemToChecklist(itemText, isChecked) { /* ... без изменений ... */ }
    function updateTaskCounter() { /* ... без изменений ... */ }
    function saveChecklist() { /* ... без изменений ... */ }

    function saveTitle() {
        localStorage.setItem('todoListTitle', listTitle.textContent.trim());
    }

    function loadData() {
        // Загрузка заголовка
        const savedTitle = localStorage.getItem('todoListTitle');
        if (savedTitle) {
            listTitle.textContent = savedTitle;
        }
        // Загрузка списка
        const savedItems = JSON.parse(localStorage.getItem('checklistItems')) || [];
        savedItems.forEach(item => addItemToChecklist(item.text, item.checked));
        updateTaskCounter();
    }

    loadData(); // Одна функция для загрузки всего

    // --- Темная тема для модального окна ---
    function syncModalTheme() { /* ... без изменений ... */ }
    const themeObserver = new MutationObserver(() => syncModalTheme());
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    syncModalTheme();

    // Неизмененные функции копируем сюда
    function addItemToChecklist(itemText, isChecked) {
        const item = document.createElement('div');
        item.classList.add('checklist-item');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        const uniqueId = `item-${Math.random().toString(36).substring(2, 9)}`;
        checkbox.id = uniqueId;
        checkbox.checked = isChecked;
        const label = document.createElement('label');
        label.htmlFor = uniqueId;
        const textSpan = document.createElement('span');
        textSpan.textContent = itemText;
        label.appendChild(textSpan);
        const removeItemButton = document.createElement('button');
        removeItemButton.textContent = 'Удалить';
        removeItemButton.classList.add('delete-item');
        removeItemButton.addEventListener('click', () => { item.remove(); saveChecklist(); });
        checkbox.addEventListener('change', saveChecklist);
        item.appendChild(checkbox);
        item.appendChild(label);
        item.appendChild(removeItemButton);
        checklist.appendChild(item);
    }
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
    function syncModalTheme() {
        if (document.body.classList.contains('dark-theme')) {
            importModalElement.setAttribute('data-bs-theme', 'dark');
        } else {
            importModalElement.removeAttribute('data-bs-theme');
        }
    }
});