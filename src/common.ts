import path from "path";

const TWEETSJS_FILE_PATH = path.resolve(__dirname, "..", "tweets.js");
const SECRETS_FILE_PATH = path.resolve(__dirname, "..", ".secret.json");

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export {
  TWEETSJS_FILE_PATH,
  SECRETS_FILE_PATH,
  sleep,
};