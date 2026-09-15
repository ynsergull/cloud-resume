export function initProjects() {
  const filters = document.querySelector('.project-filters');
  const cards = [...document.querySelectorAll('.project-card')];
  const filterStatus = document.querySelector('[data-filter-status]');
  filters.hidden = false;
  filters.addEventListener('click', (event) => {
    const selected = event.target.closest('[data-filter]');
    if (!selected) return;
    const category = selected.dataset.filter;
    for (const button of filters.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button === selected));
    for (const card of cards) card.hidden = category !== 'all' && card.dataset.category !== category;
    filterStatus.textContent = `${cards.filter((card) => !card.hidden).length} ${filterStatus.dataset.countLabel}`;
  });

  let lastTrigger;
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-project]');
    if (!trigger) return;
    const dialog = document.getElementById(`dialog-${trigger.dataset.project}`);
    if (!dialog) return;
    event.preventDefault();
    lastTrigger = trigger;
    dialog.showModal();
    document.body.classList.add('dialog-open');
    dialog.querySelector('h2').focus();
  });

  for (const dialog of document.querySelectorAll('.project-dialog')) {
    dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
    // Both ends of a pointer action must be outside, so text selection cannot dismiss the dialog.
    let pressedBackdrop = false;
    const isOutside = (event) => {
      const rect = dialog.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    };
    dialog.addEventListener('pointerdown', (event) => { pressedBackdrop = event.target === dialog && isOutside(event); });
    dialog.addEventListener('click', (event) => {
      if (pressedBackdrop && event.target === dialog && isOutside(event)) dialog.close();
      pressedBackdrop = false;
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      lastTrigger?.focus({ preventScroll: true });
    });
  }
}
