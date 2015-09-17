/*
 * natron-core build
 */
import {resolve} from "path";
import {task} from "natron";
import {src, dest} from "natron-vinyl";
import {BabelTransformer} from "vinyl-tf-babel";

const PKG_DIR = resolve(__dirname, "..");
process.chdir(PKG_DIR);

function builder(target: string, options?: object) {
  let $src = src(resolve("src", "**/*.js"));
  let $dest = dest(resolve("dist", target));
  let transform = new BabelTransformer(options);
  return () => $src.pipe(transform).pipe($dest);
}

export var build = task.set([
  builder("cjs", {modules: "common"}),
  builder("es6", {blacklist: ["es6"]}),
]);
