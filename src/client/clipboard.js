export function initClipboard() {
  const button = document.querySelector('[data-copy-email]');
  const status = document.querySelector('[data-copy-status]');
  if (!navigator.clipboard?.writeText) return;
  button.hidden = false;
  let reset;
  button.addEventListener('click', async () => {
    clearTimeout(reset);
    try {
      await navigator.clipboard.writeText(button.dataset.copyEmail);
      status.textContent = button.dataset.success;
      button.classList.add('is-copied');
    } catch {
      status.textContent = button.dataset.error;
    }
    reset = setTimeout(() => {
      status.textContent = '';
      button.classList.remove('is-copied');
    }, 4500);
  });
}
