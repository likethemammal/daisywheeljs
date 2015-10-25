var constants = require('../constants.js');
var Utils = require('../Utils.js');
var Fluxxor = require('fluxxor');
var _ = require('underscore');

module.exports = Fluxxor.createStore({

    symbolSelectionCallback: false,

	initialize: function() {
		this.resetState();

		this.bindActions(
            constants.UNLOAD, this.onUnload,
            constants.LOAD, this.onLoad,
            constants.LOAD_DEFAULT, this.onLoad,

            constants.ATTACH_INPUT, this.onAttachInput,
            constants.SET_INPUT_CURSOR, this.onSetInputCursor,
            constants.SET_INPUT_VALUE, this.onSetInputValue,
            constants.CHANGE_INPUT_SCROLL, this.onChangeInputScroll,

            constants.GAMEPAD_EVENT, this.onGamepadEvent
		);
	},

	resetState: function() {
        this.originalEl = {};
        this.value = '';
        this.cursor = 0;
        this.latestCharacter = '';
        this.latestCharacterChanged = false;
        this.scrollDirection = 1;
        this.emit('change');
	},

	getState: function() {
		return {
            originalEl: this.originalEl,
            value: this.value,
            cursor: this.cursor,
            latestCharacter: this.latestCharacter,
            latestCharacterChanged: this.latestCharacterChanged,
            scrollDirection: this.scrollDirection
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
        this.originalEl.readOnly = false;
        Utils.setCursor(this.originalEl, this.cursor);
        this.emit('change');
    },

    onLoad: function(callback) {
        this.value = this.originalEl.value;
        this.cursor = this.value.length; //Theres a bug in chrome where getCursor returns 0 onFocus, so just set it to the end of the string: http://stackoverflow.com/questions/14974913/selectionstart-of-textarea-returns-wrong-value
        this.originalEl.readOnly = true;
        this.originalEl.blur();

        if (callback) {
            this.symbolSelectionCallback = callback;
        }

        this.emit('change');
    },

    onChangeInputScroll: function() {
        if (this.latestCharacterChanged) {
            this.latestCharacterChanged = false;
            this.emit('change');
        }
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
        this.scrollDirection = 1;
        this.latestCharacter = symbol;
        this.latestCharacterChanged = true;
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
                case 'dPadUp':
                    this.cursor = 0;
                    break;
                case 'dPadDown':
                    this.cursor = this.value.length;
                    break;
                case 'dPadLeft':
                    this._decrementCursor();
                    break;
                case 'dPadRight':
                    this._incrementCursor();
                    break;
            }

            if (lastButton) {
                switch (lastButton.name) {
                    case 'leftBumper':
                        this.onBackspace();
                        break;
                    case 'rightBumper':
                        this.onSpace();
                        break;
                }
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

        start = start.substring(0, start.length - 1);

        this.value = start + valueParts.end;
    },

    onSpace: function() {
        this.addSymbolToValue(' ');
    },

    _decrementCursor: function() {
        this.scrollDirection = -1;
        if (this.cursor > 0) {
            this.cursor--;
        }
    },

    _incrementCursor: function() {
        this.scrollDirection = 1;
        this.cursor++;
    }
});