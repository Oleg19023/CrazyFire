document.addEventListener('DOMContentLoaded', () => {
    const notesTextarea = document.getElementById('notes-textarea');

    // Если виджета заметок нет на странице, ничего не делаем
    if (!notesTextarea) {
        return;
    }

    // 1. ЗАГРУЗКА: При загрузке страницы пытаемся найти сохраненные заметки
    const savedNotes = localStorage.getItem('userNotes');
    if (savedNotes) {
        notesTextarea.value = savedNotes;
    }

    // 2. СОХРАНЕНИЕ: При каждом вводе символа в поле, сохраняем его содержимое
    notesTextarea.addEventListener('input', () => {
        localStorage.setItem('userNotes', notesTextarea.value);
    });
});