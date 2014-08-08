(function(){

var getCSS = function() {
    var cssString = "#daisywheel-js{font-family:Montserrat,sans-serif}#daisywheel-js,#daisywheel-js *{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}#daisywheel-js #flower{position:relative;height:640px;width:640px;border-radius:50%;border:48px solid #15232d;background:#1d303e;-webkit-transform:scale(.8)}#daisywheel-js #flower:before{content:' ';position:absolute;height:368px;width:368px;left:144px;top:144px;border-radius:50%;background-color:#223846}#daisywheel-js .petal{position:absolute;height:160px;width:160px;background-color:#223846;border-radius:0 50% 50%}#daisywheel-js .petal.selected{background-color:#3A596B}#daisywheel-js .petal-inner{position:absolute;left:-8px;top:-8px;margin:16px}#daisywheel-js .buttons{height:144px;width:144px}#daisywheel-js .button{position:absolute;width:48px;height:48px;border-radius:50%;color:#fff;font-size:22px;line-height:48px;font-weight:500;text-align:center;text-shadow:0 0 2px rgba(0,0,0,1)}#daisywheel-js .selected .button{box-shadow:0 0 10px rgba(0,0,0,.4)}#daisywheel-js .button-left{top:48px;left:8px}#daisywheel-js .selected .button-left{background:#19417F}#daisywheel-js .button-top{top:8px;left:48px}#daisywheel-js .selected .button-top{background:#BD8F1A}#daisywheel-js .button-right{top:48px;left:88px}#daisywheel-js .selected .button-right{background:#A01B10}#daisywheel-js .button-bottom{top:88px;left:48px}#daisywheel-js .selected .button-bottom{background:#5E8D00}";
    var styleNode = document.createElement('style');

    styleNode.innerHTML = cssString;
    document.head.appendChild(styleNode);
};

getCSS();

var View = {

    symbols0: "abcdefghijklmnopqrstuvwxyz?!;\\&-".split(''),
    symbols1: "ABCDEFGHIJKLMNOPQRSTUVWXYZ+.@#$%".split(''),
    symbols2: "0123456789*,_=\"'()[]{}:~^<>|".split(''),
    symbolSetNumber: 0,

    petals: [],
    buttons: [],
    currentPetalNum: 0,

    buttonMapping: {
        0: 3,
        1: 2,
        2: 0,
        3: 1
    },
    lastButtonDownId: 0,
    lastButtonIsUp: true,

    numOfPetals: 8,

    init: function() {
        this.setupElements();
        this.setupStyles();
        this.setupFontStyles();
        this.attachSymbols();
        window.ongamepad = _.bind(this.updateWheel, this);
    },

    setupElements: function() {
        var daisywheel = document.createElement('div'),
            flower = document.createElement('div'),
            petalTemplate = document.createDocumentFragment(),
            petal = document.createElement('div'),
            petalInner = document.createElement('div'),
            buttons = document.createElement('div'),
            buttonPositions = ['left', 'top', 'right', 'bottom'],
            button;

        // Add buttons
        for (var i = 0; i < buttonPositions.length; i++) {
            button = document.createElement('div');

            button.className = 'button button-' + buttonPositions[i];
            buttons.appendChild(button);
        }

        buttons.className = 'buttons';
        petalInner.className = 'petal-inner';
        petal.className = 'petal';

        petalInner.appendChild(buttons);
        petal.appendChild(petalInner);
        petalTemplate.appendChild(petal);

        //Add petals
        for (var i = 0; i < this.numOfPetals; i++) {

            petal = petalTemplate.cloneNode(true);

            flower.appendChild(petal);
            this.petals.push(petal);
        }

        flower.id = 'flower';
        daisywheel.id = 'daisywheel-js';

        daisywheel.appendChild(flower);
        document.body.insertBefore(daisywheel);
    },

    setupStyles: function() {
        var styles = document.createElement('style'),
            stylesStr = '',
            radius = 208,
            petalDiameter = 160,
            width = 640,
            height = 640,
            step = (2*Math.PI) / this.numOfPetals,
            angle = -step * 2;

        for (var i = 0; i < this.numOfPetals; i++) {

            var x = Math.round(width/2 + radius * Math.cos(angle) - petalDiameter/2),
                y = Math.round(height/2 + radius * Math.sin(angle) - petalDiameter/2),
                rotation = angle * 180 / Math.PI + 135;

            stylesStr += ['.petal:nth-of-type(' + (i + 1) + ') {',
                            'top: ' + y + 'px;',
                            'left: ' + x + 'px;',
                            'transform: rotate(' + rotation + 'deg);',
                            '-ms-transform: rotate(' + rotation + 'deg);',
                            '-webkit-transform: rotate(' + rotation + 'deg);',
                        '} '].join('');

            stylesStr += ['.petal:nth-of-type(' + (i + 1) + ') .buttons {',
                            'transform: rotate(' + (-rotation) + 'deg);',
                            '-ms-transform: rotate(' + (-rotation) + 'deg);',
                            '-webkit-transform: rotate(' + (-rotation) + 'deg);',
                        '} '].join('');

            angle += step;
        }

        styles.innerHTML = stylesStr;
        document.head.appendChild(styles);
    },

    setupFontStyles: function() {
        var fontLinkStr = 'http://fonts.googleapis.com/css?family=Montserrat',
            link = document.createElement('link');

        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = fontLinkStr;

        document.head.appendChild(link);
    },

    attachSymbols: function() {
        this.buttons = [].slice.call(document.getElementsByClassName('button'));

        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i],
                symbol = this['symbols' + this.symbolSetNumber][i],
                opacity = 1;

            if (symbol) {
                opacity = 1;
            } else {
                symbol = '';
                opacity = 0.5;
            }

            button.innerText = symbol;
            button.style.opacity = opacity;
        }
    },

    updateWheel: function(gamepad) {
        this.setDirection(gamepad.axes);
        this.onButtonPress(gamepad.buttons);
    },

    setDirection: function(axes) {
        var petalNum = this.getPetalNum(axes[0], axes[1], (1/this.numOfPetals)*360/100);
        if (!petalNum) {
          return;
        }

        petalNum -= 1;

        for (var i = 0; i < this.numOfPetals; i++) {
          this.petals[i].className = 'petal';
        }

        this.petals[petalNum].className += ' selected';
        this.currentPetalNum = petalNum;
    },

    onButtonPress: _.throttle(function(buttonEvents) {

        if (buttonEvents[this.lastButtonDownId].pressed === false) {
            this.lastButtonIsUp = true;
            this.onButtonUp();
        }

        for (var i = 0; i < buttonEvents.length; i++) {
            var buttonEv = buttonEvents[i];

            if (buttonEv.pressed) {

                if (this.lastButtonDownId === i && !this.lastButtonIsUp) {
                    return;
                }

                switch (i) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        this.getSymbol(i);
                        break;
                    case 6:
                        this.toggleSymbols(2);
                        break;
                    case 7:
                        this.toggleSymbols(1);
                        break;
                }

                this.lastButtonDownId = i
            }
        }
    }),

    onButtonUp: function() {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].style['-webkit-filter'] = '';
        }
    },

    getSymbol: function(buttonNum) {
        var buttonRange = this.currentPetalNum*4,
            currentPetalButtons = this.buttons.slice(buttonRange, buttonRange + 4),
            mappedButtonId = this.buttonMapping[buttonNum],
            button = currentPetalButtons[mappedButtonId];

        button.style['-webkit-filter'] = 'saturate(2)';

        console.log(button.innerText);

        this.lastButtonIsUp = false;
    },

    toggleSymbols: _.throttle(function(symbolSetNumber) {
        if (this.symbolSetNumber === symbolSetNumber) {
            this.symbolSetNumber = 0;
        } else {
            this.symbolSetNumber = symbolSetNumber;
        }

        this.lastButtonIsUp = false;

        this.attachSymbols();
    }),

    getPetalNum: function(xAxis, yAxis, ratio) {
        var petal = 0;

        if (xAxis === 0 && yAxis === 0) {
            return 0;
        }

        if (xAxis > ratio) {

            if (betweenNums(yAxis, 0, ratio)) {
                petal = 3;  //right
            } else if (yAxis < ratio) {
                petal = 2;  //right-up
            } else {
                petal = 4;  //right-down
            }

        } else if (betweenNums(xAxis, 0, ratio)) {

            if (yAxis < ratio) {
                petal = 1;  //up
            } else if (yAxis > ratio) {
                petal = 5;  //down
            }

        } else {

            if (betweenNums(yAxis, 0, ratio)) {
                petal = 7;  //left
            } else if (yAxis < ratio) {
                petal = 8;  //left-up
            } else {
                petal = 6;  //left-down
            }

        }

        return petal;

        function betweenNums(numGiven, numToCheck, ratio) {
            return numGiven >= numToCheck - ratio && numGiven <= numToCheck + ratio;
        }
    }
}

window.View = View;

View.init();

}());