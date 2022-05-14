document.querySelector(".button1").addEventListener("click", () => {
  console.log("button1");
  chrome.runtime.sendMessage(
    { type: "to_content", message: "panel button1" },
    function () {
      console.log("调用成功 button 1");
    }
  );
});

chrome.runtime.onMessage.addListener((event, sender, callable) => {
  console.log("panel addListener", event);
});
