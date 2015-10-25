var constants = require('../constants.js');
var Utils = require('../Utils.js');
var Fluxxor = require('fluxxor');
var _ = require('underscore');

module.exports = Fluxxor.createStore({
    initialize: function() {
        this.resetState();

        this.bindActions(
            constants.CHANGE_INPUT_SCROLL, this.onChangeInputScroll,
            constants.GAMEPAD_EVENT, this.onGamepadEvent
        );
    },

    resetState: function() {
        this.scrollDirection = 1;
        this.scrollLeft = 0;
    },

    getState: function() {
        return {
            scrollDirection: this.scrollDirection,
            scrollLeft: this.scrollLeft
        }
    },

    onChangeInputScroll: function(scrollWidth) {
        this.waitFor(['GamepadStore', 'SymbolsStore'], _.bind(function(InputStore) {
            var scrollDirection = InputStore.getState().scrollDirection;

            this.scrollLeft += (scrollWidth * scrollDirection);
            this.emit('change');
        }, this));
    },

    onGamepadEvent: function() {
        this.waitFor(['GamepadStore'], _.bind(function(GamepadStore) {
            var gamepadState = GamepadStore.getState();
            var dPadDirection = gamepadState.dPadDirection;
            var lastButton = gamepadState.lastButton;

            if (dPadDirection === 'dPadUp') {
                this.scrollLeft = 0;
                this.emit('change');
            }

        }, this));
    }
});