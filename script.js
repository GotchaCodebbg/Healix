// Customization Engine
function applyCustomization() {
    const custom = JSON.parse(localStorage.getItem('kenko_customization') || '{}');
    if (custom.accentColor) {
        document.documentElement.style.setProperty('--accent-color', custom.accentColor);
    }
    if (custom.compactView === 'true') {
        document.body.classList.add('compact-view');
    } else {
        document.body.classList.remove('compact-view');
    }

    // Profile Sync
    const profile = JSON.parse(localStorage.getItem('kenko_profile') || '{}');
    if (profile.profName) {
        const profileNames = document.querySelectorAll('.truncate');
        profileNames.forEach(el => {
            if (el.textContent === 'Admin User' || el.classList.contains('user-name-sync')) {
                el.textContent = profile.profName;
                el.classList.add('user-name-sync');
            }
        });
    }

    // Dropdown Click Toggle for Accessibility
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', () => profileDropdown.classList.add('hidden'));
        profileDropdown.addEventListener('click', (e) => e.stopPropagation());
    }
}
applyCustomization();

// Scroll Progress Bar
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = `${totalScroll / windowHeight * 100}%`;
        scrollProgress.style.width = scroll;
    });
}

// Theme Logic
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeToggleMobile = document.getElementById('darkModeToggleMobile');
const html = document.documentElement;

function toggleDarkMode() {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    if (darkModeToggle) darkModeToggle.innerText = isDark ? '☀️' : '🌙';
    if (darkModeToggleMobile) {
        const span = darkModeToggleMobile.querySelector('span');
        if (span) span.innerText = isDark ? '☀️' : '🌙';
    }
}

if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);
if (darkModeToggleMobile) darkModeToggleMobile.addEventListener('click', toggleDarkMode);


// Login Logic (only on index.html)
const loginOverlay = document.getElementById('loginOverlay');
const mainContent = document.getElementById('mainContent');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

if (loginForm && loginOverlay && mainContent) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;

        // Secure Login Check
        if (email === 'admin@kenkoai.com' && password === 'kenko2026') {
            loginOverlay.style.display = 'none';
            mainContent.classList.remove('hidden');
            if (loginError) loginError.classList.add('hidden');
            localStorage.setItem('kenko_auth', 'true');
        } else {
            if (loginError) {
                loginError.innerText = 'Invalid credentials. Use admin@kenkoai.com / kenko2026';
                loginError.classList.remove('hidden');
            }
        }
    });

    window.addEventListener('DOMContentLoaded', () => {
        // Use early check result or re-check
        const auth = localStorage.getItem('kenko_auth') === 'true';
        if (auth) {
            loginOverlay.style.display = 'none';
            mainContent.classList.remove('hidden');
        } else {
            mainContent.classList.add('hidden');
            loginOverlay.style.display = 'flex';
        }
    });

    // Logout Functionality (using class to support multiple buttons)
    document.querySelectorAll('.logout-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('kenko_auth');
            window.location.reload();
        });
    });
}

// Burger Menu Logic
const burgerBtn = document.getElementById('burgerBtn');
const burgerClose = document.getElementById('burgerClose');
const burgerMenu = document.getElementById('burgerMenu');
const burgerOverlay = document.getElementById('burgerOverlay');

function openBurger() {
    if (burgerMenu) burgerMenu.classList.add('open');
    if (burgerOverlay) burgerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBurger() {
    if (burgerMenu) burgerMenu.classList.remove('open');
    if (burgerOverlay) burgerOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (burgerBtn) burgerBtn.addEventListener('click', openBurger);
if (burgerClose) burgerClose.addEventListener('click', closeBurger);
if (burgerOverlay) burgerOverlay.addEventListener('click', closeBurger);

document.querySelectorAll('.burger-link').forEach(link => {
    link.addEventListener('click', closeBurger);
});

// Specialty Chips Filter
document.querySelectorAll('.consult-specialty-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('.consult-specialty-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const spec = chip.dataset.spec;
        const specialtyMap = { general: ['general physician'], cardio: ['cardiologist'], pulmo: ['pulmonologist'], neuro: ['neurologist'], ortho: ['orthopedics'], derma: ['dermatology'] };
        document.querySelectorAll('.consult-doctor-card').forEach(card => {
            const specialty = card.querySelector('.consult-doctor-info p').textContent.toLowerCase();
            const matchSpecs = specialtyMap[spec] || [];
            card.style.display = matchSpecs.some(s => specialty.includes(s)) ? '' : 'none';
        });
    });
    chip.addEventListener('dblclick', () => {
        document.querySelectorAll('.consult-specialty-chip').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.consult-doctor-card').forEach(card => { card.style.display = ''; });
    });
});

// Reports Logic (only on index.html)
const reportForm = document.getElementById('reportForm');
const reportsList = document.getElementById('reportsList');
const analysisSection = document.getElementById('analysisSection');
let reports = [];

if (reportForm && reportsList && analysisSection) {
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('reportTitle').value.trim();
        const data = document.getElementById('reportData').value.trim();
        if (title && data) {
            reports.push({ title, data });
            renderReports();
            reportForm.reset();
        }
    });
}

function renderReports() {
    if (!reportsList || !analysisSection) return;
    reportsList.innerHTML = '';
    if (reports.length === 0) { analysisSection.textContent = 'No reports yet.'; return; }
    reports.forEach((r, i) => {
        const div = document.createElement('div');
        div.className = 'bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex justify-between items-center';
        div.innerHTML = `<div><span class="font-bold">${r.title}</span><br/><span class="text-slate-500 text-xs">${r.data}</span></div><button class="text-red-500 font-bold" onclick="removeReport(${i})">Delete</button>`;
        reportsList.appendChild(div);
    });
    updateAnalysis();
}

window.removeReport = function(idx) { reports.splice(idx, 1); renderReports(); }

function updateAnalysis() {
    if (!analysisSection) return;
    if (reports.length === 0) { analysisSection.textContent = 'No reports yet.'; return; }
    let summary = `<div class="mb-2">Total Reports: <span class="font-bold">${reports.length}</span></div>`;
    reports.forEach(r => {
        if (/bp|blood pressure/i.test(r.data)) summary += `<div class="text-blue-600 font-bold">BP Data: ${r.data}</div>`;
        if (/hr|heart rate/i.test(r.data)) summary += `<div class="text-blue-600 font-bold">Heart Rate: ${r.data}</div>`;
        if (/temp|temperature/i.test(r.data)) summary += `<div class="text-blue-600 font-bold">Temperature: ${r.data}</div>`;
    });
    analysisSection.innerHTML = summary;
}

// Mouse Parallax Effect
document.addEventListener('mousemove', (e) => {
    const amount = 15;
    const x = (e.clientX / window.innerWidth - 0.5) * amount;
    const y = (e.clientY / window.innerHeight - 0.5) * amount;
    document.querySelectorAll('.parallax-element').forEach(el => {
        el.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Scroll Reveal & Data Bar Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.querySelectorAll('.data-bar').forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

// Export toggleDarkMode for use in profile.html
window.toggleDarkMode = toggleDarkMode;