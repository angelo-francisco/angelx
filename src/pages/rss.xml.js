import { getCollection } from "astro:content";
import { postURL } from "../lib/posts";
import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

export async function GET(context) {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: new URL(
      import.meta.env.BASE_URL.replace(/\/$/, "") + "/",
      context.site,
    ),
    customData: "<language>pt-PT</language>",
    items: posts.map((post) => ({
      ...post.data,
      link: postURL(post.id),
    })),
  });
}
