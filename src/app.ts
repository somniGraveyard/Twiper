import { Command } from "@/lib/command";
import L from "@/lib/log";
import MainHelp from "@/commands/main-help";
import Auth from "@/commands/auth";
import Clean from "@/commands/clean";
import FilterTest from "@/commands/filter-test";

const COMMANDS: { [key: string]: Command } = {
  "help": new MainHelp(),
  "auth": new Auth(),
  "clean": new Clean(),
  "test-filter": new FilterTest(),
};

async function main() {
  if(process.argv) {
    const args = process.argv.slice(2);

    if(args.length >= 1 && !args[0].startsWith("-")) {
      const command = args[0];
      const commandArgs = args.slice(1);

      if(command in COMMANDS) {
        if(commandArgs.length >= 1 && commandArgs.includes("--help")) {
          L.raw(COMMANDS[command].helpMessage);
        } else {
          if(!(await COMMANDS[command].doCommand(commandArgs))) {
            L.raw(COMMANDS[command].helpMessage);
          }
        }
      } else {
        L.e("Main", "Not a valid command!!");
        L.raw(COMMANDS["help"].helpMessage);
      }
    } else {
      if(!(await COMMANDS["help"].doCommand(args))) {
        L.raw(COMMANDS["help"].helpMessage);
      }
    }
  }
}

main();
