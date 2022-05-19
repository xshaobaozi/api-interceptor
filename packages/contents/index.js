import {
  actionType,
  typeEvent,
  preKey,
  stringify,
} from "./../../page/src/helper/event";
//项目-监控大盘 页面配置信
const connect = chrome.runtime.connect();
// const APPKey = "api-intercepror-data";
// const sourceXML = window.XMLHttpRequest;

const appendMcokScirpt = () => {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", chrome.extension.getURL("mockScript.js"));
  document.documentElement.appendChild(script);
  script.addEventListener("load", () => {
    postMessage({ to: "1111" });
  });
};
appendMcokScirpt();
// const handleOpenMock = (disabled) => {
//   console.log("handleOpenMock", disabled ? "禁用" : "开启");
//   window.__is_api_mock = disabled;
//   console.log("window.__is_api_mock", window.__is_api_mock);
//   if (!disabled) {
//     window.XMLHttpRequest = XMLMock;
//     return;
//   }
//   window.XMLHttpRequest = sourceXML;
// };
window.dispatchEvent(new CustomEvent(typeEvent.toPage));
connect.onMessage.addListener((res) => {
  // console.log("content 长链接 ", res);
  const { action, apis, openMock } = res;
  const obj = {
    apis,
    openMock,
  };
  // console.log(res, obj, action);
  Object.keys(obj).forEach((item) => {
    window.sessionStorage.setItem(`${preKey}${item}`, stringify(obj[item]));
  });
  if (action === actionType.refresh) {
    // handleOpenMock(openMock);
    console.log("content openMock", openMock);
    window.dispatchEvent(new CustomEvent(typeEvent.toPage));
    return;
  }
  setTimeout(() => {
    chrome.runtime.sendMessage(
      {
        type: typeEvent.toPanel,
        result: {
          message: "这是content成功的消息",
        },
      },
      (res) => {
        // console.log("call ok", res, new Date());
      }
    );
    // connect.postMessage({
    //   type: "to_panel",
    //   message: "content postMessage",
    //   t: new Date(),
    // });
  }, 2000);
});
