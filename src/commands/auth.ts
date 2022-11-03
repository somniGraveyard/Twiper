import chalk from "chalk";
import CLU from "command-line-usage";
import { getUserTokens, saveUserTokensToFile } from "@/lib/auth";
import { Command, Param } from "@/lib/command";
import L from "@/lib/log";
import { loadConfig } from "@/lib/data-loader";

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
        optionList: this.availableParamsHelpDefinitions,
      },
    ]);
  }

  get availableParams() {
    return {
      "no-save": new Param({
        name: "no-save",
        help: {
          description: "Don't save obtained user access tokens to the secrets file.",
          type: Boolean,
        },
      }),

      "overwrite": new Param({
        name: "overwrite",
        alias: "s",
        help: {
          description: "Force overwrite the secrets file. This will be ignored when {underline --no-save} parameter is specified.",
          type: Boolean,
        },
      }),

      "print": new Param({
        name: "print",
        alias: "p",
        help: {
          description: "Print obtained user access tokens to stdout. Use with caution.",
          type: Boolean,
        },
      }),
    };
  }

  async doCommand(args: string[]): Promise<boolean> {
    if(!this.commandEntry(args)) return false;

    const paramNoSave = this.availableParams["no-save"].hasParam(args);
    const paramOverwrite = this.availableParams["overwrite"].hasParam(args);
    const paramPrint = this.availableParams["print"].hasParam(args);

    L.i(this.name, "Loading config file...");
    const config = await loadConfig();

    if(!config) {
      L.e(this.name, "Can't read config file!");
    } else {
      const data = await getUserTokens(config.twitterApp.tokens.consumerKey, config.twitterApp.tokens.consumerSecret);
      if(data) {
        L.nl();
        L.i(this.name, `*** Got access tokens of user '@${data.screenName}'`);
        if(paramPrint) {
          L.i(this.name, `* User ID:  ${data.userId}`);
          L.i(this.name, `* Access Token:  ${data.accessToken}`);
          L.i(this.name, `* Access Secret: ${data.accessSecret}`);
          L.i(this.name, `*** DO NOT SHARE THIS SECRETS TO STRANGERS !!! ***`);
        }
        L.nl();

        if(!paramNoSave) {
          L.i(this.name, "Writing user tokens into the secret file...");

          if(await saveUserTokensToFile(data.screenName, data.userId, data.accessToken, data.accessSecret, paramOverwrite)) {
            L.i(this.name, "User tokens written to file");
          }
        } else {
          L.i(this.name, chalk`User access tokens not saved to the secrets file because {underline ${this.availableParams["no-save"].nameParam}} parameter is specified`);
        }
      } else {
        L.e(this.name, "Invalid data");
      }
    }

    return true;
  }
}
