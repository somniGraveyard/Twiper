import CLU from "command-line-usage";
import { Command, Param } from "@/lib/command";
import { loadTweetsJs } from "@/lib/data-loader";
import L from "@/lib/log";
import chalk from "chalk";
import { sleep, TWEETSJS_FILE_PATH } from "@/common";

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

    if(this.availableParams.wet.hasParam(args)) {
      L.w("Clean", chalk`{bold.underline Wet mode enabled}. THIS IS DESTRUCTIVE, YOU KNOW WHAT YOU'RE DOING.`);
      L.w("Clean", chalk`You have {bold 5 seconds} to cancel. Use "Ctrl+C" or just kill the process if you want to cancel.`);
      await sleep(5000);
      L.nl();
    } else {
      L.i("Clean", "Dry mode enabled. No real cleaning job will be happened.");
      L.nl();
    }

    L.i("Clean", "Loading Tweet list from file...");
    const tweets = await loadTweetsJs(TWEETSJS_FILE_PATH);
    if(tweets) {
      L.i("Clean", chalk`Tweet list loaded. Total {bold ${tweets.length}} tweet(s).`);
    } else {
      L.e("Clean", `File "${TWEETSJS_FILE_PATH}" is not exist, or not available to use!`);
      return true;
    }

    // TODO

    return true;
  }
}
