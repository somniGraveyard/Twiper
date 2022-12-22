import { TwitterApi } from "twitter-api-v2";
import { loadConfig, loadSecrets } from "./data-loader";
import { FilterOption, TweetEssential } from "./interfaces";
import L from "./log";

export function getTweetIdList(tweets: TweetEssential[]): string[] {
  return tweets.map((tweet) => tweet.id_str);
}

export function getRetweetTweets(tweets: TweetEssential[]): TweetEssential[] {
  return tweets.filter((tweet) => (/^RT @(.+): /g).test(tweet.full_text));
}

export function parseFilterExp(filterExp: string): FilterOption | null {
  // Filter expression
  //    "r>5,l<10,m"
  //  - comma-separated; all filters are calculated in AND condition
  //  - "r": retweet filter, operator '>' greater than | '<' less than
  //  - "l": like filter, operator '>' greater than | '<' less than
  //  - "m": media existance filter

  if(!/^[rlm<>0-9,]+$/i.test(filterExp)) {
    return null;
  }

  const filters = filterExp.toLowerCase().split(",");
  const option: FilterOption = { };

  for(const filter of filters) {
    switch(filter[0]) {
      case "r": {
        if(filter.length < 3) return null;

        const operator = filter[1];
        const num = parseInt(filter.slice(2));
        if(operator !== ">" && operator !== "<") return null;
        if(num < 0) return null;

        option.rt = {
          count: num,
          lessThan: operator === "<",
        };
        break;
      }
      case "l": {
        if(filter.length < 3) return null;

        const operator = filter[1];
        const num = parseInt(filter.slice(2));
        if(operator !== ">" && operator !== "<") return null;
        if(num < 0) return null;

        option.like = {
          count: num,
          lessThan: operator === "<",
        };
        break;
      }
      case "m": {
        if(filter.length !== 1) return null;

        option.media = { exist: true };
        break;
      }
      default: {
        L.w("Filter Parser", `Unknown filter will be ignored: ${filter}`);
        break;
      }
    }
  }

  return option;
}

export function filterTweets(tweets: TweetEssential[], options: FilterOption): TweetEssential[] {
  return tweets.filter((tweet) => {
    const rtCount = parseInt(tweet.retweet_count);
    const rtFilterCount = options.rt?.count ?? 0;
    const rtFilterInvert = options.rt?.lessThan ?? false;
    const rtFilterCond = (
      (!rtFilterInvert && rtCount >= rtFilterCount) ||
      (rtFilterInvert && rtCount < rtFilterCount)
    );
  
    const likeCount = parseInt(tweet.favorite_count);
    const likeFilterCount = options.like?.count ?? 0;
    const likeFilterInvert = options.like?.lessThan ?? false;
    const likeFilterCond = (
      (!likeFilterInvert && likeCount >= likeFilterCount) ||
      (likeFilterInvert && likeCount< likeFilterCount)
    );

    const mediaFilterExist = options.media?.exist ?? null;
    const mediaFilterCond = (
      (mediaFilterExist === null) ||
      (mediaFilterExist === true && (tweet.entities.media && tweet.entities.media.length >= 1)) ||
      (mediaFilterExist === false && (!tweet.entities.media || tweet.entities.media.length <= 0))
    );

    if(rtFilterCond && likeFilterCond && mediaFilterCond) {
      return true;
    } else {
      return false;
    }
  });
}

export function sliceText(str: string, end: number): string {
  const strNormalized = str.trim().replaceAll(/(\r\n|\r|\n)/g, " ");

  if(strNormalized.length <= end) {
    return strNormalized;
  } else {
    return `${strNormalized.slice(0, end)} ...`;
  }
}

export async function buildTwitterClient(): Promise<TwitterApi | null> {
  L.i("TweetUtil", "Loading config and secrets...");
  const config = await loadConfig();
  const secrets = await loadSecrets();
  L.i("TweetUtil", "Config and secrets loaded.");

  if(!config || !secrets) return null;

  try {
    const client = new TwitterApi({
      appKey: config.twitterApp.tokens.consumerKey,
      appSecret: config.twitterApp.tokens.consumerSecret,
      accessToken: secrets.user.accessToken,
      accessSecret: secrets.user.accessSecret,
    });

    return client ?? null;
  } catch(error) {
    L.e("TweetUtil", "Error caused while initializing Twitter API client!");
    L.raw(error);
  }

  return null;
}