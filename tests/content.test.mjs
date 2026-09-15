import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { locales, copy } from '../src/data/copy.mjs';
import { experience } from '../src/data/profile.mjs';
import { projects } from '../src/data/projects.mjs';
import { renderPage } from '../src/components/page.mjs';

test('both languages provide the same editable content fields', () => {
  assert.deepEqual(Object.keys(copy.tr).sort(), Object.keys(copy.en).sort());
  for (const project of projects) {
    for (const language of locales) {
      assert.ok(project.title[language]);
      assert.ok(project.description[language]);
      assert.ok(project.sections[language].length >= 3);
    }
  }
});

test('current role and previous employment match the supplied CV', () => {
  assert.equal(experience.filter((item) => item.current).length, 1);
  assert.equal(experience.find((item) => item.current).company, 'Fonksiyonel Holding');
  assert.equal(experience.find((item) => item.id === 'delta').period.en, 'Jul 2024 — Apr 2026');
});

test('generated HTML has unique anchors, content and no active OCI integration', () => {
  for (const language of locales) {
    const html = renderPage(language);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Missing anchor ${match[1]}`);
    assert.match(html, /Fonksiyonel Holding/);
    assert.match(html, /English C1|İngilizce C1/);
    assert.doesNotMatch(html, /undefined|visitor-count|customer-oci\.com|cdn\.tailwindcss/);
    assert.match(html, new RegExp(`<html lang="${language}">`));
  }
});

test('downloadable CV is the supplied PDF, not a placeholder', async () => {
  const pdf = await readFile(new URL('../public/assets/Yunus_Ergul_CV_EN.pdf', import.meta.url));
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  assert.equal(pdf.length, 181617);
});
