import CLU from "command-line-usage";
import { Command, Param } from "@/lib/command";

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
        optionList: [
          {
            name: "wet",
            description: "Perform real cleaning job.",
            type: Boolean,
          },
          {
            name: "help",
            description: "Print this help message.",
            type: Boolean,
          },
        ],
      },
    ]);
  }

  get availableParams() {
    return {
      "wet": new Param("wet"),
    };
  }

  async doCommand(args: string[]): Promise<boolean> {
    // TODO
    return true;
  }
}