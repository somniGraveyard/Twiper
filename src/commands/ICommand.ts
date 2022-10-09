export default interface ICommand {
  get helpMessage(): string;

  /**
   * @param args Command parameters
   * @return `false` if command cannot be executed because of bad parameters or some other reasons, `true` if not
   */
  doCommand(args: string[]): boolean;
}