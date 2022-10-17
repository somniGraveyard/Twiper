import { TwitterApi } from "twitter-api-v2";
import * as readline from "node:readline";
import * as fs from "node:fs/promises";
import open from "open";
import path from "node:path";
import L from "./log";

export async function saveUserTokensToFile(screenName: string, accessToken: string, accessSecret: string, overwrite: boolean = false): Promise<boolean> {
  const secretFilePath = path.resolve(__dirname, "..", "..", ".secret.json");
  
  try {
    await fs.access(secretFilePath, fs.constants.F_OK);

    if(!overwrite) {
      return false;
    }
  } catch { }

  const fileHandle = await fs.open(secretFilePath, "w+", 0o600);
  await fileHandle.write(JSON.stringify({
    user: {
      screenName,
      accessToken: Buffer.from(accessToken).toString("base64"),
      accessSecret: Buffer.from(accessSecret).toString("base64"),
    },
  }));
  await fileHandle.sync();
  await fileHandle.close();

  return true;
}

export async function getUserTokens(consumerKey: string, consumerSecret: string): Promise<{
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