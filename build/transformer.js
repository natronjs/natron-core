/*
 * natron-core build
 */
import {transform} from "babel-core";
import {Transformer} from "vinyl-transformer";

export class BabelTransformer extends Transformer {

  transform(file: File): File {
    let babelOptions = Object.assign({}, this.options, {
      filename: file.path,
      filenameRelative: file.relative,
    });
    let {code} = transform(String(file.contents), babelOptions);
    file.contents = new Buffer(code);
    return file;
  }
}
