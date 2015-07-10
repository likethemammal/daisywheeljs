var constants = require('../constants');
var _ = require('underscore');
var Fluxxor = require('fluxxor');

module.exports = Fluxxor.createStore({
	initialize: function() {
		this.resetState();

		this.bindActions(
            constants.SET_SYMBOLS, this.onSetSymbols
		);
	},

	resetState: function() {
        this['left-bumper'] = 'Backspace';
        this['left-analog'] = 'Select Petal';
        this['left-trigger'] = 'Numbers';
        this['right-trigger'] = 'Caps';
        this['right-bumper'] = 'Space';
    },

	getState: function() {
		return {
            'left-bumper': this['left-bumper'],
            'left-analog': this['left-analog'],
            'right-bumper': this['right-bumper'],
            'left-trigger': this['left-trigger'],
            'right-trigger': this['right-trigger']
        }
	},

    onSetSymbols: function() {
        this.waitFor(['SymbolsStore'], _.bind(function(SymbolsStore) {
            var customTitles = SymbolsStore.getState().customTitles;
            _.map(customTitles, _.bind(function(customTitle, key) {
                this[key] = customTitle;
            }, this));
            this.emit('change');
        }, this));
    }
});