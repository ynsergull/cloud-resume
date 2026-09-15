import { copy } from '../data/copy.mjs';
import { profile, experience, skillGroups } from '../data/profile.mjs';
import { projects } from '../data/projects.mjs';
import { escapeHtml as e, icon, tags, sectionHeading } from './html.mjs';
import { heroVisual, projectVisual } from './visuals.mjs';

function navigation(c, language) {
  const otherLanguage = language === 'tr' ? 'en' : 'tr';
  const otherPath = language === 'tr' ? '/en/' : '/';
  return `<header class="site-header"><div class="container header-inner">
    <a class="wordmark" href="#top" aria-label="Yunus Ergül">yunus<span>ergül.</span><span class="brand-dot"></span></a>
    <nav id="navigation" class="navigation" aria-label="${c.navigation}">
      ${c.nav.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('')}
      <a class="mobile-contact" href="#contact">${c.contactLink}</a>
    </nav>
    <div class="header-actions"><a class="language-link" href="${otherPath}" lang="${otherLanguage}" hreflang="${otherLanguage}" aria-label="${c.otherLanguage}" data-language-link>${otherLanguage.toUpperCase()}</a>
      <a class="header-contact" href="#contact">${c.contactLink}${icon('external')}</a>
      <button class="menu-toggle" type="button" aria-controls="navigation" aria-expanded="false" aria-label="${c.menu}" data-open-label="${c.menu}" data-close-label="${c.closeMenu}" hidden><span></span><span></span></button>
    </div>
  </div></header>`;
}

function hero(c) {
  return `<section class="hero container" aria-labelledby="hero-title">
    <div class="hero-main"><div class="hero-copy">
      <p class="eyebrow hero-eyebrow"><span class="status-dot"></span>${c.heroEyebrow}</p>
      <h1 id="hero-title">${c.heroLine}<br><span>${c.heroAccent}</span></h1>
      <p class="hero-description"><strong>${c.heroIntro}</strong> ${c.heroDescription}</p>
      <div class="hero-actions"><a class="button button-primary" href="#projects">${c.viewProjects}${icon('arrow')}</a><a class="button button-text" href="${profile.resume}" download>${c.download}${icon('download')}</a></div>
      <div class="current-work"><span class="current-work-marker"></span><div><span class="eyebrow">${c.currentLabel}</span><p>${c.currentName}</p><small>${c.currentCompany}</small></div></div>
    </div>${heroVisual(c)}</div>
    <div class="hero-bottom"><span>${icon('pin')}${c.location}</span><div class="social-links"><a href="${profile.github}" target="_blank" rel="noopener noreferrer">GitHub ${icon('external')}</a><a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ${icon('external')}</a></div><a href="#about" class="scroll-link">${c.scroll}${icon('down')}</a></div>
  </section>`;
}

function about(c) {
  return `<section id="about" class="section about-section container">
    ${sectionHeading(c.aboutKicker, c.aboutTitle)}
    <div class="about-grid"><div class="about-copy"><p class="about-lead">${c.aboutLead}</p><p>${c.aboutBody}</p><p>${c.aboutFoot}</p></div><dl class="facts">${c.facts.map(([label, value]) => `<div><dt class="eyebrow">${label}</dt><dd>${value}</dd></div>`).join('')}</dl></div>
  </section>`;
}

function experienceSection(c, language) {
  return `<section id="experience" class="section experience-section container">
    ${sectionHeading(c.experienceKicker, c.experienceTitle, c.experienceIntro)}
    <div class="timeline">${experience.map((item) => `<article class="experience-item ${item.current ? 'is-current' : ''}">
      <div class="experience-meta"><span class="timeline-dot"></span><p class="experience-period">${e(item.period[language])}</p>${item.current ? `<span class="current-badge"><span></span>${c.current}</span>` : ''}</div>
      <div class="experience-content"><div class="experience-title"><div><h3>${e(item.company)}</h3><p class="role">${e(item.role[language])}</p></div><span class="experience-index">${item.current ? '↗' : '↳'}</span></div>
      <p>${e(item.summary[language])}</p>${tags(item.stack)}
      ${item.highlights ? `<details class="experience-details" ${item.current ? 'open' : ''}><summary><span class="when-closed">${c.details}</span><span class="when-open">${c.less}</span>${icon('plus')}</summary><ul>${item.highlights[language].map((text) => `<li>${e(text)}</li>`).join('')}</ul></details>` : ''}
      </div></article>`).join('')}</div>
  </section>`;
}

function projectDialog(project, c, language) {
  return `<dialog id="dialog-${project.id}" class="project-dialog" aria-labelledby="dialog-title-${project.id}"><div class="dialog-inner">
    <button class="dialog-close icon-button" type="button" aria-label="${c.close}" data-close-dialog>${icon('close')}</button>
    <p class="eyebrow">${e(project.type[language])}</p><h2 id="dialog-title-${project.id}" tabindex="-1">${e(project.title[language])}</h2>
    <p class="dialog-lead">${e(project.description[language])}</p>${tags(project.stack)}
    <div class="dialog-sections">${project.sections[language].map(([heading, description]) => `<section><h3>${e(heading)}</h3><p>${e(description)}</p></section>`).join('')}</div>
    ${project.link ? `<a class="button button-primary" href="${project.link}" target="_blank" rel="noopener noreferrer">${c.source}${icon('github')}</a>` : project.category === 'work' ? `<p class="source-note">${c.privateSource}</p>` : ''}
  </div></dialog>`;
}

function projectsSection(c, language) {
  return `<section id="projects" class="section projects-section"><div class="container">
    ${sectionHeading(c.projectsKicker, c.projectsTitle, c.projectsIntro)}
    <div class="project-toolbar"><div class="project-filters" role="group" aria-label="${c.filterLabel}" hidden>${c.filters.map(([value, label]) => `<button type="button" data-filter="${value}" aria-pressed="${value === 'all'}">${label}<span>${value === 'all' ? '04' : '02'}</span></button>`).join('')}</div><span class="project-total">SELECTED WORK / 01—04</span></div>
    <p class="sr-only" role="status" data-filter-status data-count-label="${c.projectCount}"></p>
    <div class="project-grid">${projects.map((project) => `<article class="project-card" data-category="${project.category}">
      <a class="project-preview-link" href="#dialog-${project.id}" data-project="${project.id}" tabindex="-1" aria-hidden="true">${projectVisual(project.visual, c)}</a>
      <div class="project-body"><p class="project-type"><span>${project.number}</span>${e(project.type[language])}</p><h3><a href="#dialog-${project.id}" data-project="${project.id}">${e(project.title[language])}${icon('external')}</a></h3><p class="project-description">${e(project.description[language])}</p>${tags(project.stack)}<a class="project-detail-link" href="#dialog-${project.id}" data-project="${project.id}">${c.projectDetails}${icon('arrow')}</a></div>
    </article>`).join('')}</div>
    <noscript><p class="source-note">${language === 'tr' ? 'Etkileşimli proje detayları için JavaScript’i etkinleştirebilir veya aşağıdan CV’yi indirebilirsin.' : 'Enable JavaScript for interactive project details, or download the résumé below.'} <a href="${profile.resume}" download>${c.download}</a></p></noscript>
    ${projects.map((project) => projectDialog(project, c, language)).join('')}
  </div></section>`;
}

function skillsSection(c, language) {
  return `<section id="skills" class="section container">${sectionHeading(c.skillsKicker, c.skillsTitle, c.skillsIntro)}
    <div class="skills-grid">${skillGroups.map((group) => `<article class="skill-group"><div class="skill-icon">${icon(group.icon)}</div><h3>${e(group.title[language])}</h3>${tags(group.items)}</article>`).join('')}</div>
    <p class="working-practices">${icon('code')}<span>${c.practice}</span></p>
  </section>`;
}

function educationSection(c) {
  return `<section id="education" class="section education-section container">${sectionHeading(c.educationKicker, c.educationTitle)}
    <div class="education-grid"><article class="education-card"><p class="eyebrow">${c.educationLabel}</p>${icon('layout')}<h3>${c.university}</h3><p>${c.degree}</p><small>${c.educationLanguage}</small></article>
    <article class="education-card certificate-card"><p class="eyebrow">${c.certLabel}</p>${icon('award')}<h3>${c.certTitle}</h3><p>${c.certSubtitle}</p><a href="${profile.certificate}" target="_blank" rel="noopener noreferrer">${c.verify}${icon('external')}</a></article></div>
    <div class="international"><p class="eyebrow">${c.internationalLabel}</p><div class="international-grid">${c.international.map((item) => `<article><div><h3>${item.title}</h3><small>${item.period}</small></div><p>${item.description}</p></article>`).join('')}</div></div>
  </section>`;
}

function contact(c) {
  return `<section id="contact" class="contact-section"><div class="container contact-inner"><div class="contact-top"><p class="eyebrow"><span class="status-dot"></span>${c.contactKicker}</p><span class="contact-symbol" aria-hidden="true">↗</span></div>
    <h2>${c.contactTitle}<br><span>${c.contactAccent}</span></h2><p class="contact-description">${c.contactDescription}</p>
    <div class="email-row"><a class="email-link" href="mailto:${profile.email}">${profile.email}</a><button class="icon-button copy-email" type="button" data-copy-email="${profile.email}" data-success="${c.copied}" data-error="${c.copyError}" aria-label="${c.copyEmail}" hidden>${icon('copy')}</button></div>
    <p class="copy-status" role="status" data-copy-status></p><div class="contact-bottom"><div class="social-links"><a href="${profile.github}" target="_blank" rel="noopener noreferrer">GitHub${icon('external')}</a><a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn${icon('external')}</a></div><a class="resume-link" href="${profile.resume}" download>${c.download}<span>${c.cvLabel}</span>${icon('download')}</a></div>
  </div></section>`;
}

export function renderPage(language) {
  const c = copy[language];
  if (!c) throw new Error(`Unsupported language: ${language}`);
  const url = `https://www.yunusergul.com${language === 'tr' ? '/' : '/en/'}`;
  return `<!doctype html>
<html lang="${language}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(c.title)}</title><meta name="description" content="${e(c.description)}"><meta name="theme-color" content="#141615">
  <link rel="canonical" href="${url}"><link rel="alternate" hreflang="tr" href="https://www.yunusergul.com/"><link rel="alternate" hreflang="en" href="https://www.yunusergul.com/en/"><link rel="alternate" hreflang="x-default" href="https://www.yunusergul.com/">
  <meta property="og:type" content="website"><meta property="og:title" content="${e(c.title)}"><meta property="og:description" content="${e(c.description)}"><meta property="og:url" content="${url}"><meta property="og:locale" content="${c.locale}"><meta property="og:site_name" content="Yunus Ergül"><meta name="twitter:card" content="summary">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/css/style.css">
  <script type="module" src="/js/app.js"></script>
</head>
<body id="top">
  <a class="skip-link" href="#main">${c.skip}</a>
  ${navigation(c, language)}
  <main id="main">${hero(c)}${about(c)}${experienceSection(c, language)}${projectsSection(c, language)}${skillsSection(c, language)}${educationSection(c)}${contact(c)}</main>
  <footer class="site-footer container"><a class="footer-name" href="#top">Yunus Ergül<span>© ${new Date().getUTCFullYear()}</span></a><p>${c.footer}</p><a href="#top">${c.backTop}${icon('arrow')}</a></footer>
</body>
</html>`;
}
