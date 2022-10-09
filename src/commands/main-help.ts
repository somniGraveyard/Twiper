import CLU from "command-line-usage";
import { Command } from "@/lib/Command";

export default class MainHelp extends Command {
  get helpMessage(): string {
    return CLU([
      {
        header: "Twiper",
        content: "An On-Your-Own Tweet Cleaner!",
      },
      {
        header: "Commands",
        content: [
          { name: "{bold auth}", summary: "Make an authentication to Twitter and obtain user access tokens" },
          { name: "{bold clean}", summary: "Do Tweet cleaning" },
        ],
      },
      {
        content: "You can view help message for each commands by adding {underline `--help`} parameter after the command. This parameter will ignore other parameters.",
      }
    ]);
  }

  get availableParams() { return { }; }

  async doCommand(args: string[]): Promise<boolean> {
    /* No action */
    return true;
  };
}