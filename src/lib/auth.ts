import { TwitterApi } from "twitter-api-v2";
import * as readline from "node:readline";
import * as fs from "node:fs/promises";
import open from "open";
import L from "./log";
import { SECRETS_FILE_PATH } from "@/common";

export async function saveUserTokensToFile(screenName: string, userId: string, accessToken: string, accessSecret: string, overwrite: boolean = false): Promise<boolean> {
  let fileHandle!: fs.FileHandle;
  try {
    fileHandle = await fs.open(SECRETS_FILE_PATH, overwrite ? "w+" : "wx+", 0o600);
  } catch(err: any) {
    if(err.code === "EEXIST") {
      return false;
    }
  }

  await fileHandle.write(JSON.stringify({
    user: {
      screenName,
      userId: Buffer.from(userId).toString("base64"),
      accessToken: Buffer.from(accessToken).toString("base64"),
      accessSecret: Buffer.from(accessSecret).toString("base64"),
    },
  }));
  await fileHandle.sync();
  await fileHandle.close();

  return true;
}

export async function getUserTokens(consumerKey: string, consumerSecret: string): Promise<{
  userId: string,
  screenName: string,
  accessToken: string,
  accessSecret: string,
} | null> {
  const requestClient = new TwitterApi({
    appKey: consumerKey,
    appSecret: consumerSecret
  });

  L.i("AuthLib", "Getting user authentication link...");
  const authLink = await requestClient.generateAuthLink();

  L.i("AuthLib", `Web browser with authentication URL will be open, if it's not, manually open a browser and navigate to: ${authLink.url}`);
  open(authLink.url);

  return await new Promise<{
    userId: string,
    screenName: string,
    accessToken: string,
    accessSecret: string,
  } | null>((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("PIN number: ", async (answer) => {
      const authClient = new TwitterApi({
        appKey: consumerKey,
        appSecret: consumerSecret,
        accessToken: authLink.oauth_token,
        accessSecret: authLink.oauth_token_secret,
      });

      const pin = answer.trim();
      const result = await authClient.login(pin);

      if(result) {
        resolve({
          userId: result.userId,
          screenName: result.screenName,
          accessToken: result.accessToken,
          accessSecret: result.accessSecret,
        });
      } else {
        resolve(null);
      }

      rl.close();
    });
  });
}
