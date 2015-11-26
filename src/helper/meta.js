/**
 * @module natron-core
 */

export function mergeMeta(meta: Object, other: ?Object): Object {
  if (other) {
    let meta_ = Object.assign({}, other);
    if (Object.hasOwnProperty(meta_, "options")) {
      meta_.options = Object(meta_.options);
      if (meta.options) {
        meta_.options = Object.assing(meta.options, meta_.options);
      }
    }
    if (meta_.args && !(meta_.args instanceof Array)) {
      throw new TypeError(`${meta_.args} is not an array`);
    }
    Object.assign(meta, meta_);
  }
  return meta;
}
