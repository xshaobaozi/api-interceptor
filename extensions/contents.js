(()=>{"use strict";const e="toPage",t=chrome.runtime.connect();(()=>{const e=document.createElement("script");e.setAttribute("type","text/javascript"),e.setAttribute("src",chrome.extension.getURL("mockScript.js")),document.documentElement.appendChild(e),e.addEventListener("load",(()=>{postMessage({to:"1111"})}))})(),window.addEventListener("load",(()=>{window.dispatchEvent(new CustomEvent(e))})),t.onMessage.addListener((t=>{const{action:n,apis:o,openMock:s}=t,c={apis:o,openMock:s};if(Object.keys(c).forEach((e=>{window.sessionStorage.setItem(`api_interceptor__${e}`,(e=>JSON.stringify(e))(c[e]))})),"refresh"===n)return console.log("content openMock",s),void window.dispatchEvent(new CustomEvent(e));setTimeout((()=>{chrome.runtime.sendMessage({type:"toPanel",result:{message:"这是content成功的消息"}},(e=>{}))}),2e3)}))})();