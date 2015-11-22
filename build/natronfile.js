/**
 * @module natron-core
 * build
 */
import {resolve} from "path";
import {task} from "natron";
import {src, dest} from "natron-vinyl";
import {transform} from "vinyl-tf-babel";

const PKG_DIR = resolve(__dirname, "..");

function builder(target: string, options) {
  return () => (src(resolve(PKG_DIR, "src", "**/*.js"))
    .pipe(transform(options))
    .pipe(dest(resolve(PKG_DIR, "dist", target)))
  );
}

export var build = task.set([
  builder("cjs", {
    "babelrc": false,
    "plugins": [
      "transform-flow-strip-types",
      "transform-object-assign",
    ],
    "presets": [
      "es2015",
      "stage-0",
    ],
  }),
  builder("es6", {
    "babelrc": false,
    "plugins": [
      "transform-flow-strip-types",
    ],
    "presets": [
      "stage-0",
    ],
  }),
]);
