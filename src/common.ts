import path from "path";

const TWEETSJS_FILE_PATH = path.resolve(process.cwd(), "tweets.js");
const SECRETS_FILE_PATH = path.resolve(process.cwd(), ".secret.json");
const CONFIG_FILE_PATH = path.resolve(process.cwd(), "config.json");

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export {
  TWEETSJS_FILE_PATH,
  SECRETS_FILE_PATH,
  CONFIG_FILE_PATH,
  sleep,
};
