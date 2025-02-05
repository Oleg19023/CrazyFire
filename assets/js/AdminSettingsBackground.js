var c = document.getElementById("c");
var ctx = c.getContext("2d");
var textColor = "#0F0"; // Default text color is green

function adjustCanvasSize() {
    c.height = window.innerHeight;
    c.width = window.innerWidth;
    
    columns = c.width / font_size;
    
    // Reset drops to random values
    drops = [];
    for (var x = 0; x < columns; x++) {
        drops[x] = Math.floor(Math.random() * c.height / font_size);
    }
}

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = textColor;
    ctx.font = font_size + "px arial";
    
    for (var i = 0; i < drops.length; i++) {
        var text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * font_size, drops[i] * font_size);
        
        if (drops[i] * font_size > c.height && Math.random() > 0.975)
            drops[i] = 0;
        
        drops[i]++;
    }
}

// Add event listener for window resize
window.addEventListener('resize', function() {
    adjustCanvasSize();
    draw();
});

// Initialize canvas size
adjustCanvasSize();

// Set up matrix and other variables
var matrix = "`1234567890-=!@#$%^&*()_+qwertyuiop[]asdfghjkl;'zxcvbnm,./QWERTYUIOPASDFGHJKLZXCVBNM<>?;'\"\\|~";
matrix = matrix.split("");

var font_size = 10;
var columns = c.width / font_size;
var drops = [];

// Initialize drops with random values
for (var x = 0; x < columns; x++) {
    drops[x] = Math.floor(Math.random() * c.height / font_size);
}

function changeTextColor(color) {
    textColor = color;
    draw();
}

setInterval(draw, 35);