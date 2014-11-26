(function(_){
var Utils = {
//Taken from http://stackoverflow.com/questions/1865563/set-cursor-at-a-length-of-14-onfocus-of-a-textbox/1867393#1867393 on 8/8/14
    setCursor: function(node,pos){

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
    },

//Taken from http://stackoverflow.com/questions/263743/caret-position-in-textarea-in-characters-from-the-start on 8/8/14
    getCursor: function(el) {
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
};

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

    gamepadConnected: false,

    init: function() {
        this.setupElements();
        this.setupStyles();
        this.setupFontStyles();
        this.attachSymbols();
        this.setupFocusEvent();
        window.addEventListener('ongamepadupdate', _.bind(this.onGamepadEvent, this));
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
        var daisywheelContainer = document.getElementById('daisywheel-js'),
            modalOverlay = document.createElement('div'),
            modalContainer = document.createElement('div'),
            modal = document.createElement('div'),
            daisywheel = document.createElement('div'),
            warning = document.createElement('div'),
            inputContainer = document.createElement('div'),
            input = document.createElement('input');

        daisywheel.id = 'daisywheel';

        modalOverlay.id = 'daisywheel-modal-overlay';
        modalContainer.id = 'daisywheel-modal-container';
        modal.id = 'daisywheel-modal';

        warning.id = 'daisywheel-controller-warning';
        warning.innerHTML = 'Connect a gamepad controller to use the <a href="http://daisywheeljs.org">Daisywheel</a>';

        inputContainer.id = 'daisywheel-input-container';
        input.id = 'daisywheel-input';

        inputContainer.appendChild(input);

        daisywheel.appendChild(inputContainer);

        modal.appendChild(warning);
        modal.appendChild(daisywheel);
        modalContainer.appendChild(modal);
        modalOverlay.appendChild(modalContainer);

        daisywheelContainer.appendChild(modalOverlay);
    },

    setupFlower: function() {
        var daisywheel = document.getElementById('daisywheel'),
            flower = document.createElement('div'),
            petalTemplate = document.createDocumentFragment(),
            petal = document.createElement('div'),
            petalInner = document.createElement('div'),
            buttons = document.createElement('div'),
            buttonPositions = ['left', 'top', 'right', 'bottom'];

        // Add buttons
        for (var i = 0; i < buttonPositions.length; i++) {
            var button = document.createElement('div');

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

            flower.appendChild(petal);
        }

        this.petals = document.getElementsByClassName('petal');

        flower.id = 'daisywheel-flower';
        daisywheel.appendChild(flower);
    },

    setupControlsUI: function() {
        var daisywheel = document.getElementById('daisywheel'),
            controlsUI = document.getElementById('daisywheel-controls-ui');

        if (!controlsUI) {
            controlsUI = document.createElement('div');
            controlsUI.id = 'daisywheel-controls-ui';
            daisywheel.appendChild(controlsUI);
        } else {
            controlsUI.innerHTML = '';
        }

        for (var i = 0; i < this.uiElements.length; i++) {
            var element = document.createElement('div'),
                elementKey = this.uiElements[i],
                icon = document.createElement('div'),
                label = document.createElement('div'),
                labelText = this.uiLabels[elementKey];

            element.id = 'daisywheel-' + elementKey + '-ui';
            element.className = 'control-ui cf';

            icon.className = 'control-ui-icon';
            label.className = 'control-ui-label';

            label.textContent = labelText;
            label.title = labelText;

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

            if (symbol.font) {
              button.style.fontFamily = symbol.font;
              symbol = symbol.symbol;
            }

            button.innerText = symbol;
            button.style.opacity = opacity;
        }
    },

    setupFocusEvent: function() {
        document.body.addEventListener('focus', _.bind(function(ev) {
            var el = ev.target;
            if (el.classList.contains('daisywheel')) {
                ev.preventDefault();
                this.inputEl = el;
                this.load(this.onSymbolSelectionDefault);
            }
        }, this), true);
    },

    showUI: function() {
        var daisywheel = document.getElementById('daisywheel'),
            warning = document.getElementById('daisywheel-controller-warning');

        warning.style.opacity = 0;
        daisywheel.style.opacity = 1;
    },

    load: function(callback) {
        //Overwrite symbol selection if there was/is a callback passed to `load`
        this.onSymbolSelection = callback;

        if (!this.loaded) {


            var daisywheel = document.getElementById('daisywheel-js'),
                input = document.getElementById('daisywheel-input');

            if (this.inputEl) {
                var inputElValue = this.inputEl.value;

                input.value = inputElValue;
                Utils.setCursor(input, inputElValue.length);
                this.inputEl.readOnly = true;
            }

            daisywheel.addEventListener('click', _.bind(this.unload, this));

            daisywheel.style.visibility = 'visible';
            daisywheel.style.opacity = 1;
            input.focus();

            this.loaded = true;
        }
    },

    unload: function(ev) {
        if (this.loaded) {
            var daisywheel = document.getElementById('daisywheel-js'),
                input = document.getElementById('daisywheel-input');

            if (ev && ev.target.id === 'daisywheel-input') {
              return;
            }

            if (this.inputEl) {
                this.inputEl.value = input.value;
                this.inputEl.readOnly = false;
            }

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
                this.symbolSets.unshift(setStr);
                this.symbolSets[nextOverridden] = null;

                if (customSet.title) {
                    switch (nextOverridden) {
                        case 2:
                            this.uiLabels['left-trigger'] = customSet.title;
                            break;
                        case 3:
                            this.uiLabels['right-trigger'] = customSet.title;
                            break;
                    }
                } else {
                    console.error("Custom sets with `override` must also have the `title` property defined.")
                }

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

        this.attachSymbols();
        this.setupControlsUI();
    },

    onGamepadEvent: function() {
        var gamepads = gamepadSupport.gamepads;
        for (var i = 0; i < gamepads.length; gamepads++) {
            var gamepad = gamepads[i];
            this.updateWheel(gamepad);
        }
    },

    updateWheel: function(gamepad) {
        if (!this.gamepadConnected) {
            this.gamepadConnected = true;
            this.showUI();
        }
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

        this.onSymbolSelection(button.textContent);

        this.lastButtonIsUp = false;
    },

    onSymbolSelectionDefault: function(symbol) {
        var input = document.getElementById('daisywheel-input'),
            cursorPos = Utils.getCursor(input),
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
            cursorPos = Utils.getCursor(input);

        switch (directions[buttonId]) {
            case 'up':
                Utils.setCursor(input, 0);
                break;
            case 'down':
                Utils.setCursor(input, input.value.length);
                break;
            case 'left':
                Utils.setCursor(input, cursorPos - 1);
                break;
            case 'right':
                Utils.setCursor(input, cursorPos + 1);
                break;
        }
    },

    getPetalNum: function(xAxis, yAxis, ratio) {
        var petal = 0;
        var isNoise = betweenNums(yAxis, 0,  0.1) && betweenNums(xAxis, 0, 0.1);
        var isStill = xAxis === 0 && yAxis === 0;

        if (isNoise || isStill) {
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

var Daisywheel = {
    load: _.bind(View.load, View),
    unload: _.bind(View.unload, View),
    symbols: _.bind(View.symbols, View)
};

window.Daisywheel = Daisywheel;

View.init();
}(_));