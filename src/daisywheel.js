(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('underscore'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root._);
    }
}(this, function (_) {

    if (!_) {
        console.error("Underscore.js is not defined. Remember to include it before importing DaisywheelJS");
    }


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

        },

        setupElements: function() {

        },

        setupModal: function() {

        },

        setupFlower: function() {

        },

        setupControlsUI: function() {


        },

        setupSize: function() {

        },

        setupStyles: function() {

        },

        setupFontStyles: function() {

        },

        attachSymbols: function() {

        },

        onFocusEvent: function(ev) {

        },

        showUI: function() {

        },

        hideUI: function() {

        },

        load: function(callback) {

        },

        unload: function(ev) {

        },

        symbols: function(customSymbols) {

        },

        onGamepadEvent: function(ev) {

        },

        updateWheel: function(gamepad) {

        },

        setDirection: function(axes) {

        },

        onButtonPress: _.throttle(function(buttonEvents) {

        }, 50),

        onButtonUp: function() {

        },

        getSymbol: function(buttonNum) {

        },

        onSymbolSelectionDefault: function(symbol) {

        },

        onBackspace: function() {

        },

        onSpace: function() {

        },

        toggleSymbols: _.throttle(function(symbolSetNumber) {

        }, 50),

        cycleSymbols: function() {

        },

        resetSymbols: function() {

        },

        onDPadPress: function(buttonId) {

        },

        getPetalNum: function(xAxis, yAxis, ratio) {

        }
    };

    var Daisywheel = {
        load: _.bind(View.load, View),
        unload: _.bind(View.unload, View),
        symbols: _.bind(View.symbols, View)
    };

    View.init();

    return Daisywheel;
}));