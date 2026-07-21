(() => {
  console.log("theme_switch.js loaded")

  const themeButton = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");
  const root = document.documentElement;

  const saved =
    localStorage.getItem("theme") ??
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);

    icon.src = theme === "dark"
      ? "/assets/svg/moon.svg"
      : "/assets/svg/sun.svg";
  }

  setTheme(saved);

  themeButton.addEventListener("click", () => {
    const next = root.dataset.theme === "dark"
      ? "light"
      : "dark";

    setTheme(next);
  });
})();

