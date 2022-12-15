import CLU from "command-line-usage";
import { Command, Param } from "@/lib/command";
import L from "@/lib/log";

export default class MainHelp extends Command {
  get helpMessage(): string {
    return CLU([
      {
        header: "Twiper",
        content: "An On-Your-Own Tweet Cleaner!",
      },
      {
        header: "Parameters (program itself)",
        optionList: this.availableParamsHelpDefinitions,
      },
      {
        header: "Commands",
        content: [
          { name: "{bold auth}", summary: "Make an authentication to Twitter and obtain user access tokens" },
          { name: "{bold clean}", summary: "Do Tweet cleaning" },
          { name: "{bold test-filter}", summary: "Test filter syntax" },
        ],
      },
      {
        content: "You can view help message for each commands by adding {underline `--help`} parameter after the command. This parameter will ignore other parameters.",
      }
    ]);
  }

  get availableParams() {
    return {
      "version": new Param({
        name: "version",
        alias: "v",
        help: {
          type: Boolean,
          description: "Show the version of the program.",
        },
      }),
    };
  }

  async doCommand(args: string[]): Promise<boolean> {
    if(args.length === 0 || args.some((a) => a.endsWith("-help")) || !this.commandEntry(args)) return false;

    if(this.availableParams.version.hasParam(args)) {
      L.raw(`v${(await import("@/../package.json")).version}`);
    }

    return true;
  };
}
