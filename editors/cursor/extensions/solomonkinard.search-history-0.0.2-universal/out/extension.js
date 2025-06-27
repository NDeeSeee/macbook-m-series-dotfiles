"use strict";var k=Object.create;var v=Object.defineProperty;var E=Object.getOwnPropertyDescriptor;var y=Object.getOwnPropertyNames;var P=Object.getPrototypeOf,M=Object.prototype.hasOwnProperty;var S=(t,e)=>{for(var o in e)v(t,o,{get:e[o],enumerable:!0})},x=(t,e,o,c)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of y(e))!M.call(t,s)&&s!==o&&v(t,s,{get:()=>e[s],enumerable:!(c=E(e,s))||c.enumerable});return t};var u=(t,e,o)=>(o=t!=null?k(P(t)):{},x(e||!t||!t.__esModule?v(o,"default",{value:t,enumerable:!0}):o,t)),W=t=>x(v({},"__esModule",{value:!0}),t);var A={};S(A,{activate:()=>C,deactivate:()=>T});module.exports=W(A);var b=u(require("vscode"));var i=u(require("vscode")),_=require("path"),p=class{constructor(e){this.context_=e}resolveWebviewView(e,o,c){let s="";this.context_.extensionMode===i.ExtensionMode.Production&&(s="out");let m=e.webview.asWebviewUri(i.Uri.file(_.join(this.context_.extensionPath,s,"src/webviews","script.js"))),n=e.webview;n.options={enableScripts:!0},n.onDidReceiveMessage(r=>{switch(r.command){case"searchAndSave":{let a=r.search,l=r.replace,d=i.window.activeTextEditor;if(d){let g=new RegExp(a,"g"),h=d.document.getText(),w=h.replace(g,l);if(h===w)return;d.edit(f=>{f.replace(new i.Range(0,0,d.document.lineCount,0),w)})}this.context_.workspaceState.update(a,l),this.getKeysAndPostMessage(n);break}case"remove":{let a=r.search;this.context_.workspaceState.update(a,void 0),this.getKeysAndPostMessage(n);break}}}),e.webview.html=`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script nonce="8IBTHwOdqNKAWeKl7plt8g==" src="${m}"></script>
          <style>
            :root { --bg-color: #292a2b; --color: #DEDEDE; }
            input { background-color: var(--bg-color); color: var(--color) }
            #list { padding-top: 0.5em; }
          </style>
        </head>
        <body>
          <div><input id="search" placeholder="Search"/ ></div>
          <div><input id="replace" placeholder="Replace"/ ></div>
          <div id="list"></div>
        </body>
      </html>`,this.getKeysAndPostMessage(n)}getKeysAndPostMessage(e){let o=new Set(this.context_.workspaceState.keys()),c=[];o.forEach(s=>c.push(s)&&c.push(this.context_.workspaceState.get(s))),e.postMessage({command:"load",data:c})}};var R=require("path");function C(t){let e=new p(t);t.subscriptions.push(b.window.registerWebviewViewProvider("search-history.view",e))}function T(){}0&&(module.exports={activate,deactivate});
