"use strict";
//Helper funcitn, move it to another file if necessary
function sleepNow(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export { sleepNow };
