const fs   = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("inlineCSS", function () {
    return fs.readFileSync(path.join(__dirname, "assets/css/main.css"), "utf8");
  });

  eleventyConfig.addFilter("dateISO", (dateObj) => {
    if (!dateObj) return '';
    return new Date(dateObj).toISOString().split('T')[0];
  });

  eleventyConfig.addFilter("readableDate", (dateObj, lang) => {
    if (!dateObj) return '';
    return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {
      year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
    }).format(new Date(dateObj));
  });

  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("CLAUDE.md");

  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("assets/css");
  eleventyConfig.addPassthroughCopy("assets/js");
  eleventyConfig.addPassthroughCopy("manifest-fr.json");
  eleventyConfig.addPassthroughCopy("en/manifest-en.json");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sw.js");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
      layouts: "_layouts",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
  };
};
