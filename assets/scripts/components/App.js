// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

function initMgr() {
    cc.vv = {};

    cc.vv.global = require('Global');
    cc.vv.tv = require('TV');


    let TVKeyboardMgr = require('TVKeyboardMgr');
    cc.vv.tvKeyboardMgr = new TVKeyboardMgr();


    let Utils = require('Utils');
    cc.vv.utils = new Utils();
}

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        btnList: {
            type: [cc.Node],
            default: [],
        },
        waitInfo: {
            type: cc.Node,
            default: null,
        },
        txtProgress: {
            type: cc.Label,
            default: null,
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        initMgr();
        cc.vv.utils.setFitSreenMode();


        this.init();
        this.addEvent();
    },

    init: function () {
        // tv 遥控器
        this.node.className = 'App';
        this._tv = cc.vv.tv;
        this._tv.reset(this._tv.status.start);

        // 进度条
        this.waitInfo.active = false;
        this.txtProgress.string = '0%';
    },

    // start() {},

    // update (dt) {},

    gotoGame(id) {
        cc.vv.global.lvl = id;
        console.log('home: ' + id);

        // cc.textureCache.dumpCachedTextureInfo();
        // cc.director.loadScene('game_scene');


        // this.waitInfo.active = true;
        // cc.loader.onProgress = function (completedCount, totalCount, item) {
        //     // console.log("completedCount:" + completedCount + ",totalCount:" + totalCount);
        //     let per = Math.floor(completedCount * 100 / totalCount);
        //     this.txtProgress.string = per + "%";
        // }.bind(this);

        cc.director.preloadScene('game_scene', function () {
            // cc.loader.onProgress = null;
            cc.director.loadScene('game_scene');
        });
    },

    onBtnClickHandler: function (e) {
        let id = e.currentTarget.name.split('_')[1];
        this.gotoGame(id);
    },

    onKeyBHandler: function (e) {
        let id = e + 1;
        this.gotoGame(id);
    },

    addEvent: function () {
        for (let i = 0; i < 3; ++i) {
            this.btnList[i].on(cc.Node.EventType.TOUCH_END, this.onBtnClickHandler, this);

            this._tv.addTouchToList(this.btnList[i], this.node, 'start_' + i, 'onKeyBHandler', i);
        }
        this._tv.emit(this._tv[this._tv.curStatus + 'List'][0]);
    },

    removeEvent: function () {
        for (let i = 0; i < 3; ++i) {
            this.btnList[i].off(cc.Node.EventType.TOUCH_END, this.onBtnClickHandler, this);

            this._tv.removeTouchByNode(this.btnList[i]);
        }
    },

    onDestroy() {
        this.removeEvent();
    },
});
