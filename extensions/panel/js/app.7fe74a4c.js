(function(e){function t(t){for(var r,o,u=t[0],l=t[1],i=t[2],d=0,f=[];d<u.length;d++)o=u[d],Object.prototype.hasOwnProperty.call(a,o)&&a[o]&&f.push(a[o][0]),a[o]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(e[r]=l[r]);s&&s(t);while(f.length)f.shift()();return c.push.apply(c,i||[]),n()}function n(){for(var e,t=0;t<c.length;t++){for(var n=c[t],r=!0,u=1;u<n.length;u++){var l=n[u];0!==a[l]&&(r=!1)}r&&(c.splice(t--,1),e=o(o.s=n[0]))}return e}var r={},a={app:0},c=[];function o(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=r,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="../panel/";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],l=u.push.bind(u);u.push=t,u=u.slice();for(var i=0;i<u.length;i++)t(u[i]);var s=l;c.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"1c6f":function(e,t,n){},"306d":function(e,t,n){},"44fb":function(e,t,n){"use strict";n("1c6f")},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("7a23"),a=n("1da1"),c=(n("b0c0"),n("96cf"),n("6b59")),o=n("7b31"),u=n("5530"),l=(n("e9c4"),n("ac1f"),n("5319"),n("d3b7"),n("25f0"),n("d81d"),n("a630"),n("3ca3"),n("7db0"),n("c740"),n("a434"),n("be92")),i=n("ade3"),s=(n("159b"),n("b64b"),"api_interceptor__"),d=!0,f={runtime:{sendMessage:function(e,t){console.log(e)},onMessage:{addListener:function(){console.log("addListener")}}},storage:{local:{get:function(e,t){console.log("local get",e);var n={};e.forEach((function(e){n[e]=v(window.localStorage.getItem("".concat(s).concat(e)))})),t(n)},set:function(e){Object.keys(e).forEach((function(t){window.localStorage.setItem("".concat(s).concat(t),x(e[t]))}))}}}},b=d?chrome:f,p=function(e){b.runtime.onMessage.addListener((function(t,n,r){e(t,n,r)}))},m=function(e,t){if(d){var n=e.map((function(e){return"".concat(s).concat(e)}));return b.storage.local.get(n,(function(n){var r={};e.forEach((function(e){var t=n["".concat(s).concat(e)];t&&(r[e]=v(t))})),console.log("get",e,n,r),t(r)}))}return b.storage.local.get(e,t)},O=function(e){return d&&Object.keys(e).forEach((function(t){var n=Object(i["a"])({},"".concat(s).concat(t),x(e[t]));return console.log("set",n),b.storage.local.set(n)})),b.storage.local.set(e)},j=n("5a0c"),h=n.n(j),v=function(e){try{return JSON.parse(e)}catch(t){return e}},x=function(e){return JSON.stringify(e)},w="interceptor",V=function(){var e="xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){var t=16*Math.random()|0,n="x"==e?t:3&t|8;return n.toString(16)}));return e},g="apis",C="YYYY-MM-DD hh:mm",N=Object(l["b"])(g,{state:function(){return{apis:[]}},actions:{init:function(){var e=this,t=["apis"];console.log("初始化state:",t),m(t,(function(n){t.forEach((function(t){var r=n[t];if(void 0!==r&&null!==r){if("apis"===t)return void(e[t]=Array.from(r).map((function(e){return Object(u["a"])(Object(u["a"])({},e),{},{schema:v(e.schema)})})));e[t]=r}}))}))},saveLocal:function(){console.log("保存到local ",this.apis),O({apis:this.apis})},add:function(e){var t=e.name;this.apis.find((function(e){return e.name===t}))?Object(o["a"])({type:"warn",message:"【".concat(t,"】已存在")}):(this.apis.push({id:V(),name:e.name,schema:v(e.schema),create:h()(new Date).format(C),update:h()(new Date).format(C)}),this.saveLocal())},remove:function(e){var t=this.apis.findIndex((function(t){return t.id===e}));this.apis.splice(t,1),this.saveLocal()},edit:function(e){var t=e.id,n=this.apis.find((function(e){return e.id===t}));n?(n.name=e.name,n.schema=e.schema,n.update=h()(new Date).format(C),this.saveLocal()):Object(o["a"])({type:"danger",message:"找不到【".concat(name,"】")})},editItem:function(e){var t=e.apisIdx,n=this.apis[t];if(n){var r=e.uri,a=e.methods;try{n["schema"]["paths"][r][a][w]=e,this.saveLocal()}catch(c){console.log(n,e),Object(o["a"])({type:"warn",message:"修改数据失败".concat(c.message)})}}}}}),y=N,_=(n("d9e2"),n("caad"),function(e){try{return JSON.parse(e)}catch(t){return new Error("schema 格式不对",e)}}),k=function(e){var t=_(e);if(t.message)return new Error(t.message);if(!t.info)return new Error("缺少schema.info");if(!t.info.title)return new Error("缺少schema.info.title");if(!t.paths)return new Error("缺少schema.paths");for(var n in t.paths){var r=t.paths[n];if(0===Object.keys(r).length)return new Error("schema.paths ".concat(n," 缺少get、post、delete、put中任意一种方法"));for(var a in r){var c=["get","post","delete","put"].includes(a);if(!c)return new Error("schema.paths ".concat(n," 缺少get、post、delete、put中任意一种方法"))}}},E=function(e,t){var n=[];return Object.keys(e).forEach((function(r){var a=e[r];Object.keys(a).forEach((function(e,c){var o=a[e],l=o[w];n.push({label:o.summary,detail:Object(u["a"])({uri:r,methods:e,summary:o.summary,response:{},disabled:!1,finished:!1,apisIdx:t},l)})}))})),n},S=function(e,t){var n=e.schema,r=e.name,a={label:r,id:t,children:[]};return a.children=E(v(n).paths,t),a},T=n("53ca"),B=n("61f0"),z=n.n(B),I={class:"com-json-edit",ref:"$jsonEdit"},M={props:{value:Object},emits:["update:value","change"],setup:function(e,t){var n=t.emit,a=e,c=Object(r["getCurrentInstance"])(),o=Object(r["ref"])({});return Object(r["onMounted"])((function(){var e=c.refs["$jsonEdit"];o.value=new z.a(e,{mode:"code",onChange:function(){var e=o.value.getText();n("update:value",e),n("change",e)}}),"object"!==Object(T["a"])(a.value)?o.value.set(v(a.value)):o.value.set=a.value})),function(e,t){return Object(r["openBlock"])(),Object(r["createElementBlock"])("section",I,null,512)}}};n("6c3d");const U=M;var L=U,P=Object(r["createTextVNode"])("创建"),$=Object(r["createTextVNode"])("编辑"),D=Object(r["createTextVNode"])("删除"),J={class:"p10"},K=Object(r["createTextVNode"])("保存"),R=Object(r["createTextVNode"])("重置"),Y={setup:function(e){var t=y(),n=Object(r["getCurrentInstance"])(),u=Object(r["reactive"])({name:[{required:!0,message:"请输入模块名",trigger:"change"}],schema:[{required:!0,message:"请输入数据源",trigger:"change"},{validator:function(e,t,n){return n(k(t))}}]}),l=Object(r["reactive"])({isShow:!1,isEdit:!1}),i=Object(r["reactive"])({name:"",schema:"",id:""}),s=function(){n.refs["$form"].validate(function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t,n){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}())},d=function(e){l.isShow=!0,l.isEdit=!0,i.name=e.name,i.id=e.id,i.schema=e.schema},f=function(){l.isShow=!0,l.isEdit=!1,i.name="",i.schema=""},b=function(e){c["a"].confirm("是否删除【".concat(e.name,"】"),"删除模块",{confirmButtonText:"OK",cancelButtonText:"Cancel",type:"warning"}).then((function(){t.remove(e.id),Object(o["a"])({type:"success",message:"删除成功"})})).catch((function(){}))},p=function(){n.refs["$form"].validate(function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(n,r){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(n){e.next=2;break}return e.abrupt("return");case 2:if(!l.isEdit){e.next=6;break}return t.edit(i),l.isShow=!1,e.abrupt("return");case 6:t.add({name:i.name,schema:i.schema}),l.isShow=!1;case 8:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}())},m=function(){i.name="",i.schema={info:{title:""},paths:{}}};return function(e,n){var a=Object(r["resolveComponent"])("el-button"),c=Object(r["resolveComponent"])("el-col"),o=Object(r["resolveComponent"])("el-table-column"),O=Object(r["resolveComponent"])("el-table"),j=Object(r["resolveComponent"])("el-input"),h=Object(r["resolveComponent"])("el-form-item"),v=Object(r["resolveComponent"])("el-form"),x=Object(r["resolveComponent"])("el-dialog"),w=Object(r["resolveComponent"])("el-row");return Object(r["openBlock"])(),Object(r["createBlock"])(w,{class:"p10"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(c,{span:24,class:"mb10"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(a,{type:"primary",onClick:f},{default:Object(r["withCtx"])((function(){return[P]})),_:1})]})),_:1}),Object(r["createVNode"])(c,{span:24},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(O,{data:Object(r["unref"])(t).apis},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(o,{prop:"name",label:"模块名",width:"150"}),Object(r["createVNode"])(o,{prop:"create",label:"创建时间",width:"150"}),Object(r["createVNode"])(o,{prop:"update",label:"更新时间",width:"150"}),Object(r["createVNode"])(o,{label:"操作"},{default:Object(r["withCtx"])((function(e){return[Object(r["createVNode"])(a,{size:"small",type:"primary",onClick:function(t){return d(e.row)}},{default:Object(r["withCtx"])((function(){return[$]})),_:2},1032,["onClick"]),Object(r["createVNode"])(a,{size:"small",type:"danger",onClick:function(t){return b(e.row)}},{default:Object(r["withCtx"])((function(){return[D]})),_:2},1032,["onClick"])]})),_:1})]})),_:1},8,["data"])]})),_:1}),Object(r["createVNode"])(x,{modelValue:Object(r["unref"])(l).isShow,"onUpdate:modelValue":n[2]||(n[2]=function(e){return Object(r["unref"])(l).isShow=e}),title:"编辑",width:"80%"},{default:Object(r["withCtx"])((function(){return[Object(r["createElementVNode"])("section",J,[Object(r["createVNode"])(v,{model:Object(r["unref"])(i),"label-width":"80px","label-position":"left",rules:Object(r["unref"])(u),ref:"$form"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(h,{label:"模块名",prop:"name"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(j,{modelValue:Object(r["unref"])(i).name,"onUpdate:modelValue":n[0]||(n[0]=function(e){return Object(r["unref"])(i).name=e})},null,8,["modelValue"])]})),_:1}),Object(r["createVNode"])(h,{label:"数据源",prop:"schema"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(L,{value:Object(r["unref"])(i).schema,"onUpdate:value":n[1]||(n[1]=function(e){return Object(r["unref"])(i).schema=e}),onChange:s},null,8,["value"])]})),_:1}),Object(r["createVNode"])(h,null,{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(a,{size:"small",type:"primary",onClick:p},{default:Object(r["withCtx"])((function(){return[K]})),_:1}),Object(r["createVNode"])(a,{size:"small",onClick:m},{default:Object(r["withCtx"])((function(){return[R]})),_:1})]})),_:1})]})),_:1},8,["model","rules"])])]})),_:1},8,["modelValue"])]})),_:1})}}};const q=Y;var A=q,F={class:"edit-api"},G={class:"edit-api__left"},H={key:0,class:"edit-api__right pl15"},Q=Object(r["createTextVNode"])("启动"),W=Object(r["createTextVNode"])("关闭"),X=Object(r["createTextVNode"])("完成"),Z=Object(r["createTextVNode"])("未完成"),ee=Object(r["createTextVNode"])("保存"),te=Object(r["createTextVNode"])("删除"),ne={setup:function(e){var t=y(),n={children:"children",label:"label"},a=Object(r["reactive"])({expandKey:[],checkKey:[]}),c=Object(r["ref"])({uri:"",summary:"",methods:"",response:{},finished:!1,disabled:!1}),o=Object(r["computed"])((function(){var e=t.apis.map(S);return e})),l=function(e){var n=e.detail.apisIdx,r=t.apis[n].name;a.expandKey=[r,e.label],c.value=Object(u["a"])({},e.detail)},i=(Object(r["reactive"])({}),Object(r["reactive"])({})),s=function(){t.editItem(c.value)},d=function(){},f=function(e,t){var n=t.node,r=t.data;t.store;if(!r.detail)return e("h",{class:"fz12 "},n.label);var a=r.detail.finished;return e("h",{class:"fz12 ".concat(a?"success-icon":"danger-icon")},n.label)};return function(e,t){var u=Object(r["resolveComponent"])("el-tree"),b=Object(r["resolveComponent"])("el-input"),p=Object(r["resolveComponent"])("el-form-item"),m=Object(r["resolveComponent"])("el-radio-button"),O=Object(r["resolveComponent"])("el-radio-group"),j=Object(r["resolveComponent"])("el-button"),h=Object(r["resolveComponent"])("el-form");return Object(r["openBlock"])(),Object(r["createElementBlock"])("section",F,[Object(r["createElementVNode"])("section",G,[Object(r["createVNode"])(u,{data:Object(r["unref"])(o),props:n,onNodeClick:l,"render-content":f,"default-expanded-keys":Object(r["unref"])(a).expandKey,"node-key":"label"},null,8,["data","default-expanded-keys"])]),c.value.uri?(Object(r["openBlock"])(),Object(r["createElementBlock"])("section",H,[Object(r["createVNode"])(h,{model:c.value,"label-width":"80px","label-position":"left",rules:Object(r["unref"])(i),ref:"$form"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(p,{label:"URI",prop:"uri"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(b,{modelValue:c.value.uri,"onUpdate:modelValue":t[0]||(t[0]=function(e){return c.value.uri=e})},null,8,["modelValue"])]})),_:1}),Object(r["createVNode"])(p,{label:"描述",prop:"summary"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(b,{modelValue:c.value.summary,"onUpdate:modelValue":t[1]||(t[1]=function(e){return c.value.summary=e})},null,8,["modelValue"])]})),_:1}),Object(r["createVNode"])(p,{label:"方法",prop:"methods"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(O,{modelValue:c.value.methods,"onUpdate:modelValue":t[2]||(t[2]=function(e){return c.value.methods=e}),size:"small"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(m,{label:"get"}),Object(r["createVNode"])(m,{label:"post"}),Object(r["createVNode"])(m,{label:"put"}),Object(r["createVNode"])(m,{label:"delete"})]})),_:1},8,["modelValue"])]})),_:1}),Object(r["createVNode"])(p,{label:"启用",prop:"disabled"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(O,{modelValue:c.value.disabled,"onUpdate:modelValue":t[3]||(t[3]=function(e){return c.value.disabled=e}),size:"small"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(m,{label:!0},{default:Object(r["withCtx"])((function(){return[Q]})),_:1}),Object(r["createVNode"])(m,{label:!1},{default:Object(r["withCtx"])((function(){return[W]})),_:1})]})),_:1},8,["modelValue"])]})),_:1}),Object(r["createVNode"])(p,{label:"完成",prop:"finished"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(O,{modelValue:c.value.finished,"onUpdate:modelValue":t[4]||(t[4]=function(e){return c.value.finished=e}),size:"small"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(m,{label:!0},{default:Object(r["withCtx"])((function(){return[X]})),_:1}),Object(r["createVNode"])(m,{label:!1},{default:Object(r["withCtx"])((function(){return[Z]})),_:1})]})),_:1},8,["modelValue"])]})),_:1}),Object(r["createVNode"])(p,{label:"返回",prop:"response"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(L,{value:c.value.response,"onUpdate:value":t[5]||(t[5]=function(e){return c.value.response=e})},null,8,["value"])]})),_:1}),Object(r["createVNode"])(p,null,{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(j,{size:"small",type:"primary",onClick:s},{default:Object(r["withCtx"])((function(){return[ee]})),_:1}),Object(r["createVNode"])(j,{size:"small",type:"danger",onClick:d},{default:Object(r["withCtx"])((function(){return[te]})),_:1})]})),_:1})]})),_:1},8,["model","rules"])])):Object(r["createCommentVNode"])("",!0)])}}};n("44fb");const re=ne;var ae=re,ce={setup:function(e){var t=y();t.init();var n=Object(r["ref"])("module");return function(e,t){var a=Object(r["resolveComponent"])("el-tab-pane"),c=Object(r["resolveComponent"])("el-tabs"),o=Object(r["resolveComponent"])("el-col"),u=Object(r["resolveComponent"])("el-row");return Object(r["openBlock"])(),Object(r["createBlock"])(u,null,{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(o,{span:24},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(c,{modelValue:n.value,"onUpdate:modelValue":t[0]||(t[0]=function(e){return n.value=e})},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(a,{label:"模块管理",name:"module"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(A)]})),_:1}),Object(r["createVNode"])(a,{label:"请求管理",name:"api"},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(ae)]})),_:1})]})),_:1},8,["modelValue"])]})),_:1})]})),_:1})}}};const oe=ce;var ue=oe,le=n("4d5f"),ie=(n("7437"),n("6014"),n("b339"),Object(r["createApp"])(ue));ie.use(le["a"]),ie.use(Object(l["a"])()),ie.mount("#app"),p((function(e,t,n){console.log("panel addListener",e)}))},"6c3d":function(e,t,n){"use strict";n("306d")},b339:function(e,t,n){}});
//# sourceMappingURL=app.7fe74a4c.js.map