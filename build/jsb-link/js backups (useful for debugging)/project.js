require = function n(c, r, a) {
function h(s, t) {
if (!r[s]) {
if (!c[s]) {
var e = "function" == typeof require && require;
if (!t && e) return e(s, !0);
if (d) return d(s, !0);
var i = new Error("Cannot find module '" + s + "'");
throw i.code = "MODULE_NOT_FOUND", i;
}
var o = r[s] = {
exports: {}
};
c[s][0].call(o.exports, function(t) {
var e = c[s][1][t];
return h(e || t);
}, o, o.exports, n, c, r, a);
}
return r[s].exports;
}
for (var d = "function" == typeof require && require, t = 0; t < a.length; t++) h(a[t]);
return h;
}({
App: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "cd68cDXz3pB+oqLC/iYy35m", "App");
cc.Class({
extends: cc.Component,
properties: {
btnList: {
type: [ cc.Node ],
default: []
},
waitInfo: {
type: cc.Node,
default: null
},
txtProgress: {
type: cc.Label,
default: null
}
},
onLoad: function() {
(function() {
cc.vv = {};
cc.vv.global = e("Global");
cc.vv.tv = e("TV");
var t = e("Utils");
cc.vv.utils = new t();
})();
cc.vv.utils.setFitSreenMode();
this.init();
this.addEvent();
},
init: function() {
this.node.className = "App";
this._tv = cc.vv.tv;
this._tv.reset(this._tv.status.start);
this.waitInfo.active = !1;
this.txtProgress.string = "0%";
},
gotoGame: function(t) {
cc.vv.global.lvl = t;
console.log("home: " + t);
cc.director.preloadScene("game_scene", function() {
cc.director.loadScene("game_scene");
});
},
onBtnClickHandler: function(t) {
var e = t.currentTarget.name.split("_")[1];
this.gotoGame(e);
},
onKeyBHandler: function(t) {
var e = t + 1;
this.gotoGame(e);
},
addEvent: function() {
for (var t = 0; t < 3; ++t) {
this.btnList[t].on(cc.Node.EventType.TOUCH_END, this.onBtnClickHandler, this);
this._tv.addTouchToList(this.btnList[t], this.node, "app_btn_" + t, "onKeyBHandler", t);
}
},
removeEvent: function() {
for (var t = 0; t < 3; ++t) {
this.btnList[t].off(cc.Node.EventType.TOUCH_END, this.onBtnClickHandler, this);
this._tv.removeTouchByNode(this.btnList[t]);
}
},
onDestroy: function() {
this.removeEvent();
}
});
cc._RF.pop();
}, {
Global: "Global",
TV: "TV",
Utils: "Utils"
} ],
BGAdapter: [ function(t, e, s) {
"use strict";
cc._RF.push(e, "8e8ecauFhlPDbWo32bPa3xf", "BGAdapter");
cc.Class({
extends: cc.Component,
properties: {
scaleMethod: 0
},
start: function() {
var t = cc.find("Canvas").getComponent(cc.Canvas), e = cc.view.getFrameSize(), s = this.scaleMethod;
if (1 == s) t.fitWidth ? this.node.height = this.node.width / e.width * e.height : this.node.width = this.node.height / e.height * e.width; else if (2 == s) if (t.fitWidth) {
var i = this.node.height;
this.node.height = this.node.width / e.width * e.height;
this.node.width = this.node.height / i * this.node.width;
} else {
var o = this.node.width;
this.node.width = this.node.height / e.height * e.width;
this.node.height = this.node.width / o * this.node.height;
}
}
});
cc._RF.pop();
}, {} ],
Card: [ function(t, e, s) {
"use strict";
cc._RF.push(e, "b454698cwZKBLtTWg7QXTcT", "Card");
cc.Class({
extends: cc.Component,
properties: {
mouseEnabled: !0,
saveId: {
type: cc.Integer,
default: 0
},
curId: {
get: function() {
return this._sfId;
},
set: function(t) {
if (10 < t) cc.error("id 错误"); else {
0 !== t && (this.saveId = t);
this._sfId = t;
this.node.getComponent(cc.Sprite).spriteFrame = this.spriteframeList[t];
}
},
type: cc.Integer
},
spriteframeList: {
type: [ cc.SpriteFrame ],
default: []
}
},
onLoad: function() {
this.curId = 0;
this._isfloping = !1;
},
flop: function() {
this._isfloping = !0;
360 === this.node.rotationY && (this.node.rotationY = 0);
var t = void 0;
t = 0 === this.node.rotationY ? cc.sequence(cc.rotateTo(.5, 0, 180), cc.callFunc(this.flopCallback, this)) : cc.sequence(cc.rotateTo(.5, 0, 360), cc.callFunc(this.flopCallback, this));
this.node.runAction(t);
},
flopCallback: function() {
this._isfloping = !1;
},
update: function(t) {
if (!1 !== this._isfloping) if (90 < this.node.rotationY && this.node.rotationY < 270) {
this.curId = 0;
this.node.scaleX = -1;
} else {
this.curId = this.saveId;
this.node.scaleX = 1;
}
}
});
cc._RF.pop();
}, {} ],
Game: [ function(t, e, s) {
"use strict";
cc._RF.push(e, "c37c78ygP5PEKx8n68tz9oL", "Game");
cc.Class({
extends: cc.Component,
properties: {
btn_home: {
type: cc.Node,
default: null
},
btn_over_again: {
type: cc.Node,
default: null
},
btn_over_home: {
type: cc.Node,
default: null
},
menuScore: {
type: cc.Label,
default: null
},
overScore: {
type: cc.Label,
default: null
},
overPanel: {
type: cc.Node,
default: null
}
},
onLoad: function() {
cc.vv.utils.setFitSreenMode();
this.init();
this.addEvent();
},
init: function() {
this._lvl = cc.vv.global.lvl;
this._score = cc.vv.global.score;
this._itemNum = 20;
this._timeHandleList = [];
this._showList = [ 6, 12, 20 ];
this._delayList = [ 5e3, 1e4, 15e3 ];
this._posxList = [ -130, -200, -280 ];
this._posyList = [ 70, 140, 225 ];
this._cardList = [];
this._preCard = null;
this._curCard = null;
this._canClick = !1;
this._cardURL = "prefabs/card";
this.menuScore.string = this._score + "";
this.node.className = "Game";
this._tv = cc.vv.tv;
this._tv.reset(this._tv.status.choose);
this._keybList = [];
this.createCard();
},
setup: function() {
this.overPanel.active = !1;
this.clearTime();
this.updateScore(!0, !1);
var t = this._delayList[this._lvl - 1], e = setTimeout(this.gameStart.bind(this), t);
this._timeHandleList.push(e);
},
createCard: function() {
var n = this;
cc.loader.loadRes(this._cardURL, cc.Prefab, function(t, e) {
for (var s = 0; s < n._itemNum; ++s) {
var i = cc.instantiate(e);
n._cardList.push(i);
}
var o = n._lvl - 1;
n.showitem(n._showList[o], o);
n.chaosSort();
n.setup();
n.addCardEvent();
});
},
chaosSort: function() {
for (var t, e = this._showList[this._lvl - 1], s = 0; s < e; ++s) {
this._cardList[s].active = !0;
t = Math.floor(Math.random() * (e - 1));
var i = this._cardList[s].getComponent("Card"), o = this._cardList[t].getComponent("Card"), n = i.curId;
i.curId = o.curId;
o.curId = n;
this._tv.addTouchToList(this._cardList[s], this.node, "game_card_" + s, "onKeybCardHandler", s);
this._keybList.push(this._cardList[s]);
}
this._tv.addTouchToList(this.btn_home, this.node, "game_home", "onHomeHandler");
this._keybList.push(this.btn_home);
this._tv.emit(this._tv[this._tv.curStatus + "List"][0]);
},
showitem: function(t, e) {
var s = this._cardList[0].width + 8, i = this._cardList[0].height + 8, o = 0, n = void 0;
switch (t) {
case 6:
for (o = 0; o < t; ++o) {
(n = this._cardList[o]).x = o < 3 ? this._posxList[e] + o * s : this._posxList[e] + (o - 3) * s;
n.y = o < 3 ? this._posyList[e] : this._posyList[e] - i;
this.node.addChild(n);
n.getComponent("Card").curId = Math.floor(o / 2) + 1;
}
break;

case 12:
for (o = 0; o < t; ++o) {
(n = this._cardList[o]).x = o < 4 ? this._posxList[e] + o * s : o < 8 ? this._posxList[e] + (o - 4) * s : this._posxList[e] + (o - 8) * s;
n.y = o < 4 ? this._posyList[e] : o < 8 ? this._posyList[e] - i : this._posyList[e] - 2 * i;
this.node.addChild(n);
n.getComponent("Card").curId = Math.floor(o / 2) + 1;
}
break;

case 20:
for (o = 0; o < t; ++o) {
(n = this._cardList[o]).x = o < 5 ? this._posxList[e] + o * s : o < 10 ? this._posxList[e] + (o - 5) * s : o < 15 ? this._posxList[e] + (o - 10) * s : this._posxList[e] + (o - 15) * s;
n.y = o < 5 ? this._posyList[e] : o < 10 ? this._posyList[e] - i : o < 15 ? this._posyList[e] - 2 * i : this._posyList[e] - 3 * i;
this.node.addChild(n);
n.getComponent("Card").curId = Math.floor(o / 2) + 1;
}
}
},
gameStart: function() {
this.flopCards();
this._canClick = !0;
},
updateScore: function(t, e) {
if (!0 === t) this._score = 0; else {
!0 === e ? this._score += 10 : this._score -= 1;
this._score < 0 && (this._score = 0);
}
this.menuScore.string = this._score + "";
cc.vv.global.score = this._score;
},
checkWin: function() {
for (var t = this._showList[this._lvl - 1], e = 0, s = 0; s < t; ++s) {
0 !== this._cardList[s].getComponent("Card").curId && e++;
}
if (e === t) {
console.log("game over");
this.hideCards();
this.overPanel.active = !0;
this.overScore.string = this._score + "";
}
},
hideCards: function() {
for (var t = this._lvl - 1, e = 0; e < this._showList[t]; ++e) {
this._cardList[e].active = !1;
}
this.removeKeyBListen();
this._tv.addTouchToList(this.btn_over_again, this.node, "game_again", "onAgainHandler");
this._tv.addTouchToList(this.btn_over_home, this.node, "game_home", "onHomeHandler");
this._keybList.push(this.btn_over_again);
this._keybList.push(this.btn_over_home);
this._tv.emit(this._tv[this._tv.curStatus + "List"][0]);
},
flopOne: function(t) {
1 == t.mouseEnabled && t.flop();
},
runCardLogicById: function(t) {
var e = this;
if (!1 !== e._canClick) {
var s = e._cardList[t];
if (!1 !== s.getComponent("Card").mouseEnabled) {
e._curCard = s;
if (null === e._preCard || e._preCard === e._curCard) e._preCard = e._curCard; else {
e._canClick = !1;
var i = e._preCard.getComponent("Card"), o = e._curCard.getComponent("Card");
e.flopOne(i);
e.flopOne(o);
if (i.saveId === o.saveId) {
e._canClick = !0;
i.mouseEnabled = !1;
o.mouseEnabled = !1;
e._preCard = null;
e._curCard = null;
e.updateScore(!1, !0);
var n = setTimeout(e.checkWin.bind(e), 800);
e._timeHandleList.push(n);
} else {
e.updateScore(!1, !1);
var c = setTimeout(function() {
e._canClick = !0;
e.flopOne(i);
e.flopOne(o);
e._preCard = null;
e._curCard = null;
}, 800);
e._timeHandleList.push(c);
}
}
}
}
},
onKeybCardHandler: function(t) {
this.runCardLogicById(t);
},
onCardDownHandler: function(t) {
var e = this._cardList.indexOf(t.currentTarget);
this.runCardLogicById(e);
},
onHomeHandler: function(t) {
var e = cc.vv.global.lvl;
console.log("game: " + e);
cc.director.loadScene("home_scene");
},
onAgainHandler: function(t) {
this.removeKeyBListen();
this.chaosSort();
this.setup();
},
flopCards: function() {
for (var t = this._lvl - 1, e = 0; e < this._showList[t]; ++e) {
var s = this._cardList[e].getComponent("Card");
s.flop();
s.mouseEnabled = !0;
}
},
clearTime: function() {
for (var t = 0; t < this._timeHandleList.length; ++t) {
clearTimeout(this._timeHandleList[t]);
this._timeHandleList[t] = null;
}
this._timeHandleList.splice(0, this._timeHandleList.length);
},
removeKeyBListen: function() {
var t = this._keybList.length;
if (0 < t) {
for (var e = 0; e < t; ++e) this._tv.removeTouchByNode(this._keybList[e]);
this._keybList.splice(0, t);
}
},
addCardEvent: function() {
for (var t = 0; t < this._cardList.length; ++t) this._cardList[t].on(cc.Node.EventType.TOUCH_END, this.onCardDownHandler, this);
},
addEvent: function() {
this.btn_home.on(cc.Node.EventType.TOUCH_END, this.onHomeHandler, this);
this.btn_over_home.on(cc.Node.EventType.TOUCH_END, this.onHomeHandler, this);
this.btn_over_again.on(cc.Node.EventType.TOUCH_END, this.onAgainHandler, this);
},
removeEvent: function() {
for (var t = 0; t < this._cardList.length; ++t) this._cardList[t].off(cc.Node.EventType.TOUCH_END, this.onCardDownHandler, this);
this.btn_home.off(cc.Node.EventType.TOUCH_END, this.onHomeHandler, this);
this.btn_over_home.off(cc.Node.EventType.TOUCH_END, this.onHomeHandler, this);
this.btn_over_again.off(cc.Node.EventType.TOUCH_END, this.onAgainHandler, this);
this.removeKeyBListen();
},
onDestroy: function() {
this.clearTime();
this.removeEvent();
cc.loader.releaseRes(this._cardURL, cc.Prefab);
}
});
cc._RF.pop();
}, {} ],
Global: [ function(t, e, s) {
"use strict";
cc._RF.push(e, "8ce4arcJCtBbKIw6/t6zPVl", "Global");
e.exports = {
lvl: 0,
score: 0
};
cc._RF.pop();
}, {} ],
TVKeyboardMgr: [ function(t, e, s) {
"use strict";
cc._RF.push(e, "5d8c2SmiC5MxLvXPy8hpF3C", "TVKeyboardMgr");
cc.Class({
extends: cc.Component,
properties: {
cursor: {
type: cc.Node,
default: null
},
lbKeycode: {
type: cc.Label,
default: null
},
_flag: !0,
_isMove: !0
},
onLoad: function() {
this._tv = cc.vv.tv;
this.cursor.zIndex = 999;
this.addEvent();
},
myLog: function(t) {
this.lbKeycode.string = t;
},
action: function(t) {
try {
if (!t) {
console.log("action param error!");
return;
}
"self" == t.cnNode ? t.getComponent(t.className)[t.fn](t.param) : t.cnNode.getComponent(t.cnNode.className)[t.fn](t.param);
} catch (t) {
console.log(t);
}
},
onKeyBUp: function(t) {
switch (t.keyCode) {
case cc.KEY.w:
case cc.KEY.dpadUp:
this.myLog("onKeyUp up " + t.keyCode);
break;

case cc.KEY.s:
case cc.KEY.dpadDown:
this.myLog("onKeyUp down " + t.keyCode);
break;

case cc.KEY.a:
case cc.KEY.dpadLeft:
this.myLog("onKeyUp left " + t.keyCode);
break;

case cc.KEY.d:
case cc.KEY.dpadRight:
this.myLog("onKeyUp right " + t.keyCode);
break;

case cc.KEY.space:
case cc.KEY.dpadCenter:
this.myLog("onKeyUp center " + t.keyCode);
}
},
onKeyBDown: function(t) {
this._isMove = !0;
switch (t.keyCode) {
case cc.KEY.w:
case cc.KEY.dpadUp:
this.myLog("onKeyDown up " + t.keyCode);
this._tv[this._tv.curStatus + "Count"]--;
this._flag = !1;
break;

case cc.KEY.s:
case cc.KEY.dpadDown:
this.myLog("onKeyDown down " + t.keyCode);
this._tv[this._tv.curStatus + "Count"]++;
this._flag = !0;
break;

case cc.KEY.a:
case cc.KEY.dpadLeft:
this.myLog("onKeyDown left " + t.keyCode);
this._tv[this._tv.curStatus + "Count"]--;
this._flag = !1;
break;

case cc.KEY.d:
case cc.KEY.dpadRight:
this.myLog("onKeyDown right " + t.keyCode);
this._tv[this._tv.curStatus + "Count"]++;
this._flag = !0;
break;

case cc.KEY.space:
case cc.KEY.dpadCenter:
this.myLog("onKeyDown center " + t.keyCode);
this._isMove = !1;
this.action(this._tv[this._tv.curStatus + "List"][this._tv[this._tv.curStatus + "Count"]]);
}
this._tv[this._tv.curStatus + "Count"] < 0 ? this._tv[this._tv.curStatus + "Count"] = this._tv[this._tv.curStatus + "List"].length - 1 : this._tv[this._tv.curStatus + "Count"] >= this._tv[this._tv.curStatus + "List"].length && (this._tv[this._tv.curStatus + "Count"] = 0);
this._isMove && (this.cursor.position = this._tv.convertPos(this._tv[this._tv.curStatus + "List"][this._tv[this._tv.curStatus + "Count"]]));
},
onCursor: function(t) {
this.cursor.position = t.detail.pos;
},
addEvent: function() {
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyBUp, this);
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyBDown, this);
this._tv.customEvent.on("cursor", this.onCursor, this);
},
removeEvent: function() {
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyBUp, this);
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyBDown, this);
this._tv.customEvent.off("cursor", this.onCursor, this);
},
onDestroy: function() {
this.removeEvent();
}
});
cc._RF.pop();
}, {} ],
TV: [ function(t, e, s) {
"use strict";
cc._RF.push(e, "418ecGvJb5CnoGdBAwDyEBF", "TV");
(e.exports = {
_TAG: "TV",
_isInit: !0,
customEvent: new cc.EventTarget(),
curStatus: "",
status: {
start: "start",
choose: "choose"
},
init: function() {
if (this._isInit) {
this._isInit = !1;
this.curStatus = this.status.start;
for (var t in this.status) {
this[this.status[t] + "List"] = [];
this[this.status[t] + "Count"] = 0;
}
}
},
reset: function(t) {
if (t && "undefined" != typeof t) {
this.curStatus = t;
this[this.status + "List"] = [];
this[this.status + "Count"] = 0;
}
},
convertPos: function(t) {
if (t) return cc.pSub(t.parent.convertToWorldSpaceAR(t.position), cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
console.warn(this._TAG + " convertPos param error!");
},
emit: function(t) {
if (t) {
var e = this.convertPos(t);
this.customEvent.emit("cursor", {
pos: e
});
} else console.warn(this._TAG + " emit param error!");
},
addTouchToList: function(t, e, s, i) {
var o = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : null;
t.alias = s;
t.cnNode = e;
t.fn = i;
t.param = o;
this[this.curStatus + "List"].push(t);
},
removeTouchByNode: function(t) {
if (t) {
for (var e = 0; e < this[this.curStatus + "List"].length; ++e) if (this[this.curStatus + "List"][e] === t) {
this[this.curStatus + "List"].splice(e, 1);
break;
}
this[this.curStatus + "Count"] >= this[this.curStatus + "List"].length && (this[this.curStatus + "Count"] = 0);
} else console.warn(this._TAG + " removeTouchByNode param error! " + t);
}
}).init();
cc._RF.pop();
}, {} ],
Utils: [ function(t, e, s) {
"use strict";
cc._RF.push(e, "eb57dVCFQFBr7fjqZJEZl8l", "Utils");
cc.Class({
extends: cc.Component,
properties: {},
addClickEvent: function(t, e, s, i) {
console.log(s + ": " + i);
var o = new cc.Component.EventHandler();
o.target = e;
o.component = s;
o.handler = i;
t.getComponent(cc.Button).clickEvents.push(o);
},
setFitSreenMode: function() {
var t = cc.view.getFrameSize(), e = t.width, s = t.height, i = cc.find("Canvas").getComponent(cc.Canvas);
if (i.designResolution.width / i.designResolution.height < e / s) {
i.fitHeight = !0;
i.fitWidth = !1;
} else {
i.fitHeight = !1;
i.fitWidth = !0;
}
}
});
cc._RF.pop();
}, {} ]
}, {}, [ "BGAdapter", "Global", "TV", "TVKeyboardMgr", "Utils", "App", "Card", "Game" ]);