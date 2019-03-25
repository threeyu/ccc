// tv全局数据
const tv = module.exports = {
    _TAG: 'TV',
    _isInit: true,

    customEvent: new cc.EventTarget(),
    curStatus: '',//当前状态
    // 状态列表
    status: {
        start: 'start',
        choose: 'choose',
    },

    init: function () {
        if (this._isInit) {
            this._isInit = false;
            this.curStatus = this.status.start;
            for (let i in this.status) {
                this[this.status[i] + 'List'] = [];
                this[this.status[i] + 'Count'] = 0;
            }
        }
    },

    reset: function (status) {
        if (!status || typeof status === 'undefined') {
            return;
        }
        this.curStatus = status;
        this[this.status + 'List'] = [];
        this[this.status + 'Count'] = 0;
    },

    convertPos: function (node) {
        if (!node) {
            console.warn(this._TAG + ' convertPos param error!');
            return;
        }
        return cc.pSub(node.parent.convertToWorldSpaceAR(node.position), cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
    },

    emit: function (node) {
        if (!node) {
            console.warn(this._TAG + ' emit param error!');
            return;
        }
        let pos = this.convertPos(node);
        this.customEvent.emit('cursor', { pos });
    },

    /**
     * 存储可以触摸的节点
     * @param {cc.Node} node 保存当前节点
     * @param {cc.Node} cnNode 保存函数调用节点
     * @param {String} alias 别名
     * @param {String} funcName 需要调用的函数名
     * @param {*} param 上面函数的参数
     */
    addTouchToList: function (node, cnNode, alias, funcName, param = null) {
        node.alias = alias;
        node.cnNode = cnNode;
        node.fn = funcName;
        node.param = param;
        this[this.curStatus + 'List'].push(node);
    },

    /**
     * 移除节点
     * @param {cc.Node} node 
     */
    removeTouchByNode: function (node) {
        if (!node) {
            console.warn(this._TAG + ' removeTouchByNode param error! ' + node);
            return;
        }
        for (let i = 0; i < this[this.curStatus + 'List'].length; ++i) {
            if (this[this.curStatus + 'List'][i] === node) {
                this[this.curStatus + 'List'].splice(i, 1);
                break;
            }
        }
        if (this[this.curStatus + 'Count'] >= this[this.curStatus + 'List'].length) {
            this[this.curStatus + 'Count'] = 0;
        }
        console.log(this[this.curStatus + 'List'].length + ',' + this[this.curStatus + 'Count']);
    },

};
tv.init();