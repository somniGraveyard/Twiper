import chalk from "chalk";
import CLU from "command-line-usage";
import L from "./log";

export class Param {
  private _name = "";
  private _alias: string | undefined = undefined;
  private _helpDescription = "";
  private _helpType = Boolean;

  constructor(options: {
    name: string,
    alias?: string,
    help: { description: string, type: any }
  }) {
    this._name = options.name.toLowerCase();
    if(options.alias) this._alias = options.alias;

    this._helpDescription = options.help.description;
    this._helpType = options.help.type;
  }

  get name(): string {
    return this._name;
  }

  get nameParam(): string {
    return `--${this._name}`;
  }

  get aliasParam(): string | null {
    if(this._alias) {
      return `-${this._alias}`;
    } else {
      return null;
    }
  }

  get helpDefinition(): CLU.OptionDefinition {
    return {
      name: this._name,
      alias: this._alias,
      description: this._helpDescription,
      type: this._helpType,
    };
  }

  hasParam(argList: string[]): boolean {
    if(argList.includes(this.nameParam) ||
      (this.aliasParam && argList.includes(this.aliasParam))) {
      return true;
    } else {
      return false;
    }
  }
}

export abstract class Command {
  /* === Abstracts === */
  abstract get helpMessage(): string;

  abstract get availableParams(): {
    [key: string]: Param,
  };

  /**
   * @param args Command parameters
   * @return `false` if command cannot be executed because of bad parameters or some other reasons, `true` if can. On `false` situation the main procedure will show help message(using `get helpMessage()`) about the command.
   */
  abstract doCommand(args: string[]): Promise<boolean>;

  /* === Predefined getters === */
  /**
   * Shorthand for `this.constructor.name`. Class name is command name.
   */
  get name(): string {
    return this.constructor.name;
  }

  get availableParamsFlatten(): string[] {
    return Object.values(this.availableParams).map((value) => {
      if(value.aliasParam) {
        return [value.nameParam, value.aliasParam];
      } else {
        return [value.nameParam];
      }
    }).flat();
  }

  get availableParamsHelpDefinitions(): CLU.OptionDefinition[] {
    return [
      ...Object.values(this.availableParams).map((value) => value.helpDefinition),
      {
        name: "help",
        description: "Print this help message.",
        type: Boolean,
      },
    ];
  }

  /* === Predefined functions === */
  commandEntry(args: string[]): boolean {
    // Show error message and exit if unknown parameter exists
    for(const arg of args) {
      if(!this.availableParamsFlatten.includes(arg)) {
        L.e(this.name, chalk`Unknown parameter: {bold ${arg}}`);
        return false;
      }
    }

    return true;
  }
}
