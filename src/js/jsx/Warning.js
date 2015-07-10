var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Utils = require('../Utils.js');

module.exports = React.createClass({
    displayName: "Warning",
    mixins: [FluxMixin, StoreWatchMixin('WheelStore', 'GamepadStore')],

    getStateFromFlux: function() {
        var flux = this.getFlux();
        var wheelState = flux.store('WheelStore').getState();
        var gamepadState = flux.store('GamepadStore').getState();

        return {
            showWarning: wheelState.showWarning,
            gamepadSupported: gamepadState.gamepadSupported
        };
    },

    render: function() {
        var html;
        var htmlHolder = {};
        var opacity = (this.state.showWarning) ? 1 : 0;
        var styles = {
            opacity: opacity
        };

        if (this.state.gamepadSupported) {
            html = (
                'Connect a gamepad controller to use the <a target="_blank" href="http://daisywheeljs.org">Daisywheel</a>'
            );
        } else {
            html = (
                'This browser does not support the Gamepad API. Check <a target="_blank" href="http://caniuse.com/#feat=gamepad">this list</a> for support'
            );
        }

        htmlHolder['__html'] = html;

        return (
            <div id="daisywheel-controller-warning" style={styles} dangerouslySetInnerHTML={htmlHolder}></div>
        );
    }
});