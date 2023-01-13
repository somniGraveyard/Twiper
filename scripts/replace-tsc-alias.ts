import { replaceTscAliasPaths } from "tsc-alias";
import tsconfig from "@/../tsconfig.json";

replaceTscAliasPaths({
  verbose: true,
  configFile: "tsconfig.build.json",
  outDir: tsconfig.compilerOptions.outDir,
});
