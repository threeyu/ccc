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

        scaleMethod: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {},

    start() {
        // 0、居中（居中其实不需要挂这个脚本，浪费效率）
        // 1、宽高都根据高度拉伸
        // 2、长边充满
        let cvs = cc.find('Canvas').getComponent(cc.Canvas);
        let size = cc.view.getFrameSize();
        //
        let scaleMethod = this.scaleMethod;
        if (scaleMethod == 1) {
            if (cvs.fitWidth) {
                this.node.height = this.node.width / size.width * size.height;
            }
            else {
                this.node.width = this.node.height / size.height * size.width;
            }
        }
        else if (scaleMethod == 2) {
            if (cvs.fitWidth) {
                let oldHeight = this.node.height;
                this.node.height = this.node.width / size.width * size.height;
                this.node.width = this.node.height / oldHeight * this.node.width;
            }
            else {
                let oldWidth = this.node.width;
                this.node.width = this.node.height / size.height * size.width;
                this.node.height = this.node.width / oldWidth * this.node.height;
            }
        }
    },

    // update (dt) {},


});
