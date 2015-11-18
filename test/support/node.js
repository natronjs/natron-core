/*
 * natron-core test
 */
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

let {assert} = chai;
chai.use(chaiAsPromised);

function defer() {
  let d, promise = new Promise((resolve, reject) => {
    d = {resolve, reject};
  });
  d.promise = promise;
  return d;
}

if (!Array.from) {
  Array.from = function (iterable) {
    let arr = [];
    for (let i of iterable) {
      arr.push(i);
    }
    return arr;
  };
}

Object.assign(global, {
  assert,
  defer,
});
