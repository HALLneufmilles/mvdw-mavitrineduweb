import { create } from "xmlbuilder2";

const SITE_ORIGIN = "https://mavitrineduweb.fr";

export function mostRecentIsoDate(dateValues) {
  const validDates = dateValues
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()));

  if (validDates.length === 0) return undefined;

  return new Date(Math.max(...validDates.map((date) => date.getTime()))).toISOString();
}

export function createStaticUrls(pageState, posts) {
  const latestPostUpdate = mostRecentIsoDate(
    posts.map((post) => post.updatedAt)
  );
  const blogPresentationLastmod = pageState.pages.blogPresentation?.lastmod;

  return [
    { loc: "/", lastmod: pageState.pages["/"]?.lastmod, priority: "1.0" },
    {
      loc: "/tarifs.html",
      lastmod: pageState.pages["/tarifs.html"]?.lastmod,
      priority: "0.9"
    },
    {
      loc: "/services.html",
      lastmod: pageState.pages["/services.html"]?.lastmod,
      priority: "0.9"
    },
    {
      loc: "/blog",
      lastmod: mostRecentIsoDate([
        blogPresentationLastmod,
        latestPostUpdate
      ]),
      priority: "0.9"
    }
  ];
}

export function createPostUrls(posts) {
  return posts.map((post) => ({
    loc: `/blog/post/${post.slug}`,
    lastmod: post.updatedAt ? post.updatedAt.toISOString() : undefined,
    priority: "0.8"
  }));
}

export function buildSitemapXml(urls) {
  return create({
    urlset: {
      "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
      url: urls.map((url) => ({
        loc: `${SITE_ORIGIN}${url.loc}`,
        ...(url.lastmod ? { lastmod: url.lastmod } : {}),
        priority: url.priority
      }))
    }
  }).end({ prettyPrint: true });
}
