// ===== Code Rain Background =====
const canvas = document.getElementById('code-rain');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const codeChars = '{}[]()<>;:=/\\|!@#$%^&*~`+-_.,"\'0123456789abcdefABCDEF'.split('');
const fontSize = 14;
const columns = Math.floor(window.innerWidth / (fontSize * 1.5));
const drops = Array.from({ length: columns }, () => Math.random() * -100);

function drawCodeRain() {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

    drops.forEach((y, i) => {
        const char = codeChars[Math.floor(Math.random() * codeChars.length)];
        const x = i * fontSize * 1.5;

        // Alternate between cyan and purple tints
        ctx.fillStyle = i % 3 === 0
            ? 'rgba(0, 240, 255, 0.6)'
            : 'rgba(168, 85, 247, 0.4)';

        ctx.fillText(char, x, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.985) {
            drops[i] = 0;
        }
        drops[i] += 0.4 + Math.random() * 0.3;
    });

    requestAnimationFrame(drawCodeRain);
}
drawCodeRain();

// ===== Typing Terminal Effect =====
const codeSnippet = [
    { line: 1, tokens: [
        { text: 'const ', cls: 'syn-keyword' },
        { text: 'app', cls: 'syn-func' },
        { text: ' = ', cls: 'syn-punct' },
        { text: 'await ', cls: 'syn-keyword' },
        { text: 'build', cls: 'syn-func' },
        { text: '({', cls: 'syn-punct' },
    ]},
    { line: 2, tokens: [
        { text: '  idea', cls: '' },
        { text: ':', cls: 'syn-punct' },
        { text: ' "your next big thing"', cls: 'syn-string' },
        { text: ',', cls: 'syn-punct' },
    ]},
    { line: 3, tokens: [
        { text: '  ai', cls: '' },
        { text: ':', cls: 'syn-punct' },
        { text: ' true', cls: 'syn-number' },
        { text: ',', cls: 'syn-punct' },
    ]},
    { line: 4, tokens: [
        { text: '  speed', cls: '' },
        { text: ':', cls: 'syn-punct' },
        { text: ' "lightning"', cls: 'syn-string' },
        { text: ',', cls: 'syn-punct' },
    ]},
    { line: 5, tokens: [
        { text: '  deploy', cls: '' },
        { text: ':', cls: 'syn-punct' },
        { text: ' "production"', cls: 'syn-string' },
    ]},
    { line: 6, tokens: [
        { text: '});', cls: 'syn-punct' },
    ]},
    { line: 7, tokens: [] },
    { line: 8, tokens: [
        { text: '// shipping in 3... 2... 1...', cls: 'syn-comment' },
    ]},
    { line: 9, tokens: [
        { text: 'console', cls: 'syn-func' },
        { text: '.', cls: 'syn-punct' },
        { text: 'log', cls: 'syn-func' },
        { text: '(', cls: 'syn-punct' },
        { text: '"', cls: 'syn-string' },
        { text: '🚀 App deployed!', cls: 'syn-string' },
        { text: '"', cls: 'syn-string' },
        { text: ');', cls: 'syn-punct' },
    ]},
];

const typedCode = document.getElementById('typed-code');
let currentLine = 0;
let currentToken = 0;
let currentChar = 0;
let output = '';

function getLineNumSpan(num) {
    return `<span class="syn-line-num">${String(num).padStart(2, ' ')}</span>`;
}

function typeCode() {
    if (currentLine >= codeSnippet.length) {
        // Restart after a pause
        setTimeout(() => {
            currentLine = 0;
            currentToken = 0;
            currentChar = 0;
            output = '';
            typeCode();
        }, 4000);
        return;
    }

    const line = codeSnippet[currentLine];

    // Start of a new line
    if (currentToken === 0 && currentChar === 0) {
        if (currentLine > 0) output += '\n';
        output += getLineNumSpan(line.line);
    }

    // Empty line
    if (line.tokens.length === 0) {
        typedCode.innerHTML = output;
        currentLine++;
        currentToken = 0;
        currentChar = 0;
        setTimeout(typeCode, 80);
        return;
    }

    const token = line.tokens[currentToken];
    if (!token) {
        currentLine++;
        currentToken = 0;
        currentChar = 0;
        setTimeout(typeCode, 60 + Math.random() * 80);
        return;
    }

    // Type one character at a time
    currentChar++;
    const partial = token.text.substring(0, currentChar);
    const fullTokensBefore = line.tokens.slice(0, currentToken)
        .map(t => t.cls ? `<span class="${t.cls}">${t.text}</span>` : t.text)
        .join('');
    const currentPartial = token.cls
        ? `<span class="${token.cls}">${partial}</span>`
        : partial;

    // Build the current display
    const previousLines = output;
    // Remove the current line's line number and rebuild
    const lastNewline = previousLines.lastIndexOf('\n');
    const base = currentLine === 0 && currentToken === 0 && currentChar === 1
        ? ''
        : previousLines;

    // Simpler approach: rebuild just the display
    let display = '';
    for (let i = 0; i < currentLine; i++) {
        if (i > 0) display += '\n';
        display += getLineNumSpan(codeSnippet[i].line);
        display += codeSnippet[i].tokens
            .map(t => t.cls ? `<span class="${t.cls}">${t.text}</span>` : t.text)
            .join('');
    }
    if (currentLine > 0) display += '\n';
    display += getLineNumSpan(line.line) + fullTokensBefore + currentPartial;

    typedCode.innerHTML = display;

    if (currentChar >= token.text.length) {
        // Update output with completed token
        output = display;
        currentToken++;
        currentChar = 0;
    }

    const speed = 25 + Math.random() * 35;
    setTimeout(typeCode, speed);
}

// Start typing after a short delay
setTimeout(typeCode, 800);

// ===== Nav scroll effect =====
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile menu toggle =====
const menuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Animate stat numbers on scroll =====
const stats = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;
    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
        statsAnimated = true;
        stats.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const suffix = stat.dataset.suffix || '';
            let current = 0;
            const step = Math.max(1, Math.floor(target / 30));
            const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                stat.textContent = current + suffix;
            }, 40);
        });
    }
}

window.addEventListener('scroll', animateStats);
animateStats();

// ===== Scroll-triggered fade-in =====
const fadeElements = document.querySelectorAll(
    '.project-card, .process-card, .section-header, .cta-block, .tech-strip'
);

fadeElements.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

fadeElements.forEach(el => observer.observe(el));
