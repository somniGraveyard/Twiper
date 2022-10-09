import CLU from "command-line-usage";
import { Command } from "@/lib/Command";

export default class Clean extends Command {
  get helpMessage(): string {
    return CLU([
      {
        header: "Cleaner (`clean`)",
        content: [
          "Clean Tweets using Tweet Archive.",
          "\nThis command needs user access token secrets for accessing Twitter API, which can be obtained/saved (to file) by command {bold auth}."
        ]
      },
      {
        header: "Parameters",
        optionList: [
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
    // TODO
    return { };
  }

  async doCommand(args: string[]): Promise<boolean> {
    // TODO
    return true;
  }
}