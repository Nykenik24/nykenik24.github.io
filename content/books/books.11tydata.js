import { readFileSync } from "node:fs";

const books = JSON.parse(
  readFileSync(
    new URL("../../_data/books.json", import.meta.url),
    "utf8",
  ),
);

const slugFor = (data) => {
  const fileSlug = data.page.fileSlug;
  if (fileSlug === "_index") {
    const inputPath = data.page.inputPath ?? "";
    const normalized = inputPath.replace(/\\/g, "/");
    const match = normalized.match(/\/content\/books\/([^/]+)\//);
    if (match) return match[1];
  }
  return fileSlug;
};

const bookFor = (data) =>
  books.find((book) => book.slug === slugFor(data));

export default {
  layout: "book.njk",
  permalink: (data) => `/books/${slugFor(data)}/`,
  eleventyComputed: {
    book: bookFor,
    title: (data) => bookFor(data)?.title,
  },
};
