export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

export function tags(items) {
  return `<ul class="tags">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

export function sectionHeading(kicker, title, description = '') {
  return `<div class="section-heading"><p class="eyebrow">${escapeHtml(kicker)}</p><h2>${escapeHtml(title)}</h2>${description ? `<p class="section-intro">${escapeHtml(description)}</p>` : ''}</div>`;
}

const paths = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  external: '<path d="M6 18 18 6M6 6h12v12"/>',
  down: '<path d="M12 4v16m-6-6 6 6 6-6"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-16-2 20"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  layout: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 9v12"/>',
  check: '<path d="m5 12 4 4L19 6"/><path d="M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  github: '<path d="M9 19c-5 1-5-3-7-3m14 6v-4c0-1-.3-2-1-2.5 3-.3 6-1.5 6-6A5 5 0 0 0 20 6a5 5 0 0 0-.1-4s-1-.3-4 1.5a13 13 0 0 0-7 0C6 1.7 5 2 5 2a5 5 0 0 0-.1 4A5 5 0 0 0 3.5 9.5c0 4.5 3 5.7 6 6-.7.5-1 1.5-1 2.5v4"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 10v7m0-11v.1M11 17v-7m0 3c0-4 6-4 6 0v4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  award: '<circle cx="12" cy="8" r="5"/><path d="m8 12-2 9 6-3 6 3-2-9"/>',
};

export function icon(name, className = '') {
  return `<svg class="icon ${className}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
}
