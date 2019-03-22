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


    var TVKeyboardMgr = require('TVKeyboardMgr');
    cc.vv.tvKeyboardMgr = new TVKeyboardMgr();


    var Utils = require('Utils');
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

        btn_1: {
            type: cc.Node,
            default: null,
        },
        btn_2: {
            type: cc.Node,
            default: null,
        },
        btn_3: {
            type: cc.Node,
            default: null,
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

        this.waitInfo.active = false;
        this.txtProgress.string = '0%';

        this.addEvent();
    },

    // start() {},

    // update (dt) {},


    onBtnClickHandler: function (e) {
        var id = e.currentTarget.name.split('_')[1];
        cc.vv.global.lvl = id;
        console.log('home: ' + id);

        // cc.textureCache.dumpCachedTextureInfo();
        cc.director.loadScene('game_scene');


        // this.waitInfo.active = true;
        // cc.loader.onProgress = function (completedCount, totalCount, item) {
        //     // console.log("completedCount:" + completedCount + ",totalCount:" + totalCount);
        //     var per = Math.floor(completedCount * 100 / totalCount);
        //     this.txtProgress.string = per + "%";
        // }.bind(this);

        // cc.director.preloadScene('game_scene', function () {
        //     cc.loader.onProgress = null;
        //     cc.director.loadScene('game_scene');
        // });
    },

    addEvent: function () {
        this.btn_1.on(cc.Node.EventType.TOUCH_END, this.onBtnClickHandler, this);
        this.btn_2.on(cc.Node.EventType.TOUCH_END, this.onBtnClickHandler, this);
        this.btn_3.on(cc.Node.EventType.TOUCH_END, this.onBtnClickHandler, this);
    },

    removeEvent: function () {
        this.btn_1.off(cc.Node.EventType.TOUCH_END, this.onBtnClickHandler, this);
        this.btn_2.off(cc.Node.EventType.TOUCH_END, this.onBtnClickHandler, this);
        this.btn_3.off(cc.Node.EventType.TOUCH_END, this.onBtnClickHandler, this);
    },

    onDestroy() {
        this.removeEvent();
    },
});
