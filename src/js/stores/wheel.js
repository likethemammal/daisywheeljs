var constants = require('../constants.js');
var Fluxxor = require('fluxxor');
var Howl = require('howler').Howl;
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

    sound: new Howl({
        volume: 0.2,
        urls: [
            'https://cdn.rawgit.com/likethemammal/daisywheeljs/master/src/assets/sounds/navigate.mp3',
            'https://cdn.rawgit.com/likethemammal/daisywheeljs/master/src/assets/sounds/navigate.ogg'
        ]
    }),

	initialize: function() {
		this.resetState();

		this.bindActions(
            constants.LOAD, this.onLoad,
            constants.LOAD_DEFAULT, this.onLoad,
            constants.UNLOAD, this.onUnload,
            constants.DEBUG, this.onDebug,
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

    onDebug: function() {
        this.loaded = true;
        this.showWarning = false;
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
                        this.selectPetal(index);
                    }
                }, this));
            } else {
                this.deselectPetal();
            }

        }, this));
    },

    selectPetal: _.throttle(function(index) {
        var newIndex = index + 1;

        //conditional to compensate for noise in controller axis
        if (this.selectedPetal !== newIndex && this.selectedPetal !== 'none') {
            this.sound.play();
        }

        this.selectedPetal = newIndex;
        this.emit('change');
    }, 10),

    deselectPetal: function() {
        this.selectedPetal = 'none';
        this.emit('change');
    }
});