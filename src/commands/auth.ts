import CLU from "command-line-usage";
import ICommand from "./ICommand";

export default class Auth implements ICommand {
  get helpMessage(): string {
    return CLU([
      {
        header: "Authentication (`auth`)",
        content: "Make an authentication to Twitter and obtain user access tokens, which requires for using Twitter API.",
      },
      {
        header: "Parameters",
        optionList: [
          {
            name: "save",
            alias: "s",
            description: "Force save user access tokens to secret file, even if the secret file exists.",
            defaultOption: false,
            type: Boolean
          },
          {
            name: "print",
            alias: "p",
            description: "Print obtained user access tokens to stdout. Use with caution.",
            defaultOption: false,
            type: Boolean,
          },
          {
            name: "help",
            description: "Print this help message.",
            type: Boolean,
          },
        ],
      },
    ]);
  }

  doCommand(args: string[]): boolean {
    // TODO
    return true;
  }
}