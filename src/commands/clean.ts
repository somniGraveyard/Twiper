import CLU from "command-line-usage";
import { Command, Param } from "@/lib/command";
import { loadTweetsJs } from "@/lib/data-loader";
import L from "@/lib/log";
import chalk from "chalk";
import { sleep, TWEETSJS_FILE_PATH } from "@/common";
import { sliceText } from "@/lib/tweet-utils";

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

    const wetModeEnabled = this.availableParams.wet.hasParam(args);

    if(wetModeEnabled) {
      L.w(this.name, chalk`{bold.underline Wet mode enabled}. THIS IS DESTRUCTIVE, YOU KNOW WHAT YOU'RE DOING.`);
      L.w(this.name, chalk`You have {bold 5 seconds} to cancel. Use "Ctrl+C" or just kill the process if you want to cancel.`);
      await sleep(5000);
    } else {
      L.i(this.name, "Dry mode enabled. No real cleaning job will be happened.");
    }

    L.nl();
    L.i(this.name, "Loading Tweet list from file...");
    const tweets = await loadTweetsJs(TWEETSJS_FILE_PATH);
    if(tweets) {
      L.i(this.name, chalk`Tweet list loaded. Total {bold ${tweets.length}} tweet(s).`);
    } else {
      L.e(this.name, `File "${TWEETSJS_FILE_PATH}" is not exist, or not available to use!`);
      return true;
    }

    await sleep(1000);

    for(let index = 0; index < tweets.length; index++) {
      const tweet = tweets[index];
      L.i(this.name, chalk`{grey #${index + 1}} Deleting Tweet with ID: {bold ${tweet.id_str}}, Text: "{bold ${sliceText(tweet.full_text, 30)}}"`);

      if(wetModeEnabled) {
        // WET MODE TODO
      } else {
        // Faking communication delay, using sleep() with random duration(0.02s ~ 0.22s per Tweet)
        await sleep(Math.floor(Math.random() * 200 + 20));
      }
    }

    L.nl();
    L.i(this.name, "Tweet cleaning job done!");
    if(!wetModeEnabled) {
      L.w(this.name, "This command ran under dry mode, so no data has been deleted or altered.");
    }

    return true;
  }
}
