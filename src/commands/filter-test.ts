import chalk from "chalk";
import CLU from "command-line-usage";
import { Command, Param } from "@/lib/command";

export default class FilterTest extends Command {
  get helpMessage(): string {
    return CLU([
      {
        header: "Test Filter (`filter-test`)",
        content: [
          "This command helps you to see and check what Tweets will be filtered.",
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
      "filter": new Param({
        name: "filter",
        alias: "f",
        help: {
          description: "Filter syntax to be tested.",
          type: String,
        },
      }),
    };
  }

  async doCommand(args: string[]): Promise<boolean> {
    if(!this.commandEntry(args)) return false;

    const filterSyntax = this.availableParams.filter.getParamValue(args);
    console.log(filterSyntax);

    return true;
  }
}
