import * as fs from "fs/promises";
import { TweetEssential } from "./interfaces";

export async function loadTweetsJs(path: string): Promise<TweetEssential[] | null> {
  let rawText = "";

  try {
    rawText = await fs.readFile(path, { encoding: "utf8", flag: "r" });
    if(!rawText) return null;
  } catch {
    return null;
  }

  const fixedText = rawText.trim().replaceAll(/^window\.YTD\.tweets\.part\d+\s?=\s?/g, "");
  if(!fixedText.startsWith("[")) return null;

  const parsed = JSON.parse(fixedText) as { tweet: TweetEssential }[];
  return parsed.map(v => v.tweet);
}
