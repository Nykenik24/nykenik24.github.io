(() => {
  console.log("theme_switch.js loaded")

  const button = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");
  const root = document.documentElement;

  const themes = [
    {
      id: "dark",
      icon: "/assets/svg/moon.svg",
      colorScheme: "dark",
    },
    {
      id: "light",
      icon: "/assets/svg/sun.svg",
      colorScheme: "light",
    },
    {
      id: "nord",
      icon: "/assets/svg/snowflake.svg",
      colorScheme: "nord"
    },
    {
      id: "gruvbox",
      icon: "/assets/svg/box.svg",
      colorScheme: "gruvbox"
    },
    {
      id: "solarized",
      icon: "/assets/svg/solarized.svg",
      colorScheme: "solarized"
    },
    {
      id: "github-dark",
      icon: "/assets/svg/github.svg",
      colorScheme: "github-dark"
    }
  ];

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

    button.title = String(theme.id).charAt(0).toUpperCase() + String(theme.id).slice(1);
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

  button.addEventListener("click", nextTheme);

  button.addEventListener("contextmenu", event => {
    event.preventDefault();
    previousTheme();
  });

  loadTheme();
})();

