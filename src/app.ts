import chalk from "chalk";
import { Command } from "@/lib/Command";
import MainHelp from "@/commands/main-help";
import Auth from "@/commands/auth";

const COMMANDS: { [key: string]: Command } = {
  "_": new MainHelp(),
  "auth": new Auth(),
};

async function main() {
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
          if(!(await COMMANDS[command].doCommand(commandArgs))) {
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