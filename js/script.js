// Language switcher functionality
let currentLang = localStorage.getItem('language') || 'tr';

function updateContent(lang) {
    document.documentElement.lang = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = translations[lang][key];
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
    updateLanguageButtons(lang);
}

function updateLanguageButtons(lang) {
    const trBtn = document.getElementById('tr-btn');
    const enBtn = document.getElementById('en-btn');
    
    if (lang === 'tr') {
        trBtn.classList.add('bg-accent', 'text-light-text');
        trBtn.classList.remove('text-accent');
        enBtn.classList.remove('bg-accent', 'text-light-text');
        enBtn.classList.add('text-accent');
    } else {
        enBtn.classList.add('bg-accent', 'text-light-text');
        enBtn.classList.remove('text-accent');
        trBtn.classList.remove('bg-accent', 'text-light-text');
        trBtn.classList.add('text-accent');
    }
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    updateContent(lang);
}

// Initialize language
document.addEventListener('DOMContentLoaded', () => {
    updateContent(currentLang);
    document.getElementById('lang-text').textContent = currentLang.toUpperCase();
});

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const closeMenu = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});

closeMenu.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
});

// Close menu when clicking on links
const mobileLinks = document.querySelectorAll('#mobile-menu a');
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Visitor counter simulation
const visitorCount = document.getElementById('visitor-count');
let count = 1284;

// Simulate visitor count increasing
setInterval(() => {
  count++;
  visitorCount.textContent = count;
}, 10000);

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (pageYOffset >= (sectionTop - 300)) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active-nav');
    if (link.getAttribute('href').substring(1) === current) {
      link.classList.add('active-nav');
    }
  });
});
