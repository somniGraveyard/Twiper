import chalk from "chalk";

export default class L {
  private static capitalize(str: string): string {
    return str.split(/\s+/g).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
  }

  public static i(title: string, message: string) {
    console.info(chalk`{bold {blueBright [INFO]} [${this.capitalize(title)}]} ${message}`);
  }

  public static e(title: string, message: string) {
    console.error(chalk`{red {bold [ERROR] [${this.capitalize(title)}]} ${message}}`);
  }

  public static w(title: string, message: string) {
    console.warn(chalk`{yellow {bold [WARN] [${this.capitalize(title)}]} ${message}}`);
  }

  public static nl() {
    console.log();
  }

  public static raw(message?: any, ...params: any[]) {
    console.log(message, ...params);
  }
}
