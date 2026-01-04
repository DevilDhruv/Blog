const buttons = document.querySelectorAll(".theme-switcher button");
const savedTheme = localStorage.getItem("themeforblog");

if (savedTheme) {
  document.body.setAttribute("data-theme", savedTheme);
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.body.setAttribute("data-theme", prefersDark ? "dark" : "light");
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.getAttribute("data-theme");
    document.body.setAttribute("data-theme", theme);
    window.localStorage.setItem("themeforblog", theme);
  });
});

const sections = document.querySelectorAll('.blog-section h2');
const dotTocList = document.getElementById('dot-toc-list');

sections.forEach((section, index) => {
  const id = `section-${index}`;
  section.id = id;

  const li = document.createElement('li');
  const dot = document.createElement('span');

  dot.className = 'dot';
  dot.dataset.title = section.textContent;

  dot.addEventListener('click', () => {
    document.getElementById(id).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });

  li.appendChild(dot);
  dotTocList.appendChild(li);
});

/* Scroll Spy: highlight current section */
window.addEventListener('scroll', () => {
  let currentIndex = 0;

  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.3) {
      currentIndex = index;
    }
  });

  document.querySelectorAll('.dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
});
