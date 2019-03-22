// 工具类
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // 模拟点击事件
    addClickEvent: function (node, target, component, onHandler) {
        console.log(component + ': ' + onHandler);
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = onHandler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },

    // 内容适配
    setFitSreenMode: function () {
        var size = cc.view.getFrameSize();
        var fw = size.width;
        var fh = size.height;

        var cvs = cc.find('Canvas').getComponent(cc.Canvas);
        var dw = cvs.designResolution.width;
        var dh = cvs.designResolution.height;

        if ((fw / fh) > (dw / dh)) {
            // 如果更宽 则让高显示满
            cvs.fitHeight = true;
            cvs.fitWidth = false;
        } else {
            // 如果更高，则让宽显示满
            cvs.fitHeight = false;
            cvs.fitWidth = true;
        }
    }

});