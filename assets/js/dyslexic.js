(() => {
  console.log("dyslexic.js loaded");

  const fontButton = document.getElementById("font-toggle");
  const root = document.documentElement;

  const saved = localStorage.getItem("font") ?? "default";
  root.dataset.font = saved;

  fontButton.addEventListener("click", () => {
    const next =
      root.dataset.font === "default"
        ? "dyslexic"
        : "default";

    root.dataset.font = next;
    localStorage.setItem("font", next);
  });
})();
