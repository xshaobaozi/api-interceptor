import { typeEvent } from "./../../page/src/helper/event";
// background.js

var last_port = null;

chrome.runtime.onConnect.addListener(function (port) {
  last_port = port;
});

chrome.runtime.onMessage.addListener((event, sender, callable) => {
  var type = event.type || "";
  if (type === typeEvent.toContent) {
    last_port.postMessage(event.result);
    return;
  }
  callable(event);
});
