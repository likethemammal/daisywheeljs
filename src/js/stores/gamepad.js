var constants = require('../constants');
var Fluxxor = require('fluxxor');
var _ = require('underscore');
var BetweenNums = require('../units/BetweenNums.js');
var GamepadMicro = require('gamepad-micro');

module.exports = Fluxxor.createStore({

    actionButtonMapping: {
        'actionWest': 1,
        'actionNorth': 2,
        'actionEast': 3,
        'actionSouth': 4
    },

	initialize: function() {
		this.resetState();

        delete this._GamepadMicro;
        this._GamepadMicro = new GamepadMicro();
        this.gamepadSupported = !!this._GamepadMicro.gamepadSupported;
        this._GamepadMicro.onUpdate(_.debounce(_.bind(this.onGamepadUpdate, this), 0));

        this.bindActions(
            constants.GAMEPAD_EVENT, this.onGamepadEvent,
            constants.DEBUG, this.onDebug
		);
	},

	resetState: function() {
        this.gamepadConnected = false;
        this.stickDirection = false;
        this.otherButtons = {};
        this.dPadDirection = false;
        this.actionButton = false;
    },

	getState: function() {
		return {
            gamepadConnected: this.gamepadConnected,
            gamepadSupported: this.gamepadSupported,
            stickDirection: this.stickDirection,
            otherButtons: this.otherButtons,
            dPadDirection: this.dPadDirection,
            actionButton: this.actionButton,
            actionButtonMapping: this.actionButtonMapping
        }
	},

    onGamepadUpdate: function(gamepads) {
        var wheelState = flux.store('WheelStore').getState();
        this.gamepadConnected = this._GamepadMicro.gamepadConnected;

        if (wheelState.loaded) {
            if (this.gamepadConnected) {
                _.map(gamepads, function(gamepad) {
                     if (gamepad) {
                         flux.actions.gamepadEvent(gamepad);
                     }
                });
            } else {
                if (wheelState.showWarning) {
                    flux.actions.hideWarning();
                }
            }
        }

        this.emit('change');
    },

    onGamepadEvent: function(gamepad) {
        this.setDirection(gamepad.leftStick);
        this.setButtons(gamepad.buttons);
    },

    onDebug: function() {
        this.gamepadConnected = true;
        this.emit('change');
    },

    setDirection: function(leftStick) {
        var numOfPetals = flux.store('WheelStore').getState().numOfPetals;
        this.stickDirection = this.getDirectionFromAxes(leftStick.x, leftStick.y, (1/numOfPetals)*360/100);
        this.emit('change');
    },

    getDirectionFromAxes: function(xAxis, yAxis, ratio) {
        var direction = false;
        var assumedNoise = 0.24;
        var isNoise = BetweenNums(yAxis, 0, assumedNoise) && BetweenNums(xAxis, 0, assumedNoise);
        var isStill = xAxis === 0 && yAxis === 0;

        if (isNoise || isStill) {
            return false;
        }

        if (xAxis > ratio) {

            if (BetweenNums(yAxis, 0, ratio)) {
                direction = 'east';  //right
            } else if (yAxis < ratio) {
                direction = 'northeast';  //right-up
            } else {
                direction = 'southeast';  //right-down
            }

        } else if (BetweenNums(xAxis, 0, ratio)) {

            if (yAxis < ratio) {
                direction = 'north';  //up
            } else if (yAxis > ratio) {
                direction = 'south';  //down
            }

        } else {

            if (BetweenNums(yAxis, 0, ratio)) {
                direction = 'west';  //left
            } else if (yAxis < ratio) {
                direction = 'northwest';  //left-up
            } else {
                direction = 'southwest';  //left-down
            }

        }

        return direction;
    },

    setButtons: function(buttons) {
        this.actionButton = false;
        this.dPadDirection = false;
        this.otherButtons = {};
        _.map(buttons, function(state, button) {
            if (!state) {
                return;
            }

            switch (button) {
                case 'actionSouth':
                case 'actionNorth':
                case 'actionEast':
                case 'actionWest':
                    this.actionButton = button || false;
                    return;
                    break;
                case 'dPadUp':
                case 'dPadRight':
                case 'dPadDown':
                case 'dPadLeft':
                    this.setDPadDirection(button);
                    return;
                    break;
            }

            this.otherButtons[button] = {
                released: state.released,
                held: state.held
            };
        }.bind(this));
        this.emit('change');
    },

    setDPadDirection: function(button) {
        this.dPadDirection = button || false;
        this.emit('change');
    }
});