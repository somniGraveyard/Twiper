import chalk from "chalk";
import CLU from "command-line-usage";
import Config from "@/../config.json";
import { getUserTokens, saveUserTokensToFile } from "@/lib/auth";
import { Command, Param } from "@/lib/command";
import L from "@/lib/log";

export default class Auth extends Command {
  get helpMessage(): string {
    return CLU([
      {
        header: "Authentication (`auth`)",
        content: [
          "Make an authentication to Twitter and obtain user access tokens, which requires for using Twitter API.",
          "\nUser access tokens obtained by this command will save to the secrets file automatically by default. Saved secrets file will be used in further commands like {bold clean}."
        ]
      },
      {
        header: "Parameters",
        optionList: [
          {
            name: "no-save",
            description: "Don't save obtained user access tokens to the secrets file.",
            defaultOption: true,
            type: Boolean,
          },
          {
            name: "overwrite",
            alias: "s",
            description: "Force overwrite the secrets file. This will be ignored when {underline --no-save} parameter is specified.",
            defaultOption: false,
            type: Boolean,
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

  get availableParams() {
    return {
      "no-save": new Param("no-save"),
      "overwrite": new Param("overwrite", "s"),
      "print": new Param("print", "p"),
    };
  }

  async doCommand(args: string[]): Promise<boolean> {
    for(const arg of args) {
      if(!this.availableParamsFlatten.includes(arg)) {
        L.e("Auth", chalk`Unknown parameter: {bold ${arg}}`);
        return false;
      }
    }

    const paramNoSave = this.availableParams["no-save"].hasParam(args);
    const paramOverwrite = this.availableParams["overwrite"].hasParam(args);
    const paramPrint = this.availableParams["print"].hasParam(args);

    const data = await getUserTokens(Config.twitterApp.tokens.consumerKey, Config.twitterApp.tokens.consumerSecret);
    if(data) {
      L.nl();
      L.i("Auth", `*** Got access tokens of user '@${data.screenName}'`);
      if(paramPrint) {
        L.i("Auth", `* Access Token:  ${data.accessToken}`);
        L.i("Auth", `* Access Secret: ${data.accessSecret}`);
        L.i("Auth", `*** DO NOT SHARE THIS SECRETS TO STRANGERS !!! ***`);
      }
      L.nl();

      if(!paramNoSave) {
        L.i("Auth", "Writing user tokens into the secret file...");

        if(!(await saveUserTokensToFile(data.screenName, data.accessToken, data.accessSecret, paramOverwrite))) {
          L.w("Auth", "Overwrite parameter not specified, and seems like the secret file is already exists. No changes will be made!");
        } else {
          L.i("Auth", "User tokens written to file");
        }
      } else {
        L.i("Auth", chalk`User access tokens not saved to the secrets file because {underline ${this.availableParams["no-save"].nameParam}} parameter is specified`);
      }
    } else {
      L.e("Auth", "Invalid data");
    }

    return true;
  }
}