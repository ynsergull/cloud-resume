// Language switcher functionality
let currentLang = localStorage.getItem('language') || 'tr';

function updateContent(lang) {
    document.documentElement.lang = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        // translations may be defined in a separate file; guard access
        const translation = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang][key] : null;
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
    if (!trBtn || !enBtn) return; // guard
    
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
    try {
        updateContent(lang);
    } catch (e) {
        console.error('Error updating translations:', e);
    }
}

// Visitor counter functionality
// Oracle API Gateway base (change here if gateway URL changes)
const API_GATEWAY_BASE = "https://alxca7khnm6i2oynvdlggw56u4.apigateway.eu-frankfurt-1.oci.customer-oci.com";

// Generate/store a per-browser UUID to count uniques by browser (privacy-friendly)
function getVisitorId() {
  try {
    const key = 'visitorId';
    let id = localStorage.getItem(key);
    if (!id) {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        id = crypto.randomUUID();
      } else {
        id = 'v-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      }
      localStorage.setItem(key, id);
    }
    return id;
  } catch (e) {
    // localStorage might be unavailable (privacy mode); fallback to per-load id
    return 'v-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}
async function incrementVisitorCount() {
  try {
  const el = document.getElementById('visitor-count');
  const uniqueEl = document.getElementById('unique-count');
  const vid = getVisitorId();
  const url = `${API_GATEWAY_BASE}/counter?vid=${encodeURIComponent(vid)}`;
  if (!el) { console.warn('visitor-count element not found'); return null; }
  const response = await fetch(url, { method: "GET", mode: 'cors', cache: 'no-store' });
    if (!response.ok) {
      console.warn('Counter fetch returned non-OK status', response.status);
      return null;
    }
    const data = await response.json();
    if (el && data && typeof data.count !== 'undefined') {
      el.textContent = data.count;
    }
    if (uniqueEl && data && typeof data.unique !== 'undefined') {
      uniqueEl.textContent = data.unique;
    }
    console.log('Visitor count:', data);
    return data;
  } catch (error) {
    console.error('Error incrementing/fetching visitor count:', error);
    return null;
  }
}

// Initialize language and counter safely
document.addEventListener('DOMContentLoaded', () => {
    // update content if translations exist; protect against missing translations file
    try {
        if (typeof translations !== 'undefined') {
            updateContent(currentLang);
            const langTextEl = document.getElementById('lang-text');
            if (langTextEl) langTextEl.textContent = currentLang.toUpperCase();
        } else {
            // translations not loaded; still set language label if present
            const langTextEl = document.getElementById('lang-text');
            if (langTextEl) langTextEl.textContent = currentLang.toUpperCase();
        }
    } catch (e) {
        console.error('Error during initial updateContent:', e);
    }

  // Increment once on page load
  incrementVisitorCount();
});

// Mobile menu toggle - guard elements exist
const menuToggle = document.getElementById('menu-toggle');
const closeMenu = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle && closeMenu && mobileMenu) {
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
}

// Visitor counter element reference (may be null if not present)
const visitorCount = document.getElementById('visitor-count');

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
    if (link.getAttribute('href') && link.getAttribute('href').substring(1) === current) {
      link.classList.add('active-nav');
    }
  });
});