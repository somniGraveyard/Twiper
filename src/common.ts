import path from "path";

const TWEETSJS_FILE_PATH = path.resolve(process.cwd(), "tweets.js");
const SECRETS_FILE_PATH = path.resolve(process.cwd(), ".secret.json");
const CONFIG_FILE_PATH = path.resolve(process.cwd(), "config.json");

const CLEANWITH_TWEET_TEXT = "Tweets? Got rid of them with #Twiper, an on-your-own Tweet cleaner tool made by @somni_somni. Take a look at https://github.com/somnisomni/Twiper";

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export {
  TWEETSJS_FILE_PATH,
  SECRETS_FILE_PATH,
  CONFIG_FILE_PATH,
  CLEANWITH_TWEET_TEXT,
  sleep,
};
