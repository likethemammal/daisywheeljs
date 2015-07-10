var React = require('react');
var Fluxxor = require('fluxxor');
var Input = require('./Input.js');
var Flower = require('./Flower.js');
var Controls = require('./Controls.js');
var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

module.exports = React.createClass({
    displayName: "Wheel",
    mixins: [FluxMixin, StoreWatchMixin('WheelStore')],

    getStateFromFlux: function() {
        var wheelState = this.getFlux().store('WheelStore').getState();

        return {
            showWarning: wheelState.showWarning
        };
    },

    render: function() {
        var styles = {
            opacity: (this.state.showWarning) ? 0 : 1
        };

        return (
            <div id="daisywheel" style={styles}>
                <Input />
                <Flower flux={window.flux}/>
                <Controls />
            </div>
        );
    }
});