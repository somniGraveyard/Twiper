import * as fs from "fs/promises";
import { CONFIG_FILE_PATH } from "@/common";
import { Config, TweetEssential } from "./interfaces";

async function readJsonFile(path: string, preprocess?: (raw: string) => string | null): Promise<any | null> {
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

  return JSON.parse(rawText);
}

export async function loadConfig(): Promise<Config | null> {
  return await readJsonFile(CONFIG_FILE_PATH) as Config | null;
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
