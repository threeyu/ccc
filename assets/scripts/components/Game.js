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

        btn_home: {
            type: cc.Node,
            default: null,
        },
        btn_over_again: {
            type: cc.Node,
            default: null,
        },
        btn_over_home: {
            type: cc.Node,
            default: null,
        },

        menuScore: {
            type: cc.Label,
            default: null,
        },
        overScore: {
            type: cc.Label,
            default: null,
        },
        overPanel: {
            type: cc.Node,
            default: null,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.vv.utils.setFitSreenMode();


        this.initData();
    },

    start() {
        this.setup();
    },

    // update (dt) {},

    setup: function () {
        this.overPanel.active = false;
        this.clearTime();
        this.updateScore(true, false);


        var delay = this._delayList[this._lvl - 1];;
        var handl = setTimeout(this.gameStart.bind(this), delay);
        this._timeHandleList.push(handl);
    },

    chaosSort: function () {
        var len = this._showList[this._lvl - 1];
        for (var i = 0, rand; i < len; ++i) {
            this._cardList[i].active = true;

            rand = Math.floor(Math.random() * (len - 1));
            var tmpx = this._cardList[i].x;
            var tmpy = this._cardList[i].y;
            this._cardList[i].x = this._cardList[rand].x;
            this._cardList[i].y = this._cardList[rand].y;
            this._cardList[rand].x = tmpx;
            this._cardList[rand].y = tmpy;
        }
    },

    initData: function () {
        this._lvl = cc.vv.global.lvl;
        this._score = cc.vv.global.score;
        this._itemNum = 20;
        this._timeHandleList = [];
        this._showList = [6, 12, 20];
        this._delayList = [5000, 10000, 15000];
        this._posxList = [-130, -200, -280];
        this._posyList = [70, 140, 225];
        this._cardList = [];
        this._preCard = null;
        this._curCard = null;
        this._canClick = false;


        this.menuScore.string = this._score + '';


        this.createCard();
    },

    createCard: function () {
        var self = this;
        cc.loader.loadRes('prefabs/card', cc.Prefab, function (err, res) {
            for (var i = 0; i < self._itemNum; ++i) {
                var card = cc.instantiate(res);
                self._cardList.push(card);
            }


            var key = self._lvl - 1;
            self.showitem(self._showList[key], key);

            self.chaosSort();// 乱序

            // 添加事件
            self.addEvent();
        });
    },

    showitem: function (type, mode) {
        var w = this._cardList[0].width + 8;
        var h = this._cardList[0].height + 8;
        var i = 0;
        var cardNode, card;

        switch (type) {
            case 6:
                for (i = 0; i < type; ++i) {
                    cardNode = this._cardList[i];
                    cardNode.x = i < 3 ? this._posxList[mode] + i * w : this._posxList[mode] + (i - 3) * w;
                    cardNode.y = i < 3 ? this._posyList[mode] : this._posyList[mode] - h;
                    this.node.addChild(cardNode);

                    card = cardNode.getComponent('Card');
                    card.curId = Math.floor(i / 2) + 1;
                }
                break;
            case 12:
                for (i = 0; i < type; ++i) {
                    cardNode = this._cardList[i];
                    cardNode.x = i < 4 ? this._posxList[mode] + i * w : i < 8 ? this._posxList[mode] + (i - 4) * w : this._posxList[mode] + (i - 8) * w;
                    cardNode.y = i < 4 ? this._posyList[mode] : i < 8 ? this._posyList[mode] - h : this._posyList[mode] - 2 * h;
                    this.node.addChild(cardNode);

                    card = cardNode.getComponent('Card');
                    card.curId = Math.floor(i / 2) + 1;
                }
                break;
            case 20:
                for (i = 0; i < type; ++i) {
                    cardNode = this._cardList[i];
                    cardNode.x = i < 5 ? this._posxList[mode] + i * w : i < 10 ? this._posxList[mode] + (i - 5) * w : i < 15 ? this._posxList[mode] + (i - 10) * w : this._posxList[mode] + (i - 15) * w;
                    cardNode.y = i < 5 ? this._posyList[mode] : i < 10 ? this._posyList[mode] - h : i < 15 ? this._posyList[mode] - 2 * h : this._posyList[mode] - 3 * h;
                    this.node.addChild(cardNode);

                    card = cardNode.getComponent('Card');
                    card.curId = Math.floor(i / 2) + 1;
                }
                break;
        }
    },

    gameStart: function () {
        this.flopCards();
        this._canClick = true;
    },

    updateScore: function (isReset, isAdd) {
        if (isReset === true) {
            this._score = 0;
        } else {
            if (isAdd === true) {
                this._score += 10;
            } else {
                this._score -= 1;
            }
            if (this._score < 0) {
                this._score = 0;
            }
        }

        this.menuScore.string = this._score + '';
        cc.vv.global.score = this._score;
    },

    checkWin: function () {
        var winCnt = this._showList[this._lvl - 1];
        var doneCnt = 0;
        for (var i = 0; i < winCnt; ++i) {
            var cardComp = this._cardList[i].getComponent('Card');
            if (cardComp.curId !== 0) {
                doneCnt++;
            }
        }

        if (doneCnt === winCnt) {
            console.log('game over');
            this.hideCards();

            this.overPanel.active = true;
            this.overScore.string = this._score + '';
            var bg = this.overPanel.getChildByName('bg');
            bg.y = 300;
            var act = cc.moveTo(0.5, cc.p(0, 0));
            bg.runAction(act);
        }
    },

    hideCards: function () {
        var key = this._lvl - 1;
        for (var i = 0; i < this._showList[key]; ++i) {
            var card = this._cardList[i];
            card.active = false;
        }
    },

    flopOne: function (cardComp) {
        if (cardComp.mouseEnabled == true) {
            cardComp.flop();
        }
    },

    onCardDownHandler: function (e) {
        var self = this;
        if (self._canClick === false) {
            return;
        }

        var cardcomp = e.currentTarget.getComponent('Card');
        if (cardcomp.mouseEnabled === false) {
            return;
        }

        self._curCard = e.currentTarget;
        if (self._preCard !== null && self._preCard !== self._curCard) {
            self._canClick = false;
            var pCardComp = self._preCard.getComponent('Card');
            var cCardComp = self._curCard.getComponent('Card');
            self.flopOne(pCardComp);
            self.flopOne(cCardComp);

            if (pCardComp.saveId === cCardComp.saveId) {
                self._canClick = true;
                pCardComp.mouseEnabled = false;
                cCardComp.mouseEnabled = false;
                self._preCard = null;
                self._curCard = null;
                self.updateScore(false, true);
                var handl = setTimeout(self.checkWin.bind(self), 800);
                self._timeHandleList.push(handl);
            } else {
                self.updateScore(false, false);
                var handl = setTimeout(function () {
                    self._canClick = true;
                    self.flopOne(pCardComp);
                    self.flopOne(cCardComp);
                    self._preCard = null;
                    self._curCard = null;
                }, 800);
                self._timeHandleList.push(handl);
            }
            return;
        }
        self._preCard = self._curCard;
    },

    onHomeHandler: function (e) {
        var id = cc.vv.global.lvl;
        console.log('game: ' + id);

        // cc.textureCache.dumpCachedTextureInfo();
        cc.director.loadScene('home_scene');
    },

    onAgainHandler: function (e) {
        this.chaosSort();// 乱序
        this.setup();
    },

    flopCards: function () {
        var key = this._lvl - 1;
        for (var i = 0; i < this._showList[key]; ++i) {
            var cardComp = this._cardList[i].getComponent('Card');
            cardComp.flop();
            cardComp.mouseEnabled = true;
        }
    },

    clearTime: function () {
        for (var i = 0; i < this._timeHandleList.length; ++i) {
            clearTimeout(this._timeHandleList[i]);
            this._timeHandleList[i] = null;
        }
        this._timeHandleList.splice(0, this._timeHandleList.length);
    },

    addEvent: function () {
        for (var i = 0; i < this._cardList.length; ++i) {
            this._cardList[i].on(cc.Node.EventType.TOUCH_END, this.onCardDownHandler, this);
        }

        this.btn_home.on(cc.Node.EventType.TOUCH_END, this.onHomeHandler, this);
        this.btn_over_home.on(cc.Node.EventType.TOUCH_END, this.onHomeHandler, this);
        this.btn_over_again.on(cc.Node.EventType.TOUCH_END, this.onAgainHandler, this);
    },

    removeEvent: function () {
        for (var i = 0; i < this._cardList.length; ++i) {
            this._cardList[i].off(cc.Node.EventType.TOUCH_END, this.onCardDownHandler, this);
        }

        this.btn_home.off(cc.Node.EventType.TOUCH_END, this.onHomeHandler, this);
        this.btn_over_home.off(cc.Node.EventType.TOUCH_END, this.onHomeHandler, this);
        this.btn_over_again.off(cc.Node.EventType.TOUCH_END, this.onAgainHandler, this);
    },

    onDestroy() {
        this.clearTime();
        this.removeEvent();
    }


});