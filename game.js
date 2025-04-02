// 遊戲設定
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const bgm = document.getElementById('bgm');
const scoreSound = document.getElementById('scoreSound');

// 設定畫布大小
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 遊戲狀態
let score = 0;
let encouragements = [
    "你是最棒的，宇宙第一帥！",
    "得分+1，離脫單又近了一步！",
    "別人玩遊戲，你玩的是人生巔峰！",
    "你這操作，牛頓看了都想復活！",
    "再接再厲，世界因你而美好！"
];
let currentEncouragement = '';
let encouragementAlpha = 0;

// 玩家
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    color: '#FF6F61',
    speed: 5
};

// 目標
const target = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 10,
    color: '#FFD700'
};

// 粒子系統
let particles = [];

// 控制邏輯
let keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // 計算方向和距離
    const dx = mouseX - player.x;
    const dy = mouseY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > player.speed) {
        player.x += (dx / distance) * player.speed;
        player.y += (dy / distance) * player.speed;
    }
});

// 創建粒子
function createParticles() {
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: target.x,
            y: target.y,
            radius: Math.random() * 3 + 2,
            color: '#FFFF00',
            speed: Math.random() * 2 + 1,
            angle: Math.random() * Math.PI * 2,
            alpha: 1
        });
    }
}

// 更新粒子
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.alpha -= 0.02;
        
        if (p.alpha <= 0) particles.splice(i, 1);
    }
}

// 重置目標位置
function resetTarget() {
    target.x = Math.random() * (canvas.width - target.radius * 2) + target.radius;
    target.y = Math.random() * (canvas.height - target.radius * 2) + target.radius;
}

// 檢查碰撞
function checkCollision() {
    const dx = player.x - target.x;
    const dy = player.y - target.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < player.radius + target.radius) {
        score++;
        scoreSound.currentTime = 0;
        scoreSound.play();
        createParticles();
        resetTarget();
        currentEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        encouragementAlpha = 1;
    }
}

// 更新遊戲狀態
function update() {
    // 鍵盤控制
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
    if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
    
    // 邊界檢查
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
    
    checkCollision();
    updateParticles();
    
    // 更新鼓勵文字透明度
    if (encouragementAlpha > 0) {
        encouragementAlpha -= 0.01;
    }
}

// 繪製遊戲畫面
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 繪製目標
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fillStyle = target.color;
    ctx.fill();
    
    // 繪製玩家
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    
    // 繪製粒子
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 0, ${p.alpha})`;
        ctx.fill();
    });
    
    // 繪製得分
    ctx.font = '20px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(`得分: ${score}`, 20, 40);
    
    // 繪製鼓勵文字
    if (encouragementAlpha > 0) {
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = `rgba(255, 68, 68, ${encouragementAlpha})`;
        ctx.textAlign = 'center';
        ctx.fillText(currentEncouragement, canvas.width / 2, canvas.height / 2);
        ctx.textAlign = 'left';
    }
}

// 遊戲循環
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// 初始化音樂
bgm.volume = 0.4;
scoreSound.volume = 0.3;

// 啟動遊戲
document.addEventListener('click', () => {
    if (bgm.paused) {
        bgm.play();
    }
});

gameLoop();