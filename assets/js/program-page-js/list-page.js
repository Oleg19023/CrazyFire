const checklist = document.getElementById('checklist');
const createButton = document.querySelector('.Btn');
const deleteButton = document.querySelector('.button-delete');
const inputField = document.createElement('input');
inputField.type = 'text';
inputField.placeholder = 'Введите элемент';
document.querySelector('.container').insertBefore(inputField, checklist); // Добавляем поле ввода перед списком

// Загрузка сохраненных элементов из localStorage при загрузке страницы
document.addEventListener('DOMContentLoaded', loadChecklist);

createButton.addEventListener('click', () => {
    const itemText = inputField.value.trim();
    if (itemText) {
        addItemToChecklist(itemText);
        inputField.value = ''; // Очищаем поле ввода
        saveChecklist(); // Сохраняем изменения в localStorage
    }
});

deleteButton.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите удалить все элементы?')) {
        checklist.innerHTML = ''; // Очищаем список
        saveChecklist(); // Сохраняем изменения в localStorage
    }
});

function addItemToChecklist(itemText) {
    const item = document.createElement('div');
    item.classList.add('checklist-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `item-${Date.now()}`;
    
    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.textContent = itemText;

    // Добавляем кнопку удаления для каждого элемента
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.classList.add('delete-item');

    // Обработчик для удаления конкретного элемента
    deleteButton.addEventListener('click', () => {
        item.remove();
        saveChecklist(); // Сохраняем изменения в localStorage
    });

    // Добавляем обработчик для зачеркивания текста при отметке чекбокса
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            label.style.textDecoration = 'line-through';
        } else {
            label.style.textDecoration = 'none';
        }
        saveChecklist(); // Сохраняем изменения в localStorage
    });

    item.appendChild(checkbox);
    item.appendChild(label);
    item.appendChild(deleteButton); // Добавляем кнопку удаления в элемент списка
    checklist.appendChild(item);
}

function loadChecklist() {
    const savedItems = JSON.parse(localStorage.getItem('checklistItems')) || [];
    savedItems.forEach(item => {
        addItemToChecklist(item.text);
        const checkbox = checklist.lastChild.querySelector('input[type="checkbox"]');
        checkbox.checked = item.checked;
        checkbox.dispatchEvent(new Event('change')); // Вызываем событие для зачеркивания
    });
}

function saveChecklist() {
    const items = [];
    document.querySelectorAll('.checklist-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        items.push({ text: item.querySelector('label').textContent, checked: checkbox.checked });
    });
    localStorage.setItem('checklistItems', JSON.stringify(items));
}
