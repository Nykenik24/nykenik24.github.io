import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import shortcodes from "./shortcodes.mjs";

export default function (conf) {
  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink(),
  });

  conf.addCollection("journals", (collectionApi) => {
    const journals = collectionApi.getFilteredByTag("journal");
    return [...journals].sort(
      (a, b) => new Date(a.data.date) - new Date(b.data.date),
    );
  });

  conf.addCollection("projects", (collectionApi) => {
    const projects = collectionApi.getFilteredByTag("projects");
    return [...projects].sort(
      (a, b) => new Date(a.data.date) - new Date(b.data.date),
    );
  });

  conf.setLibrary("md", md);

  conf.addPassthroughCopy({
    "./public/": "/",
    "./assets/": "/assets",
  });

  shortcodes(conf);
}

export const config = {
  dir: {
    input: "content",
    output: "_dist",
    includes: "../_includes",
    layouts: "../_layouts",
    data: "../_data",
  },
  templateFormats: ["md", "njk"],
  htmlTemplateEngine: "njk",
  markdownTemplateEngine: "njk",
};
