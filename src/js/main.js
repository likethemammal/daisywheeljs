var Polyfills = require('./polyfills.js');
var actions = require('./actions.js');
var View = require('./jsx/View.js');
var Fluxxor = require('./libs/fluxxor.1.6.0.js');
var React = require('./libs/react.0.13.3.js');

if (window && document) {
    Polyfills.init();
}

//Flux
var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var SymbolsStore = require('./stores/symbols.js');
var WheelStore = require('./stores/wheel.js');
var InputStore = require('./stores/input.js');
var GamepadStore = require('./stores/gamepad.js');
var ControlsStore = require('./stores/controls.js');

var stores = {
    InputStore: new InputStore(),
    SymbolsStore: new SymbolsStore(),
    WheelStore: new WheelStore(),
    GamepadStore: new GamepadStore(),
    ControlsStore: new ControlsStore()
};

var flux = new Fluxxor.Flux(stores, actions);
window.flux = flux;

flux.on("dispatch", function(type, payload) {
    if (console && console.log) {
        console.log("[Dispatch]", type, payload);
    }
});

var app = document.createElement('div');

document.body.appendChild(app);

React.render(React.createElement(View, {flux: window.flux}), app);

module.exports = {
    symbols: flux.actions.setSymbols,
    load: flux.actions.load,
    unload: flux.actions.unload
};