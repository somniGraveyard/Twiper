export class Param {
  private _name = "";
  private _alias: string | null = null;

  constructor(name: string, alias?: string) {
    this._name = name.toLowerCase();
    if(alias) this._alias = alias;
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
  abstract get helpMessage(): string;

  abstract get availableParams(): {
    [key: string]: Param,
  };

  /**
   * @param args Command parameters
   * @return `false` if command cannot be executed because of bad parameters or some other reasons, `true` if not
   */
  abstract doCommand(args: string[]): Promise<boolean>;

  get availableParamsFlatten(): string[] {
    return Object.values(this.availableParams)
      .map((value) => {
        if(value.aliasParam) {
          return [value.nameParam, value.aliasParam];
        } else {
          return [value.nameParam];
        }
      }).flat();
  }
}
