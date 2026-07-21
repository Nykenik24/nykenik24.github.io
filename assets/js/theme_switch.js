(async () => {
  console.log("theme_switch.js loaded")

  const nextButton = document.getElementById("theme-next");
  const previousButton = document.getElementById("theme-prev");
  const icon = document.getElementById("theme-icon");
  const name = document.getElementById("theme-name");

  const maxNameLength = Math.max(
    ...themes.map(theme => theme.name.length)
  );

  name.style.width = `${maxNameLength}ch`;

  const root = document.documentElement;

  const defaultTheme = "dark";

  function getThemeIndex(id) {
    return themes.findIndex(theme => theme.id === id);
  }

  function setTheme(theme) {
    root.dataset.theme = theme.id;
    root.style.colorScheme = theme.colorScheme;

    if (icon) {
      icon.src = theme.icon;
    }

    if (name) {
      name.textContent = theme.name;
    }

    button.title = theme.name;
    localStorage.setItem("theme", theme.id);
  }

  function loadTheme() {
    const saved = localStorage.getItem("theme");
    const theme = themes.find(theme => theme.id === saved)
      ?? themes.find(theme => theme.id === defaultTheme)
      ?? themes[0];

    setTheme(theme);
  }

  function nextTheme() {
    const current = getThemeIndex(root.dataset.theme);

    const next = themes[
      (current + 1) % themes.length
    ];

    setTheme(next);
  }

  function previousTheme() {
    const current = getThemeIndex(root.dataset.theme);

    const previous = themes[
      (current - 1 + themes.length) % themes.length
    ];

    setTheme(previous);
  }


  nextButton.addEventListener("click", nextTheme);
  previousButton.addEventListener("click", previousTheme);

  loadTheme();
})();

