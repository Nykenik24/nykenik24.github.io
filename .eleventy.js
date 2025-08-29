export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");

  const markdownIt = require("markdown-it");
  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(dateObj);
  });

  eleventyConfig.addPairedShortcode(
    "link_tooltip",
    function (tooltip, link_name, link) {
      return `<a src="${link}"><span title="${tooltip}">${link_name}</span></a>`;
    },
  );

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("content/posts/**/index.md");
  });

  eleventyConfig.addCollection("projects", function (collectionApi) {
    return collectionApi.getFilteredByGlob("content/projects/**/index.md");
  });

  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
  eleventyConfig.addPlugin(syntaxHighlight);

  return {
    dir: {
      input: "content",
      includes: "../_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["md", "njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
