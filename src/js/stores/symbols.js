var Fluxxor = require('fluxxor');
var constants = require('../constants.js');
var Utils = require('../Utils.js');
var _ = require('underscore');

module.exports = Fluxxor.createStore({
	initialize: function() {
		this.resetState();

		this.bindActions(
            constants.LOAD, this.onLoad,
            constants.LOAD_DEFAULT, this.onLoadDefault,
            constants.SET_SYMBOLS, this.onSetSymbols,
            constants.GAMEPAD_EVENT, this.onGamepadEvent
		);
	},

	resetState: function() {
        this.symbolSets = [
            "abcdefghijklmnopqrstuvwxyz?!;\\&-".split(''),
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ+.@#$%".split(''),
            "0123456789*,_=\"'()[]{}:~^<>|".split('')
        ];
        this.selectedSetIndex = 0;
        this.selectedSymbol = '';
        this.defaultSymbolSelection = true;
        this.customTitles = {};
	},

	getState: function() {
        return {
            symbolSets: this.symbolSets,
            selectedSetIndex: this.selectedSetIndex,
            selectedSymbol: this.selectedSymbol,
            defaultSymbolSelection: this.defaultSymbolSelection,
            customTitles: this.customTitles
        }
	},

    onLoadDefault: function() {
        this.defaultSymbolSelection = true;
        this.emit('change');
    },

    onLoad: function(callback) {
        if (callback) {
            this.defaultSymbolSelection = false;
            this.emit('change');
        }
    },

    onSetSymbols: function(customSymbols) {
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
                            this.customTitles['left-trigger'] = customSet.title;
                            break;
                        case 3:
                            this.customTitles['right-trigger'] = customSet.title;
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
            this.customTitles['left-trigger'] = 'Reset';
            this.customTitles['right-trigger'] = 'Cycle';
        }

        this.emit('change');
    },

    onGamepadEvent: function() {
        this.waitFor(['GamepadStore', 'WheelStore'], _.bind(function(GamepadStore, WheelStore) {
            var gamepadState = GamepadStore.getState();
            var selectedPetal = WheelStore.getState().selectedPetal;
            var lastButton = gamepadState.lastButton;
            var actionButton = gamepadState.actionButton;
            var shouldToggle = this.symbolSets.length < 4;
            var actionButtonMapped = gamepadState.actionButtonMapping[actionButton];
            var currentSymbolSet = this.symbolSets[this.selectedSetIndex];

            if (lastButton) {
                switch (lastButton.name) {
                    case 'leftTrigger':
                        if (shouldToggle) {
                            if (lastButton.held) {
                                this.selectedSetIndex = 2;
                            } else if (lastButton.released) {
                                this.selectedSetIndex = 0;
                            }
                        } else {
                            if (lastButton.released) {
                                this.resetSymbols();
                            }
                        }
                        break;
                    case 'rightTrigger':
                        if (shouldToggle) {
                            if (lastButton.held) {
                                this.selectedSetIndex = 1;
                            } else if (lastButton.released) {
                                this.selectedSetIndex = 0;
                            }
                        } else {
                            if (lastButton.released) {
                                this.cycleSymbols();
                            }
                        }
                        break;
                }
            }

            if (actionButton && selectedPetal !== 'none') {
                var selectedPetalGroupIndex = selectedPetal * 4 - 4;
                var selectedSymbolIndex = selectedPetalGroupIndex + actionButtonMapped - 1;

                this.selectedSymbol = currentSymbolSet[selectedSymbolIndex];
            } else {
                this.selectedSymbol = false;
            }
            this.emit('change');

        }, this));
    },
    
    cycleSymbols: function() {
        if (this.selectedSetIndex > this.symbolSets.length - 1) {
            this.selectedSetIndex++;
        } else {
            this.selectedSetIndex = 0;
        }
        this.emit('change');
    },

    resetSymbols: function() {
        this.selectedSetIndex = 0;
        this.emit('change');
    }

});