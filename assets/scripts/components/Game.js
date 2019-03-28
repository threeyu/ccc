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


        this.init();
        this.addEvent();
    },

    // start() {},

    // update (dt) {},

    init: function () {
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
        this._cardURL = 'prefabs/card';


        this.menuScore.string = this._score + '';


        // tv 遥控器
        this.node.className = 'Game';
        this._tv = cc.vv.tv;
        this._tv.reset(this._tv.status.choose);
        this._keybList = [];// 用于存储当前能活动的按钮


        this.createCard();
    },

    setup: function () {
        this.overPanel.active = false;
        this.clearTime();
        this.updateScore(true, false);


        let delay = this._delayList[this._lvl - 1];;
        let handl = setTimeout(this.gameStart.bind(this), delay);
        this._timeHandleList.push(handl);
    },

    createCard: function () {
        let self = this;
        cc.loader.loadRes(this._cardURL, cc.Prefab, function (err, res) {
            for (let i = 0; i < self._itemNum; ++i) {
                let card = cc.instantiate(res);
                self._cardList.push(card);
            }

            let key = self._lvl - 1;
            self.showitem(self._showList[key], key);

            
            self.chaosSort();// 乱序
            self.setup();
            // 添加事件
            self.addCardEvent();
        });
    },

    chaosSort: function () {
        let len = this._showList[this._lvl - 1];
        for (let i = 0, rand; i < len; ++i) {
            this._cardList[i].active = true;
            rand = Math.floor(Math.random() * (len - 1));
            let tmpCard = this._cardList[i].getComponent('Card');
            let randCard = this._cardList[rand].getComponent('Card');
            let tmpId = tmpCard.curId;
            tmpCard.curId = randCard.curId;
            randCard.curId = tmpId;

            this._tv.addTouchToList(this._cardList[i], this.node, 'game_card_' + i, 'onKeybCardHandler', i);
            this._keybList.push(this._cardList[i]);
        }

        // add key ctrl on btn_home
        this._tv.addTouchToList(this.btn_home, this.node, 'game_home', 'onHomeHandler');
        this._keybList.push(this.btn_home);
        this._tv.emit(this._tv[this._tv.curStatus + 'List'][0]);
        
    },

    showitem: function (type, mode) {
        let w = this._cardList[0].width + 8;
        let h = this._cardList[0].height + 8;
        let i = 0;
        let cardNode, card;

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
        let winCnt = this._showList[this._lvl - 1];
        let doneCnt = 0;
        for (let i = 0; i < winCnt; ++i) {
            let cardComp = this._cardList[i].getComponent('Card');
            if (cardComp.curId !== 0) {
                doneCnt++;
            }
        }

        if (doneCnt === winCnt) {
            console.log('game over');
            this.hideCards();

            this.overPanel.active = true;
            this.overScore.string = this._score + '';
            // let bg = this.overPanel.getChildByName('bg');
            // bg.y = 300;
            // let act = cc.moveTo(0.5, cc.p(0, 0));
            // bg.runAction(act);
        }
    },

    hideCards: function () {
        // hide all cards
        let key = this._lvl - 1;
        for (let i = 0; i < this._showList[key]; ++i) {
            let card = this._cardList[i];
            card.active = false;
        }


        // remove keyctrl
        this.removeKeyBListen();


        // over add keyctrl
        this._tv.addTouchToList(this.btn_over_again, this.node, 'game_again', 'onAgainHandler');
        this._tv.addTouchToList(this.btn_over_home, this.node, 'game_home', 'onHomeHandler');
        this._keybList.push(this.btn_over_again);
        this._keybList.push(this.btn_over_home);
        this._tv.emit(this._tv[this._tv.curStatus + 'List'][0]);
    },

    flopOne: function (cardComp) {
        if (cardComp.mouseEnabled == true) {
            cardComp.flop();
        }
    },

    // 选择卡片逻辑
    runCardLogicById: function(id) {
        let self = this;
        if (self._canClick === false) {
            return;
        }

        let item = self._cardList[id];
        let cardcomp = item.getComponent('Card');
        if (cardcomp.mouseEnabled === false) {
            return;
        }

        self._curCard = item;
        if (self._preCard !== null && self._preCard !== self._curCard) {
            self._canClick = false;
            let pCardComp = self._preCard.getComponent('Card');
            let cCardComp = self._curCard.getComponent('Card');
            self.flopOne(pCardComp);
            self.flopOne(cCardComp);

            if (pCardComp.saveId === cCardComp.saveId) {
                self._canClick = true;
                pCardComp.mouseEnabled = false;
                cCardComp.mouseEnabled = false;
                self._preCard = null;
                self._curCard = null;
                self.updateScore(false, true);
                let handl = setTimeout(self.checkWin.bind(self), 800);
                self._timeHandleList.push(handl);
            } else {
                self.updateScore(false, false);
                let handl = setTimeout(function () {
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

    onKeybCardHandler: function(id) {
        this.runCardLogicById(id);
    },

    onCardDownHandler: function (e) {
        let id = this._cardList.indexOf(e.currentTarget);
        this.runCardLogicById(id);
    },

    onHomeHandler: function (e) {
        let id = cc.vv.global.lvl;
        console.log('game: ' + id);

        // cc.textureCache.dumpCachedTextureInfo();
        cc.director.loadScene('home_scene');
    },

    onAgainHandler: function (e) {
        // remove keyctrl
        this.removeKeyBListen();

        this.chaosSort();// 乱序
        this.setup();
    },

    flopCards: function () {
        let key = this._lvl - 1;
        for (let i = 0; i < this._showList[key]; ++i) {
            let cardComp = this._cardList[i].getComponent('Card');
            cardComp.flop();
            cardComp.mouseEnabled = true;
        }
    },

    clearTime: function () {
        for (let i = 0; i < this._timeHandleList.length; ++i) {
            clearTimeout(this._timeHandleList[i]);
            this._timeHandleList[i] = null;
        }
        this._timeHandleList.splice(0, this._timeHandleList.length);
    },

    removeKeyBListen: function () {
        let keyLen = this._keybList.length;
        if (keyLen > 0) {
            for (let i = 0; i < keyLen; ++i) {
                this._tv.removeTouchByNode(this._keybList[i]);
            }
            this._keybList.splice(0, keyLen);
        }
    },

    addCardEvent: function () {
        for (let i = 0; i < this._cardList.length; ++i) {
            this._cardList[i].on(cc.Node.EventType.TOUCH_END, this.onCardDownHandler, this);
        }
    },

    addEvent: function () {
        this.btn_home.on(cc.Node.EventType.TOUCH_END, this.onHomeHandler, this);
        this.btn_over_home.on(cc.Node.EventType.TOUCH_END, this.onHomeHandler, this);
        this.btn_over_again.on(cc.Node.EventType.TOUCH_END, this.onAgainHandler, this);
    },

    removeEvent: function () {
        for (let i = 0; i < this._cardList.length; ++i) {
            this._cardList[i].off(cc.Node.EventType.TOUCH_END, this.onCardDownHandler, this);
        }
        this.btn_home.off(cc.Node.EventType.TOUCH_END, this.onHomeHandler, this);
        this.btn_over_home.off(cc.Node.EventType.TOUCH_END, this.onHomeHandler, this);
        this.btn_over_again.off(cc.Node.EventType.TOUCH_END, this.onAgainHandler, this);


        // remove keyctrl
        this.removeKeyBListen();
    },

    onDestroy() {
        this.clearTime();
        this.removeEvent();
        cc.loader.releaseRes(this._cardURL, cc.Prefab);
    }


});