var constants = require('../constants.js');
var Utils = require('../Utils.js');
var Fluxxor = require('../libs/fluxxor.1.6.0.js');
var _ = require('../libs/underscore.1.8.3.js');

module.exports = Fluxxor.createStore({

    symbolSelectionCallback: false,

	initialize: function() {
		this.resetState();

		this.bindActions(
            constants.UNLOAD, this.onUnload,
            constants.LOAD, this.onLoad,
            constants.LOAD_DEFAULT, this.onLoad,

            constants.ATTACH_INPUT, this.onAttachInput,
            constants.SET_INPUT_VALUE, this.onSetInputValue,
            constants.SET_INPUT_CURSOR, this.onSetInputCursor,

            constants.SELECT_SYMBOL, this.onSelectSymbol,
            constants.GAMEPAD_EVENT, this.onGamepadEvent
		);
	},

	resetState: function() {
        this.originalEl = {};
        this.value = '';
        this.cursor = 0;
	},

	getState: function() {
		return {
            originalEl: this.originalEl,
            value: this.value,
            cursor: this.cursor
        }
	},

    onSetInputValue: function(value) {
        this.value = value;
        this.emit('change');
    },

    onSetInputCursor: function(cursorPos) {
        this.cursor = cursorPos;
        this.emit('change');
    },

    onAttachInput: function(el) {
        this.originalEl = el;
        this.emit('change');
    },

    onUnload: function() {
        this.originalEl.value = this.value;
        this.originalEl.readonly = false;
        Utils.setCursor(this.originalEl, this.cursor);
        this.originalEl.focus();
        this.emit('change');
    },

    onLoad: function(callback) {
        this.value = this.originalEl.value;
        this.cursor = Utils.getCursor(this.originalEl);
        this.originalEl.readOnly = true;
        this.originalEl.blur();

        if (callback) {
            this.symbolSelectionCallback = callback;
        }

        this.emit('change');
    },

    onSelectSymbol: function(symbol) {
        this.waitFor(['SymbolsStore'], _.bind(function(SymbolsStore) {
            if (SymbolsStore.defaultSymbolSelection) {
                this.addSymbolToValue(symbol);
            }
        }, this));
    },

    getValueDivision: function() {
        var value = this.value + '';
        var firstStrPart = value.substring(0, this.cursor),
            secondStrPart = value.substring(this.cursor, value.length);

        return {
            start: firstStrPart,
            end: secondStrPart
        }
    },

    addSymbolToValue: function(symbol) {
        var valueParts = this.getValueDivision();
        this.value = valueParts.start + symbol + valueParts.end;
        this.cursor++;
        this.emit('change');
    },

    onGamepadEvent: function() {
        this.waitFor(['GamepadStore', 'SymbolsStore'], _.bind(function(GamepadStore, SymbolsStore) {
            var gamepadState = GamepadStore.getState();
            var symbolsState = SymbolsStore.getState();
            var selectedSymbol = symbolsState.selectedSymbol;
            var defaultSymbolSelection = symbolsState.defaultSymbolSelection;
            var dPadDirection = gamepadState.dPadDirection;
            var lastButton = gamepadState.lastButton;

            switch (dPadDirection) {
                case 'up':
                    this.cursor = 0;
                    break;
                case 'down':
                    this.cursor = this.value.length - 1;
                    break;
                case 'left':
                    this.cursor--;
                    break;
                case 'right':
                    this.cursor++;
                    break;
            }

            switch (lastButton) {
                case 5:
                    this.onBackspace();
                    break;
                case 6:
                    this.onSpace();
                    break;
            }

            if (selectedSymbol) {
                if (defaultSymbolSelection) {
                    this.addSymbolToValue(selectedSymbol);
                } else {
                    this.symbolSelectionCallback(selectedSymbol);
                }
            }

            this.emit('change');
        }, this));
    },

    onBackspace: function() {
        var valueParts = this.getValueDivision();
        var start = valueParts.start;

        start.substring(0, start.length - 1);

        this.value = start + valueParts.end;
        this.emit('change');
    },

    onSpace: function() {
        this.addSymbolToValue(' ');
    }
});