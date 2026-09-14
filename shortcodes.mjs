export default function shortcodes(conf) {
  conf.addPairedShortcode("center", function(content) {
    return `
<div class="center">
${content}
</div>
`;
  });

  conf.addShortcode("figure", function(src, caption, alt = "") {
    return `
      <figure>
        <img src="${src}" alt="${alt}" aria-label="${alt}">
        ${caption ? `<figcaption><span>${caption}</span></figcaption>` : ""}
      </figure>
    `;
  });

  conf.addPairedShortcode("figures", function(content) {
    return `<div class="figure-row">${content}</div>`;
  });

  conf.addPairedShortcode("quote", function(content) {
    return `<blockquote>${content}</blockquote>`;
  });

  conf.addShortcode("badge", function(txt, color = "") {
    return `<span class="badge ${color}">${txt}</span>`;
  })

  conf.addPairedShortcode("collapsible", function(content, title = "") {
    return `
<details class="collapsible">
  <summary>${title}</summary>

  <div class="collapsible-content">
    ${content}
  </div>
</details>
`;
  });
}
