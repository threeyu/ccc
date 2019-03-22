// tv键盘事件管理
cc.Class({
    extends: cc.Component,

    properties: {
        // 光标
        cursor: {
            type: cc.Node,
            default: null,
        },
        // 测试用log
        lbKeycode: {
            type: cc.Label,
            default: null,
        },

        _flag: true,        // 判断加减
        _isMove: true,      // 判断是否需要移动光标

    },

    onLoad() {
        this.cursor.zIndex = 999;


        this.addEvent();
    },

    onKeyUp: function (e) {

    },

    onKeyDown: function (e) {

    },

    addEvent: function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    removeEvent: function () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },


    onDestroy() {
        this.removeEvent();
    },
});