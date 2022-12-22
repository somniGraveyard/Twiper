export interface Config {
  twitterApp: {
    tokens: {
      consumerKey: string,
      consumerSecret: string,
    },
  },
}

export interface Secrets {
  user: {
    screenName: string,
    userId: string,
    accessToken: string,
    accessSecret: string,
  },
}

export type TweetMediaType = "photo" | "video" | "animated_gif";

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
      type: TweetMediaType,
    }[],
    hashtags: {
      text: string,
    }[],
  }
}

export interface FilterOption {
  rt?: {
    count: number,
    lessThan: boolean,
  },
  like?: {
    count: number,
    lessThan: boolean,
  },
  media?: {
    exist: boolean | null,
  },
}