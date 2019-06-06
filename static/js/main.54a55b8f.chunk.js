(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[,,,,,,,,function(e,t,n){e.exports=n(20)},,,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var i=n(0),a=n.n(i),r=n(3),s=n.n(r),o=(n(14),n(4)),l=n(6),c=n(5),u=n(1),m=n(7),h=(n(15),n(16),{C:"emoji mine clicked",M:"emoji mine",F:"emoji flag",W:"emoji wrong",null:"unrevealed"}),f={C:"\ud83d\udca3",M:"\ud83d\udca3",F:"\ud83d\udea9",W:"\u274c"},d=function(e){return h[e]||"revealed number"+e},v=function(e){return f[e]||e||null};function g(e){return a.a.createElement("button",{className:"Square ".concat(d(e.value)),onClick:e.onClick,onContextMenu:e.onRightClick},v(e.value))}n(17);var k=function(e,t,n){return n.map(function(n,i){return function(e,t,n,i){return a.a.createElement(g,{key:t+"_"+n,value:i,onClick:function(){return e.onClick(t,n)},onRightClick:function(i){return e.onRightClick(i,t,n)}})}(e,t,i,n)})};function b(e){return a.a.createElement("div",{className:"Board"+(e.gameFinished?" disabled":""),style:{gridTemplateColumns:"repeat(".concat(e.width,", 1fr)")}},e.game.map(function(t,n){return k(e,n,t)}))}n(18);function y(e){return a.a.createElement("div",{className:"status"},a.a.createElement("div",{className:"lcd minesLeft"},e.minesLeft),a.a.createElement("button",{className:"restart",onClick:e.onClick},e.buttonStatus),a.a.createElement("div",{className:"lcd timer"},e.time))}n(19);function p(e){return a.a.createElement("button",{className:"difficulty-level "+(e.isSelected?"selected":""),onClick:e.onClick},e.label," ",a.a.createElement("span",{role:"img","aria-label":e.label},e.emoji))}var S=function(e){function t(e){var n;return Object(o.a)(this,t),(n=Object(l.a)(this,Object(c.a)(t).call(this,e))).state=n.getInitialState(),n}return Object(m.a)(t,e),Object(u.a)(t,null,[{key:"randomInRange",value:function(e,t){return Math.floor(Math.random()*(t-e+1))+e}},{key:"isMine",value:function(e,t,n){return"M"===e[t][n]}},{key:"generateArray",value:function(e,t,n){return Array.from({length:e},function(){return Array.from({length:t},function(){return n})})}},{key:"vibrate",value:function(e){return navigator.vibrate(e)}},{key:"getSolution",value:function(e,n,i){return e.map(function(e,a){return e.map(function(e,r){return t.isMine(n,a,r)?i:n[a][r]})})}},{key:"thereAreRemainingMoves",value:function(e,t){return e.flat().filter(function(e){return null===e||"F"===e}).length>t}},{key:"leftPad",value:function(e){return e<0?"-"+Math.abs(e).toString().padStart(2,"0"):e.toString().padStart(3,"0")}}]),Object(u.a)(t,[{key:"restart",value:function(){this.setState(this.getInitialState.apply(this,arguments))}},{key:"getInitialState",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:9,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:9,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:10;return this.stopTimer(),{height:e,width:n,maximumMines:i,minesLeft:i,game:t.generateArray(e,n,null),solution:null,gameStarted:!1,gameFinished:!1,buttonStatus:"\ud83d\ude42",time:0,start:0,bestTimes:JSON.parse(localStorage.getItem("minesweeper:bestTimes"))||{}}}},{key:"checkStart",value:function(){this.state.gameStarted||this.startTimer()}},{key:"handleClick",value:function(e,t){var n,i=this.state.game.slice();this.state.solution?n=this.state.solution.slice():(n=this.generateGame(this.state.height,this.state.width,e,t,this.state.maximumMines),this.setState({gameStarted:!0,solution:n})),this.checkStart(),this.state.gameFinished||null!==i[e][t]||(this.reveal(i,n,e,t),this.updateGameStatus(i,n,e,t))}},{key:"handleRightClick",value:function(e,n,i){var a=this.state.game.slice();e.preventDefault(),this.checkStart();var r=a[n][i];if(!(this.state.gameFinished||null!==r&&"F"!==r)){a[n][i]=r?null:"F";var s=this.state.minesLeft+(a[n][i]?-1:1);t.vibrate(200),this.setState({game:a,minesLeft:s})}}},{key:"reveal",value:function(e,t,n,i){this.inRange(n,i)&&null===e[n][i]&&(e[n][i]=t[n][i],0===e[n][i]&&this.expand(e,t,n,i))}},{key:"expand",value:function(e,t,n,i){this.reveal(e,t,n-1,i),this.reveal(e,t,n+1,i),this.reveal(e,t,n,i-1),this.reveal(e,t,n,i+1),this.reveal(e,t,n-1,i-1),this.reveal(e,t,n-1,i+1),this.reveal(e,t,n+1,i+1),this.reveal(e,t,n+1,i-1)}},{key:"updateGameStatus",value:function(e,n,i,a){if(t.isMine(e,i,a))return this.setGameOver(e,n,i,a);var r=!t.thereAreRemainingMoves(e,this.state.maximumMines),s=r?"\ud83d\ude0e":this.state.buttonStatus,o=this.state.minesLeft;r&&(this.stopTimer(),e=t.getSolution(e,n,"F"),o=0,t.vibrate([300,40,300,40,300,40,300]),this.updateBestTime(this.state.time||1)),this.setState({game:e,gameFinished:r,buttonStatus:s,minesLeft:o})}},{key:"setGameOver",value:function(e,n,i,a){this.stopTimer(),e=e.map(function(e,i){return e.map(function(e,a){var r=t.isMine(n,i,a);return"F"===e?r?e:"W":r?"M":e})}),t.vibrate(800),e[i][a]="C",this.setState({game:e,gameFinished:!0,buttonStatus:"\ud83d\udc80"})}},{key:"generateGame",value:function(e,n,i,a,r){for(var s,o,l=t.generateArray(e,n,0),c=0;c<r;)s=t.randomInRange(0,e-1),o=t.randomInRange(0,n-1),t.isMine(l,s,o)||i===s&&a===o||(l[s][o]="M",this.incrementMinesNearby(l,s-1,o),this.incrementMinesNearby(l,s+1,o),this.incrementMinesNearby(l,s,o-1),this.incrementMinesNearby(l,s,o+1),this.incrementMinesNearby(l,s-1,o-1),this.incrementMinesNearby(l,s-1,o+1),this.incrementMinesNearby(l,s+1,o+1),this.incrementMinesNearby(l,s+1,o-1),c++);return l}},{key:"incrementMinesNearby",value:function(e,n,i){this.inRange(n,i)&&!t.isMine(e,n,i)&&(e[n][i]=e[n][i]+1)}},{key:"inRange",value:function(e,t){return e>=0&&e<this.state.height&&t>=0&&t<this.state.width}},{key:"startTimer",value:function(){var e=this;this.setState({gameStarted:!0,time:1,start:Date.now()}),this.timer&&this.stopTimer(),this.timer=setInterval(function(){return e.setState({time:Math.floor((Date.now()-e.state.start)/1e3)+1})},1)}},{key:"stopTimer",value:function(){clearInterval(this.timer)}},{key:"updateBestTime",value:function(e){var t=Object.assign({},this.state.bestTimes),n=t[this.getBestTimeKey()]||null;(null===n||e<n)&&(t[this.getBestTimeKey()]=e,localStorage.setItem("minesweeper:bestTimes",JSON.stringify(t)),this.setState({bestTimes:t}))}},{key:"getBestTimeText",value:function(){var e=this.state.bestTimes[this.getBestTimeKey()]||null;return null!==e?"Best time: "+t.leftPad(e):""}},{key:"getBestTimeKey",value:function(){return"".concat(this.state.height,",").concat(this.state.width,",").concat(this.state.maximumMines)}},{key:"isGame",value:function(e,t,n){return this.state.height===e&&this.state.width===t&&this.state.maximumMines===n}},{key:"render",value:function(){var e=this;return a.a.createElement("div",{className:"Game"},a.a.createElement("div",{className:"wrapper"},a.a.createElement(y,{buttonStatus:this.state.buttonStatus,minesLeft:t.leftPad(this.state.minesLeft),time:t.leftPad(this.state.time),onClick:function(){return e.restart(e.state.height,e.state.width,e.state.maximumMines)}})),a.a.createElement(b,{onClick:function(t,n){return e.handleClick(t,n)},onRightClick:function(t,n,i){return e.handleRightClick(t,n,i)},game:this.state.game,gameFinished:this.state.gameFinished,width:this.state.width}),a.a.createElement("div",{className:"bestScore"},this.getBestTimeText()),a.a.createElement("div",{className:"difficulty"},a.a.createElement(p,{isSelected:this.isGame(9,9,10),onClick:function(){return e.restart(9,9,10)},label:"Beginner",emoji:"\ud83d\udc76"}),a.a.createElement(p,{isSelected:this.isGame(16,16,40),onClick:function(){return e.restart(16,16,40)},label:"Intermediate",emoji:"\ud83e\uddd1"}),a.a.createElement(p,{isSelected:this.isGame(16,30,99),onClick:function(){return e.restart(16,30,99)},label:"Expert",emoji:"\ud83e\uddd3"})))}}]),t}(i.Component),w=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function M(e,t){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}}).catch(function(e){console.error("Error during service worker registration:",e)})}s.a.render(a.a.createElement(S,null),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/minesweeper",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",function(){var t="".concat("/minesweeper","/service-worker.js");w?(function(e,t){fetch(e).then(function(n){var i=n.headers.get("content-type");404===n.status||null!=i&&-1===i.indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):M(e,t)}).catch(function(){console.log("No internet connection found. Game is running in offline mode.")})}(t,e),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")})):M(t,e)})}}()}],[[8,1,2]]]);
//# sourceMappingURL=main.54a55b8f.chunk.js.map