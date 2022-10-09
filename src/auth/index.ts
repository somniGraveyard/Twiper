import { TwitterApi } from "twitter-api-v2";
import * as readline from "node:readline";
import * as fs from "node:fs/promises";
import open from "open";
import path from "node:path";

async function saveUserTokensToFile(screenName: string, accessToken: string, accessSecret: string) {
  console.log("Writing user tokens into the secret file...");

  const secretFilePath = path.resolve(__dirname, "..", ".secret.json");
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
  
  console.log("User tokens written to file");
}

export async function getUserTokens(consumerKey: string, consumerSecret: string, saveTokensToFile: boolean = true) {
  const client = new TwitterApi({
    appKey: consumerKey,
    appSecret: consumerSecret
  });

  console.log("Getting user authentication link...");
  const authLink = await client.generateAuthLink();

  console.log(`Web browser with authentication URL will be open, if it's not, manually open a browser and navigate to: ${authLink.url}`);
  open(authLink.url);
  
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

    console.log();
    console.log(`*** Got access tokens of user '@${result.screenName}'`);
    if(!saveTokensToFile) {
      console.log(`* Access Token:  ${result.accessToken}`);
      console.log(`* Access Secret: ${result.accessSecret}`);
      console.log(`*** DO NOT SHARE THIS SECRETS TO STRANGERS !!! ***`);
    }
    console.log();

    if(saveTokensToFile) saveUserTokensToFile(result.screenName, result.accessToken, result.accessSecret);

    rl.close();
  });
}