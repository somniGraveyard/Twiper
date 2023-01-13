import * as fs from "fs/promises";
import { CONFIG_FILE_PATH, SECRETS_FILE_PATH } from "@/common";
import { Config, Secrets, TweetEssential } from "./interfaces";

async function readJsonFile<T>(path: string, preprocess?: (raw: string) => string | null): Promise<T | null> {
  let rawText = "";

  try {
    rawText = await fs.readFile(path, { encoding: "utf8", flag: "r" });
    if(!rawText) return null;
  } catch {
    return null;
  }

  if(preprocess) {
    const processedText = preprocess(rawText);

    if(processedText) rawText = processedText;
    else return null;
  }

  return JSON.parse(rawText) as T;
}

export async function loadConfig(): Promise<Config | null> {
  return await readJsonFile<Config>(CONFIG_FILE_PATH);
}

export async function loadSecrets(): Promise<Secrets | null> {
  const parsed = await readJsonFile<Secrets>(SECRETS_FILE_PATH);
  
  if(parsed) {
    return {
      ...parsed,
      user: {
        ...parsed.user,
        userId: Buffer.from(parsed.user.userId, "base64").toString("utf8"),
        accessToken: Buffer.from(parsed.user.accessToken, "base64").toString("utf8"),
        accessSecret: Buffer.from(parsed.user.accessSecret, "base64").toString("utf8"),
      },
    };
  } else {
    return null;
  }
}

export async function loadTweetsJs(path: string): Promise<TweetEssential[] | null> {
  const parsed = await readJsonFile(path, (raw) => {
    const fixedText = raw.trim().replaceAll(/^window\.YTD\.tweets\.part\d+\s?=\s?/g, "");

    if(!fixedText.startsWith("[")) return null;
    else return fixedText;
  }) as { tweet: TweetEssential }[] | null;

  if(parsed) return parsed.map(v => v.tweet);
  else return null;
}
