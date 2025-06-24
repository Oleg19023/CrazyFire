document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы DOM ---
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    const colorPickerPaint = document.getElementById('colorPickerPaint');
    const lineWidthSlider = document.getElementById('lineWidthSlider');
    const lineWidthValue = document.getElementById('lineWidthValue');
    const toolBtns = document.querySelectorAll('.tool-btn');
    const brushShapeBtns = document.querySelectorAll('.brush-shape-btn');
    const clearCanvasBtn = document.getElementById('clearCanvasBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resizeCanvasBtn = document.getElementById('resizeCanvasBtn');
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const canvasArea = document.querySelector('.canvas-area');

    // --- Переменные состояния ---
    let isDrawing = false;
    let isDragging = false;
    let activeTool = 'pencil';
    let startX, startY;
    
    // --- ОБЪЕКТНАЯ МОДЕЛЬ ---
    let objects = [];
    let history = [];
    let historyIndex = -1;
    let selectedObject = null;
    let dragOffsetX, dragOffsetY;

    // --- Настройки ---
    const settings = {
        lineWidth: 5,
        lineColor: '#000000',
        brushShape: 'round',
    };

    // --- Инициализация ---
    function initializeCanvas() {
        const parent = document.querySelector('.canvas-area');
        canvas.width = parent.clientWidth - 40;
        canvas.height = parent.clientHeight - 40;
        redrawCanvas();
        saveState();
    }
    
    window.addEventListener('load', initializeCanvas);

    // --- УПРАВЛЕНИЕ ИСТОРИЕЙ ---
    function saveState() {
        // Очищаем "будущее" если мы делали отмену
        if (historyIndex < history.length - 1) {
            history.splice(historyIndex + 1);
        }
        // Глубокое копирование объектов, чтобы история была независимой
        history.push(JSON.parse(JSON.stringify(objects)));
        historyIndex++;
    }

    function undo() {
        if (historyIndex > 0) {
            historyIndex--;
            // Глубокое копирование состояния из истории
            objects = JSON.parse(JSON.stringify(history[historyIndex]));
            selectedObject = null;
            redrawCanvas();
        }
    }

    function redo() {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            objects = JSON.parse(JSON.stringify(history[historyIndex]));
            selectedObject = null;
            redrawCanvas();
        }
    }

    // --- РИСОВАНИЕ ---
    function redrawCanvas() {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        objects.forEach(drawObject);
        if (selectedObject) {
            drawSelectionBox(selectedObject);
        }
    }

    resizeCanvasBtn.addEventListener('click', () => {
    const newWidth = prompt("Введите новую ширину холста (px):", canvas.width);
    const newHeight = prompt("Введите новую высоту холста (px):", canvas.height);
    if (newWidth && newHeight && !isNaN(newWidth) && !isNaN(newHeight)) {
        // Создаем временный холст со старым изображением
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(canvas, 0, 0);

        // Изменяем размер основного холста
        canvas.width = parseInt(newWidth);
        canvas.height = parseInt(newHeight);

        // Перерисовываем все объекты на новый размер
        // Это более правильный подход, чем просто вставлять старое изображение,
        // так как сохраняет векторное качество
        redrawCanvas(); 

        // Сохраняем новое состояние в историю
        saveState(); 
    }
});
    
    function drawObject(obj) {
        ctx.beginPath();
        ctx.lineWidth = obj.lineWidth;
        ctx.strokeStyle = obj.lineColor;
        ctx.fillStyle = obj.lineColor;
        ctx.lineCap = obj.brushShape;
        ctx.lineJoin = obj.brushShape;
        
        switch (obj.type) {
            case 'path':
                ctx.globalAlpha = obj.alpha || 1;
                ctx.moveTo(obj.points[0].x, obj.points[0].y);
                obj.points.forEach(p => ctx.lineTo(p.x, p.y));
                ctx.stroke();
                ctx.globalAlpha = 1;
                break;
            case 'line':
                ctx.moveTo(obj.x1, obj.y1);
                ctx.lineTo(obj.x2, obj.y2);
                ctx.stroke();
                break;
            case 'rectangle':
                ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
                break;
            case 'circle':
                ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
                ctx.stroke();
                break;
            case 'text':
                ctx.font = obj.font;
                ctx.fillText(obj.text, obj.x, obj.y);
                break;
        }
    }
    
    function drawSelectionBox(obj) {
        const bounds = getObjectBounds(obj);
        ctx.strokeStyle = '#0d6efd';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.strokeRect(bounds.x - 5, bounds.y - 5, bounds.width + 10, bounds.height + 10);
        ctx.setLineDash([]);
    }

    // --- ЛОГИКА ИНСТРУМЕНТОВ ---
    function handleMouseDown(e) {
        startX = e.offsetX;
        startY = e.offsetY;

        if (activeTool === 'select') {
            selectedObject = getObjectAtPosition(startX, startY);
            if (selectedObject) {
                isDragging = true;
                const bounds = getObjectBounds(selectedObject);
                dragOffsetX = startX - bounds.x;
                dragOffsetY = startY - bounds.y;
                canvasArea.classList.add('move-mode');
            }
            redrawCanvas();
        } else {
            isDrawing = true;
            const newObject = createNewObject(startX, startY);
            if (newObject) {
                objects.push(newObject);
                redrawCanvas();
            }
        }
    }

    function handleMouseMove(e) {
        const currentX = e.offsetX;
        const currentY = e.offsetY;

        if (isDragging && selectedObject) {
            moveObject(selectedObject, currentX - dragOffsetX, currentY - dragOffsetY);
            redrawCanvas();
        } else if (isDrawing) {
            const currentObject = objects[objects.length - 1];
            if (currentObject) {
                updateObject(currentObject, currentX, currentY);
                redrawCanvas();
            }
        }
    }

    function handleMouseUp() {
        if (isDrawing || isDragging) {
            saveState();
        }
        isDrawing = false;
        isDragging = false;
        canvasArea.classList.remove('move-mode');
    }
    
    function createNewObject(x, y) {
        const commonProps = {
            lineWidth: settings.lineWidth,
            lineColor: activeTool === 'eraser' ? '#fff' : settings.lineColor,
            brushShape: settings.brushShape
        };
        switch (activeTool) {
            case 'pencil':
            case 'brush':
            case 'eraser':
                 return { ...commonProps, type: 'path', points: [{x, y}] };
            case 'marker':
                 return { ...commonProps, type: 'path', points: [{x, y}], alpha: 0.1 };
            case 'line':
                 return { ...commonProps, type: 'line', x1: x, y1: y, x2: x, y2: y };
            case 'rectangle':
                 return { ...commonProps, type: 'rectangle', x: x, y: y, width: 0, height: 0 };
            case 'circle':
                 return { ...commonProps, type: 'circle', x: x, y: y, radius: 0 };
            default:
                return null;
        }
    }
    
    function updateObject(obj, x, y) {
        switch (obj.type) {
            case 'path': obj.points.push({x, y}); break;
            case 'line': obj.x2 = x; obj.y2 = y; break;
            case 'rectangle': obj.width = x - obj.x; obj.height = y - obj.y; break;
            case 'circle': obj.radius = Math.sqrt(Math.pow(x - obj.x, 2) + Math.pow(y - obj.y, 2)); break;
        }
    }
    
    function moveObject(obj, newX, newY) {
        const bounds = getObjectBounds(obj);
        const dx = newX - bounds.x;
        const dy = newY - bounds.y;
        
        switch (obj.type) {
            case 'path': obj.points.forEach(p => { p.x += dx; p.y += dy; }); break;
            case 'line': obj.x1 += dx; obj.y1 += dy; obj.x2 += dx; obj.y2 += dy; break;
            default: obj.x += dx; obj.y += dy; break;
        }
    }

    // --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
    function getObjectBounds(obj) {
        // ... (эта функция остается без изменений из предыдущего ответа) ...
        switch (obj.type) {
            case 'path':
                const xs = obj.points.map(p => p.x);
                const ys = obj.points.map(p => p.y);
                const minX = Math.min(...xs);
                const minY = Math.min(...ys);
                return { x: minX, y: minY, width: Math.max(...xs) - minX, height: Math.max(...ys) - minY };
            case 'rectangle':
                return { x: Math.min(obj.x, obj.x + obj.width), y: Math.min(obj.y, obj.y + obj.height), width: Math.abs(obj.width), height: Math.abs(obj.height) };
            case 'circle':
                return { x: obj.x - obj.radius, y: obj.y - obj.radius, width: obj.radius * 2, height: obj.radius * 2 };
            case 'line':
                return { x: Math.min(obj.x1, obj.x2), y: Math.min(obj.y1, obj.y2), width: Math.abs(obj.x1-obj.x2), height: Math.abs(obj.y1-obj.y2)};
            case 'text':
                // Это приблизительные границы, т.к. точные требуют рендера
                return { x: obj.x, y: obj.y - obj.lineWidth * 2, width: obj.lineWidth * obj.text.length * 1.5, height: obj.lineWidth * 3 };
            default:
                return { x: 0, y: 0, width: 0, height: 0 };
        }
    }

    function getObjectAtPosition(x, y) {
        for (let i = objects.length - 1; i >= 0; i--) {
            const obj = objects[i];
            const bounds = getObjectBounds(obj);
            if (x >= bounds.x - obj.lineWidth && x <= bounds.x + bounds.width + obj.lineWidth && y >= bounds.y - obj.lineWidth && y <= bounds.y + bounds.height + obj.lineWidth) {
                return obj;
            }
        }
        return null;
    }

    // --- ОБРАБОТЧИКИ СОБЫТИЙ ---
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseUp);
    canvas.addEventListener('click', (e) => {
        if (activeTool === 'text') {
            const text = prompt("Введите текст:", "");
            if (text) {
                const textObj = {
                    type: 'text',
                    text: text,
                    x: e.offsetX, y: e.offsetY,
                    font: `${settings.lineWidth * 3}px Arial`,
                    lineColor: settings.lineColor,
                    lineWidth: settings.lineWidth // Сохраняем для границ
                };
                objects.push(textObj);
                redrawCanvas();
                saveState();
            }
        }
    });
    
    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.tool-btn.active')?.classList.remove('active');
            btn.classList.add('active');
            activeTool = btn.dataset.tool;
            selectedObject = null;
            redrawCanvas();
            canvasArea.classList.toggle('selection-mode', activeTool === 'select');
        });
    });

    // ИСПРАВЛЕНО: Смена цвета
    colorPickerPaint.addEventListener('input', (e) => {
        settings.lineColor = e.target.value;
        if (selectedObject) {
            selectedObject.lineColor = settings.lineColor;
            redrawCanvas();
            // Не сохраняем в историю, чтобы можно было отменить смену цвета
        }
    });
    colorPickerPaint.addEventListener('change', () => {
        // Сохраняем в историю только после завершения выбора цвета
        if(selectedObject) saveState();
    });
    
    lineWidthSlider.addEventListener('input', (e) => {
        settings.lineWidth = e.target.value;
        lineWidthValue.textContent = `${e.target.value}px`;
    });
    
    // Удаление объекта
    window.addEventListener('keydown', (e) => {
        if ((e.key === 'Delete' || e.key === 'Backspace') && selectedObject) {
            objects = objects.filter(obj => obj !== selectedObject);
            selectedObject = null;
            redrawCanvas();
            saveState();
        }
    });

    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    
    clearCanvasBtn.addEventListener('click', () => {
        if (confirm("Вы уверены? Это действие необратимо.")) {
            objects = [];
            selectedObject = null;
            redrawCanvas();
            saveState();
        }
    });
    
    downloadBtn.addEventListener('click', () => {
        selectedObject = null;
        redrawCanvas();
        const link = document.createElement('a');
        link.download = `crazyfire_paint_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
});