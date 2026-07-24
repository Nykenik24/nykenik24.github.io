import { config as siteConfig } from "./siteconfig.mjs"
import { DateTime } from "luxon";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import fs from "node:fs";
import path from "node:path";
import shortcodes from "./shortcodes.mjs";

export default function(conf) {
  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink(),
  });

  conf.setLibrary("md", md);

  conf.addNunjucksFilter("date", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString();
  });

  conf.addWatchTarget("../assets/themes/");

  conf.addCollection("themes", () => {
    const themesDir = path.resolve(
      conf.dir.input,
      "../assets/themes"
    );

    return fs.readdirSync(themesDir)
      .filter(file => file.endsWith(".css"))
      .map(file => {
        const content = fs.readFileSync(
          path.join(themesDir, file),
          "utf8"
        );

        const match = content.match(
          /\/\*\s*---([\s\S]*?)---\s*\*\//
        );

        if (!match) {
          return null;
        }

        const metadata = Object.fromEntries(
          match[1]
            .trim()
            .split("\n")
            .map(line => {
              const [key, ...value] = line.split(":");
              return [
                key.trim(),
                value.join(":").trim()
              ];
            })
        );

        return {
          ...metadata,
          file,
        };
      })
      .filter(Boolean);
  });

  conf.addGlobalData("layout", "page");
  conf.addGlobalData("site", {
    title: siteConfig.siteTitle ?? "Site",
    headerLinks: siteConfig.headerLinks ?? [],
    footerLinks: siteConfig.footerLinks ?? []
  })

  conf.addBundle("js", {
    toFileDirectory: "assets/js/bundles/",
    outputFileExtension: "js",
  })

  conf.addGlobalData("age", () => {
    /* I wasn't actually born at 00:00, I just
     * don't know at what hour I was exactly born.
     */
    const birthday = new Date("2012-04-22T00:00:00")
    const today = new Date();

    const milsPerY = 365.2425 * 24 * 60 * 60 * 1000;

    return Number(((today - birthday) / milsPerY).toFixed(15))
  })

  conf.addCollection("blog", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("content/blog/**/index.md")
      .reverse();
  })

  conf.addCollection("projects", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("content/projects/**/index.md")
      .reverse();
  });

  conf.addPassthroughCopy({ "./public/": "/", "./assets/": "/assets" })

  shortcodes(conf);
};

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
