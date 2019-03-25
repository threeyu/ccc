// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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

        mouseEnabled: true,
        saveId: {
            type: cc.Integer,
            default: 0,
        },

        curId: {
            get: function () {
                return this._sfId;
            },
            set: function (val) {
                if (val > 10) {
                    cc.error('id 错误');
                    return;
                }

                if (val !== 0) {
                    this.saveId = val;
                }
                this._sfId = val;
                this.node.getComponent(cc.Sprite).spriteFrame = this.spriteframeList[val];
            },
            type: cc.Integer,
        },
        spriteframeList: {
            type: [cc.SpriteFrame],
            default: [],
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.curId = 0;
        this._isfloping = false;
    },

    flop: function () {
        // let act;
        // if(this.node.scaleX === 1) {
        //     act = cc.scaleTo(0.5, -1, 1);
        // } else {
        //     act = cc.scaleTo(0.5, 1, 1);
        // }
        // this.node.runAction(act);


        this._isfloping = true;
        if (this.node.rotationY === 360) {
            this.node.rotationY = 0;
        }
        let seq;
        if (this.node.rotationY === 0) {
            seq = cc.sequence(cc.rotateTo(0.5, 0, 180), cc.callFunc(this.flopCallback, this));
        } else {
            seq = cc.sequence(cc.rotateTo(0.5, 0, 360), cc.callFunc(this.flopCallback, this));
        }
        this.node.runAction(seq);
    },

    flopCallback: function () {
        this._isfloping = false;
    },

    // start() {},

    update(dt) {
        if (this._isfloping === false) {
            return;
        }

        if (this.node.rotationY > 90 && this.node.rotationY < 270) {
            // 由正面转到背面
            this.curId = 0;
            this.node.scaleX = -1;
        } else {
            // 由背面转到正面
            this.curId = this.saveId;
            this.node.scaleX = 1;
        }
    },
});
