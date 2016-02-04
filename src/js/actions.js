var constants = require('./constants.js');

module.exports = {
    unload: function(ev) {
        if (ev && ev.target.id === 'daisywheel-input') {
            return;
        }
        this.dispatch(constants.UNLOAD);
    },
    load: function(symbolSelection) {
        this.dispatch(constants.LOAD, symbolSelection);
    },
    debug: function() {
        this.dispatch(constants.DEBUG);
    },
    loadDefault: function() {
        this.dispatch(constants.LOAD_DEFAULT);
    },
    attachInput: function(el) {
        this.dispatch(constants.ATTACH_INPUT, el);
    },
    clickCloseAttached: function() {
        this.dispatch(constants.CLICK_CLOSE_ATTACHED)
    },
    clickCloseDetached: function() {
        this.dispatch(constants.CLICK_CLOSE_DETACHED)
    },
    setInputValue: function(value) {
        this.dispatch(constants.SET_INPUT_VALUE, value);
    },
    setInputCursor: function(cursorPos) {
        this.dispatch(constants.SET_INPUT_CURSOR, cursorPos)
    },
    showWarning: function() {
        this.dispatch(constants.SHOW_WARNING);
    },
    hideWarning: function() {
        this.dispatch(constants.HIDE_WARNING);
    },
    selectSymbol: function(symbol) {
        this.dispatch(constants.SELECT_SYMBOL, symbol);
    },
    setSymbols: function(symbols) {
        if (_.isString(symbols)) {
            symbols = symbols.split('');
        }
        this.dispatch(constants.SELECT_SYMBOL, symbols);
    },
    gamepadEvent: function(gamepad) {
        this.dispatch(constants.GAMEPAD_EVENT, gamepad);
    }
};