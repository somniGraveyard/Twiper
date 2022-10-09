import chalk from "chalk";
import MainHelp from "./commands/main-help";
import ICommand from "./commands/ICommand";
import Auth from "./commands/auth";

const COMMANDS: { [key: string]: ICommand } = {
  "_": new MainHelp(),
  "auth": new Auth(),
};

function main(): void {
  if(process.argv) {
    const args = process.argv.slice(2);

    if(args.length <= 0 || (args.length >= 1 && args[0] === "help")) {
      console.log(COMMANDS["_"].helpMessage);
    } else {
      const command = args[0];
      const commandArgs = args.slice(1);

      if(command in COMMANDS) {
        if(commandArgs.length >= 1 && commandArgs.includes("--help")) {
          console.log(COMMANDS[command].helpMessage);
        } else {
          if(!COMMANDS[command].doCommand(commandArgs)) {
            console.log(COMMANDS[command].helpMessage);
          }
        }
      } else {
        console.error(chalk`{red Not a valid command!!}`);
        console.log(COMMANDS["_"].helpMessage);
      }
    }
  }
}

main();