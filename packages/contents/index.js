import { typeEvent } from "./../../page/src/helper/event";
const connect = chrome.runtime.connect();
const APPKey = 'api-intercepror-data'
connect.onMessage.addListener((res) => {
  console.log("content 长链接 ", res);
  window.localStorage.setItem(APPKey, JSON.stringify(res))
  // console.log("send");
  setTimeout(() => {
    console.log(222222);
    chrome.runtime.sendMessage(
      {
        type: typeEvent.toPanel,
        result: {
          message: "这是content成功的消息",
        },
      },
      (res) => {
        console.log("call ok", res, new Date());
      }
    );
    // connect.postMessage({
    //   type: "to_panel",
    //   message: "content postMessage",
    //   t: new Date(),
    // });
  }, 2000);
});
