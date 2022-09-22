// this module exists for very contrived reasons and as such cannot import any
// other module
let loadHandlers = new Set<() => any>();
export let ready = false;

export function onReady(fn: () => any) {
  if (ready) {
    fn();
  } else {
    loadHandlers.add(fn);
  }
}

export function _doReady() {
  if (ready) return;
  ready = true;
  for (let f of loadHandlers) f();
}
