export interface TweetEssential {
  id_str: string,
  retweeted: boolean,
  favorited: boolean,
  favorite_count: string,
  retweet_count: string,
  full_text: string,
  entities: {
    user_mentions: object[],
    urls: object[],
    symbols: object[],
    media: {
      type: "photo" | "video" | "animated_gif"
    }[],
    hashtags: {
      text: string,
    }[],
  }
}