var React = require('../libs/react.0.13.3.js');
var Fluxxor = require('../libs/fluxxor.1.6.0.js');
var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Utils = require('../Utils.js');

module.exports = React.createClass({
    displayName: "Warning",
    mixins: [FluxMixin, StoreWatchMixin(['WheelStore'])],

    propTypes: {
        gamepadSupported: React.PropTypes.bool.isRequired
    },

    getStateFromFlux: function() {
        var wheelState = this.getFlux().store('WheelStore').getState();

        return {
            showWarning: wheelState.showWarning
        };
    },

    render: function() {
        var renderedComponent;
        var opacity = (this.state.showWarning) ? 1 : 0;
        var styles = {
            opacity: opacity
        };

        if (this.props.gamepadSupported) {
            renderedComponent = (
                'This browser does not support the Gamepad API. Check <a href="http://caniuse.com/#feat=gamepad">this list</a> for support'
            );
        } else {
            renderedComponent = (
                'Connect a gamepad controller to use the <a href="http://daisywheeljs.org">Daisywheel</a>'
            );
        }

        return (
            <div id="daisywheel-controller-warning" styles={styles}>
                {renderedComponent}
            </div>
        );
    }
});