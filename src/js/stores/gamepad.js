var constants = require('../constants');
var Fluxxor = require('../libs/fluxxor.1.6.0.js');
var _ = require('../libs/underscore.1.8.3.js');
var BetweenNums = require('../units/BetweenNums.js');

module.exports = Fluxxor.createStore({
	initialize: function() {
		this.resetState();

        window.addEventListener('ongamepadupdate', _.bind(this.onGamepadUpdate, this));

        this.bindActions(
            constants.GAMEPAD_EVENT, this.onGamepadEvent
		);
	},

	resetState: function() {
        this.gamepadConnected = false;
        this.stickDirection = false;
        this.lastButton = false;
        this.dPadDirection = false;
        this.actionButton = false;
	},

	getState: function() {
		return {
            gamepadConnected: this.gamepadConnected,
            stickDirection: this.stickDirection,
            lastButton: this.lastButton,
            dPadDirection: this.dPadDirection,
            actionButton: this.actionButton
        }
	},

    onGamepadUpdate: function() {
        var gamepads = ev.detail;

        if (!_.isEmpty(gamepads)) {
            if (!this.gamepadConnected) {
                this.gamepadConnected = true;
            }
            _.map(gamepads, flux.actions.gamepadEvent);
        } else {
            this.gamepadConnected = false;
            flux.actions.hideWarning();
        }
        this.emit('change');
    },

    onGamepadEvent: function(gamepad) {
        this.setDirection(gamepad.axes);
        this.setButtons(gamepad.buttons);
    },

    setDirection: function(axes) {
        var numOfPetals = flux.store('WheelStore').getState().numOfPetals;
        this.stickDirection = this.getDirectionFromAxes(axes[0], axes[1], (1/numOfPetals)*360/100);
        this.emit('change');
    },

    getDirectionFromAxes: function(xAxis, yAxis, ratio) {
        var direction = false;
        var isNoise = BetweenNums(yAxis, 0,  0.1) && BetweenNums(xAxis, 0, 0.1);
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

    setButtons: _.throttle(function(buttons) {
        var lastPressedButton = buttons[this.lastButton];

        if (lastPressedButton && !lastPressedButton.pressed) {
            this.lastButtonIsUp = true;
            this.actionButton = false;
        }

        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];

            if (button.pressed) {

                if (this.lastButton === i && !this.lastButtonIsUp) {
                    return;
                }

                this.lastButton = i;

                this.setDPadDirection();
                this.setActionButton();
                this.lastButtonIsUp = false;

                this.emit('change');

            }
        }
    }, 50),

    setDPadDirection: function() {
        var directions = {
            12: 'up',
            13: 'down',
            14: 'left',
            15: 'right'
        };

        this.dPadDirection = directions[this.lastButton] || false;
        this.emit('change');
    },

    setActionButton: function() {
        var actionButtonMapping = {
            0: 3,
            1: 2,
            2: 0,
            3: 1
        };

        this.actionButton = actionButtonMapping[this.lastButton] || false;
        this.emit('change');
    }
});