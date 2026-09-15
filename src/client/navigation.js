export function initNavigation() {
  const menu = document.querySelector('#navigation');
  const toggle = document.querySelector('.menu-toggle');
  const mobile = window.matchMedia('(max-width: 760px)');

  const setMenuOpen = (open, restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? toggle.dataset.closeLabel : toggle.dataset.openLabel);
    menu.classList.toggle('is-open', open);
    if (restoreFocus) toggle.focus();
  };

  toggle.hidden = false;
  menu.classList.add('is-enhanced');
  toggle.addEventListener('click', () => setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenuOpen(false, true);
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) setMenuOpen(false);
  });
  document.addEventListener('focusin', (event) => {
    if (!event.target.closest('.site-header')) setMenuOpen(false);
  });
  mobile.addEventListener('change', () => setMenuOpen(false));

  const languageLink = document.querySelector('[data-language-link]');
  const languagePath = languageLink.getAttribute('href');
  const updateLanguageLink = () => { languageLink.href = `${languagePath}${location.hash}`; };
  updateLanguageLink();
  window.addEventListener('hashchange', updateLanguageLink);

  const links = [...menu.querySelectorAll('a[href^="#"]')];
  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  let scheduled = false;
  const updateActiveSection = () => {
    const active = sections.filter((section) => section.getBoundingClientRect().top <= 180).at(-1);
    for (const link of links) {
      if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateActiveSection);
    }
  }, { passive: true });
  updateActiveSection();
}
