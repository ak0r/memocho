import rss from "@astrojs/rss";
import { siteConfig } from "@/site.config";
import { getAllPosts, getPostUrl } from "@/utils/content.utils";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getAllPosts();

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site!,
    items: posts.map((post) => ({
      title:       post.data.title,
      description: post.data.description ?? "",
      pubDate:     post.data.published,
      link:        getPostUrl(post),
      categories:  post.data.tags ?? [],
    })),
    customData: `<language>en-us</language>`,
    stylesheet: "/rss/styles.xsl",
  });
}