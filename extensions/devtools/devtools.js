// 声明panel.html
chrome.devtools.panels.create(
  "Api",
  "images/128.png",
  "panel/index.html",
  function (panel) {
    console.log("创建成功了");
  }
);
