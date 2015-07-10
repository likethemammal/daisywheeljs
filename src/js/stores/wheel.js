var constants = require('../constants.js');
var Fluxxor = require('fluxxor');
var _ = require('underscore');

module.exports = Fluxxor.createStore({

    numOfPetals: 8,
    petalDirections: [
        'north',
        'northeast',
        'east',
        'southeast',
        'south',
        'southwest',
        'west',
        'northwest'
    ],

	initialize: function() {
		this.resetState();

		this.bindActions(
            constants.LOAD, this.onLoad,
            constants.LOAD_DEFAULT, this.onLoad,
            constants.UNLOAD, this.onUnload,
            constants.CLICK_CLOSE_ATTACHED, this.onClickCloseAttached,
            constants.CLICK_CLOSE_DETACHED, this.onClickCloseDetached,

            constants.SHOW_WARNING, this.onShowWarning,
            constants.HIDE_WARNING, this.onHideWarning,
            constants.GAMEPAD_EVENT, this.onGamepadEvent
		);
	},

	resetState: function() {
		this.loaded = false;
        this.clickCloseAttached = false;
        this.showWarning = true;
        this.selectedPetal = 'none';
	},

	getState: function() {
		return {
            loaded: this.loaded,
            clickCloseAttached: this.clickCloseAttached,
            showWarning: this.showWarning,
            numOfPetals: this.numOfPetals,
            selectedPetal: this.selectedPetal
        }
	},

    onLoad: function() {
        this.loaded = true;
        this.emit('change');
    },

    onUnload: function() {
        this.loaded = false;
        this.emit('change');
    },

    onClickCloseAttached: function() {
        this.clickCloseAttached = true;
        this.emit('changed');
    },

    onClickCloseDetached: function() {
        this.clickCloseAttached = false;
        this.emit('changed');
    },

    onShowWarning: function() {
        this.showWarning = true;
        this.emit('change');
    },

    onHideWarning: function() {
        this.showWarning = false;
        this.emit('change');
    },

    onGamepadEvent: function() {
        this.waitFor(['GamepadStore'], _.bind(function(GamepadStore) {
            var gamepadState = GamepadStore.getState();
            var direction = gamepadState.stickDirection;
            var isConnected = gamepadState.gamepadConnected;

            this.showWarning = !isConnected;

            if (direction) {
                _.map(this.petalDirections, _.bind(function(petalDirection, index) {
                    if (petalDirection === direction) {
                        this.selectedPetal = index;
                    }
                }, this));
            } else {
                this.selectedPetal = 'none';
            }

            this.emit('change');
        }, this));
    }
});