import { escapeHtml as e, icon } from './html.mjs';

export function heroVisual(c) {
  return `<div class="engineering-visual" aria-hidden="true">
    <div class="visual-topline"><span class="tiny-cross">+</span><span>${c.visualLabel}</span><span class="tiny-cross">+</span></div>
    <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
    <div class="visual-headline">${c.visualTitle}<br><span>${c.visualAccent}</span></div>
    <div class="layer-stack">${c.visualLayers.map(([n, label, tech], i) => `<div class="system-layer layer-${i}"><span class="layer-number">${n}</span><span class="layer-text"><strong>${label}</strong><small>${tech}</small></span>${icon(['layout', 'code', 'database'][i])}</div>`).join('')}</div>
    <div class="visual-bottomline"><span class="crosshair">⊕</span><span>${c.visualNote}</span><span class="visual-mark">YE.</span></div>
  </div>`;
}

export function projectVisual(kind, c) {
  const v = c.visual;
  const frame = (label, content) => `<div class="project-visual visual-${kind}" aria-hidden="true"><span class="visual-caption">${label}</span>${content}<span class="visual-corner">+</span></div>`;
  if (kind === 'commerce') return frame(v.commerce, `<div class="commerce-wordmark">kiraladık<span>.com</span></div><div class="commerce-line"></div><div class="commerce-nodes"><span>${icon('check')}${v.payment}</span><span>${icon('globe')}${v.subscription}</span><span>${icon('layout')}${v.invoice}</span></div>`);
  if (kind === 'erp') return frame(v.erp, `<div class="erp-network"><div class="erp-hub">ERP<span>↗</span></div><div class="erp-branches"><span>${v.stock}<i></i></span><span>${v.order}<i></i></span><span>${v.report}<i></i></span></div></div>`);
  if (kind === 'cloud') return frame(v.cloud, `<div class="cloud-orbit"><span class="cloud-satellite">OCI</span><span class="cloud-monogram">ye<span>.</span></span><span class="cloud-satellite cloud-edge">edge</span></div><span class="cloud-domain">yunusergul.com</span>`);
  const heights = [14, 25, 18, 36, 55, 28, 42, 66, 38, 78, 53, 31, 61, 84, 48, 35, 70, 52, 28, 46, 65, 38, 24, 49, 33, 20, 39, 27, 17];
  return frame(v.audio, `<div class="waveform">${heights.map((height, i) => `<i style="--bar-height:${height}px;--bar-delay:${i * 35}ms"></i>`).join('')}</div><div class="audio-labels"><span>${e(v.transcript)}</span><span>→</span><span>${e(v.summary)}</span><span>→</span><span>${e(v.pdf)} ${icon('download')}</span></div>`);
}
