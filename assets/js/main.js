// Two pages need at least this much width to stay readable.
const SPREAD_MIN_WIDTH = 716;

function setupLamp() {
  const lamps = [...document.querySelectorAll(".lamp")];
  if (!lamps.length) return;

  const root = document.documentElement;
  const isDark = () => root.dataset.theme === "dark";

  const sync = () => {
    const dark = isDark();
    for (const lamp of lamps) {
      lamp.setAttribute("aria-pressed", String(dark));
      lamp.setAttribute(
        "aria-label",
        dark ? "Turn the light off" : "Turn the light on",
      );
    }
  };

  const toggle = () => {
    const theme = isDark() ? "light" : "dark";
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    sync();
  };

  sync();

  for (const lamp of lamps) {
    lamp.addEventListener("click", toggle);
  }
}

function setupCover() {
  const overlay = document.querySelector(".cover-view");
  if (!overlay) return;

  const book = overlay.querySelector(".book");
  const reader = document.querySelector(".reader");
  if (!book) return;

  book.addEventListener("click", () => {
    const back = book.classList.toggle("is-back");
    book.setAttribute(
      "aria-label",
      back ? "Show front cover" : "Show summary",
    );
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) window.location.href = "/";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (reader && reader.open) return;
    window.location.href = "/";
  });
}

function setupReader() {
  const reader = document.querySelector(".reader");
  if (!reader) return;

  const leaf = reader.querySelector(".leaf");
  const flow = reader.querySelector(".flow");
  const counter = reader.querySelector(".page-count");
  const prev = reader.querySelector(".prev");
  const next = reader.querySelector(".next");
  const openBtn = document.querySelector(".open-btn");
  const closeBtn = reader.querySelector(".leaf-close");
  const indexBtn = reader.querySelector(".index-return");

  let spread = 0;
  let metrics = { pageWidth: 0, gap: 0, perSpread: 1 };

  const headings = [...flow.querySelectorAll("h1")];
  const indexPages = buildIndex(headings);
  if (indexBtn) indexBtn.hidden = headings.length === 0;

  function buildIndex(items) {
    const pages = new Map();
    if (!items.length) return pages;

    const index = document.createElement("nav");
    index.className = "index";
    index.setAttribute("aria-label", "Contents");

    const label = document.createElement("p");
    label.className = "index-label";
    label.textContent = "Contents";

    const list = document.createElement("ol");
    list.className = "index-list";

    for (const heading of items) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      const name = document.createElement("span");
      const leader = document.createElement("span");
      const page = document.createElement("span");

      link.className = "index-entry";
      link.href = `#${heading.id}`;
      link.addEventListener("click", (event) => {
        event.preventDefault();
        turnTo(heading);
      });

      name.className = "index-name";
      name.textContent = heading.textContent.replace(/\s+/g, " ").trim();

      leader.className = "index-leader";
      leader.setAttribute("aria-hidden", "true");

      page.className = "index-page";
      page.textContent = "Page —";

      link.append(name, leader, page);
      item.append(link);
      list.append(item);
      pages.set(heading, page);
    }

    index.append(label, list);
    flow.prepend(index);

    return pages;
  }

  function pageOf(element) {
    if (!metrics.pageWidth) return 1;
    const flowLeft = flow.getBoundingClientRect().left;
    const elementLeft = element.getBoundingClientRect().left;
    return Math.round(
      (elementLeft - flowLeft) / (metrics.pageWidth + metrics.gap),
    ) + 1;
  }

  function turnTo(heading) {
    const page = pageOf(heading);
    spread = Math.floor((page - 1) / metrics.perSpread);
    layout();
    leaf.focus();
  }

  const layout = () => {
    if (!reader.open) return;

    const gap = parseFloat(getComputedStyle(flow).columnGap) || 0;
    const perSpread = flow.clientWidth >= SPREAD_MIN_WIDTH ? 2 : 1;
    const pageWidth =
      (flow.clientWidth - (perSpread - 1) * gap) / perSpread;

    flow.style.columnWidth = `${pageWidth}px`;
    leaf.classList.toggle("is-spread", perSpread === 2);

    metrics = { pageWidth, gap, perSpread };

    const total = Math.max(
      1,
      Math.round((flow.scrollWidth + gap) / (pageWidth + gap)),
    );
    const spreads = Math.ceil(total / perSpread);

    spread = Math.min(Math.max(spread, 0), spreads - 1);

    const step = perSpread * (pageWidth + gap);
    flow.style.transform = `translateX(${-spread * step}px)`;

    const first = spread * perSpread + 1;
    const last = Math.min(first + perSpread - 1, total);
    const label = first === last ? `${first}` : `${first}–${last}`;
    counter.textContent = `${label} / ${total}`;

    for (const [heading, page] of indexPages) {
      page.textContent = `Page ${pageOf(heading)}`;
    }

    prev.disabled = spread === 0;
    next.disabled = spread === spreads - 1;
  };

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      reader.showModal();
      leaf.focus();
      spread = 0;
      layout();
      document.fonts.ready.then(layout);
    });
  }

  closeBtn.addEventListener("click", () => reader.close());

  if (indexBtn) {
    indexBtn.addEventListener("click", () => {
      spread = 0;
      layout();
      leaf.focus();
    });
  }

  prev.addEventListener("click", () => {
    spread -= 1;
    layout();
  });

  next.addEventListener("click", () => {
    spread += 1;
    layout();
  });

  reader.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      spread += 1;
      layout();
    }
    if (event.key === "ArrowLeft") {
      spread -= 1;
      layout();
    }
  });

  reader.addEventListener("click", (event) => {
    if (event.target === reader) reader.close();
  });

  window.addEventListener("resize", () => {
    if (reader.open) layout();
  });

  flow.addEventListener(
    "toggle",
    () => {
      if (reader.open) layout();
    },
    true,
  );
}

setupLamp();
setupCover();
setupReader();
