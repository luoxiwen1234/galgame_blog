const app = document.querySelector('#app');
const themeSwitch = document.querySelector('#themeSwitch');
const nav = document.querySelector('#nav');
const menuButton = document.querySelector('#menuButton');

function applyTheme(theme, persist = true) {
  if (!app || !themeSwitch) return;
  document.documentElement.dataset.theme = theme;
  app.classList.toggle('theme-summer', theme === 'summer');
  app.classList.toggle('theme-moon', theme === 'moon');
  themeSwitch.querySelectorAll('[data-theme]').forEach((item) => item.classList.toggle('active', item.dataset.theme === theme));
  themeSwitch.setAttribute('aria-label', `切换到${theme === 'summer' ? '月夜' : '盛夏'}主题`);
  const heroSide = document.querySelector('#heroSide');
  const heroLine = document.querySelector('#heroLine');
  if (heroSide) heroSide.textContent = theme === 'summer' ? 'SUMMER SIDE' : 'MOON SIDE';
  if (heroLine) heroLine.textContent = theme === 'summer' ? '那年夏天的蓝，至今仍然清晰。' : '月光落在樱花与礼服之间。';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'summer' ? '#fffaf6' : '#0c1020');
  if (persist) localStorage.setItem('moon-summer-theme', theme);
}

themeSwitch?.addEventListener('click', (event) => {
  const target = event.target.closest('[data-theme]');
  const theme = target?.dataset.theme || (app.classList.contains('theme-summer') ? 'moon' : 'summer');
  if (document.startViewTransition) document.startViewTransition(() => applyTheme(theme));
  else applyTheme(theme);
});

menuButton?.addEventListener('click', () => nav?.classList.toggle('open'));
nav?.addEventListener('click', () => nav.classList.remove('open'));

let savedTheme = 'summer';
try { savedTheme = localStorage.getItem('moon-summer-theme') || 'summer'; } catch {}
applyTheme(savedTheme === 'moon' ? 'moon' : 'summer', false);
