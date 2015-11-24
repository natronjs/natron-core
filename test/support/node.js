/**
 * @module natron-core
 * test
 */
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

Object.assign(global, {
  assert: chai.assert,
});

if (!Array.from) {
  Array.from = function (iterable) {
    let arr = [];
    for (let i of iterable) {
      arr.push(i);
    }
    return arr;
  };
}
