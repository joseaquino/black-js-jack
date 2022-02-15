"use strict";
function sleepNow(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export { sleepNow };
