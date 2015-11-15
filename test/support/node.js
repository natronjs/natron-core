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

Object.assign(global, {
  assert,
  defer,
});
