(function(_){

//var getCSS = function() {
//    var cssString = "#daisywheel-js{font-family:Montserrat,sans-serif}#daisywheel-js,#daisywheel-js *{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}#daisywheel-js #flower{position:relative;height:640px;width:640px;border-radius:50%;border:48px solid #15232d;background:#1d303e;-webkit-transform:scale(.8)}#daisywheel-js #flower:before{content:' ';position:absolute;height:368px;width:368px;left:144px;top:144px;border-radius:50%;background-color:#223846}#daisywheel-js .petal{position:absolute;height:160px;width:160px;background-color:#223846;border-radius:0 50% 50%}#daisywheel-js .petal.selected{background-color:#3A596B}#daisywheel-js .petal-inner{position:absolute;left:-8px;top:-8px;margin:16px}#daisywheel-js .buttons{height:144px;width:144px}#daisywheel-js .button{position:absolute;width:48px;height:48px;border-radius:50%;color:#fff;font-size:22px;line-height:48px;font-weight:500;text-align:center;text-shadow:0 0 2px rgba(0,0,0,1)}#daisywheel-js .selected .button{box-shadow:0 0 10px rgba(0,0,0,.4)}#daisywheel-js .button-left{top:48px;left:8px}#daisywheel-js .selected .button-left{background:#19417F}#daisywheel-js .button-top{top:8px;left:48px}#daisywheel-js .selected .button-top{background:#BD8F1A}#daisywheel-js .button-right{top:48px;left:88px}#daisywheel-js .selected .button-right{background:#A01B10}#daisywheel-js .button-bottom{top:88px;left:48px}#daisywheel-js .selected .button-bottom{background:#5E8D00}";
//    var styleNode = document.createElement('style');
//
//    styleNode.innerHTML = cssString;
//    document.head.appendChild(styleNode);
//};
//
//getCSS();

var View = {

    symbolSets: [
        "abcdefghijklmnopqrstuvwxyz?!;\\&-".split(''),
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ+.@#$%".split(''),
        "0123456789*,_=\"'()[]{}:~^<>|".split('')
    ],
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

    uiElements: [
        'left-bumper',
        'left-analog',
        'right-bumper',
        'left-trigger',
        'right-trigger'
    ],

    uiLabels: {
        'left-bumper': 'Backspace',
        'left-analog': 'Select Petal',
        'right-bumper': 'Space',
        'left-trigger': 'Numbers',
        'right-trigger': 'Caps'
    },

    init: function() {
        this.setupElements();
        this.setupStyles();
        this.setupFontStyles();
        this.attachSymbols();
        this.setupFocusEvent();
        window.ongamepad = _.bind(this.updateWheel, this);
        window.addEventListener('resize', _.throttle(_.bind(this.setupSize, this), 100));
        window.addEventListener('keyup', _.bind(function(ev) {
            if (ev.which === 27 && this.loaded) {
                this.unload();
                if (this.inputEl) {
                    this.inputEl.blur();
                }
            }
        }, this));
    },

    setupElements: function() {
        var daisywheel = document.createElement('div');

        daisywheel.id = 'daisywheel-js';

        document.body.appendChild(daisywheel);

        this.setupModal();
        this.setupFlower();
        this.setupControlsUI();
        this.setupSize();
    },

    setupModal: function() {
        var daisywheel = document.getElementById('daisywheel-js'),
            modalOverlay = document.createElement('div'),
            modalContainer = document.createElement('div'),
            modal = document.createElement('div'),
            inputContainer = document.createElement('div'),
            input = document.createElement('input');

        modalOverlay.id = 'daisywheel-modal-overlay';
        modalContainer.id = 'daisywheel-modal-container';
        modal.id = 'daisywheel-modal';
        inputContainer.id = 'daisywheel-input-container';
        input.id = 'daisywheel-input';

        inputContainer.appendChild(input);
        modal.appendChild(inputContainer);
        modalContainer.appendChild(modal);
        modalOverlay.appendChild(modalContainer);
        daisywheel.appendChild(modalOverlay);
    },

    setupFlower: function() {
        var modal = document.getElementById('daisywheel-modal'),
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
        for (var j = 0; j < this.numOfPetals; j++) {
            petal = petalTemplate.cloneNode(true);

            if (j === 0) {
                petal.children[0].className = 'petal selected';
            }

            flower.appendChild(petal);
        }

        this.petals = document.getElementsByClassName('petal');

        flower.id = 'flower';
        modal.appendChild(flower);
    },

    setupControlsUI: function() {
        var modal = document.getElementById('daisywheel-modal'),
            controlsUI = document.getElementById('daisywheel-controls-ui');

        if (!controlsUI) {
            controlsUI = document.createElement('div');
            controlsUI.id = 'daisywheel-controls-ui';
            modal.appendChild(controlsUI);
        } else {
            controlsUI.innerHTML = '';
        }

        for (var i = 0; i < this.uiElements.length; i++) {
            var element = document.createElement('div'),
                elementKey = this.uiElements[i],
                icon = document.createElement('div'),
                label = document.createElement('div');

            element.id = 'daisywheel-' + elementKey + '-ui';
            element.className = 'control-ui cf';

            icon.className = 'control-ui-icon';
            label.className = 'control-ui-label';

            label.textContent = this.uiLabels[elementKey];

            element.appendChild(icon);
            element.appendChild(label);

            controlsUI.appendChild(element);
        }

    },

    setupSize: function() {
        var modal = document.getElementById('daisywheel-modal'),
            maxSize = (window.innerWidth < window.innerHeight) ? window.innerWidth : window.innerHeight,
            padding = 25,
            scalePrecision = 100,
            modalHeight = 1000,
            scaleAmount = Math.floor(scalePrecision * (maxSize / (modalHeight + padding*2))) / scalePrecision;

        modal.style['-webkit-transform'] = 'scale(' + scaleAmount + ')';
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
                symbol = this.symbolSets[this.symbolSetNumber][i],
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

    setupFocusEvent: function() {
        document.body.addEventListener('focus', _.bind(function(ev) {
            var el = ev.target;
            if (hasClass(el, 'daisywheel')) {
                ev.preventDefault();
                this.inputEl = el;
                this.load(this.onSymbolSelectionDefault);
            }
        }, this), true);
    },

    load: function(callback) {
        //Overwrite symbol selection if there was/is a callback passed to `load`
        this.onSymbolSelection = callback;

        if (!this.loaded) {
            var daisywheel = document.getElementById('daisywheel-js'),
                input = document.getElementById('daisywheel-input'),
                inputElValue = this.inputEl.value;

            input.value = inputElValue;
            setCursor(input, inputElValue.length);

            daisywheel.addEventListener('click', _.bind(this.unload, this));

            daisywheel.style.visibility = 'visible';
            daisywheel.style.opacity = 1;
            input.focus();

            this.inputEl.readOnly = true;
            this.loaded = true;
        }
    },

    unload: function() {
        if (this.loaded) {
            var daisywheel = document.getElementById('daisywheel-js'),
                input = document.getElementById('daisywheel-input');

            this.inputEl.value = input.value;
            this.inputEl.readOnly = false;

            daisywheel.removeEventListener('click', _.bind(this.unload, this));

            daisywheel.style.opacity = 0;
            daisywheel.style.visibility = 'hidden';
            this.loaded = false;
        }
    },

    symbols: function(customSymbols) {
        var nextOverridden = 2;
        var nextSetNumber = 3;

        for (var i = 0; i < customSymbols.length; i++) {
            var customSet = customSymbols[i];
            var setStr = customSet.set;
            var override = customSet.override;

            if (override && nextOverridden > -1) {
                this.symbolSets[nextOverridden] = setStr;
                nextOverridden -= 1;
            } else {
                this.symbolSets[nextSetNumber] = setStr;
                nextSetNumber++;
            }
        }

        if (nextSetNumber > 3) {
            this.uiLabels['left-trigger'] = 'Reset';
            this.uiLabels['right-trigger'] = 'Cycle';
        }

        this.setupControlsUI();
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
                    case 4:
                        this.onBackspace();
                        break;
                    case 5:
                        this.onSpace();
                        break;
                    case 6:
                        if (this.symbolSets.length < 4) {
                            this.toggleSymbols(2);
                        } else {
                            this.resetSymbols();
                        }
                        break;
                    case 7:
                        if (this.symbolSets.length < 4) {
                            this.toggleSymbols(1);
                        } else {
                            this.cycleSymbols();
                        }
                        break;
                    case 12:
                    case 13:
                    case 14:
                    case 15:
                        this.onDPadPress(i);
                        break;
                }

                this.lastButtonDownId = i
            }
        }
    }, 50),

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

        this.onSymbolSelection(button.innerText);

        this.lastButtonIsUp = false;
    },

    onSymbolSelectionDefault: function(symbol) {
        var input = document.getElementById('daisywheel-input'),
            cursorPos = getCursor(input),
            currentText = input.value,
            firstStrPart = currentText.substring(0, cursorPos),
            secondStrPart = currentText.substring(cursorPos, currentText.length);

        input.value = firstStrPart + symbol + secondStrPart;
        input.scrollLeft = input.scrollWidth;
    },

    onBackspace: function() {
        var input = document.getElementById('daisywheel-input');
        var value = input.value;

        input.value = value.substring(0, value.length - 1);
    },

    onSpace: function() {
        var input = document.getElementById('daisywheel-input');

        input.value += ' ';
    },

    toggleSymbols: _.throttle(function(symbolSetNumber) {
        if (this.symbolSetNumber === symbolSetNumber) {
            this.symbolSetNumber = 0;
        } else {
            this.symbolSetNumber = symbolSetNumber;
        }

        this.lastButtonIsUp = false;

        this.attachSymbols();
    }, 50),

    cycleSymbols: function() {
        if (this.symbolSetNumber > this.symbolSets.length - 1) {
            this.symbolSetNumber++;
        } else {
            this.symbolSetNumber = 0;
        }
        this.attachSymbols();
    },

    resetSymbols: function() {
        this.symbolSetNumber = 0;
        this.attachSymbols();
    },

    onDPadPress: function(buttonId) {
        var directions = {
                12: 'up',
                13: 'down',
                14: 'left',
                15: 'right'
            },
            input = document.getElementById('daisywheel-input'),
            cursorPos = getCursor(input);

        switch (directions[buttonId]) {
            case 'up':
                setCursor(input, 0);
                break;
            case 'down':
                setCursor(input, input.value.length);
                break;
            case 'left':
                setCursor(input, cursorPos - 1);
                break;
            case 'right':
                setCursor(input, cursorPos + 1);
                break;
        }
    },

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
};

window.View = View;

View.init();


//Taken from http://stackoverflow.com/questions/1865563/set-cursor-at-a-length-of-14-onfocus-of-a-textbox/1867393#1867393 on 8/8/14
function setCursor(node,pos){

    var node = (typeof node == "string" || node instanceof String) ? document.getElementById(node) : node;

    if(!node){
        return false;
    }else if(node.createTextRange){
        var textRange = node.createTextRange();
        textRange.collapse(true);
        textRange.moveEnd(pos);
        textRange.moveStart(pos);
        textRange.select();
        return true;
    }else if(node.setSelectionRange){
        node.setSelectionRange(pos,pos);
        return true;
    }

    return false;
}

//Taken from http://stackoverflow.com/questions/263743/caret-position-in-textarea-in-characters-from-the-start on 8/8/14
function getCursor(el) {
    if (el.selectionStart) {
        return el.selectionStart;
    } else if (document.selection) {
        el.focus();

        var r = document.selection.createRange();
        if (r == null) {
            return 0;
        }

        var re = el.createTextRange(),
            rc = re.duplicate();
        re.moveToBookmark(r.getBookmark());
        rc.setEndPoint('EndToStart', re);

        return rc.text.length;
    }
    return 0;
}

//Taken from http://stackoverflow.com/questions/5085567/hasclass-with-javascript-or-site-with-jquery-to-javascript-translation on 8/8/14 and modified
function hasClass(el, selector) {
    var className = ' ' + selector + ' ',
        elClasses = ' ' + el.className + ' ';

    return elClasses.replace(/[\n\t]/g, ' ').indexOf(className) > -1;
}

}(_));