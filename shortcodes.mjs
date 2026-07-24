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

  conf.addShortcode("badge", function(txt, color = "") {
    return `<span class="badge ${color}">${txt}</span>`;
  })
}
