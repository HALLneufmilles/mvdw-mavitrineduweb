import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
dotenv.config();

const SITE_URL = process.env.SITE_URL || "https://mavitrineduweb.fr";

const twitterClient =
  process.env.TWITTER_API_KEY &&
  process.env.TWITTER_API_SECRET_KEY &&
  process.env.TWITTER_ACCESS_TOKEN &&
  process.env.TWITTER_ACCESS_SECRET
    ? new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET_KEY,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET
      })
    : null;

const truncateText = (text, maxLength) => {
  if (!text || maxLength <= 0) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
};

export const buildArticleUrl = (post) => {
  const slugOrId = post.slug || post._id;
  return `${SITE_URL}/blog/post/${slugOrId}`;
};

export const tweetArticleSummary = async (articleData) => {
  if (!twitterClient) {
    console.warn("Publication X ignoree : variables Twitter manquantes.");
    return;
  }

  const url = articleData.url || buildArticleUrl(articleData);
  const prefix = `Nouvel article : ${articleData.title}`;
  const suffix = `Lire ici : ${url}`;
  const reservedLength = prefix.length + suffix.length + 2;
  const description = truncateText(
    articleData.description || "",
    Math.max(0, 280 - reservedLength)
  );
  const message = [prefix, description, suffix].filter(Boolean).join("\n");

  try {
    const response = await twitterClient.v2.tweet(message);
    console.log("Reponse de l'API X:", response);
    console.log("Tweet publie avec succes!");
  } catch (error) {
    console.error("Erreur lors de la publication du tweet:", error);
  }
};

export const publishArticleToSelectedSocials = async (post, options = {}) => {
  if (post.status !== "published") return;

  const articleData = {
    title: post.title,
    description: post.description,
    url: buildArticleUrl(post)
  };

  const tasks = [];
  if (options.publishToX) tasks.push(tweetArticleSummary(articleData));

  await Promise.allSettled(tasks);
};
