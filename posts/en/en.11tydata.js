module.exports = {
  lang: "en",
  layout: "post.njk",
  tags: ["post"],
  noHero: true,
  eleventyComputed: {
    permalink: (data) => `/en/blog/${data.page.fileSlug}/`,
  },
};
