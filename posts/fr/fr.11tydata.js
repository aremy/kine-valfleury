module.exports = {
  lang: "fr",
  layout: "post.njk",
  tags: ["post"],
  noHero: true,
  eleventyComputed: {
    permalink: (data) => `/blog/${data.page.fileSlug}/`,
  },
};
