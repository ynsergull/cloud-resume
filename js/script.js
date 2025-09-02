// Language switcher functionality
let currentLang = localStorage.getItem('language') || 'tr';

function updateContent(lang) {
    document.documentElement.lang = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
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
    if (!trBtn || !enBtn) return;
    
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
const API_GATEWAY_BASE = "https://alxca7khnm6i2oynvdlggw56u4.apigateway.eu-frankfurt-1.oci.customer-oci.com";
const COUNTER_PATHS = ['views', 'counter'];

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
    return 'v-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

async function incrementVisitorCount() {
  try {
    const el = document.getElementById('visitor-count');
    const uniqueEl = document.getElementById('unique-count');
    const vid = getVisitorId();
    if (!el) { console.warn('visitor-count element not found'); return null; }

    let lastErr = null;
    for (const p of COUNTER_PATHS) {
      const url = `${API_GATEWAY_BASE}/${p}?vid=${encodeURIComponent(vid)}`;
      try {
        console.debug('[counter] GET', url);
        const response = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' });
        if (!response.ok) { lastErr = new Error(`HTTP ${response.status}`); continue; }
        const data = await response.json();

        if (typeof data.count !== 'undefined') el.textContent = data.count;
        if (uniqueEl && typeof data.unique !== 'undefined') uniqueEl.textContent = data.unique;

        console.log('Visitor count:', data);
        return data;
      } catch (e) {
        lastErr = e;
        continue;
      }
    }
    throw lastErr || new Error('All counter paths failed');
  } catch (error) {
    console.error('Error incrementing/fetching visitor count:', error);
    return null;
  }
}

// Project Modal Functionality
const projectModal = {
  init: function() {
    this.cacheDom();
    this.bindEvents();
  },
  
  cacheDom: function() {
    this.modal = document.getElementById('project-modal');
    this.closeBtn = document.getElementById('modal-close');
    this.title = document.getElementById('modal-title');
    this.content = document.getElementById('modal-content');
    this.skills = document.getElementById('modal-skills');
    this.details = document.getElementById('modal-details');
    this.githubSection = document.getElementById('github-section');
    this.githubBtn = document.getElementById('modal-github-btn');
  },
  
  bindEvents: function() {
    this.closeBtn.addEventListener('click', this.hideModal.bind(this));
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hideModal();
    });
    
    // Escape tuşu ile kapatma
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('show')) {
        this.hideModal();
      }
    });
  },
  
  showModal: function(projectId) {
    const projectData = projectsData[projectId];
    if (!projectData) return;
    
    // Mevcut dil için içeriği al
    const lang = currentLang;
    
    // Modal içeriğini doldur
    this.title.textContent = projectData.title[lang] || projectData.title['en'];
    this.content.innerHTML = `<p>${projectData.description[lang] || projectData.description['en']}</p>`;
    
    // Yetenekleri temizle ve yeniden doldur
    this.skills.innerHTML = '';
    projectData.skills.forEach(skill => {
      const skillBadge = document.createElement('span');
      skillBadge.className = 'skill-badge px-3 py-1 rounded-full text-sm';
      skillBadge.textContent = skill;
      this.skills.appendChild(skillBadge);
    });
    
    // Ek detayları doldur
    this.details.innerHTML = projectData.details[lang] || projectData.details['en'] || '';
    
    // GitHub linkini ayarla (eğer varsa)
    if (projectData.link && projectData.link !== '#') {
      this.githubBtn.href = projectData.link;
      this.githubSection.style.display = 'block';
    } else {
      this.githubSection.style.display = 'none';
    }
    
    // Modalı göster
    this.modal.style.display = 'flex';
    setTimeout(() => {
      this.modal.classList.add('show');
    }, 10);
    document.body.style.overflow = 'hidden';
  },
  
  hideModal: function() {
    this.modal.classList.remove('show');
    setTimeout(() => {
      this.modal.style.display = 'none';
    }, 300);
    document.body.style.overflow = '';
  }
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  // Initialize language
  try {
    if (typeof translations !== 'undefined') {
      updateContent(currentLang);
    }
  } catch (e) {
    console.error('Error during initial updateContent:', e);
  }

  // Increment visitor count
  incrementVisitorCount();
  
  // Initialize modal
  projectModal.init();
  
  // Tüm proje kartlarına tıklama olayı ekle
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    // Proje başlığını al ve ID oluştur
    const projectTitleElement = card.querySelector('h3');
    if (!projectTitleElement) return;
    
    const projectTitle = projectTitleElement.textContent.trim().toLowerCase().replace(/\s+/g, '-');
    
    // Eğer bu proje için modal verisi varsa
    if (projectsData[projectTitle]) {
      card.style.cursor = 'pointer';
      
      card.addEventListener('click', (e) => {
        // Eğer tıklanan element bir link değilse modalı aç
        if (e.target.tagName !== 'A' && !e.target.closest('a')) {
          projectModal.showModal(projectTitle);
        }
      });
    }
    
    // Proje kartı içindeki linklere tıklandığında modal yerine orijinal linke gitmesini sağla
    const links = card.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        // Eğer link href'i '#' ise, varsayılan davranışı engelle
        if (link.getAttribute('href') === '#') {
          e.preventDefault();
        }
      });
    });
  });

  // Mobile menu functionality
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      
      if (isOpen) {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        menuToggle.innerHTML = '<i class="fa-solid fa-bars text-2xl"></i>';
      } else {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
        menuToggle.innerHTML = '<i class="fa-solid fa-xmark text-2xl"></i>';
      }
    });

    // Close menu when clicking on links
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        menuToggle.innerHTML = '<i class="fa-solid fa-bars text-2xl"></i>';
      });
    });
  }

  // Close mobile menu when clicking on horizontal nav links
  document.querySelectorAll('.horizontal-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        if (menuToggle) {
          menuToggle.innerHTML = '<i class="fa-solid fa-bars text-2xl"></i>';
        }
      }
    });
  });

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
});