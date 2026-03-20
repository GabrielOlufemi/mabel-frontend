// Cycles the italic word in the auth title on register.html
// Words to rotate through
const WORDS = [
  'learning',
  'studying',
  'innovating',
  'discovering',
  'researching',
  'exploring',
  'growing',
  'creating',
  'achieving',
  'excelling',
];

const INTERVAL = 3000;   // ms between swaps
const FADE_MS  = 280;    // fade transition duration

(function () {
  const el = document.querySelector('.auth-title .gray');
  if (!el) return;

  // Inject the transition style once
  el.style.cssText = `
    display: inline-block;
    transition: opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease;
  `;

  let index = 0; // 'learning' is already showing, start cycling from next

  setInterval(() => {
    index = (index + 1) % WORDS.length;

    // Fade + slide out
    el.style.opacity = '0';
    el.style.transform = 'translateY(-6px)';

    setTimeout(() => {
      el.textContent = WORDS[index] + '.';

      // Fade + slide in
      el.style.transform = 'translateY(6px)';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    }, FADE_MS);
  }, INTERVAL);
})();