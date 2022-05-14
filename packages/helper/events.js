const ID = chrome.runtime.id;
export const EventType = {
  Init: "Init",
  Edit: "Edit",
};
const initAddlistener = () => {
  if (!chrome.runtime) {
    console.warn(`chrome.runtime is undefined`, chrome.runtime);
    return () => {};
  }
  if (!chrome.runtime.onMessage) {
    console.warn(`chrome.runtime.onMessage`, chrome.runtime.onMessage);
    return () => {};
  }
  if (!chrome.runtime.onMessage.addListener) {
    console.warn(
      `chrome.runtime.onMessage.addListener`,
      chrome.runtime.onMessage.addListener
    );
    return () => {};
  }

  return chrome.runtime.onMessage.addListener;
};
const ChromRuntimeOnmessageAdd = initAddlistener();
class eventsBus {
  constructor() {
    this.bus = {};
    // ChromRuntimeOnmessageAdd();
  }
  on(eventName, fn) {
    this.bus[eventName] = fn;
  }
  emit(eventName, message, successCall) {
    chrome.runtime.sendMessage(
      ID,
      { type: eventName, result: message },
      successCall
    );
  }
}

export const event = new eventsBus();
