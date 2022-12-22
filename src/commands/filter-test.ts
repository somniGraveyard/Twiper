import chalk from "chalk";
import CLU from "command-line-usage";
import { Command, Param } from "@/lib/command";
import L from "@/lib/log";

export default class FilterTest extends Command {
  get helpMessage(): string {
    return CLU([
      {
        header: "Test Filter (`test-filter`)",
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

    if(!this.availableParams.filter.hasParam(args)) {
      L.e(this.name, chalk`{bold ${this.availableParams.filter.nameParam}} parameter should be specified with valid value!`);
      return false;
    }

    const filterSyntax = this.availableParams.filter.getParamValue(args);

    return true;
  }
}
