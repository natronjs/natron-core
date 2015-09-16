/*
 * natron-core build
 */
import {resolve} from "path";
import {task} from "natron";
import {src, dest} from "vinyl-fs";
import {BabelTransformer} from "./transformer";

const PKG_DIR = resolve(__dirname, "..");

function builder(babelOptions: object, out: string) {
  return () => {
    return (src(resolve(PKG_DIR, "src", "**/*.js"))
      .pipe(new BabelTransformer(babelOptions))
      .pipe(dest(resolve(PKG_DIR, "dist", out)))
    );
  };
}

export var build = task.set([
  builder({modules: "common"}, "cjs"),
  builder({blacklist: ["es6"]}, "es6"),
]);
