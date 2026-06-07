const fs   = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("inlineCSS", function () {
    return fs.readFileSync(path.join(__dirname, "assets/css/main.css"), "utf8");
  });

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
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
};
