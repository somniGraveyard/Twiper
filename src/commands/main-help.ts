import CLU from "command-line-usage";
import ICommand from "./ICommand";

export default class MainHelp implements ICommand {
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
        ],
      },
      {
        content: "You can view help message for each commands by adding {underline `--help`} parameter after the command. This parameter will ignore other parameters.",
      }
    ]);
  }

  doCommand(args: string[]): boolean {
    /* No action */
    return true;
  };
}