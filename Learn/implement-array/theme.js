const buttons = document.querySelectorAll('.theme-switcher button');
const theme = window.localStorage.getItem('themeforblog');
if (theme) {
    document.body.setAttribute('data-theme', theme);
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.getAttribute('data-theme');
    document.body.setAttribute('data-theme', theme);
    window.localStorage.setItem('themeforblog', theme);
  });
});
