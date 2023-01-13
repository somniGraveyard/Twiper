import chalk from "chalk";
import CLU from "command-line-usage";
import { Command, Param } from "@/lib/command";
import L from "@/lib/log";
import { parseFilterExp } from "@/lib/tweet-utils";

export default class FilterTest extends Command {
  get helpMessage(): string {
    return CLU([
      {
        header: "Test Filter (`test-filter`)",
        content: [
          "This command helps you to see and check what Tweets will be filtered.",
        ],
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
    if(filterSyntax) {
      const filterOption = parseFilterExp(filterSyntax);

      if(filterOption) {
        L.i(this.name, chalk`Filter syntax parsed, original string: {bold ${filterSyntax}}`);
        L.nl();

        if(filterOption.rt) {
          L.i(this.name, chalk`🔄️ Will filter Tweets with {bold.underline ${filterOption.rt.lessThan ? "less" : "greater"} than ${filterOption.rt.count} RT(s)}.`);
        }

        if(filterOption.like) {
          L.i(this.name, chalk`💟 Will filter Tweets with {bold.underline ${filterOption.like.lessThan ? "less" : "greater"} than ${filterOption.like.count} Like(s)}.`);
        }

        if(filterOption.media && filterOption.media.exist) {
          L.i(this.name, chalk`🕶️ Will filter Tweets with {bold.underline any media(s)}.`);
        }
      } else {
        L.e(this.name, "Cannot parse filter syntax! Make sure you provided valid filter syntax string.");
      }
    } else {
      L.e(this.name, "Unknown error: invalid filter syntax string");
    }

    return true;
  }
}
