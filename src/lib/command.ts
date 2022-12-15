import chalk from "chalk";
import CLU from "command-line-usage";
import L from "./log";

export class Param {
  private _name = "";
  private _alias: string | undefined = undefined;
  private _helpDescription = "";
  private _helpType: any = Boolean;

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

  get valueType(): "boolean" | "string" | "any" {
    switch(this._helpType) {
      case Boolean: return "boolean";
      case String: return "string";
      default: return "any";
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

  getParamValue(argList: string[]): string | null {
    if(this.hasParam(argList) && this.valueType === "string") {
      const paramIndex = (argList.indexOf(this.nameParam) + 1 || (this.aliasParam ? argList.indexOf(this.aliasParam) + 1 : 0)) - 1;

      if(paramIndex >= 0 &&
         paramIndex + 1 < argList.length &&
         !argList[paramIndex + 1].startsWith("-")) {
        return argList[paramIndex + 1];
      } else {
        return null;
      }
    } else {
      return null;
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
  findParamByArg(arg: string): Param | null {
    for(const paramKey in this.availableParams) {
      const param = this.availableParams[paramKey];
      if(param.hasParam([arg])) return param;
    }

    return null;
  }

  commandEntry(args: string[]): boolean {
    let willHaveParamValue = false;

    // Show error message and exit if unknown parameter exists
    for(const arg of args) {
      if(this.availableParamsFlatten.includes(arg) && this.findParamByArg(arg)?.valueType === "string") {
        willHaveParamValue = true;
      }

      if(!this.availableParamsFlatten.includes(arg)) {
        if(willHaveParamValue) {
          if(!arg.startsWith("-")) {
            willHaveParamValue = false;
            continue;
          } else if(arg.startsWith("-")) {
            L.e(this.name, chalk`Parameter needs string value`);
            return false;
          }
        }

        L.e(this.name, chalk`Unknown parameter: {bold ${arg}}`);
        return false;
      }
    }

    if(willHaveParamValue) {
      L.e(this.name, chalk`Parameter needs string value`);
      return false;
    }

    return true;
  }
}
