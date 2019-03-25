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
        this._tv = cc.vv.tv;

        this.cursor.zIndex = 999;

        this.addEvent();
    },

    myLog: function (str) {
        // console.log(str);
        this.lbKeycode.string = str;
    },

    action: function (node) {
        try {
            if(!node) {
                console.log('action param error!');
                return;
            }

            if(node.cnNode == 'self') {
                node.getComponent(node.className)[node.fn](node.param);
            } else {
                node.cnNode.getComponent(node.cnNode.className)[node.fn](node.param);
            }
        } catch(error) {
            console.log(error);
        }
    },

    /**
     * 键    cocos默认键值   小米盒子测试键值
     * 上    1003            1003
     * 下    1004            1004
     * 左    1000            1000
     * 右    1001            1001
     * 确定  1005            13  (小米盒子确定键使用的是全键盘的enter)
     * 返回  6               6
     * 菜单  18              18
     */
    onKeyBUp: function (e) {
        switch (e.keyCode) {
            case cc.KEY.w:
            case cc.KEY.dpadUp:// 1003
                this.myLog('onKeyUp up ' + e.keyCode);
                break;
            case cc.KEY.s:
            case cc.KEY.dpadDown:// 1004
                this.myLog('onKeyUp down ' + e.keyCode);
                break;
            case cc.KEY.a:
            case cc.KEY.dpadLeft:// 1000
                this.myLog('onKeyUp left ' + e.keyCode);
                break;
            case cc.KEY.d:
            case cc.KEY.dpadRight:// 1001
                this.myLog('onKeyUp right ' + e.keyCode);
                break;
            case cc.KEY.space:
            case cc.KEY.dpadCenter:// 1005
                this.myLog('onKeyUp center ' + e.keyCode);
                break;
        }
    },

    onKeyBDown: function (e) {
        this._isMove = true;
        switch (e.keyCode) {
            case cc.KEY.w:
            case cc.KEY.dpadUp:// 1003
                this.myLog('onKeyDown up ' + e.keyCode);
                this._tv[this._tv.curStatus + 'Count']--;
                this._flag = false;
                break;
            case cc.KEY.s:
            case cc.KEY.dpadDown:// 1004
                this.myLog('onKeyDown down ' + e.keyCode);
                this._tv[this._tv.curStatus + 'Count']++;
                this._flag = true;
                break;
            case cc.KEY.a:
            case cc.KEY.dpadLeft:// 1000
                this.myLog('onKeyDown left ' + e.keyCode);
                this._tv[this._tv.curStatus + 'Count']--;
                this._flag = false;
                break;
            case cc.KEY.d:
            case cc.KEY.dpadRight:// 1001
                this.myLog('onKeyDown right ' + e.keyCode);
                this._tv[this._tv.curStatus + 'Count']++;
                this._flag = true;
                break;
            case cc.KEY.space:
            case cc.KEY.dpadCenter:// 1005
                this.myLog('onKeyDown center ' + e.keyCode);
                this._isMove = false;
                this.action(this._tv[this._tv.curStatus + 'List'][this._tv[this._tv.curStatus + 'Count']]);
                break;
        }

        if (this._tv[this._tv.curStatus + 'Count'] < 0) {
            this._tv[this._tv.curStatus + 'Count'] = this._tv[this._tv.curStatus + 'List'].length - 1;
        } else if (this._tv[this._tv.curStatus + 'Count'] >= this._tv[this._tv.curStatus + 'List'].length) {
            this._tv[this._tv.curStatus + 'Count'] = 0;
        }

        if (this._isMove) {
            this.cursor.position = this._tv.convertPos(this._tv[this._tv.curStatus + 'List'][this._tv[this._tv.curStatus + 'Count']]);
        }
    },

    onCursor: function (e) {
        this.cursor.position = e.detail.pos;
    },

    addEvent: function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyBUp, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyBDown, this);
        this._tv.customEvent.on('cursor', this.onCursor, this);
    },

    removeEvent: function () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyBUp, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyBDown, this);
        this._tv.customEvent.off('cursor', this.onCursor, this);
    },


    onDestroy() {
        this.removeEvent();
    },
});