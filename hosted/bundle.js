(()=>{var t={726:(t,n,o)=>{"use strict";o.r(n),o.d(n,{createPlayer:()=>a});const a=(t,n)=>{var o;document.getElementById("currentUsers").innerHTML+=`\n    <div id="${o=t}">\n        <p id="${o}Name"></p>\n        <label>Current guess:</label>\n        <p id="${o}Guess"></p>\n        <form id="${o}GuessForm" action="/addGuess" method="post">\n            <label for="guess">Is it The Onion? ('y' or 'n'): </label>\n            <input type="radio" id="onionY" name="isItOnion${o}" value="y">\n            <label for="onionY">yes</label><br>\n            <input type="radio" id="onionN" name="isItOnion${o}" value="n">\n            <label for="onionN">no</label><br>\n            <input type="submit" value="Post Guess Method" />\n        </form>\n        <label>Points:</label>\n        <p id="${o}Points"></p>\n        <label>Current Streak:</label>\n        <p id="${o}Streak"></p>\n        <button id="remove${o}Button" action="/removeUser" method="post" type="button">Stop playing?</button>\n    </div>\n    `;const a=document.getElementById("remove"+t+"Button"),s=document.getElementById(t+"GuessForm");a.addEventListener("click",(()=>((async(e,t)=>{const n=`name=${e}&roomID=${t}`;let o=await fetch("/removeUser",{method:"post",headers:{"Content-Type":"application/x-www-form-urlencoded",Accept:"application/json"},body:n});202==o.status&&(document.getElementById(e).innerHTML=""),handleResponse(o,!1)})(t,n),!1))),s.addEventListener("submit",(e=>(e.preventDefault(),(async(e,t)=>{const n=document.getElementsByName("isItOnion"+e);let o;for(let e of n)e.checked&&(o=e.value);const a=`name=${e}&isOnion=${o}&roomID=${t}`;let s=await fetch("/addGuess",{method:"post",headers:{"Content-Type":"application/x-www-form-urlencoded",Accept:"application/json"},body:a});201==s.status&&(document.getElementById(e+"Guess").innerHTML=o),handleResponse(s,!1)})(t,n),!1))),document.getElementById(t+"Name").innerHTML=t,document.getElementById(t+"Points").innerHTML=0,document.getElementById(t+"Streak").innerHTML=0;const r=document.getElementsByClassName("hide");for(e of r)e.classList.remove("hide")}},299:(e,t,n)=>{const o=n(726),a=async(e,t)=>{const n=document.querySelector("#content");switch(e.status){case 200:n.innerHTML="<b>Success</b>";break;case 201:n.innerHTML="<b>Created</b>";break;case 202:n.innerHTML="<b>Accepted</b>";case 204:return void(n.innerHTML="<b>Updated (No Content)</b>");case 400:n.innerHTML="<b>Bad Request</b>";break;case 404:n.innerHTML="<b>Not Found</b>";break;default:n.innerHTML="<b>Response code not implemented by client.</b>"}if(t){let t=await e.json();t.message?n.innerHTML+=`<p>${t.message}</p>`:t&&(n.innerHTML+=`<p>${JSON.stringify(t)}</p>`),console.log(t)}};e.exports={handleResponse:a,updateArticle:async e=>{const t=document.querySelector("#articleTitle"),n=`roomID=${e}`,o=await fetch("/displayNextArticle",{method:"post",headers:{"Content-Type":"application/x-www-form-urlencoded",Accept:"application/json"},body:n});if(200==o.status){const e=await o.json();t.innerHTML=e.title}a(o,!1)},requestUpdate:async e=>{const t=e.querySelector("#getUrlField").value,n=e.querySelector("#methodSelect").value;let o=await fetch(t,{method:n,headers:{Accept:"application/json"}});a(o,"head"!==n)},userPostAdd:async(e,t)=>{const n=e.querySelector("#nameField").value,s=`name=${n}&roomID=${t}`;let r=await fetch("/addUser",{method:"post",headers:{"Content-Type":"application/x-www-form-urlencoded",Accept:"application/json"},body:s});201==r.status&&o.createPlayer(n,t),a(r,!1)},nextQuestion:async()=>{let e=await fetch("/updatePointsStreaks",{method:"put",headers:{Accept:"application/json"}});a(e,!1);let t=await fetch("/getGameData",{method:"get",headers:{Accept:"application/json"}});(await t.json()).users;let n=await fetch("/getNextArticle",{method:"get",headers:{Accept:"application/json"}});a(n,!1);const o=document.querySelector("#articleTitle"),s=await n.json();o.innerHTML=s.title},sendPut:async e=>{const t=e.getAttribute("action"),n=e.getAttribute("method");let o=await fetch(t,{method:n,headers:{Accept:"application/json"}});a(o,!1)}}}},n={};function o(e){var a=n[e];if(void 0!==a)return a.exports;var s=n[e]={exports:{}};return t[e](s,s.exports,o),s.exports}o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{const e=o(299);let t;window.onload=async()=>{await(async()=>{let n=await fetch("/createRoom",{method:"post",headers:{Accept:"application/json"}});if(201==n.status){const e=await n.json();t=e.roomID}e.handleResponse(n,!1)})(),e.updateArticle(t);const n=document.getElementById("getForm"),o=document.getElementById("addUserForm"),a=document.getElementById("nextQuestion");n.addEventListener("submit",(t=>(t.preventDefault(),e.requestUpdate(n),!1))),o.addEventListener("submit",(n=>(n.preventDefault(),e.userPostAdd(o,t),!1))),a.addEventListener("click",(t=>(e.nextQuestion(),!1)))}})()})();