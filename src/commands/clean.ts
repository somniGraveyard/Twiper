import CLU from "command-line-usage";
import chalk from "chalk";
import { TwitterApi } from "twitter-api-v2";
import { Command, Param } from "@/lib/command";
import { loadTweetsJs } from "@/lib/data-loader";
import L from "@/lib/log";
import { CLEANWITH_TWEET_TEXT, sleep, TWEETSJS_FILE_PATH } from "@/common";
import { buildTwitterClient, sliceText } from "@/lib/tweet-utils";

export default class Clean extends Command {
  get helpMessage(): string {
    return CLU([
      {
        header: "Cleaner (`clean`)",
        content: [
          "Clean Tweets using Tweet Archive.",
          "\nThis command needs user access token secrets for accessing Twitter API, which can be obtained/saved (to file) by command {bold auth}.",
          "\nThis command will always perform dry run unless {underline --wet} parameter is specified, to prevent the user clean their Tweets by mistake.",
          "\n\n{red {bold CAUTION}: USE THIS COMMAND ON YOUR OWN RISK. DEVELOPER IS NOT RESPONSIBLE FOR ANY LOSS OR/AND DAMAGE OF YOUR DATA.}"
        ]
      },
      {
        header: "Parameters",
        optionList: this.availableParamsHelpDefinitions,
      },
    ]);
  }

  get availableParams() {
    return {
      "wet": new Param({
        name: "wet",
        help: {
          description: "Perform real cleaning job.",
          type: Boolean,
        },
      }),
    };
  }

  async doCommand(args: string[]): Promise<boolean> {
    if(!this.commandEntry(args)) return false;

    /* Constants / Variables */
    const wetModeEnabled = this.availableParams.wet.hasParam(args);
    let client: TwitterApi | null = null;

    /* Dry/Wet mode notices */
    if(wetModeEnabled) {
      L.w(this.name, chalk`{bold.underline Wet mode enabled}. {red THIS IS DESTRUCTIVE}, I HOPE YOU TO KNOW WHAT YOU'RE DOING.`);
      L.w(this.name, chalk`You have {bold 5 seconds} to cancel. Use "Ctrl+C" or just kill the process if you want to cancel.`);
      await sleep(5000);
    } else {
      L.i(this.name, "Dry mode enabled. No real cleaning job will be happened.");
    }

    /* Load Tweet list */
    L.nl();
    L.i(this.name, "Loading Tweet list from file...");
    const tweets = await loadTweetsJs(TWEETSJS_FILE_PATH);
    if(tweets) {
      L.i(this.name, chalk`Tweet list loaded. Total {bold ${tweets.length}} tweet(s).`);
    } else {
      L.e(this.name, `File "${TWEETSJS_FILE_PATH}" is not exist, or not available to use!`);
      return true;
    }

    /* Load Twitter API client */
    if(wetModeEnabled) {
      L.nl();
      L.i(this.name, "Loading Twitter API client...");
      client = await buildTwitterClient();

      if(client) {
        L.i(this.name, chalk`Twitter API client loaded, logged in as {bold.underline @${(await client.currentUser()).screen_name}}`);
      }

      await sleep(2000);
    }

    /* Sleep a second(3 seconds on wet mode) to give the user last chance to cancel */
    await sleep(1000);

    /* Real cleaning job */
    for(let index = 0; index < tweets.length; index++) {
      const tweet = tweets[index];
      L.i(this.name, chalk`{grey #${index + 1}} Deleting Tweet with ID: {bold ${tweet.id_str}}, Text: "{bold ${sliceText(tweet.full_text, 30)}}"`);

      if(wetModeEnabled) {
        if(client) {
          // REAL TODO
        }
      } else {
        // Faking communication delay, using sleep() with random duration(0.02s ~ 0.12s per Tweet)
        await sleep(Math.floor(Math.random() * 100 + 20));
      }
    }

    /* Leave `Clean With` Tweet */
    L.nl();
    L.i(this.name, "Leaving `Clean With` Tweet on logged in account...");
    L.i(this.name, "You are free to delete the Tweet once after it posted. You can cheer the developer up just by this Tweet!");
    if(wetModeEnabled && client) {
      await client.v1.tweet(CLEANWITH_TWEET_TEXT);
    }
    L.i(this.name, "`Clean With` Tweet posted!");

    /* Cleaning job done */
    L.nl();
    L.i(this.name, "Tweet cleaning job done!");
    if(!wetModeEnabled) {
      L.w(this.name, "This command ran under dry mode, so no data has been deleted or altered.");
    }

    return true;
  }
}
